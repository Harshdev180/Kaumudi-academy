import express from "express";
import {
  getMyEnrollments,
  getMyCertificates,
    getDashboardStats,
    getRecentEnrollments,
  getMyProfile,
  updateMyProfile,
  getMySettings,
  updateMySettings,
  changeMyPassword
} from "../controllers/profile.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * 🔒 All profile routes
 * Role: STUDENT only
 */
router.use(authMiddleware, roleMiddleware("STUDENT"));

/**
 * Vidya — Enrollments
 */
router.get("/enrollments", getMyEnrollments);

/**
 * Pramana — Certificates
 */
router.get("/certificates", getMyCertificates);

/**
 * Vyaktigatam — Personal Info
 */
router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);

/**
 * Vinyasa — Settings
 */
router.get("/settings", getMySettings);
router.put("/settings", updateMySettings);
router.put("/change-password", changeMyPassword);
router.get("/stats", getDashboardStats);
router.get("/recent", getRecentEnrollments);

export default router;
