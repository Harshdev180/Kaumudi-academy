
import express from "express";
const router = express.Router();

import {
  getMyEnrollments,
  getAllEnrollments
} from "../controllers/enrollment.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";


router.get(
  "/enrollment/my",
  authMiddleware,
  getMyEnrollments
);


router.get(
  "/enrollment",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllEnrollments
);

export default router;
