import express from "express";
import { login, createAdmin } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

/* Login (Admin & Super Admin) */
router.post("/login", login);

/* Super Admin creates Admin */
router.post(
  "/create-admin",
  authMiddleware,
  roleMiddleware(ROLES.SUPER_ADMIN),
  createAdmin
);

/* Example Admin-only API */
router.get(
  "/admin-dashboard",
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  (req, res) => {
    res.json({ message: "Welcome Admin Dashboard" });
  }
);

export default router;
