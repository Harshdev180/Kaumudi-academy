import Notification from "../models/Notification.model.js";
import Student from "../models/Student.model.js";
import Admin from "../models/Admin.model.js";

/**
 * Fetches user details based on user ID and role
 */
const getUserDetails = async (userId, role) => {
  try {
    if (!userId) {
      console.log("⚠️ getUserDetails: No userId provided");
      return null;
    }
    
    console.log(`🔍 getUserDetails: Looking up userId=${userId}, role=${role}`);
    
    let user;
    if (role === "STUDENT") {
      user = await Student.findById(userId).select("firstName lastName email phoneNumber");
    } else if (role === "ADMIN" || role === "SUPER_ADMIN") {
      user = await Admin.findById(userId).select("firstName lastName email");
    }
    
    if (user) {
      // For student users, try to get enrollment ID if course context is available
      let enrollmentId = null;
      if (role === "STUDENT") {
        // We'll add enrollment ID from the notification metadata instead
        // This is a placeholder that will be overridden by the calling function
        enrollmentId = null;
      }
      
      const userData = {
        id: user._id.toString(),
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown",
        email: user.email || "N/A",
        phone: user.phoneNumber || "N/A",
        enrollmentId: enrollmentId
      };
      console.log(`✅ getUserDetails: Found user -`, userData);
      return userData;
    }
    console.log(`⚠️ getUserDetails: No user found for userId=${userId}, role=${role}`);
    return null;
  } catch (error) {
    console.error("GET USER DETAILS ERROR:", error);
    return null;
  }
};

/**
 * Creates a new notification and saves it to the database
 * @param {Object} params - Notification parameters
 * @param {string} params.title - Notification title
 * @param {string} params.message - Notification message
 * @param {string} params.type - Main category: PAYMENT, ENROLLMENT, STUDENT_QUERY, OTHERS
 * @param {string} params.subType - Specific action type
 * @param {string} params.recipientRole - ADMIN, SUPER_ADMIN, STUDENT, ALL
 * @param {mongoose.Types.ObjectId} [params.recipientId] - Specific recipient ID
 * @param {string} [params.actionUrl] - Frontend redirect URL
 * @param {string} [params.priority] - HIGH, MEDIUM, LOW
 * @param {Object} [params.metadata] - Additional data
 * @param {mongoose.Types.ObjectId} [params.userId] - User ID for fetching details
 * @param {Date} [params.expiresAt] - Expiration date
 * @returns {Promise<Document>} Created notification
 */
export const createNotification = async ({
  title,
  message,
  type,
  subType,
  recipientRole,
  recipientId = null,
  actionUrl = null,
  priority = "MEDIUM",
  metadata = {},
  userId = null,
  userRole = null,  // NEW: Explicit role for user lookup
  expiresAt = null
}) => {
  try {
    // Fetch user details if userId is provided
    // Use userRole if explicitly provided (for admin notifications about student actions)
    let userDetails = null;
    if (userId && userRole) {
      console.log(`🔔 Creating notification: userId=${userId}, userRole=${userRole}, type=${type}/${subType}`);
      userDetails = await getUserDetails(userId, userRole);
    } else if (userId) {
      // Fallback: use recipientRole if userRole not specified
      console.log(`🔔 Creating notification: userId=${userId}, recipientRole=${recipientRole}, type=${type}/${subType}`);
      userDetails = await getUserDetails(userId, recipientRole);
    }

    // Merge user details into metadata
    // If metadata contains enrollmentId, also add it to userDetails
    if (userDetails && metadata.enrollmentId) {
      userDetails = {
        ...userDetails,
        enrollmentId: metadata.enrollmentId
      };
    }
    
    const enrichedMetadata = {
      ...metadata,
      userDetails: userDetails
    };

    const notification = await Notification.create({
      title,
      message,
      type,
      subType,
      recipientRole,
      recipientId,
      actionUrl,
      priority,
      metadata: enrichedMetadata,
      expiresAt
    });

    console.log(`🔔 Notification created: ${title} (${type}/${subType})`);
    return notification;
  } catch (error) {
    console.error("CREATE NOTIFICATION ERROR:", error);
    // Don't throw - notifications should not break main flow
    return null;
  }
};

/**
 * Creates multiple notifications for different recipients
 * @param {Array} notifications - Array of notification objects
 */
export const createBulkNotifications = async (notifications) => {
  try {
    const created = await Notification.insertMany(notifications);
    console.log(`🔔 Bulk notifications created: ${created.length}`);
    return created;
  } catch (error) {
    console.error("CREATE BULK NOTIFICATIONS ERROR:", error);
    return [];
  }
};

/**
 * Sends notification to all admins
 */
