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
  roleMiddleware("ADMIN"),
  getStudentFeeStats
);

// List fees (search, filter)
router.get(
  "/admin/student-fees",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllStudentFees
);

// View single fee record
router.get(
  "/admin/student-fees/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getStudentFeeById
);

// Mark payment as PAID
router.patch(
  "/admin/student-fees/:id/mark-paid",
  authMiddleware,
  roleMiddleware("ADMIN"),
  markFeeAsPaid
);

// Delete fee record
router.delete(
  "/admin/student-fees/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteStudentFee
);

export default router;
