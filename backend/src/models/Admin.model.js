import mongoose from "mongoose"
const adminSchema = mongoose.Schema({
  name:{
    required:true,
    type:String
  },
  email:{
    required:true,
    lowercase:true,
    unique:true,
    trim:true,
    type:String
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
  resetPasswordToken:{
    type:String
  },
  resetPasswordExpire:{
    type:Date
  }
},
{timestamps:true}
)

export default mongoose.model("Admin",adminSchema)