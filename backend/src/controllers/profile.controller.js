import Enrollment from "../models/Enrollment.model.js";
import Certificate from "../models/Certificate.model.js";

/**
 * ==============================
 * 📊 DASHBOARD STATS
 * ==============================
 */
export const getDashboardStats = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id
    });

    const total = enrollments.length;
    const active = enrollments.filter(e => e.status === "ACTIVE").length;
    const completed = enrollments.filter(e => e.status === "COMPLETED").length;

    const avgProgress =
      total === 0
        ? 0
        : Math.round(
            enrollments.reduce((sum, e) => sum + e.progress, 0) / total
          );

    res.json({
      success: true,
      data: { total, active, completed, avgProgress }
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats"
    });
  }
};

/**
 * ==============================
 * 📚 RECENT ENROLLMENTS
 * ==============================
 */
export const getRecentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id
    })
      .populate("course", "title image startDate endDate")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    console.error("RECENT ENROLLMENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent enrollments"
    });
  }
};

/**
 * ==============================
 * VIDYA — ALL ENROLLMENTS
 * ==============================
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
 * VYAKTIGATAM — PROFILE
 * ==============================
 */
export const getMyProfile = async (req, res) => {
  try {
    const userObj = req.user.toObject();

    // remove sensitive fields
    delete userObj.password;
    delete userObj.__v;

    res.json({
      success: true,
      data: userObj
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
 * ✏️ UPDATE PROFILE
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

    const userObj = req.user.toObject();
    delete userObj.password;
    delete userObj.__v;

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: userObj
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
 * ⚙️ SETTINGS
 * ==============================
 */
export const getMySettings = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user.settings || {}
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
 * 🔧 UPDATE SETTINGS (SAFE MERGE)
 */
export const updateMySettings = async (req, res) => {
  try {
    const currentSettings = req.user.settings || {};

    req.user.settings = {
      ...currentSettings,
      ...req.body,
      notifications: {
        ...(currentSettings.notifications || {}),
        ...(req.body.notifications || {})
      },
      preferences: {
        ...(currentSettings.preferences || {}),
        ...(req.body.preferences || {})
      },
      security: {
        ...(currentSettings.security || {}),
        ...(req.body.security || {})
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
