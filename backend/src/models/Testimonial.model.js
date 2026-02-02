import mongoose from "mongoose"

export const testimonialSchema = mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"Student"
  },
  message:{
    type:String,
    required:true,
    minlength:10,
    maxlength:100,
    trim:true
  },
  star:{
    type:Number,
    required:true,
    min:0,
    max:5
  }
})

export default mongoose.model("Testimonial",testimonialSchema)