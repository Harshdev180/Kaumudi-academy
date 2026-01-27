import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    syllabus: {
      type: String,
    },

    duration: {
      type: String,
      required: true,
    },

    mode: {
      type: String,
      enum: ["ONLINE", "OFFLINE"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      public_id: String,
      url: String,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
language: {
  type: [String],
  required: true,
  trim: true
},

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Course", courseSchema);
