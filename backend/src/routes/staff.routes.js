import express from "express";
const router = express.Router();

import {
  createStaff,
  getAllStaff,
  updateStaff,
  deleteStaff,
  toggleStaffPayment,
  toggleStaffStatus,
  getStaffStats
} from "../controllers/staff.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

/**
 * ADMIN ROUTES
 */
router.get("/staff", authMiddleware, roleMiddleware("ADMIN"), getAllStaff);

router.get("/staff/stats", authMiddleware, roleMiddleware("ADMIN"), getStaffStats);

router.post("/staff", authMiddleware, roleMiddleware("ADMIN"), createStaff);

router.put("/staff/:id", authMiddleware, roleMiddleware("ADMIN"), updateStaff);

router.delete("/staff/:id", authMiddleware, roleMiddleware("ADMIN"), deleteStaff);

router.patch(
  "/staff/:id/pay",
  authMiddleware,
  roleMiddleware("ADMIN"),
  toggleStaffPayment
);

router.patch(
  "/staff/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  toggleStaffStatus
);

export default router;
