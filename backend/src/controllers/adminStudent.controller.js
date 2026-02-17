import Student from "../models/Student.model.js";
import cloudinary from "../configs/cloudinary.js";
import fs from "fs";

/**
 * GET /admin/students
 */
export const getAllStudents = async (req, res) => {
  const { search, status, paymentStatus } = req.query;

  const query = {};

  if (status) query.status = status;
  if (paymentStatus) query.paymentStatus = paymentStatus;

  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  const students = await Student.find(query)
    .populate("course", "title")
    .sort({ createdAt: -1 })
    .select("-password");

  res.json({ success: true, data: students });
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

  const student = await Student.create({
    ...req.body,
    image: imageData
  });

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

  Object.assign(student, req.body);
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
