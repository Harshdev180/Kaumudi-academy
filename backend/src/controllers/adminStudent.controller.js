import Student from "../models/Student.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../configs/cloudinary.js";
import Enrollment from "../models/Enrollment.model.js";
import fs from "fs";


export const getAllStudents = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate({
        path: "student",
        select: "-password"
      })
      .populate("course", "title")
      .sort({ createdAt: -1 });

    const students = enrollments.map(enrollment => ({
      ...enrollment.student?.toObject(),
      course: enrollment.course
    }));

    res.json({
      success: true,
      data: students
    });

  } catch (error) {
    console.error("GET ENROLLED STUDENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled students"
    });
  }
};

/**
 * POST /admin/students
 */
export const createStudentByAdmin = async (req, res) => {
  let imageData = {};

  if (req.file) {
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "kaumudi/students"
    });

    imageData = {
      public_id: upload.public_id,
      url: upload.secure_url
    };

    fs.unlinkSync(req.file.path);
  }

  const payload = { ...req.body, image: imageData };
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  const student = await Student.create(payload);

  res.status(201).json({
    success: true,
    message: "Student created successfully",
    data: student
  });
};

/**
 * PUT /admin/students/:id
 */
export const updateStudentByAdmin = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found" });
  }

  if (req.file) {
    if (student.image?.public_id) {
      await cloudinary.uploader.destroy(student.image.public_id);
    }

    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "kaumudi/students"
    });

    student.image = {
      public_id: upload.public_id,
      url: upload.secure_url
    };

    fs.unlinkSync(req.file.path);
  }

  const payload = { ...req.body };
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }
  Object.assign(student, payload);
  await student.save();

  res.json({
    success: true,
    message: "Student updated successfully",
    data: student
  });
};

/**
 * DELETE /admin/students/:id
 */
export const deleteStudentByAdmin = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found" });
  }

  if (student.image?.public_id) {
    await cloudinary.uploader.destroy(student.image.public_id);
  }

  await student.deleteOne();

  res.json({ success: true, message: "Student deleted successfully" });
};

/**
 * PATCH /admin/students/:id/status
 */
export const toggleStudentStatus = async (req, res) => {
  const student = await Student.findById(req.params.id);

  student.status = student.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  await student.save();

  res.json({ success: true, status: student.status });
};

/**
 * PATCH /admin/students/:id/payment
 */
export const toggleStudentPayment = async (req, res) => {
  const student = await Student.findById(req.params.id);

  student.paymentStatus =
    student.paymentStatus === "PAID" ? "PENDING" : "PAID";

  await student.save();

  res.json({ success: true, paymentStatus: student.paymentStatus });
};
