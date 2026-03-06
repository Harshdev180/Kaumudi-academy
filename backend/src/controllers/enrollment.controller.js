import Enrollment from "../models/Enrollment.model.js";
import Payment from "../models/Payment.model.js";
import Course from "../models/Course.model.js";
import Student from "../models/Student.model.js";
import { createNotification, notifyStudent, notifyAdmins } from "../services/notification.service.js";
import { formatEnrollmentId } from "../utils/enrollment.utils.js";

export const createEnrollment = async ({ studentId, courseId, paymentId }) => {
  try {
    console.log("createEnrollment - studentId:", studentId, "courseId:", courseId, "paymentId:", paymentId);
    
    const exists = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });
    //thisis

    if (exists) {
      console.log("Enrollment already exists, updating payment:", exists._id);
      // Update the existing enrollment with the new payment
      exists.payment = paymentId;
      await exists.save();
      return exists;
    }

    console.log("Creating new enrollment...");
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      payment: paymentId,
      status: "ACTIVE",
      progress: 0,
    });

    // Get course and student details for notifications
    const course = await Course.findById(courseId);
    const student = await Student.findById(studentId);

    // Format enrollment ID using student's unique ID and creation date
    const formattedEnrollmentId = student ? formatEnrollmentId(student._id, student.createdAt) : null;

    // 🔔 NOTIFICATION: New Enrollment - Notify Admin
    if (student && course) {
      const studentName = student.firstName && student.lastName 
        ? `${student.firstName} ${student.lastName}` 
        : (student.fullName || 'A student');
      
      // Get payment details if available
      let paymentData = null;
      if (paymentId) {
        paymentData = await Payment.findById(paymentId);
      }
      
      await notifyAdmins({
        title: "New Course Enrollment",
        message: `${studentName} enrolled in ${course.title}`,
        type: "ENROLLMENT",
        subType: "NEW_ENROLLMENT",
        actionUrl: "/admin/enrollments",
        priority: "MEDIUM",
        metadata: { 
          courseId, 
          courseName: course.title,
          enrollmentId: formattedEnrollmentId,
          totalPrice: paymentData?.originalAmount || course.price,
          discountAmount: paymentData?.discountAmount,
          paidPrice: paymentData?.finalAmount,
          amount: paymentData?.finalAmount
        },
        userId: studentId,
        userRole: "STUDENT"
      });
    }

    // 🔔 NOTIFICATION: Enrollment Confirmed - Notify Student
    if (student && course) {
      await notifyStudent({
        studentId: studentId,
        title: "Enrollment Confirmed!",
        message: `You have successfully enrolled in ${course.title}. Start learning now!`,
        type: "ENROLLMENT",
        subType: "ENROLLMENT_CONFIRMED",
        actionUrl: "/student/courses",
        priority: "HIGH",
        metadata: { courseId, enrollmentId: formattedEnrollmentId }
      });

      // 🔔 NOTIFICATION: Course Started
      await notifyStudent({
        studentId: studentId,
        title: "Course Started",
        message: `${course.title} is now available. Begin your learning journey!`,
        type: "ENROLLMENT",
        subType: "COURSE_STARTED",
        actionUrl: `/coursedetail/${courseId}`,
        priority: "MEDIUM",
        metadata: { courseId, enrollmentId: formattedEnrollmentId }
      });
    }

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

/**
 * Update enrollment status (for admin)
 */
export const updateEnrollmentStatus = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { status, progress } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate("student", "fullName email createdAt")
      .populate("course", "title");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }

    if (status) enrollment.status = status;
    if (progress !== undefined) enrollment.progress = progress;

    await enrollment.save();

    // Format enrollment ID using student's unique ID and creation date
    const formattedEnrollmentId = enrollment.student?.createdAt 
      ? formatEnrollmentId(enrollment.student._id, enrollment.student.createdAt) 
      : enrollmentId;

    // 🔔 NOTIFICATION: Enrollment Cancelled
    if (status === "CANCELLED") {
      await notifyStudent({
        studentId: enrollment.student._id,
        title: "Enrollment Cancelled",
        message: `Your enrollment in ${enrollment.course.title} has been cancelled.`,
        type: "ENROLLMENT",
        subType: "ENROLLMENT_CANCELLED",
        actionUrl: "/student/courses",
        priority: "HIGH",
        metadata: { enrollmentId: formattedEnrollmentId, courseId: enrollment.course._id }
      });
    }

    res.json({
      success: true,
      message: "Enrollment updated successfully",
      data: enrollment
    });
  } catch (error) {
    console.error("UPDATE ENROLLMENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update enrollment"
    });
  }
};

/**
 * Mark course as completed and notify student
 */
export const completeCourse = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate("student", "fullName email createdAt")
      .populate("course", "title");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }

    enrollment.status = "COMPLETED";
    enrollment.progress = 100;
    await enrollment.save();

    // Format enrollment ID using student's unique ID and creation date
    const formattedEnrollmentId = enrollment.student?.createdAt 
      ? formatEnrollmentId(enrollment.student._id, enrollment.student.createdAt) 
      : enrollmentId;

    // 🔔 NOTIFICATION: Course Completed
    await notifyStudent({
      studentId: enrollment.student._id,
      title: "🎉 Congratulations! Course Completed",
      message: `You have successfully completed ${enrollment.course.title}!`,
      type: "ENROLLMENT",
      subType: "COURSE_COMPLETED",
      actionUrl: "/student/certificates",
      priority: "HIGH",
      metadata: { enrollmentId: formattedEnrollmentId, courseId: enrollment.course._id }
    });

    res.json({
      success: true,
      message: "Course marked as completed",
      data: enrollment
    });
  } catch (error) {
    console.error("COMPLETE COURSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete course"
    });
  }
};
