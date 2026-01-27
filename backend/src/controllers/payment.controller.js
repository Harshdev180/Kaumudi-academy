import razorpay from "../configs/razorpay.js";
import Transaction from "../models/Transaction.model.js";
import crypto from "crypto";
import { config } from "../configs/env.js";
import Course from "../models/Course.model.js";
import Coupon from "../models/Coupon.model.js";
import { createEnrollment } from "./enrollment.controller.js";
import Enrollment from "../models/Enrollment.model.js";

export const createRazorpayOrder = async (req, res) => {
  try {
    const { courseId, couponCode } = req.body;

    
    const course = await Course.findById(courseId);
    if (!course || course.status !== "ACTIVE") {
      return res.status(404).json({
        success: false,
        message: "Course not available"
      });
    }


const alreadyEnrolled = await Enrollment.findOne({
  student: req.user._id,
  course: courseId
});

if (alreadyEnrolled) {
  return res.status(400).json({
    success: false,
    message: "You are already enrolled in this course"
  });
}

  
    const originalAmount = course.price;
    let discountAmount = 0;
    let appliedCoupon = null;

   
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode,
        isActive: true,
        startTime: { $lte: new Date() },
        endTime: { $gte: new Date() }
      });

      if (coupon) {
        discountAmount =
          (originalAmount * coupon.discountPercentage) / 100;
        appliedCoupon = coupon.code;
      }
    }

    const finalAmount = Math.max(
      originalAmount - discountAmount,
    
    );

 
    const order = await razorpay.orders.create({
      amount: Math.round(finalAmount * 100), 
      currency: "INR",
      receipt: `rcpt_${Date.now()}`

    });

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
      message: "Failed to create order"
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

    const transaction = await Transaction.findOne({
      razorpayOrderId
    });

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

await createEnrollment({
  studentId: transaction.user,
  courseId: transaction.course,
  paymentId: transaction._id
});

    res.json({
      success: true,
      message: "Payment verified successfully"
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({ success: false });
  }
};


export const fakeVerifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId } = req.body;

    const transaction = await Transaction.findOne({
      razorpayOrderId
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    transaction.status = "SUCCESS";
    transaction.razorpayPaymentId = "FAKE_PAYMENT_ID";
    transaction.razorpaySignature = "FAKE_SIGNATURE";

    await transaction.save();
await createEnrollment({
  studentId: transaction.user,
  courseId: transaction.course,
  paymentId: transaction._id
});
    res.json({
      success: true,
      message: "Fake payment verified (testing only)"
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
