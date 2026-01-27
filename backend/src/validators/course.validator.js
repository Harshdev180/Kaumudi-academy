import Joi from "joi";

export const createCourseSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().required(),
  syllabus: Joi.string().optional(),
  duration: Joi.string().required(),

  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required(),

  mode: Joi.string().valid("ONLINE", "OFFLINE").required(),
  price: Joi.number().positive().required(),

  language: Joi.array()
    .items(Joi.string().trim().min(2))
    .min(1)
    .required()
});


export const updateCourseSchema = Joi.object({
  title: Joi.string().min(3).optional(),
  description: Joi.string().optional(),
  syllabus: Joi.string().optional(),
  duration: Joi.string().optional(),
  mode: Joi.string().valid("ONLINE", "OFFLINE").optional(),
  price: Joi.number().positive().optional(),
  language: Joi.array()
  .items(Joi.string().trim().min(2))
  .optional(),

  status: Joi.string().valid("ACTIVE", "INACTIVE").optional(),
  startDate: Joi.date().required(),
endDate: Joi.date().greater(Joi.ref("startDate")).required(),

});
