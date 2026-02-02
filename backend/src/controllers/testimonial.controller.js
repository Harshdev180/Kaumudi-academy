import express from "express"
import Student from "../models/Student.model.js"
import Testimonial from "../models/Testimonial.model.js"
export const addTestimonial=async (req,res) =>{
  try{
    const studentId = req.user._id
    const {star,message}  = req.body
    
    const student =await Student.findById(studentId).populate("firstName lastName email")
    if(!student){
      return res.status(401).json({
        success:false,
        message:"Please sign up"
      })
    }
   const testimonial = await Testimonial.create({
      message,
      star,
      user:studentId
    })
    
    res.status(201).json({
      success:true,
      message:"Review submitted successfully"
      ,
      data:testimonial
    })
  }catch(error){
    console.log("ADD TESTIMONIAL ERROR : ",error)
    res.status(500).json({
      success:false,
      message:"Failed to submit review"
    })
  }
}


export const getAllTestimonials =async (req,res) =>{
  try{
    const testimonial = await Testimonial.find().populate("user", "firstName lastName email")
    
    if(!testimonial){
      return res.status(404).json({
        success:false,
        message:"Testimonial not found"
      })
    }
    
    res.json({
      success:true,
      count:testimonial.length,
      data:testimonial
    })
    
  }catch(error){
    console.log("GET ALL TESTIMONIALS ERROR : ",error)
    res.status(500).json({
      success:false,
      message:"Failed to get all testimonials"
    })
  }
}


export const updateTestimonial =async (req,res) =>{
  try{
    const studentId = req.user._id
    const testimonialId= req.params.testimonialId
    const {updatedStar,updatedMessage} = req.body
    
    const testimonial =await Testimonial.findById(testimonialId)
    if(!testimonial){
      return res.status(404).json({
        success:false,
        message:"Testimonial not found"
      })
    }
    if (studentId.toString() === testimonial.user.toString()){
      return res.status(401).json({
        success:false,
        message:"You can not update other studnet review"
      })
    }
    
    const updatedReview =await Testimonial.findByIdAndUpdate(testimonialId,{
      star:updatedStar,
      message:updatedMessage
    },{new:true})
    
    res.status(201).json({
      success:true,
      message:"Review updated successfully",
      data:updatedReview
    })
  }catch(error){
    console.log("UPDATE TESTIMONIALS ERROR : ",error)
    res.status(500).json({
      success:false,
      message:"Failed to update testimonial"
    })
  }
}


export const deleteTestimonial =async (req,res) =>{
  try{
    const testimonialId = req.params.testimonialId
    const studentId = req.user._id
    const testimonial =await Testimonial.findById(testimonialId)
    
    if(!testimonial){
      return res.status(401).json({
        success:false,
        message:"Testimonial not found"
      })
    }
    
    if(studentId.toString() !== testimonial.user.toString()){
      return res.status(401).json({
        success:false,
        message:"You can not delete other student testimonial"
      })
    }
    
    await Testimonial.findByIdAndDelete(testimonialId)
    
    res.status(200).json({
      success:true,
      message:"testimonial deleted successfully"
    })
  }catch(error){
    console.log("DELETE TESTIMONIALS ERROR : ",error)
    res.status(500).json({
      success:false,
      message:"Failed to delete testimonial"
    })
  }
}