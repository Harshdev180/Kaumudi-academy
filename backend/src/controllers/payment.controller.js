import razorpay from "../configs/razorpay.js";
import Payment from "../models/Payment.model.js";
import crypto from "crypto";
import { config } from "../configs/env.js";
import Course from "../models/Course.model.js";
import Coupon from "../models/Coupon.model.js";
import { createEnrollment } from "./enrollment.controller.js";
import Notification from "../models/Notification.model.js";
import axios from "axios"
import StudentFee from "../models/StudentFee.model.js";
import { sendCourseEnrollmentSuccessMail } from "../services/mail.service.js";
import Student from "../models/Student.model.js"
// Helper function price clean karne ke liye (6,499 -> 6499)
const sanitizePrice = (price) => {
  if (typeof price === "number") return price;
  return Number(price.toString().replace(/[^0-9.]/g, ""));
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { courseId, couponCode, paymentMode, captchaToken } = req.body;

    // ================= CAPTCHA VERIFY =================
    // Skip captcha verification in development mode or when SKIP_CAPTCHA is set
    const skipCaptcha = process.env.NODE_ENV === "development" || process.env.SKIP_CAPTCHA === "true" || process.env.SKIP_CAPTCHA === true;
    
    if (!skipCaptcha) {
      if (!captchaToken) {
        return res.status(400).json({
          success: false,
          message: "Captcha verification required"
        });
      }
      
      try {
        const captchaVerify = await axios.post(
          `https://www.google.com/recaptcha/api/siteverify`,
          null,
          {
            params: {
              secret: process.env.RECAPTCHA_SECRET_KEY,
              response: captchaToken
            },
            timeout: 5000 // 5 second timeout
          }
        );

        if (!captchaVerify.data.success) {
          return res.status(400).json({
            success: false,
            message: "Captcha verification failed"
          });
        }
      } catch (captchaError) {
        console.error("CAPTCHA VERIFICATION ERROR:", captchaError.message);
        // Allow payment to proceed if captcha verification fails due to network issues
        if (captchaError.code === 'ETIMEDOUT' || captchaError.code === 'ENOTFOUND') {
          console.warn("Captcha verification timed out - allowing request (network issue)");
        } else {
          return res.status(400).json({
            success: false,
            message: "Captcha verification error. Please try again."
          });
        }
      }
    } else {
      console.log("CAPTCHA VERIFICATION SKIPPED (development mode or SKIP_CAPTCHA=true)");
    }
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

    let payableAmount = originalAmount;

    if (paymentMode === "EMI") {
      payableAmount = originalAmount * 0.3; // 30% first installment
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

    const discountedAmount = Math.max(originalAmount - discountAmount, 0);

    let finalAmount = discountedAmount;

    if (paymentMode === "EMI") {
      finalAmount = discountedAmount * 0.3; // 30% EMI payment
    }

    // 4. Razorpay Order
    // Validate amount before creating order (Razorpay max: 10,00,000 INR)
    const maxRazorpayAmount = 1000000; // 10 lakh INR in rupees
    if (finalAmount > maxRazorpayAmount) {
      return res.status(400).json({
        success: false,
        message: `Course price exceeds maximum allowed amount (₹${maxRazorpayAmount.toLocaleString('en-IN')}). Please contact support.`
      });
    }

    const options = {
      amount: Math.round(finalAmount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    };

    // Create order with error handling
    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch (razorpayError) {
      console.error("RAZORPAY API ERROR:", razorpayError);
      
      // Handle specific Razorpay errors
      if (razorpayError.statusCode === 400) {
        return res.status(400).json({
          success: false,
          message: razorpayError.error?.description || "Invalid payment amount. Please check course pricing."
        });
      }
      
      throw new Error("Payment gateway error: " + razorpayError.error?.description);
    }

    // 5. Payment Create
    const payment = await Payment.create({
      user: req.user._id,
      course: courseId,
      originalAmount,
      discountAmount,
      finalAmount,
      paymentMode: paymentMode || "FULL",
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

    const payment = await Payment.findOne({ razorpayOrderId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    payment.status = "SUCCESS";
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    await payment.save();

    // Enrollment trigger
    await createEnrollment({
  studentId: payment.user,
  courseId: payment.course,
  paymentId: payment._id
});

    const course = await Course.findById(payment.course);

    await StudentFee.create({
      student: payment.user,
      course: payment.course,
      totalAmount: payment.originalAmount,
      paidAmount: payment.finalAmount,
      paymentMode: payment.paymentMode,
      payment: payment._id,
      paymentStatus:
        payment.paymentMode === "EMI" ? "PARTIAL" : "PAID"
    });

    const user = await Student.findById(payment.user);

    await sendCourseEnrollmentSuccessMail({
      studentEmail: user.email,
      studentName: user.fullName,
      courseTitle: course.title,
      amountPaid: payment.finalAmount,
      paymentMode: payment.paymentMode
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
    const payment = await Payment.findOne({ razorpayOrderId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    payment.status = "SUCCESS";
    payment.razorpayPaymentId = "FAKE_PAYMENT_ID_" + Date.now();
    payment.razorpaySignature = "FAKE_SIGNATURE";
    await payment.save();

    await createEnrollment({
      studentId: payment.user,
      courseId: payment.course,
      paymentId: payment._id
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