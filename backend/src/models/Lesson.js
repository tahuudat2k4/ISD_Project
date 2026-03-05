import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
  ngayhoc: { type: Date, required: true },
  tenbaihoc: { type: String, required: true },
  noidungbaihoc: { type: String },
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

export default mongoose.model("Lesson", LessonSchema);
