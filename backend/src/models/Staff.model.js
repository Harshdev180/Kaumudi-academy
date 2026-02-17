import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    role: {
      type: String,
      required: true,
      trim: true
    },

    salary: {
      type: Number,
      required: true,
      min: 0
    },

    bonus: {
      type: Number,
      default: 0,
      min: 0
    },

    deduction: {
      type: Number,
      default: 0,
      min: 0
    },

    // Calculated salary after bonus & deduction
    netSalary: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE"
    },

    paid: {
      type: Boolean,
      default: false // false = Pending, true = Paid
    }
  },
  {
    timestamps: true
  }
);

// Auto-calculate net salary before save
staffSchema.pre("save", function (next) {
  this.netSalary = this.salary + this.bonus - this.deduction;
  next();
});

export default mongoose.model("Staff", staffSchema);
