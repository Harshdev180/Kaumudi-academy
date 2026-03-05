import express from "express";
import {
  updateProgress,
  getProgress,
  getCourseCertificate,
  getMyCertificates,
  downloadCertificate,
  verifyCertificate
} from "../controllers/progress.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/download/:certificateId", downloadCertificate);

router.post("/update", authMiddleware, updateProgress);

router.get("/:courseId", authMiddleware, getProgress);

router.get("/certificates/my", authMiddleware, getMyCertificates);

router.get("/certificates/:courseId", authMiddleware, getCourseCertificate);

router.get("/verify/:certificateId", verifyCertificate);

export default router;