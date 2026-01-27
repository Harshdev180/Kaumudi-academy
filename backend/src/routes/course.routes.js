import express from "express";
const router = express.Router();

import {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseDetail,
  toggleCourseStatus,
  getAllCoursesForAdmin,
  getActiveCoursesForAdmin,
  getCoursesWithEnrollmentCount,
  getCourseDashboardStats
} from "../controllers/course.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

import {
  validateBody
} from "../middlewares/validate.middleware.js";

import {
  createCourseSchema,
  updateCourseSchema
} from "../validators/course.validator.js";


router.get("/course", getAllCourses);
router.get("/course/:id", getCourseDetail);


router.post(
  "/course",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  validateBody(createCourseSchema),
  createCourse
);

router.put(
  "/course/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  validateBody(updateCourseSchema),
  updateCourse
);

router.patch(
  "/course/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  toggleCourseStatus
);

router.delete(
  "/course/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteCourse
);

router.get("/course/admin/all", authMiddleware, roleMiddleware("ADMIN"), getAllCoursesForAdmin);
router.get("/course/admin/active", authMiddleware, roleMiddleware("ADMIN"), getActiveCoursesForAdmin);
router.get("/course/admin/with-enrollments", authMiddleware, roleMiddleware("ADMIN"), getCoursesWithEnrollmentCount);
router.get("/course/admin/stats", authMiddleware, roleMiddleware("ADMIN"), getCourseDashboardStats);

export default router;
