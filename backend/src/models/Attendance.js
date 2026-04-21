import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  ngayDD: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Có mặt", "Đi muộn", "Vắng"],
    required: true
  },
  dihoc: { type: Boolean, required: true },
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
  ghichuDD: { type: String, default: "" }
}, { timestamps: true });

AttendanceSchema.index({ ngayDD: 1, masoHS: 1 }, { unique: true });

export default mongoose.model("Attendance", AttendanceSchema);
