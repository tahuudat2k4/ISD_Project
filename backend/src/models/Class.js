import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema({
  malop: { type: String, required: true, unique: true },
  tenlop: { type: String, required: true },
  status: {
    type: String,
    enum: ["Hoạt động", "Tạm dừng", "Kế hoạch"],
    default: "Hoạt động",
  },
  succhua: { type: Number, default: 30 },
  giaovienphutro: { type: String, default: "" },
  phonghoc: { type: String, default: "" },
  giohoc: { type: String, default: "" },
  ngaythanhlap: { type: Date },
  cosovatchat: [{ type: String }],
  ghichu: { type: String, default: "" },
  khoiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Grade",
    required: true
  },
  giaoVienId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Class", ClassSchema);
