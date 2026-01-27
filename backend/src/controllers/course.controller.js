import Course from "../models/Course.model.js";
import cloudinary from "../configs/cloudinary.js";
import fs from "fs";


export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      syllabus,
      duration,
      mode,
      price,
      language,
      startDate,
      endDate
    } = req.body;

    let imageData = {};

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "kaumudi/courses"
      });

      imageData = {
        public_id: upload.public_id,
        url: upload.secure_url
      };
       if (req.file && fs.existsSync(req.file.path)) {
  fs.unlinkSync(req.file.path);
}

    }

    const course = await Course.create({
      title,
      description,
      syllabus,
      duration,
      mode,
      price,
      language,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      image: imageData,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course
    });
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create course"
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    
    delete req.body.createdBy;
    delete req.body._id;
    delete req.body.status;

    if (req.file) {
      if (course.image?.public_id) {
        await cloudinary.uploader.destroy(course.image.public_id);
      }

      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "kaumudi/courses"
      });

      course.image = {
        public_id: upload.public_id,
        url: upload.secure_url
      };
    }

    Object.assign(course, req.body);
    await course.save();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: course
    });
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update course"
    });
  }
};


export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    if (course.image?.public_id) {
      await cloudinary.uploader.destroy(course.image.public_id);
    }

    await course.deleteOne();

    res.json({
      success: true,
      message: "Course deleted successfully"
    });
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete course"
    });
  }
};


export const toggleCourseStatus = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    course.status =
      course.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    await course.save();

    res.json({
      success: true,
      message: "Course status updated",
      status: course.status
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};


export const getAllCourses = async (req, res) => {
  const now = new Date();

  const courses = await Course.find({
    status: "ACTIVE",
    endDate: { $gte: now }
  })
    .select("-price")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: courses
  });
};


export const getCourseDetail = async (req, res) => {
  const now = new Date();
  const course = await Course.findById(req.params.id);

  if (
    !course ||
    course.status !== "ACTIVE" ||
    course.endDate < now
  ) {
    return res.status(404).json({
      success: false,
      message: "Course not found"
    });
  }

  res.json({
    success: true,
    data: course
  });
};


export const getAllCoursesForAdmin = async (req, res) => {
  try {
    const courses = await Course.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses"
    });
  }
};


export const getActiveCoursesForAdmin = async (req, res) => {
  try {
    const now = new Date();

    const courses = await Course.find({
      status: "ACTIVE",
      endDate: { $gte: now }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};


import Enrollment from "../models/Enrollment.model.js";

export const getCoursesWithEnrollmentCount = async (req, res) => {
  try {
    const courses = await Course.aggregate([
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "course",
          as: "enrollments"
        }
      },
      {
        $addFields: {
          enrollmentCount: { $size: "$enrollments" }
        }
      },
      {
        $project: {
          enrollments: 0
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error("COURSE ENROLLMENT COUNT ERROR:", error);
    res.status(500).json({ success: false });
  }
};

export const getCourseDashboardStats = async (req, res) => {
  try {
    const now = new Date();

    const totalCourses = await Course.countDocuments();

    const activeCourses = await Course.countDocuments({
      status: "ACTIVE",
      endDate: { $gte: now }
    });

    const activeStudents = await Enrollment.distinct("student");

    res.json({
      success: true,
      data: {
        totalCourses,
        activeStudents: activeStudents.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
