import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  ngayDD: { type: Date, required: true },
  dihoc: { type: Boolean, required: true }, // 1/0 -> true/false
  masoHS: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  masoGV: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  ghichuDD: { type: String }
}, { timestamps: true });

export default mongoose.model("Attendance", AttendanceSchema);
