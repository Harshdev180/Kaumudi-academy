import mongoose from "mongoose"

const contactSchema = mongoose.Schema({
    fullName:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String,
        trim:true,
        lowercase:true
    },
    subject:{
        required:true,
        type:String,
        trim:true
    },
    message:{
        type:String,
        required:true,
        trim:true,
        minlength:10,
        maxlength:100
    }
},
{timestamps:true}
)

export default mongoose.model("Contact",contactSchema)