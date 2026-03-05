// import mongoose from "mongoose";

// const certificateSchema = new mongoose.Schema(
//   {
//     student: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Student",
//       required: true
//     },
//     course: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Course",
//       required: true
//     },
//     certificateId: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true
//     },
//     grade: {
//       type: String,
//       trim: true,
//       default: ""
//     },
//     issuedAt: {
//       type: Date,
//       default: Date.now
//     },
//     type: {
//       type: String,
//       trim: true,
//       default: "Course Completion"
//     }
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Certificate", certificateSchema);
// models/Certificate.model.js
import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  certificateId: {
    type: String,
    unique: true
  },

  issuedAt: {
    type: Date,
    default: Date.now
  }
},
{ timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);