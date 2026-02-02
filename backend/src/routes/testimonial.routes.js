import {addTestimonial,getAllTestimonials,updateTestimonial,deleteTestimonial} from "../controllers/testimonial.controller.js"
import {authMiddleware} from "../middlewares/auth.middleware.js"
import {roleMiddleware} from "../middlewares/role.middleware.js"
import {validateBody} from "../middlewares/validate.middleware.js"
import express from "express"
import {addTestimonialSchema,updateTestimonialSchema} from "../validators/testimonial.validator.js"
const router = express.Router()

router.post("/testimonial",authMiddleware,roleMiddleware("STUDENT"),validateBody(addTestimonialSchema),addTestimonial)

router.get("/testimonial",getAllTestimonials)
router.put("/testimonial/:testimonialId",authMiddleware,validateBody(updateTestimonialSchema),roleMiddleware("STUDENT"),updateTestimonial)

router.delete("/testimonial/:testimonialId",authMiddleware,roleMiddleware("STUDENT"),deleteTestimonial)
export default router