import razorpay from "../configs/razorpay.js";
import Payment from "../models/Payment.model.js";
import Enrollment from "../models/Enrollment.model.js";
import crypto from "crypto";
import { config } from "../configs/env.js";
import Course from "../models/Course.model.js";
import Coupon from "../models/Coupon.model.js";
import { createEnrollment } from "./enrollment.controller.js";
import { createNotification, notifyAdmins, notifyStudent, notifyBoth } from "../services/notification.service.js";
import axios from "axios"
import StudentFee from "../models/StudentFee.model.js";
import { sendCourseEnrollmentSuccessMail } from "../services/mail.service.js";
import Student from "../models/Student.model.js"
import { formatEnrollmentId } from "../utils/enrollment.utils.js";
// Helper function price clean karne ke liye (6,499 -> 6499)
const sanitizePrice = (price) => {
  if (typeof price === "number") return price;
  return Number(price.toString().replace(/[^0-9.]/g, ""));
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { courseId, couponCode, paymentMode, captchaToken } = req.body;

    // CAPTCHA VERIFY
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

    // Get user details for notification
    const user = await Student.findById(req.user._id).select("firstName lastName fullName email");

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

    // Add processing fee - only once (for full payment or first EMI installment)
    const processingFee = 99;

    // Calculate payable amount based on payment mode
    // For EMI: First payment = 1/3 of discounted amount + processing fee (only once)
    // For FULL: Pay the full discounted amount + processing fee
    // Use 2 decimal places precision
    let finalAmount = discountedAmount;
    if (paymentMode === "EMI") {
      // First EMI payment includes processing fee
      const emiBase = Math.round((discountedAmount / 3) * 100) / 100;
      finalAmount = emiBase + processingFee;
    } else {
      // Full payment includes processing fee
      finalAmount = discountedAmount + processingFee;
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
    console.log("Creating payment for user:", req.user._id, "course:", courseId);
    
    // For EMI, store the base amount without processing fee
    const paymentFinalAmount = paymentMode === "EMI" 
      ? Math.round((discountedAmount / 3) * 100) / 100  // Base EMI without processing fee
      : finalAmount;
    
    const payment = await Payment.create({
      user: req.user._id,
      course: courseId,
      originalAmount,
      discountAmount,
      finalAmount: paymentFinalAmount,
      processingFee: paymentMode === "EMI" ? processingFee : (paymentMode === "FULL" ? processingFee : 0),
      paymentMode: paymentMode || "FULL",
      couponCode: appliedCoupon,
      razorpayOrderId: order.id,
      status: "PENDING"
    });

    // 🔔 NOTIFICATION: Payment Initiated
    const payerName = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : (user.fullName || 'A student');
      
    await notifyAdmins({
      title: "Payment Initiated",
      message: `${payerName} started payment for ${course.title} - ₹${finalAmount}`,
      type: "PAYMENT",
      subType: "PAYMENT_INITIATED",
      actionUrl: "/admin/payments",
      priority: "MEDIUM",
      metadata: { 
        courseId, 
        courseName: course.title,
        paymentId: payment._id, 
        amount: finalAmount 
      },
      userId: req.user._id,
      userRole: "STUDENT"  // Explicitly indicate this is a student action
    });

    // Build EMI details if EMI mode is selected
    const emiBase = Math.round((discountedAmount / 3) * 100) / 100;
    const emiDetails = paymentMode === "EMI" ? {
      isEmi: true,
      totalAmount: discountedAmount,
      processingFee: processingFee,
      firstPayment: emiBase + processingFee, // First payment includes processing fee
      remainingAmount: discountedAmount - emiBase, // Remaining 2/3 without processing fee
      installments: 3,
      installmentAmount: emiBase, // Each subsequent installment is just the base amount (without processing fee)
      perMonth: emiBase // Without processing fee
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
      finalAmount: paymentFinalAmount, // Base amount without processing fee
      processingFee: paymentMode === "EMI" ? processingFee : processingFee,
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

    console.log("Payment verified - creating enrollment for student:", payment.user, "course:", payment.course);

    try {
      // Enrollment trigger
      await createEnrollment({
        studentId: payment.user,
        courseId: payment.course,
        paymentId: payment._id
      });
      console.log("Enrollment created successfully!");
    } catch (enrollmentError) {
      console.error("ERROR creating enrollment:", enrollmentError);
    }

    const course = await Course.findById(payment.course);

    // Calculate the actual total after discount (not original price)
    const discountedTotal = payment.originalAmount - payment.discountAmount;
    const remainingAmount = Math.max(discountedTotal - payment.finalAmount, 0);

    // Get enrollment ID for notifications - use student's unique ID
    const student = await Student.findById(payment.user).select('_id createdAt studentId');
    const formattedEnrollmentId = student ? formatEnrollmentId(student._id, student.createdAt) : null;

    console.log("Creating/updating StudentFee for student:", payment.user, "course:", payment.course);

    // Check if StudentFee exists for this student and course
    const existingFee = await StudentFee.findOne({
      student: payment.user,
      course: payment.course
    });

    if (existingFee) {
      // Update existing fee record
      existingFee.paidAmount = payment.finalAmount;
      existingFee.remainingAmount = remainingAmount;
      existingFee.payment = payment._id;
      existingFee.paymentStatus = payment.paymentMode === "EMI" ? "PARTIAL" : "PAID";
      await existingFee.save();
      console.log("StudentFee updated:", existingFee._id);
    } else {
      // Create new fee record
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
      console.log("StudentFee created");
    }

    const user = await Student.findById(payment.user);

    await sendCourseEnrollmentSuccessMail({
      studentEmail: user.email,
      studentName: user.fullName,
      courseTitle: course.title,
      amountPaid: payment.finalAmount,
      paymentMode: payment.paymentMode
    });

    // 🔔 NOTIFICATION: Payment Success - Notify both Admin and Student
    await notifyBoth({
      adminTitle: "Payment Successful",
      adminMessage: `${user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : (user.fullName || 'A student')} paid ₹${payment.finalAmount} for ${course.title}`,
      studentId: payment.user,
      studentTitle: "Enrollment Confirmed!",
      studentMessage: `You have successfully enrolled in ${course.title}. Your payment of ₹${payment.finalAmount} has been received.`,
      type: "PAYMENT",
      subType: "PAYMENT_SUCCESS",
      adminActionUrl: "/admin/payments",
      studentActionUrl: "/student/courses",
      priority: "HIGH",
      metadata: { 
        courseId: payment.course, 
        courseName: course.title,
        paymentId: payment._id, 
        amount: payment.finalAmount,
        enrollmentId: formattedEnrollmentId
      },
      userId: payment.user,
      userRole: "STUDENT"
    });

    // 🔔 NOTIFICATION: New Enrollment
    await notifyAdmins({
      title: "New Enrollment",
      message: `${user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : (user.fullName || 'A student')} enrolled in ${course.title} - ₹${payment.finalAmount}`,
      type: "ENROLLMENT",
      subType: "NEW_ENROLLMENT",
      actionUrl: "/admin/enrollments",
      priority: "HIGH",
      metadata: { 
        studentId: payment.user, 
        courseId: payment.course, 
        courseName: course.title,
        paymentId: payment._id,
        totalPrice: payment.originalAmount,
        discountAmount: payment.discountAmount,
        paidPrice: payment.finalAmount,
        amount: payment.finalAmount,
        enrollmentId: formattedEnrollmentId
      },
      userId: payment.user,
      userRole: "STUDENT"
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

    const course = await Course.findById(payment.course);
    const user = await Student.findById(payment.user);

    // 🔔 NOTIFICATION: Test Payment Success
    const testPayerName = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : (user.fullName || 'A student');
      
    await notifyAdmins({
      title: "Test Payment Verified",
      message: `${testPayerName} paid ₹${payment.finalAmount} for ${course.title}`,
      type: "PAYMENT",
      subType: "PAYMENT_SUCCESS",
      actionUrl: "/admin/payments",
      priority: "MEDIUM",
      metadata: { courseId: payment.course, paymentId: payment._id, isTest: true, amount: payment.finalAmount },
      userId: payment.user,
      userRole: "STUDENT"
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
    }).populate("payment").select('_id createdAt');

    // Get student info for enrollment ID
    const student = await Student.findById(studentId).select('_id createdAt studentId');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "No enrollment found for this course"
      });
    }

    const payment = enrollment.payment;
    const formattedEnrollmentId = student ? formatEnrollmentId(student._id, student.createdAt) : null;

    // Fetch course details for notifications
    const course = await Course.findById(courseId);

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
    const totalPaidSoFar = payment.finalAmount;
    const remainingAmount = discountedTotal - totalPaidSoFar;

    if (remainingAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "EMI is already fully paid"
      });
    }

    // Count how many EMI installments have already been paid
    // parentPayment.finalAmount starts with the first payment (1/3 + processing fee), then increases with each installment
    // Note: First payment includes processing fee, subsequent installments don't
    const firstPaymentAmount = Math.round((discountedTotal / 3) * 100) / 100;
    const processingFee = 99;
    const expectedPerInstallment = Math.round((discountedTotal - firstPaymentAmount) / 2 * 100) / 100;
    
    // Calculate how many installments have been paid (excluding the initial first payment)
    // After first payment (enrollment): paid = firstPaymentAmount + processingFee (includes processing fee)
    // After second payment: paid = firstPaymentAmount + processingFee + installmentAmount (2/3)
    // After third payment: paid = firstPaymentAmount + processingFee + 2*installmentAmount (3/3)
    const amountPaidBeyondFirst = totalPaidSoFar - firstPaymentAmount - processingFee;
    let installmentsPaid = 0;
    if (amountPaidBeyondFirst > 0) {
      installmentsPaid = Math.round(amountPaidBeyondFirst / expectedPerInstallment);
    }

    console.log("EMI Installment Tracking:", {
      discountedTotal,
      firstPaymentAmount,
      expectedPerInstallment,
      totalPaidSoFar,
      amountPaidBeyondFirst,
      installmentsPaid,
      remainingAmount
    });

    // Calculate installment amount based on how many installments have been paid
    // If 0 installments paid beyond first payment → this is 2nd payment (1st installment)
    // If 1 installment paid beyond first payment → this is 3rd payment (2nd/final installment)
    let installmentAmount;
    if (installmentsPaid >= 2) {
      // Already paid both installments, shouldn't reach here but safety check
      return res.status(400).json({
        success: false,
        message: "All EMI installments have already been paid"
      });
    } else if (installmentsPaid >= 1) {
      // This is the 3rd/final payment - pay the full remaining amount
      installmentAmount = remainingAmount;
    } else {
      // This is the 2nd payment - divide remaining into 2 parts
      installmentAmount = remainingAmount / 2;
    }
    
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
    const courseName = course ? course.title : "the course";
    await notifyBoth({
      adminTitle: "EMI Installment Initiated",
      adminMessage: `Student started EMI installment payment for ${courseName}`,
      studentId: studentId,
      studentTitle: "EMI Payment Started",
      studentMessage: `Your next installment payment for ${courseName} has been initiated. Amount: ₹${Math.round(installmentAmount * 100) / 100}`,
      type: "PAYMENT",
      subType: "EMI_INSTALLMENT_INITIATED",
      adminActionUrl: "/admin/payments",
      studentActionUrl: "/student/fees",
      priority: "MEDIUM",
      metadata: { courseId, courseName, installmentPaymentId: installmentPayment._id, amount: installmentAmount, enrollmentId: formattedEnrollmentId },
      userId: studentId,
      userRole: "STUDENT"
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: installmentPayment._id,
      remainingAmount: remainingAmount - installmentAmount,
      installmentNumber: installmentsPaid >= 1 ? 3 : 2, // If already paid 1 installment beyond first, this is the 3rd payment
      debug: {
        originalAmount: payment.originalAmount,
        discountAmount: payment.discountAmount,
        finalAmount: payment.finalAmount,
        discountedTotal,
        remainingAmount,
        installmentAmount,
        installmentsPaid
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

    // Get course and student for notifications
    const course = await Course.findById(payment.course);
    const studentId = payment.user;
    const courseId = payment.course;

    // Get enrollment ID for notifications - use student's unique ID
    const enrollment = await Enrollment.findOne({ student: studentId, course: courseId }).select('_id createdAt');
    const student = await Student.findById(studentId).select('_id createdAt studentId');
    const formattedEnrollmentId = student ? formatEnrollmentId(student._id, student.createdAt) : null;

    payment.status = "SUCCESS";
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    await payment.save();

    // Update the parent payment's paid amount
    let newRemaining = 0;
    const parentPayment = await Payment.findById(payment.parentPayment);
    if (parentPayment) {
      parentPayment.finalAmount += payment.finalAmount;
      await parentPayment.save();

      // Update StudentFee record
      const discountedTotal = parentPayment.originalAmount - parentPayment.discountAmount;
      newRemaining = discountedTotal - parentPayment.finalAmount;

      await StudentFee.findOneAndUpdate(
        { payment: parentPayment._id },
        {
          paidAmount: parentPayment.finalAmount,
          remainingAmount: newRemaining,
          paymentStatus: newRemaining <= 0 ? "PAID" : "PARTIAL"
        }
      );
    }

    // 🔔 NOTIFICATION: EMI Installment Success - Notify both Admin and Student
    const courseName = course ? course.title : "the course";
    
    // Get parent payment details for total calculation
    const parentPaymentData = parentPayment ? await Payment.findById(payment.parentPayment) : null;
    const totalPrice = parentPaymentData?.originalAmount || payment.originalAmount;
    const totalPaid = parentPaymentData?.finalAmount || payment.finalAmount;
    
    await notifyBoth({
      adminTitle: "EMI Installment Paid",
      adminMessage: `EMI installment of ₹${payment.finalAmount} received for ${courseName}`,
      studentId: studentId,
      studentTitle: "EMI Installment Received",
      studentMessage: `Your installment payment of ₹${payment.finalAmount} for ${courseName} has been received. Remaining: ₹${newRemaining}`,
      type: "PAYMENT",
      subType: "EMI_INSTALLMENT_PAID",
      adminActionUrl: "/admin/payments",
      studentActionUrl: "/student/fees",
      priority: "HIGH",
      metadata: { 
        courseId, 
        courseName, 
        installmentPaymentId: payment._id, 
        amount: payment.finalAmount, 
        totalPrice: totalPrice,
        totalPaid: totalPaid,
        remainingAmount: newRemaining,
        enrollmentId: formattedEnrollmentId
      },
      userId: studentId,
      userRole: "STUDENT"
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