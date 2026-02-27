import express from "express";

import {
  getAllStudentFees,
  getStudentFeeById,
  markFeeAsPaid,
  deleteStudentFee,
  getStudentFeeStats
} from "../controllers/studentFee.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * 🔐 Admin Protected Routes
 * Base URL: /api/admin/student-fees
 */

// Dashboard cards
router.get(
  "/admin/student-fees/stats",
  authMiddleware,
  roleMiddleware("admin", "ADMIN", "SUPER_ADMIN"),
  getStudentFeeStats
);

// List fees (search, filter)
router.get(
  "/admin/student-fees",
  authMiddleware,
  roleMiddleware("admin", "ADMIN", "SUPER_ADMIN"),
  getAllStudentFees
);

// View single fee record
router.get(
  "/admin/student-fees/:id",
  authMiddleware,
  roleMiddleware("admin", "ADMIN", "SUPER_ADMIN"),
  getStudentFeeById
);

// Mark payment as PAID
router.patch(
  "/admin/student-fees/:id/mark-paid",
  authMiddleware,
  roleMiddleware("admin", "ADMIN", "SUPER_ADMIN"),
  markFeeAsPaid
);

// Delete fee record
router.delete(
  "/admin/student-fees/:id",
  authMiddleware,
  roleMiddleware("admin", "ADMIN", "SUPER_ADMIN"),
  deleteStudentFee
);

export default router;
