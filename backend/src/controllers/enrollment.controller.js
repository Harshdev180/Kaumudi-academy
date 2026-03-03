import Enrollment from "../models/Enrollment.model.js";
import Payment from "../models/Payment.model.js";
import Course from "../models/Course.model.js";

export const createEnrollment = async ({ studentId, courseId, paymentId }) => {
  try {
    const exists = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (exists) {
      return exists;
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      payment: paymentId,
      status: "ACTIVE",
      progress: 0,
    });

    return enrollment;
  } catch (error) {
    console.error("CREATE ENROLLMENT ERROR:", error);
    throw error;
  }
};

export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id,
    })
      .populate("course")
      .populate({
        path: "payment",
        select:
          "originalAmount discountAmount finalAmount couponCode paymentMode status",
      })
      .sort({ createdAt: -1 });

    // Calculate remaining amount based on payment details
    const enrollmentsWithRemaining = enrollments.map((enrollment) => {
      const payment = enrollment.payment;
      if (payment) {
        // Calculate discounted total (original - discount)
        const discountedTotal = payment.originalAmount - payment.discountAmount;

        // For EMI, calculate remaining based on payment mode
        let remainingAmount = 0;
        if (payment.paymentMode === "EMI") {
          // EMI: remaining is total after first payment (70% remaining)
          remainingAmount = discountedTotal - payment.finalAmount;
        } else {
          remainingAmount = discountedTotal - payment.finalAmount;
        }
        return {
          ...enrollment.toObject(),
          remainingAmount: Math.max(remainingAmount, 0),
        };
      }
      return enrollment;
    });

    res.json({
      success: true,
      data: enrollmentsWithRemaining,
    });
  } catch (error) {
    console.error("GET MY ENROLLMENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments",
    });
  }
};

export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "firstName lastName email")
      .populate("course", "title mode")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    console.error("GET ALL ENROLLMENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments",
    });
  }
};

/**
 * Check if current user is enrolled in a specific course
 */
export const checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    }).populate("course", "title price mode");

    if (enrollment) {
      res.json({
        success: true,
        enrolled: true,
        data: enrollment,
      });
    } else {
      res.json({
        success: true,
        enrolled: false,
        data: null,
      });
    }
  } catch (error) {
    console.error("CHECK ENROLLMENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check enrollment",
    });
  }
};
