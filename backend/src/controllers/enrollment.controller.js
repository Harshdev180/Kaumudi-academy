import Enrollment from "../models/Enrollment.model.js";
import Transaction from "../models/Transaction.model.js";
import Course from "../models/Course.model.js";


export const createEnrollment = async ({
  studentId,
  courseId,
  paymentId
}) => {

  const exists = await Enrollment.findOne({
    student: studentId,
    course: courseId
  });

  if (exists) {
    return exists;
  }

  const enrollment = await Enrollment.create({
    student: studentId,
    course: courseId,
    payment: paymentId
  });

  return enrollment;
};


export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id
    })
      .populate("course")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    console.error("GET MY ENROLLMENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments"
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
      data: enrollments
    });
  } catch (error) {
    console.error("GET ALL ENROLLMENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments"
    });
  }
};
