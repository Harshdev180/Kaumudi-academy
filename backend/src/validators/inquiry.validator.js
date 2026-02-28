import Joi from "joi";

export const submitInquirySchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),

  vedicName: Joi.string().allow("", null),

  email: Joi.string().email().required(),

  whatsappNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),

  preferredLevel: Joi.string()
    .valid("BEGINNER", "INTERMEDIATE", "ADVANCED")
    .required(),

  message: Joi.string().max(1000).allow("", null),

  course: Joi.object({
    title: Joi.string().optional(),
    duration: Joi.string().optional(),
    language: Joi.string().optional(),
    level: Joi.string().optional()
  }).optional()
});