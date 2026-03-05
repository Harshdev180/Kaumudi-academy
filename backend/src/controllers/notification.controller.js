import Notification from "../models/Notification.model.js";

/**
 * GET /admin/notifications
 * Fetch notifications for logged-in admin with filtering, pagination
 */
export const getAdminNotifications = async (req, res) => {
  try {
    const { 
      type,        // PAYMENT, ENROLLMENT, STUDENT_QUERY, OTHERS
      isRead,     // true, false
      priority,   // HIGH, MEDIUM, LOW
      search,     // Search in title/message
      page = 1, 
      limit = 20 
    } = req.query;

    const query = {
      recipientRole: { $in: ["ADMIN", "SUPER_ADMIN"] }
    };

    // Filter by type
    if (type && type !== "all") {
      query.type = type.toUpperCase();
    }

    // Filter by read status
    if (isRead !== undefined) {
      query.isRead = isRead === "true";
    }

    // Filter by priority
    if (priority) {
      query.priority = priority.toUpperCase();
    }

    // Search in title or message
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      ...query,
      isRead: false
    });

    res.json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      unreadCount
    });
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications"
    });
  }
};

/**
 * GET /admin/notifications/stats
 * Get notification statistics by category
 */
export const getNotificationStats = async (req, res) => {
  try {
    const stats = await Notification.aggregate([
      {
        $match: { recipientRole: { $in: ["ADMIN", "SUPER_ADMIN"] } }
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: 1 },
          unread: { $sum: { $cond: ["$isRead", 0, 1] } },
          highPriority: { 
            $sum: { $cond: [{ $eq: ["$priority", "HIGH"] }, 1, 0] }
          }
        }
      }
    ]);

    // Format response
    const formatted = {
      all: { total: 0, unread: 0, highPriority: 0 },
      payment: { total: 0, unread: 0, highPriority: 0 },
      enrollment: { total: 0, unread: 0, highPriority: 0 },
      student_query: { total: 0, unread: 0, highPriority: 0 },
      others: { total: 0, unread: 0, highPriority: 0 }
    };

    stats.forEach(stat => {
      const key = stat._id ? stat._id.toLowerCase() : 'all';
      if (formatted[key]) {
        formatted[key] = { 
          total: stat.total, 
          unread: stat.unread,
          highPriority: stat.highPriority 
        };
      }
    });

    // Calculate totals
    formatted.all = stats.reduce(
      (acc, curr) => ({
        total: acc.total + curr.total,
        unread: acc.unread + curr.unread,
        highPriority: acc.highPriority + curr.highPriority
      }),
      { total: 0, unread: 0, highPriority: 0 }
    );

    res.json({
      success: true,
      data: formatted
    });
  } catch (error) {
    console.error("GET NOTIFICATION STATS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notification statistics"
    });
  }
};

/**
 * GET /student/notifications
 * Fetch notifications for logged-in student
 */
export const getStudentNotifications = async (req, res) => {
  try {
    const { 
      type,
      isRead,
      page = 1, 
      limit = 10  // Changed from 20 to 10
    } = req.query;

    const query = {
      recipientRole: "STUDENT"
    };

    // If user is logged in, filter by their notifications too
    if (req.user && req.user._id) {
      query.$or = [
        { recipientRole: "STUDENT", recipientId: req.user._id },
        { recipientRole: "STUDENT", recipientId: null } // Broadcast to all students
      ];
    }

    if (type && type !== "all") {
      query.type = type.toUpperCase();
    }

    if (isRead !== undefined) {
      query.isRead = isRead === "true";
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      ...query,
      isRead: false
    });

    res.json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      unreadCount
    });
  } catch (error) {
    console.error("GET STUDENT NOTIFICATIONS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications"
    });
  }
};

/**
 * DELETE /admin/notifications/:id
 * Delete a notification
 */
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

/**
 * DELETE /admin/notifications
 * Delete all read notifications (cleanup)
 */
export const cleanupReadNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      recipientRole: { $in: ["ADMIN", "SUPER_ADMIN"] },
      isRead: true
    });

    res.json({ 
      success: true, 
      message: `Deleted ${result.deletedCount} read notifications` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to cleanup" });
  }
};

/**
 * PATCH /admin/notifications/:id/read
 * Mark single notification as read (for both admin and student)
 */
export const markNotificationAsRead = async (req, res) => {
  try {
    // Build query based on user role
    const query = { _id: req.params.id };
    
    // If user is a student, only mark their own notifications
    if (req.user.role === "STUDENT") {
      query.recipientRole = "STUDENT";
      query.recipientId = req.user._id;
    } else {
      // Admin can mark any admin/super_admin notification
      query.recipientRole = { $in: ["ADMIN", "SUPER_ADMIN"] };
    }

    const notification = await Notification.findOneAndUpdate(
      query,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found or unauthorized"
      });
    }

    res.json({
      success: true,
      message: "Notification marked as read",
      data: notification
    });
  } catch (error) {
    console.error("MARK READ ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update notification"
    });
  }
};

/**
 * PATCH /admin/notifications/read-all (Admin)
 * PATCH /student/notifications/read-all (Student)
 * Mark all notifications as read
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userRole = req.user.role;
    let query = { isRead: false };

    if (userRole === "STUDENT") {
      // For students: mark only their own notifications
      query = {
        recipientRole: "STUDENT",
        recipientId: req.user._id,
        isRead: false
      };
    } else {
      // For admins: mark admin notifications
      query = {
        recipientRole: { $in: ["ADMIN", "SUPER_ADMIN"] },
        isRead: false
      };
    }

    const result = await Notification.updateMany(query, { isRead: true });

    res.json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`
    });
  } catch (error) {
    console.error("READ ALL ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update notifications"
    });
  }
};
