import Joi from "joi";


const languageSchema = Joi.alternatives().try(
  Joi.array().items(Joi.string().trim().min(2)),
  Joi.string()
).custom((value, helpers) => {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return helpers.error("any.invalid");
      }
      return parsed;
    } catch {
      return helpers.error("any.invalid");
    }
  }
  return value;
}, "Language parser");

const dateRange = {
  startDate: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "Start date must be a valid date"
    }),

  endDate: Joi.date()
    .greater(Joi.ref("startDate"))
    .required()
    .messages({
      "date.greater": "End date must be after start date"
    })
};


export const createCourseSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).required(),
  description: Joi.string().trim().min(10).required(),
  syllabus: Joi.string().trim().allow("", null).optional(),
  curriculum: Joi.array().optional(),
  batchSchedule: Joi.array().optional(),
  duration: Joi.string().trim().required(),
  mode: Joi.string().valid("ONLINE", "OFFLINE", "HYBRID").required(), // ← added HYBRID
  price: Joi.number().min(0).required(),
  language: languageSchema.required(),
  instructor: Joi.string().trim().optional().allow("", null), // ← ADD THIS
  level: Joi.string().trim().optional(),                      // ← ADD THIS
  ...dateRange
}).unknown(false);

export const updateCourseSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150),
  description: Joi.string().trim().min(10),
  syllabus: Joi.string().trim().allow("", null),
  curriculum: Joi.array().optional(),
  batchSchedule: Joi.array().optional(),
  duration: Joi.string().trim(),
  mode: Joi.string().valid("ONLINE", "OFFLINE", "HYBRID"),   // ← added HYBRID
  price: Joi.number().min(0),
  language: languageSchema,
  instructor: Joi.string().trim().optional().allow("", null), // ← ADD THIS
  level: Joi.string().trim().optional(),                      // ← ADD THIS
  startDate: Joi.date().iso(),
  endDate: Joi.date().when("startDate", {
    is: Joi.exist(),
    then: Joi.date().greater(Joi.ref("startDate")),
    otherwise: Joi.date()
  })
}).min(1).unknown(false);
