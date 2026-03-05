import mongoose from "mongoose";

const EvaluationSchema = new mongoose.Schema({
  ngayNX: { type: Date, required: true },
  xeploai: { type: String },
  masoHS: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  masoGV: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Evaluation", EvaluationSchema);
