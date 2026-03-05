import express from "express";

import {
  getAdminNotifications,
  getStudentNotifications,
  getNotificationStats,
  markNotificationAsRead,
  deleteNotification,
  markAllAsRead,
  cleanupReadNotifications
} from "../controllers/notification.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * 🔔 Admin Notifications
 */

// Get all admin notifications with filters
router.get(
  "/admin/notifications",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  getAdminNotifications
);

// Get notification statistics
router.get(
  "/admin/notifications/stats",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  getNotificationStats
);

// Mark single notification as read
router.patch(
  "/admin/notifications/:id/read",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  markNotificationAsRead
);

// Delete single notification
router.delete(
  "/admin/notifications/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  deleteNotification
);

// Mark all notifications as read
router.patch(
  "/admin/notifications/read-all",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  markAllAsRead
);

// Cleanup read notifications
router.delete(
  "/admin/notifications/cleanup",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  cleanupReadNotifications
);

/**
 * 🔔 Student Notifications
 */

// Get student notifications
router.get(
  "/student/notifications",
  authMiddleware,
  getStudentNotifications
);

// Mark single student notification as read
router.patch(
  "/student/notifications/:id/read",
  authMiddleware,
  markNotificationAsRead
);

// Mark all student notifications as read
router.patch(
  "/student/notifications/read-all",
  authMiddleware,
  markAllAsRead
);

export default router;
