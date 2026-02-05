import Joi from "joi";

export const createCouponSchema = Joi.object({
  code: Joi.string()
    .trim()
    .uppercase()
    .min(3)
    .max(20)
    .required()
    .messages({
      "string.base": "Coupon code must be a string",
      "string.empty": "Coupon code is required",
      "string.min": "Coupon code must be at least 3 characters",
      "string.max": "Coupon code must not exceed 20 characters",
      "any.required": "Coupon code is required"
    }),

  discountPercentage: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .required()
    .messages({
      "number.base": "Discount must be a number",
      "number.min": "Discount must be at least 1%",
      "number.max": "Discount cannot exceed 100%",
      "any.required": "Discount percentage is required"
    }),

  startTime: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "Start time must be a valid date",
      "any.required": "Start time is required"
    }),

  endTime: Joi.date()
    .greater(Joi.ref("startTime"))
    .required()
    .messages({
      "date.greater": "End time must be after start time",
      "any.required": "End time is required"
    })
});
