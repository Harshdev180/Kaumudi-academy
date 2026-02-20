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

<<<<<<< HEAD
router.use(authMiddleware, roleMiddleware("ADMIN", "SUPER_ADMIN"));
=======
/**
 * 🔐 Admin Protected Routes
 * Only ADMIN & SUPER_ADMIN can access
 */

router.use(
  authMiddleware,
  roleMiddleware("ADMIN")
);
>>>>>>> 9a3e0c6e7d138eb193aa122457f10197a9d8b415

router.get("/admin/inquiries", getAllInquiries);
router.get("/admin/inquiries/:id", getInquiryById);
router.patch("/admin/inquiries/:id/status", updateInquiryStatus);
router.delete("/admin/inquiries/:id", deleteInquiry);

export default router;
