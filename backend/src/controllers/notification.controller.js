import Notification from "../models/Notification.model.js";

/**
 * GET /admin/notifications
 * Fetch notifications for logged-in admin
 */
export const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientRole: { $in: ["ADMIN", "SUPER_ADMIN"] } // ← fetch for both
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications"
    });
  }
};

export const getStudentNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientRole: "STUDENT"
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error("GET STUDENT NOTIFICATIONS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications"
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

/**
 * PATCH /admin/notifications/:id/read
 */
export const markNotificationAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true
    });

    res.json({
      success: true,
      message: "Notification marked as read"
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
 * PATCH /admin/notifications/read-all
 */
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientRole: req.user.role, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: "All notifications marked as read"
    });
  } catch (error) {
    console.error("READ ALL ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update notifications"
    });
  }
};
