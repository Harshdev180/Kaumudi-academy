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

    curriculum: {
      type: Array,
      default: []
    },

    duration: {
      type: String,
      required: true,
    },

    mode: {
      type: String,
      enum: ["ONLINE", "OFFLINE", "HYBRID"],
      required: true,
    },

    level: {
      type: String,
      enum: ["Prathama (Beginner)", "Madhyama (Intermediate)", "Kovida (Advanced)"],
      default: "Prathama (Beginner)"
    },

    category: {
      type: String,
      default: "General"
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
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
      default: "INACTIVE",
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
      required: true
    },

    batchSchedule: {
      type: [{
        batchType: { type: String, default: "" },
        days: { type: String, default: "" },
        startTime: { type: String, default: "" },
        endTime: { type: String, default: "" }
      }],
      default: []
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
