import express from "express";
import { submitInquiry } from "../controllers/inquiry.controller.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { submitInquirySchema } from "../validators/inquiry.validator.js";

const router = express.Router();

router.post(
  "/inquiries",
  validateBody(submitInquirySchema),
  submitInquiry
);

export default router;