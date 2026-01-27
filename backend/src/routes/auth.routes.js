import express from "express";
const router = express.Router();



import {
  registerSuperAdmin,
  registerStudent,
  login,
  createAdmin,
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller.js";



import {
  registerSuperAdminSchema,
  registerStudentSchema,
  loginSchema,
  createAdminSchema,
  forgotPasswordSchema,
  resetPasswordParamsSchema,
  resetPasswordBodySchema
} from "../validators/auth.validator.js";



import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import {
  validateBody,
  validateParams
} from "../middlewares/validate.middleware.js";


router.post(
  "/auth/super-admin/register",
  validateBody(registerSuperAdminSchema),
  registerSuperAdmin
);


router.post(
  "/auth/student/register",
  validateBody(registerStudentSchema),
  registerStudent
);



router.post(
  "/auth/login",
  validateBody(loginSchema),
  login
);


router.post(
  "/auth/forgot-password",
  validateBody(forgotPasswordSchema),
  forgotPassword
);


router.post(
  "/auth/reset-password/:token",
  validateParams(resetPasswordParamsSchema),
  validateBody(resetPasswordBodySchema),
  resetPassword
);


router.post(
  "/auth/admin/create",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN"),
  validateBody(createAdminSchema),
  createAdmin
);

export default router;
