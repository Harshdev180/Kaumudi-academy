import joi from "joi"

export const addTestimonialSchema = joi.object({
  message:joi.string().min(10).max(100).required(),
  star:joi.number().min(0).max(5).required()
})

export const updateTestimonialSchema = joi.object({
  updatedMessage:joi.string().min(10).max(100).required(),
  updatedStar:joi.number().min(0).max(5).required()
})