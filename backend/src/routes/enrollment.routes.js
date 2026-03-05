
import express from "express";
const router = express.Router();

import {
  getMyEnrollments,
  getAllEnrollments,
  checkEnrollment,
  updateEnrollmentStatus,
  completeCourse
} from "../controllers/enrollment.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";


router.get(
  "/enrollment/my",
  authMiddleware,
  getMyEnrollments
);


router.get(
  "/enrollment/check/:courseId",
  authMiddleware,
  checkEnrollment
);


router.get(
  "/enrollment",
  authMiddleware,
  roleMiddleware("admin", "ADMIN", "SUPER_ADMIN"),
  getAllEnrollments
);

// Admin: Update enrollment status
router.patch(
  "/enrollment/:enrollmentId/status",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  updateEnrollmentStatus
);

// Admin: Mark course as completed
router.patch(
  "/enrollment/:enrollmentId/complete",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  completeCourse
);

export default router;
