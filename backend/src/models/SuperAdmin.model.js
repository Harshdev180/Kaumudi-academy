import mongoose from "mongoose"

const superAdminSchema = mongoose.Schema({
  name:{
    required:true,
    type:String
  },
  email:{
    type:String,
    required:true,
    lowercase:true,
    unique:true,
    trim:true
  },
  password:{
    type:String,
    required:true,
    trim:true,
    select:false
  },
  phoneNumber:{
    type:String,
    required:true,
    trim:true,
    maxlength:15,
    minlength:10
  },
  secretKey:{
    type:String,
    required:true
  },
  resetPasswordToken:{
    type:String
  },
  resetPasswordExpire:{
    type:Date
  }
},
{timestamps:true}
)

export default mongoose.model("SuperAdmin", superAdminSchema)
