import razorpay from "../configs/razorpay.js";
import Payment from "../models/Payment.model.js";
import Enrollment from "../models/Enrollment.model.js";
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

    // Calculate discounted amount AFTER coupon is applied
    const discountedAmount = Math.max(originalAmount - discountAmount, 0);

    // Calculate payable amount based on payment mode
    // For EMI: First payment = 1/3 of discounted amount (after coupon)
    // For FULL: Pay the full discounted amount
    // Use 2 decimal places precision
    let finalAmount = discountedAmount;
    if (paymentMode === "EMI") {
      finalAmount = Math.round((discountedAmount / 3) * 100) / 100; // First payment = 1/3 with 2 decimal places
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

    // Build EMI details if EMI mode is selected
    const emiDetails = paymentMode === "EMI" ? {
      isEmi: true,
      totalAmount: discountedAmount,
      firstPayment: finalAmount, // First payment = 1/3 of discounted amount (with 2 decimal places)
      remainingAmount: Math.round((discountedAmount - finalAmount) * 100) / 100, // Remaining = 2/3 with 2 decimal places
      installments: 3,
      installmentAmount: Math.round(((discountedAmount - finalAmount) / 2) * 100) / 100, // Remaining / 2 with 2 decimal places
      perMonth: finalAmount // Same as firstPayment since it's divided by 3
    } : null;

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment._id,
      originalAmount,
      discountAmount,
      discountedAmount,
      finalAmount,
      emiDetails
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

    // Calculate the actual total after discount (not original price)
    const discountedTotal = payment.originalAmount - payment.discountAmount;
    const remainingAmount = Math.max(discountedTotal - payment.finalAmount, 0);

    await StudentFee.create({
      student: payment.user,
      course: payment.course,
      totalAmount: discountedTotal, // Use discounted amount as total
      paidAmount: payment.finalAmount,
      remainingAmount: remainingAmount, // Calculate remaining correctly
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

// Create a new Razorpay order for continuing EMI installments
export const createEmiInstallment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user._id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    // Find the student's enrollment for this course with EMI mode
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId
    }).populate("payment");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "No enrollment found for this course"
      });
    }

    const payment = enrollment.payment;

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "No payment record found for this enrollment"
      });
    }

    // Verify this is an EMI payment - check both paymentMode and payment pattern
    // Some payments were saved with paymentMode="FULL" but were actually EMI (30% paid)
    const discountedTotal = payment.originalAmount - payment.discountAmount;
    const paidPercentage = discountedTotal > 0 ? (payment.finalAmount / discountedTotal) * 100 : 0;
    const isEmiPattern = paidPercentage > 0 && paidPercentage < 50; // Paid less than 50% suggests EMI
    
    if (payment.paymentMode !== "EMI" && !isEmiPattern) {
      return res.status(400).json({
        success: false,
        message: "This enrollment is not on EMI mode. Please use full payment."
      });
    }

    // Check if already fully paid
    const remainingAmount = discountedTotal - payment.finalAmount;

    if (remainingAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "EMI is already fully paid"
      });
    }

    // Calculate installment amount (divide remaining into 2 parts for 2 more installments)
    // Original: 33.3% paid (1/3), remaining: 66.6% = should be paid in 2 installments (33.3% each)
    const installmentAmount = remainingAmount / 2;
    
    console.log("EMI Installment Calculation:", {
      originalAmount: payment.originalAmount,
      discountAmount: payment.discountAmount,
      finalAmount: payment.finalAmount,
      discountedTotal,
      remainingAmount,
      installmentAmount
    });

    // Validate amount before creating order (Razorpay max: 10,00,000 INR)
    const maxRazorpayAmount = 1000000;
    if (installmentAmount > maxRazorpayAmount) {
      return res.status(400).json({
        success: false,
        message: `Installment amount exceeds maximum allowed amount (₹${maxRazorpayAmount.toLocaleString('en-IN')}). Please contact support.`
      });
    }

    // Create Razorpay order for the installment
    const options = {
      amount: Math.round(installmentAmount * 100),
      currency: "INR",
      receipt: `emi_${Date.now()}`
    };

    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch (razorpayError) {
      console.error("RAZORPAY EMI INSTALLMENT ERROR:", razorpayError);
      return res.status(500).json({
        success: false,
        message: "Payment gateway error: " + (razorpayError.error?.description || "Failed to create installment order")
      });
    }

    // Create a new payment record for this installment
    const installmentPayment = await Payment.create({
      user: studentId,
      course: courseId,
      originalAmount: payment.originalAmount,
      discountAmount: payment.discountAmount,
      finalAmount: installmentAmount,
      paymentMode: "EMI_INSTALLMENT",
      couponCode: payment.couponCode,
      razorpayOrderId: order.id,
      status: "PENDING",
      isInstallment: true,
      parentPayment: payment._id
    });

    // 🔔 NOTIFICATION: EMI Installment Initiated
    await Notification.create({
      title: "EMI Installment Initiated",
      message: `EMI installment payment started for course enrollment`,
      type: "PAYMENT",
      recipientRole: "STUDENT",
      recipient: studentId
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: installmentPayment._id,
      remainingAmount: remainingAmount - installmentAmount,
      installmentNumber: 2, // This is the 2nd payment (first was 30%)
      debug: {
        originalAmount: payment.originalAmount,
        discountAmount: payment.discountAmount,
        finalAmount: payment.finalAmount,
        discountedTotal,
        remainingAmount,
        installmentAmount
      }
    });
  } catch (error) {
    console.error("CREATE EMI INSTALLMENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create EMI installment order"
    });
  }
};

// Verify EMI installment payment
export const verifyEmiInstallmentPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentId
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

    // Find the installment payment
    const payment = await Payment.findById(paymentId);

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

    // Update the parent payment's paid amount
    const parentPayment = await Payment.findById(payment.parentPayment);
    if (parentPayment) {
      parentPayment.finalAmount += payment.finalAmount;
      await parentPayment.save();

      // Update StudentFee record
      const discountedTotal = parentPayment.originalAmount - parentPayment.discountAmount;
      const newRemaining = discountedTotal - parentPayment.finalAmount;

      await StudentFee.findOneAndUpdate(
        { payment: parentPayment._id },
        {
          paidAmount: parentPayment.finalAmount,
          remainingAmount: newRemaining,
          paymentStatus: newRemaining <= 0 ? "PAID" : "PARTIAL"
        }
      );
    }

    // 🔔 NOTIFICATION: EMI Installment Success
    await Notification.create({
      title: "EMI Installment Paid",
      message: "An EMI installment payment was completed successfully",
      type: "PAYMENT",
      recipientRole: "ADMIN",
      actionUrl: "/admin/payments"
    });

    return res.json({
      success: true,
      message: "EMI installment payment verified successfully"
    });
  } catch (error) {
    console.error("VERIFY EMI INSTALLMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Verification failed"
    });
  }
};