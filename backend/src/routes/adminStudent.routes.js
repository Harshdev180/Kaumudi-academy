import express from "express";
import {
  getAllStudents,
  createStudentByAdmin,
  updateStudentByAdmin,
  deleteStudentByAdmin,
  toggleStudentStatus,
  toggleStudentPayment
} from "../controllers/adminStudent.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

/**
 * ADMIN STUDENT MANAGEMENT
 */
router.get(
  "/admin/students",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllStudents
);

router.post(
  "/admin/students",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  createStudentByAdmin
);

router.put(
  "/admin/students/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  updateStudentByAdmin
);

router.delete(
  "/admin/students/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteStudentByAdmin
);

router.patch(
  "/admin/students/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  toggleStudentStatus
);

router.patch(
  "/admin/students/:id/payment",
  authMiddleware,
  roleMiddleware("ADMIN"),
  toggleStudentPayment
);

export default router;
