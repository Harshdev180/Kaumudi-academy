import express from "express";

import {
  getAdminNotifications,
  markNotificationAsRead,
  deleteNotification,
  markAllAsRead
} from "../controllers/notification.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
const router = express.Router();

/**
 * 🔔 Admin Notifications
 */

router.get(
  "/admin/notifications",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  getAdminNotifications
);

router.patch(
  "/admin/notifications/:id/read",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  markNotificationAsRead
);

router.delete(
  "/admin/notifications/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  deleteNotification
);

router.patch(
  "/admin/notifications/read-all",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  markAllAsRead
);

export default router;
