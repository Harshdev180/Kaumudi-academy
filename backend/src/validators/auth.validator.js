import Joi from "joi";

export const registerSuperAdminSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),

  email: Joi.string().email().lowercase().required(),

  password: Joi.string()
    .min(6)
    .max(30)
    .required(),

  phoneNumber: Joi.string()
    .min(10)
    .max(15)
    .required(),

  secretKey: Joi.string().required()
});


export const registerStudentSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(30).required(),

  lastName: Joi.string().trim().min(2).max(30).required(),

  email: Joi.string().email().lowercase().required(),

  password: Joi.string()
    .min(6)
    .max(30)
    .required(),

  address: Joi.string().trim().min(5).max(200).optional(),

  phoneNumber: Joi.string()
    .min(10)
    .max(15)
    .optional()
});



export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),

  password: Joi.string().required(),

  role: Joi.string()
    .valid("SUPER_ADMIN", "ADMIN", "STUDENT")
    .required()
});



export const createAdminSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),

  email: Joi.string().email().lowercase().required(),

  phoneNumber: Joi.string()
    .min(10)
    .max(15)
    .required()
});


export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().required()
});


export const resetPasswordParamsSchema = Joi.object({
  token: Joi.string().required()
});

export const resetPasswordBodySchema = Joi.object({
  newPassword: Joi.string()
    .min(6)
    .max(30)
    .required(),

  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords do not match"
    })
});
