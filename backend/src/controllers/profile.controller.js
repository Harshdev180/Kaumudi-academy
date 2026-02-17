import Enrollment from "../models/Enrollment.model.js";
import Certificate from "../models/Certificate.model.js";

/**
 * ==============================
 * VIDYA — ENROLLMENTS
 * ==============================
 * Get all enrollments of logged-in student
 */
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id
    })
      .populate("course", "title image startDate endDate")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    console.error("GET ENROLLMENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments"
    });
  }
};

/**
 * ==============================
 * PRAMANA — CERTIFICATES
 * ==============================
 * Get certificates of logged-in student
 */
export const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({
      student: req.user._id
    }).populate("course", "title");

    res.json({
      success: true,
      data: certificates
    });
  } catch (error) {
    console.error("GET CERTIFICATES ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificates"
    });
  }
};

/**
 * ==============================
 * VYAKTIGATAM — PERSONAL INFO
 * ==============================
 * Get logged-in student profile
 */
export const getMyProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile"
    });
  }
};

/**
 * Update logged-in student profile
 */
export const updateMyProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "phone",
      "dob",
      "address",
      "city",
      "state",
      "country",
      "bio"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    await req.user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: req.user
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
};

/**
 * ==============================
 * VINYASA — SETTINGS
 * ==============================
 * Get student settings
 */
export const getMySettings = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user.settings
    });
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings"
    });
  }
};

/**
 * Update student settings (SAFE MERGE)
 */
export const updateMySettings = async (req, res) => {
  try {
    const currentSettings = req.user.settings || {};

    req.user.settings = {
      ...currentSettings,
      ...req.body,
      notifications: {
        ...currentSettings.notifications,
        ...req.body.notifications
      },
      preferences: {
        ...currentSettings.preferences,
        ...req.body.preferences
      },
      security: {
        ...currentSettings.security,
        ...req.body.security
      }
    };

    await req.user.save();

    res.json({
      success: true,
      message: "Settings updated successfully",
      data: req.user.settings
    });
  } catch (error) {
    console.error("UPDATE SETTINGS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings"
    });
  }
};
