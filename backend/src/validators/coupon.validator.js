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

  discountType: Joi.string()
    .valid("percentage", "flat")
    .default("percentage")
    .messages({
      "any.only": "Discount type must be percentage or flat"
    }),

  discountValue: Joi.number()
    .integer()
    .min(1)
    .messages({
      "number.base": "Discount must be a number",
      "number.min": "Discount must be at least 1"
    }),

  // Backward compatibility for older clients
  discountPercentage: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .messages({
      "number.base": "Discount must be a number",
      "number.min": "Discount must be at least 1%",
      "number.max": "Discount cannot exceed 100%"
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
})
  .custom((value, helpers) => {
    const type = value.discountType || "percentage";
    const providedValue =
      value.discountValue !== undefined
        ? value.discountValue
        : value.discountPercentage;

    if (providedValue === undefined || providedValue === null) {
      return helpers.message("Discount value is required");
    }

    if (type === "percentage" && providedValue > 100) {
      return helpers.message("Discount cannot exceed 100%");
    }

    return value;
  });
