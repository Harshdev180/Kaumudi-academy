import Course from "../models/Course.model.js";
import cloudinary from "../configs/cloudinary.js";
import mongoose from "mongoose";
import fs from "fs";
import Enrollment from "../models/Enrollment.model.js";
import Staff from "../models/Staff.model.js";
/* =========================
   HELPER: Parse JSON fields safely
========================= */
const parseJSON = (value, defaultValue = []) => {
  if (!value) return defaultValue;
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') return defaultValue; // Don't parse objects, return default
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : defaultValue;
  } catch {
    return defaultValue;
  }
};

/* =========================
   HELPER: Safe Cloudinary cleanup
========================= */
const cleanupLocalFile = (path) => {
  if (path && fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

/* =========================
   CREATE COURSE (ADMIN)
========================= */
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      syllabus,
      curriculum,
      duration,
      instructor,
      level,
      mode,
      price,
      language,
      startDate,
      endDate,
      batchSchedule,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Course thumbnail image is required",
      });
    }

    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "kaumudi/courses",
    });
    cleanupLocalFile(req.file.path);

    const course = await Course.create({
      title,
      description,
      syllabus,
      curriculum: parseJSON(curriculum, []),
      duration,
      instructor:
        instructor && mongoose.Types.ObjectId.isValid(instructor)
          ? new mongoose.Types.ObjectId(instructor)
          : undefined,
      level: level || "Prathama (Beginner)",
      mode,
      price,
      language: parseJSON(language, []),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      batchSchedule: parseJSON(batchSchedule, []),
      image: {
        public_id: upload.public_id,
        url: upload.secure_url,
      },
      status: "INACTIVE", // safe default — must be explicitly published
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationMessages
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
};

/* =========================
   UPDATE COURSE (ADMIN)
========================= */
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name role image description")
      .populate("createdBy", "name email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Whitelist only safe, editable fields
    const ALLOWED_FIELDS = [
      "title",
      "description",
      "syllabus",
      "curriculum",
      "duration",
      "instructor",
      "level",
      "mode",
      "price",
      "language",
      "startDate",
      "endDate",
      "batchSchedule",
    ];

    ALLOWED_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "language") {
          course.language = parseJSON(req.body.language, []);
        } else if (field === "startDate" || field === "endDate") {
          course[field] = new Date(req.body[field]);
        } else if (field === "instructor") {
          // Validate and convert instructor to ObjectId
          const instructorValue = req.body.instructor;
          if (
            instructorValue &&
            mongoose.Types.ObjectId.isValid(instructorValue)
          ) {
            course.instructor = new mongoose.Types.ObjectId(instructorValue);
          } else {
            course.instructor = undefined;
          }
        } else if (field === "batchSchedule") {
          // Parse batchSchedule JSON - handle both string and object
          course.batchSchedule = parseJSON(req.body.batchSchedule, []);
        } else if (field === "curriculum") {
          // Parse curriculum JSON - handle both string and object
          course.curriculum = parseJSON(req.body.curriculum, []);
        } else {
          course[field] = req.body[field];
        }
      }
    });

    // Handle image replacement
    if (req.file) {
      if (course.image?.public_id) {
        await cloudinary.uploader.destroy(course.image.public_id);
      }

      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "kaumudi/courses",
      });
      cleanupLocalFile(req.file.path);

      course.image = {
        public_id: upload.public_id,
        url: upload.secure_url,
      };
    }

    await course.save();

    // Re-populate instructor after save to return full object
    await course.populate("instructor", "name role image description");
    await course.populate("createdBy", "name email");

    return res.json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
};

/* =========================
   DELETE COURSE (ADMIN)
========================= */
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.image?.public_id) {
      await cloudinary.uploader.destroy(course.image.public_id);
    }

    await course.deleteOne();

    return res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};

/* =========================
   TOGGLE COURSE STATUS (ADMIN)
========================= */
export const toggleCourseStatus = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Block activation if no instructor assigned
    if (!course.instructor && course.status === "INACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Assign an instructor before publishing this course",
      });
    }

    course.status = course.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await course.save();

    return res.json({
      success: true,
      status: course.status,
      message: `Course is now ${course.status === "ACTIVE" ? "published" : "unpublished"}`,
    });
  } catch (error) {
    console.error("TOGGLE STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle course status",
    });
  }
};

/* =========================
   GET ALL COURSES (PUBLIC)
========================= */
export const getAllCourses = async (req, res) => {
  try {
    const now = new Date();

    const courses = await Course.find({
      status: "ACTIVE",
      $or: [
        { endDate: { $gte: now } },
        { endDate: { $exists: false } },
        { endDate: null },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("instructor", "name role image description")
      .populate("createdBy", "name email");

    return res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("GET ALL COURSES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

export const getCourseDetail = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name role image description")
      .populate("createdBy", "name email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.json({ success: true, data: course });
  } catch (error) {
    console.error("GET COURSE DETAIL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course",
    });
  }
};

/* =========================
   GET ALL COURSES (ADMIN)
========================= */
export const getAllCoursesForAdmin = async (req, res) => {
  try {
    const courses = await Course.find()
      .sort({ createdAt: -1 })
      .populate("instructor", "name role image description")
      .populate("createdBy", "name email");

    return res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("GET ALL COURSES ADMIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

/* =========================
   GET ACTIVE COURSES (ADMIN)
========================= */
export const getActiveCoursesForAdmin = async (req, res) => {
  try {
    const now = new Date();

    const courses = await Course.find({
      status: "ACTIVE",
      endDate: { $gte: now },
    })
      .sort({ createdAt: -1 })
      .populate("instructor", "name role image")
      .populate("createdBy", "name email");

    return res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("GET ACTIVE COURSES ADMIN ERROR:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch active courses" });
  }
};

/* =========================
   GET COURSES WITH ENROLLMENT COUNT (ADMIN)
========================= */
export const getCoursesWithEnrollmentCount = async (req, res) => {
  try {
    const courses = await Course.aggregate([
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "course",
          as: "enrollments",
        },
      },
      {
        $lookup: {
          from: "staffs",
          localField: "instructor",
          foreignField: "_id",
          as: "instructor",
        },
      },
      {
        $unwind: { path: "$instructor", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: { enrollmentCount: { $size: "$enrollments" } },
      },
      {
        $project: { enrollments: 0 },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("COURSE ENROLLMENT COUNT ERROR:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch course stats" });
  }
};

/* =========================
   GET COURSE DASHBOARD STATS (ADMIN)
========================= */
export const getCourseDashboardStats = async (req, res) => {
  try {
    const now = new Date();

    const [totalCourses, activeCourses, activeStudents] = await Promise.all([
      Course.countDocuments(),
      Course.countDocuments({ status: "ACTIVE", endDate: { $gte: now } }),
      Enrollment.distinct("student"),
    ]);

    return res.json({
      success: true,
      data: {
        totalCourses,
        activeCourses,
        activeStudents: activeStudents.length,
      },
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch stats" });
  }
};
