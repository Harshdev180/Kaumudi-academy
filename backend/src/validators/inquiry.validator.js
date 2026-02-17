import Joi from "joi";

export const submitInquirySchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "Full name is required",
      "string.min": "Full name must be at least 3 characters"
    }),

  vedicName: Joi.string()
    .trim()
    .max(100)
    .allow("", null)
    .optional(),

  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Invalid email address",
      "any.required": "Email is required"
    }),

  phoneNumber: Joi.string()
    .trim()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be a valid 10-digit Indian number",
      "any.required": "Phone number is required"
    }),

  preferredLevel: Joi.string()
    .trim()
    .valid("BEGINNER", "INTERMEDIATE", "ADVANCED")
    .required()
    .messages({
      "any.only": "Preferred level must be Beginner, Intermediate or Advanced"
    }),

  message: Joi.string()
    .trim()
    .min(10)
    .max(1000)
    .required()
    .messages({
      "string.min": "Message must be at least 10 characters"
    })
}).unknown(false);


export const updateInquiryStatusSchema = Joi.object({
  status: Joi.string()
    .valid("NEW", "CONTACTED", "CLOSED")
    .required()
});