export const notifyAdmins = async ({
  title,
  message,
  type,
  subType,
  actionUrl = null,
  priority = "MEDIUM",
  metadata = {},
  userId = null,
  userRole = null  // NEW: Specify the role for user lookup (e.g., "STUDENT" for student actions)
}) => {
  return createNotification({
    title,
    message,
    type,
    subType,
    recipientRole: "ADMIN",
    actionUrl,
    priority,
    metadata,
    userId,
    userRole
  });
};

/**
 * Sends notification to a specific student
 */
export const notifyStudent = async ({
  studentId,
  title,
  message,
  type,
  subType,
  actionUrl = null,
  priority = "MEDIUM",
  metadata = {},
  userId = null
}) => {
  return createNotification({
    title,
    message,
    type,
    subType,
    recipientRole: "STUDENT",
    recipientId: studentId,
    actionUrl,
    priority,
    metadata,
    userId: userId || studentId
  });
};

/**
 * Sends notification to both admin and student
 */
export const notifyBoth = async ({
  adminTitle,
  adminMessage,
  studentId,
  studentTitle,
  studentMessage,
  type,
  subType,
  adminActionUrl = null,
  studentActionUrl = null,
  priority = "MEDIUM",
  metadata = {},
  userId = null,
  userRole = null  // NEW: Explicit role for user lookup
}) => {
  const results = await Promise.all([
    // Notify admin
    createNotification({
      title: adminTitle,
      message: adminMessage,
      type,
      subType,
      recipientRole: "ADMIN",
      actionUrl: adminActionUrl,
      priority,
      metadata: { ...metadata, studentId },
      userId: userId || studentId,
      userRole: userRole || "STUDENT"  // Default to STUDENT for admin notifications
    }),
    // Notify student
    createNotification({
      title: studentTitle,
      message: studentMessage,
      type,
      subType,
      recipientRole: "STUDENT",
      recipientId: studentId,
      actionUrl: studentActionUrl,
      priority,
      metadata,
      userId: studentId,
      userRole: "STUDENT"
    })
  ]);

  return results;
};

/**
 * Marks a notification as read
 */
export const markAsRead = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    return notification;
  } catch (error) {
    console.error("MARK AS READ ERROR:", error);
    return null;
  }
};

/**
 * Marks all notifications as read for a recipient
 */
export const markAllAsRead = async (recipientRole, recipientId = null) => {
  try {
    const query = { recipientRole, isRead: false };
    if (recipientId) {
      query.recipientId = recipientId;
    }
    
    const result = await Notification.updateMany(query, { isRead: true });
    console.log(`🔔 Marked ${result.modifiedCount} notifications as read`);
    return result;
  } catch (error) {
    console.error("MARK ALL AS READ ERROR:", error);
    return null;
  }
};

/**
 * Gets unread notification count for a recipient
 */
export const getUnreadCount = async (recipientRole, recipientId = null) => {
  try {
    const query = { recipientRole, isRead: false };
    if (recipientId) {
      query.recipientId = recipientId;
    }
    
    const count = await Notification.countDocuments(query);
    return count;
  } catch (error) {
    console.error("GET UNREAD COUNT ERROR:", error);
    return 0;
  }
};

/**
 * Gets notification statistics for admin dashboard
 */
export const getNotificationStats = async (recipientRole = "ADMIN") => {
  try {
    const stats = await Notification.aggregate([
      {
        $match: { recipientRole }
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: 1 },
          unread: { $sum: { $cond: ["$isRead", 0, 1] } }
        }
      }
    ]);
    
    // Format response
    const formatted = {
      all: { total: 0, unread: 0 },
      payment: { total: 0, unread: 0 },
      enrollment: { total: 0, unread: 0 },
      student_query: { total: 0, unread: 0 },
      others: { total: 0, unread: 0 }
    };
    
    stats.forEach(stat => {
      const key = stat._id ? stat._id.toLowerCase().replace('_', '_') : 'all';
      if (formatted[key]) {
        formatted[key] = { total: stat.total, unread: stat.unread };
      }
    });
    
    // Calculate totals
    formatted.all = stats.reduce(
      (acc, curr) => ({
        total: acc.total + curr.total,
        unread: acc.unread + curr.unread
      }),
      { total: 0, unread: 0 }
    );
    
    return formatted;
  } catch (error) {
    console.error("GET NOTIFICATION STATS ERROR:", error);
    return null;
  }
};

/**
 * Deletes expired notifications
 */
export const cleanupExpiredNotifications = async () => {
  try {
    const result = await Notification.deleteMany({
      expiresAt: { $lt: new Date() },
      isRead: true
    });
    
    if (result.deletedCount > 0) {
      console.log(`🗑️ Deleted ${result.deletedCount} expired notifications`);
    }
    
    return result;
  } catch (error) {
    console.error("CLEANUP EXPIRED NOTIFICATIONS ERROR:", error);
    return null;
  }
};

export default {
  createNotification,
  createBulkNotifications,
  notifyAdmins,
  notifyStudent,
  notifyBoth,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  getNotificationStats,
  cleanupExpiredNotifications
};
