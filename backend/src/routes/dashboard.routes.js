import express from "express";
const router = express.Router();

import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

router.get(
  "/dashboard/stats",
  authMiddleware,
  roleMiddleware("admin", "ADMIN", "SUPER_ADMIN"),
  getDashboardStats
);

export default router;
