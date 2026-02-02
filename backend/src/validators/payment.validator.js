import Joi from "joi";
import mongoose from "mongoose";

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

export const createPaymentOrderSchema = Joi.object({
  courseId: objectId.required(),

  couponCode: Joi.string()
    .trim()
    .uppercase()
    .min(3)
    .max(20)
    .optional()
}).unknown(false);


export const verifyPaymentSchema = Joi.object({
  razorpayOrderId: Joi.string().required(),
  razorpayPaymentId: Joi.string().required(),
  razorpaySignature: Joi.string().required()
}).unknown(false);

export const fakeVerifyPaymentSchema = Joi.object({
  razorpayOrderId: Joi.string().required()
}).unknown(false);
