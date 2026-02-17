import express from "express";
import {
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry
} from "../controllers/adminInquiry.controller.js";

import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(isAuthenticated, isAdmin);

router.get("/admin/inquiries", getAllInquiries);
router.get("/admin/inquiries/:id", getInquiryById);
router.patch("/admin/inquiries/:id/status", updateInquiryStatus);
router.delete("/admin/inquiries/:id", deleteInquiry);

export default router;
