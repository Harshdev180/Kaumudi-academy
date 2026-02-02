import express from "express";
import { createCoupon, toggleCouponStatus } from "../controllers/coupon.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { createCouponSchema } from "../validators/coupon.validator.js";

const router = express.Router();

router.post(
  "/coupon",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateBody(createCouponSchema),
  createCoupon
);

router.patch(
  "/coupon/:id/toggle",
  authMiddleware,
  roleMiddleware("ADMIN"),
  toggleCouponStatus
);

export default router;
