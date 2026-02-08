import Joi from "joi";

export const createContactValidator = Joi.object({
  fullName: Joi.string()
    .min(3)
    .max(50)
    .required(),

  email: Joi.string()
    .email()
    .required(),

  subject: Joi.string()
    .min(3)
    .max(100)
    .required(),

  message: Joi.string()
    .min(10)
    .max(100)
    .required()
});
