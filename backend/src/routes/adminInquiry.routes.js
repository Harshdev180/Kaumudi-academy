import express from "express";
import {
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry
} from "../controllers/adminInquiry.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("ADMIN", "SUPER_ADMIN"));

router.get("/admin/inquiries", getAllInquiries);
router.get("/admin/inquiries/:id", getInquiryById);
router.patch("/admin/inquiries/:id/status", updateInquiryStatus);
router.delete("/admin/inquiries/:id", deleteInquiry);

export default router;
