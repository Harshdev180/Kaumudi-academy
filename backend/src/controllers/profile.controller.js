import Enrollment from "../models/Enrollment.model.js";
import Certificate from "../models/Certificate.model.js";
import bcrypt from "bcryptjs";
import Payment from "../models/Payment.model.js";
import { formatEnrollmentId } from "../utils/enrollment.utils.js";
import mongoose from "mongoose";

/**
 * 📊 DASHBOARD STATS
 */
export const getDashboardStats = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id,
    });

    const total = enrollments.length;
    const active = enrollments.filter((e) => e.status === "ACTIVE").length;
    const completed = enrollments.filter(
      (e) => e.status === "COMPLETED",
    ).length;

    const avgProgress =
      total === 0
        ? 0
        : Math.round(
            enrollments.reduce((sum, e) => sum + e.progress, 0) / total,
          );

    res.json({
      success: true,
      data: { total, active, completed, avgProgress },
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
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
      student: req.user._id,
    })
      .populate(
        "course",
        "title image startDate endDate category instructor duration level mode",
      )
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    console.error("RECENT ENROLLMENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent enrollments",
    });
  }
};

/**
 * ==============================
 * VIDYA — ALL ENROLLMENTS
 * ==============================
 */
// export const getMyEnrollments = async (req, res) => {
//   try {
//     const enrollments = await Enrollment.find({
//       student: req.user._id,
//     })
//       .populate(
//         "course",
//         "title image startDate endDate category instructor duration level mode",
//       )
//       // In getMyEnrollments, change populate to:
//       .populate({
//         path: "payment",
//         select: "originalAmount finalAmount discountAmount status",
//         // Add this to debug:
//         match: {}
//       })
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: enrollments,
//     });
//   } catch (error) {
//     console.error("GET ENROLLMENTS ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch enrollments",
//     });
//   }
// };
export const getMyEnrollments = async (req, res) => {
  try {
    console.log("getMyEnrollments - User ID:", req.user?._id, "Role:", req.user?.role);
    console.log("User ID type:", typeof req.user?._id);
    
    const enrollments = await Enrollment.find({
      student: req.user._id,
    })
      .populate(
        "course",
        "title image startDate endDate category instructor duration level mode",
      )
      .populate({
        path: "payment",
        select:
          "originalAmount discountAmount finalAmount couponCode paymentMode status",
      })
      .sort({ createdAt: -1 });

    console.log("Found enrollments:", enrollments.length);
    enrollments.forEach((e, i) => {
      console.log(`  ${i + 1}. enrollment._id: ${e._id}, student: ${e.student}, payment: ${e.payment?._id || 'null'}`);
    });

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
    console.error("GET ENROLLMENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments",
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
    const userId = req.user._id;
    
    const certificates = await Certificate.find({
      user: userId,
    }).populate("course", "title");

    // For each certificate, find the corresponding enrollment to get enrollment ID
    const certificatesWithEnrollment = await Promise.all(
      certificates.map(async (cert) => {
        const certObj = cert.toObject();
        
        try {
          // Find the enrollment for this user and course
          // Use the certificate's course._id after population
          const courseId = cert.course?._id;
          
          let enrollment = null;
          if (courseId) {
            // Try to find enrollment with explicit ObjectId conversion
            enrollment = await Enrollment.findOne({
              student: new mongoose.Types.ObjectId(userId),
              course: new mongoose.Types.ObjectId(courseId),
            }).sort({ createdAt: -1 });
          }
          
          // Format enrollment ID using the enrollment's _id
          if (enrollment) {
            certObj.enrollmentId = formatEnrollmentId(enrollment._id, enrollment.createdAt);
            console.log("Found enrollment:", enrollment._id, "-> formatted:", certObj.enrollmentId);
          } else {
            // Fallback to user ID if no enrollment found
            certObj.enrollmentId = formatEnrollmentId(userId, req.user.createdAt);
            console.log("No enrollment found, using userId:", certObj.enrollmentId);
          }
        } catch (enrollErr) {
          console.error("Enrollment lookup error:", enrollErr);
          // Fallback on error
          certObj.enrollmentId = formatEnrollmentId(userId, req.user.createdAt);
        }
        
        return certObj;
      })
    );

    res.json({
      success: true,
      data: certificatesWithEnrollment,
    });
  } catch (error) {
    console.error("GET CERTIFICATES ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificates",
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
    if (!userObj.name) {
      const first = userObj.firstName || "";
      const last = userObj.lastName || "";
      userObj.name = [first, last].filter(Boolean).join(" ").trim();
    }
    if (!userObj.phone && userObj.phoneNumber) {
      userObj.phone = userObj.phoneNumber;
    }

    // Add formatted enrollment ID
    userObj.enrollmentId = formatEnrollmentId(userObj._id, userObj.createdAt);

    res.json({
      success: true,
      data: userObj,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

/**
 * ✏️ UPDATE PROFILE
 */
export const updateMyProfile = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (payload.name && !payload.firstName && !payload.lastName) {
      const parts = String(payload.name).trim().split(/\s+/);
      payload.firstName = parts.shift();
      payload.lastName = parts.join(" ") || undefined; // Don't set empty string for required field
    }

    if (payload.phone && !payload.phoneNumber) {
      payload.phoneNumber = payload.phone;
    }

    // Handle date of birth - validate and parse properly
    if (payload.dob !== undefined) {
      if (payload.dob === "" || payload.dob === null) {
        // Clear the dob if empty
        payload.dob = undefined;
      } else {
        // Try to parse the date
        const dobDate = new Date(payload.dob);
        // Check if valid date
        if (!isNaN(dobDate.getTime())) {
          payload.dob = dobDate;
        } else {
          // Try parsing common date formats (MMDDYY, DDMMYY, YYMMDD)
          const dateStr = String(payload.dob);
          if (/^\d{6}$/.test(dateStr)) {
            // Assume MMDDYY format
            const month = parseInt(dateStr.substring(0, 2)) - 1;
            const day = parseInt(dateStr.substring(2, 4));
            let year = parseInt(dateStr.substring(4, 6));
            year = year > 50 ? 1900 + year : 2000 + year;
            const parsedDate = new Date(year, month, day);
            if (!isNaN(parsedDate.getTime())) {
              payload.dob = parsedDate;
            }
          } else {
            // Invalid date format, don't update
            delete payload.dob;
          }
        }
      }
    }

    const allowedFields = [
      "firstName",
      "lastName",
      "phoneNumber",
      "dob",
      "address",
      "city",
      "state",
      "country",
      "bio",
      "sanskritKnowledge",
      "occupation",
    ];

    allowedFields.forEach((field) => {
      // Only set field if it's defined and not an empty string
      if (payload[field] !== undefined && payload[field] !== "") {
        req.user[field] = payload[field];
      }
    });

    await req.user.save();

    const userObj = req.user.toObject();
    delete userObj.password;
    delete userObj.__v;

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: userObj,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
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
      data: req.user.settings || {},
    });
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
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
        ...(req.body.notifications || {}),
      },
      preferences: {
        ...(currentSettings.preferences || {}),
        ...(req.body.preferences || {}),
      },
      security: {
        ...(currentSettings.security || {}),
        ...(req.body.security || {}),
      },
    };

    await req.user.save();

    res.json({
      success: true,
      message: "Settings updated successfully",
      data: req.user.settings,
    });
  } catch (error) {
    console.error("UPDATE SETTINGS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};

/**
 * ==============================
 * 🔐 CHANGE PASSWORD
 * ==============================
 */
export const changeMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    // Check password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    // Get user with password field
    const user = await req.user.constructor
      .findById(req.user._id)
      .select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};
