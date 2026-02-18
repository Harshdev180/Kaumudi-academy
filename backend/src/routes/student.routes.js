import express from "express";
const router = express.Router();

import {
  getStudentProfile,
  updateStudentProfile
} from "../controllers/student.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

router.get("/student/me", authMiddleware, getStudentProfile);

router.put("/student/me", authMiddleware, updateStudentProfile);

export default router;
