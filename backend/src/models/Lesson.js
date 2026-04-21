import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
  maBaiGiang: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  ngayhoc: { type: Date, required: true },
  tenbaihoc: { type: String, required: true },
  chude: {
    type: String,
    required: true,
    trim: true,
  },
  thoiluong: {
    type: String,
    default: "",
    trim: true,
  },
  phonghoc: {
    type: String,
    default: "",
    trim: true,
  },
  taiLieuDinhKem: {
    fileName: { type: String, default: "", trim: true },
    mimeType: { type: String, default: "", trim: true },
    size: { type: Number, default: 0 },
    dataUrl: { type: String, default: "" },
  },
  ghichu: {
    type: String,
    default: "",
    trim: true,
  },
  lopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },
  masoGV: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  noidungbaihoc: { type: String, default: "", trim: true }
}, { timestamps: true });

export default mongoose.model("Lesson", LessonSchema);
