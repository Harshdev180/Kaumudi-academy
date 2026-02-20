import razorpay from "../configs/razorpay.js";
import Transaction from "../models/Transaction.model.js";
import crypto from "crypto";
import { config } from "../configs/env.js";
import Course from "../models/Course.model.js";
import Coupon from "../models/Coupon.model.js";
import { createEnrollment } from "./enrollment.controller.js";
import Enrollment from "../models/Enrollment.model.js";
import Notification from "../models/Notification.model.js"; // ✅ ADDED

// Helper function price clean karne ke liye (6,499 -> 6499)
const sanitizePrice = (price) => {
  if (typeof price === "number") return price;
  return Number(price.toString().replace(/[^0-9.]/g, ""));
};

export const createRazorpayOrder = async (req, res) => {
  console.log("USER FROM AUTH:", req.user);
  console.log("BODY DATA:", req.body);

  try {
    const { courseId, couponCode } = req.body;

    // 1. Course find
    const course = await Course.findById(courseId);
    if (!course || course.status !== "ACTIVE") {
      return res.status(404).json({
        success: false,
        message: "Course not available"
      });
    }

    // 2. Price clean
    const originalAmount = Number(course.price.toString().replace(/,/g, ""));
    if (isNaN(originalAmount)) {
      throw new Error("Invalid price format in database");
    }

    let discountAmount = 0;
    let appliedCoupon = null;

    // 3. Coupon Logic
    if (couponCode && couponCode.trim() !== "") {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        startTime: { $lte: new Date() },
        endTime: { $gte: new Date() }
      });

      if (coupon) {
        const type = coupon.discountType || "percentage";
        const value =
          coupon.discountValue !== undefined && coupon.discountValue !== null
            ? Number(coupon.discountValue)
            : Number(coupon.discountPercentage || 0);

        if (!Number.isNaN(value) && value > 0) {
          if (type === "flat") {
            discountAmount = value;
          } else {
            discountAmount = (originalAmount * value) / 100;
          }
          discountAmount = Math.min(discountAmount, originalAmount);
          appliedCoupon = coupon.code;
        }
      }
    }

    const finalAmount = Math.max(originalAmount - discountAmount, 0);

    // 4. Razorpay Order
    const options = {
      amount: Math.round(finalAmount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    // 5. Transaction Create
    const payment = await Transaction.create({
      user: req.user._id,
      course: courseId,
      originalAmount,
      discountAmount,
      finalAmount,
      couponCode: appliedCoupon,
      razorpayOrderId: order.id,
      status: "PENDING"
    });

    // 🔔 NOTIFICATION: Payment Initiated
    await Notification.create({
      title: "Payment Initiated",
      message: `Payment started for ${course.title}`,
      type: "PAYMENT",
      recipientRole: "ADMIN",
      actionUrl: "/admin/payments"
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment._id
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order"
    });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = req.body;

    const body = razorpayOrderId + "|" + razorpayPaymentId;

    const expectedSignature = crypto
      .createHmac("sha256", config.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    const transaction = await Transaction.findOne({ razorpayOrderId });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    transaction.status = "SUCCESS";
    transaction.razorpayPaymentId = razorpayPaymentId;
    transaction.razorpaySignature = razorpaySignature;
    await transaction.save();

    // Enrollment trigger
    await createEnrollment({
      studentId: transaction.user,
      courseId: transaction.course,
      paymentId: transaction._id
    });

    // 🔔 NOTIFICATION: Payment Success
    await Notification.create({
      title: "Payment Successful",
      message: "A course payment was completed successfully",
      type: "PAYMENT",
      recipientRole: "ADMIN",
      actionUrl: "/admin/payments"
    });

    return res.json({
      success: true,
      message: "Payment verified successfully"
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Verification failed"
    });
  }
};

export const fakeVerifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId } = req.body;
    const transaction = await Transaction.findOne({ razorpayOrderId });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    transaction.status = "SUCCESS";
    transaction.razorpayPaymentId = "FAKE_PAYMENT_ID_" + Date.now();
    transaction.razorpaySignature = "FAKE_SIGNATURE";
    await transaction.save();

    await createEnrollment({
      studentId: transaction.user,
      courseId: transaction.course,
      paymentId: transaction._id
    });

    // 🔔 NOTIFICATION: Fake Payment (Testing)
    await Notification.create({
      title: "Payment Successful (Test)",
      message: "Fake payment verified successfully",
      type: "PAYMENT",
      recipientRole: "ADMIN"
    });

    return res.json({
      success: true,
      message: "Fake payment verified"
    });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};