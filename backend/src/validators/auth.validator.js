import Joi from "joi";

const email = Joi.string()
  .trim()
  .lowercase()
  .email({ tlds: { allow: false } });

const phoneNumber = Joi.string()
  .pattern(/^[6-9]\d{9}$/)
  .messages({
    "string.pattern.base": "Invalid Indian phone number"
  });

const password = Joi.string()
  .min(8)
  .max(30)
  .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/)
  .messages({
    "string.pattern.base":
      "Password must contain letters and numbers"
  });

export const registerSuperAdminSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),
  email: email.required(),
  password: password.required(),
  phoneNumber: phoneNumber.required(),
  secretKey: Joi.string().required()
}).unknown(false);

export const registerStudentSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(30).required(),
  lastName: Joi.string().trim().min(2).max(30).required(),
  email: email.required(),
  password: password.required(),
  address: Joi.string().trim().min(5).max(200).optional(),
  phoneNumber: phoneNumber.optional()
}).unknown(false);

// NEW: Verify OTP Schema
export const verifyOtpSchema = Joi.object({
  email: email.required(),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only numbers"
    })
}).unknown(false);

// NEW: Resend OTP Schema
export const resendOtpSchema = Joi.object({
  email: email.required()
}).unknown(false);

export const loginSchema = Joi.object({
  email: email.required(),
  password: Joi.string().required(),
  role: Joi.string()
    .valid("SUPER_ADMIN", "ADMIN", "STUDENT")
    .required()
}).unknown(false);

export const createAdminSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),
  email: email.required(),
  phoneNumber: phoneNumber.required()
}).unknown(false);

export const forgotPasswordSchema = Joi.object({
  email: email.required(),
  role: Joi.string()
    .valid("SUPER_ADMIN", "ADMIN", "STUDENT")
    .required()
}).unknown(false);

export const resetPasswordParamsSchema = Joi.object({
  token: Joi.string().length(64).required()
});

export const resetPasswordBodySchema = Joi.object({
  newPassword: password.required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords do not match"
    })
}).unknown(false);