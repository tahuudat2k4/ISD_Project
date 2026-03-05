import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  masoHS: { type: String, required: true, unique: true },
  hotenHS: { type: String, required: true },
  gioitinh: { type: String },
  ngaysinh: { type: Date },
  ngaynhaphoc: { type: Date },
  diachi: { type: String },
  suckhoe: { type: String },
  sdt: { type: String },
  ghichu: { type: String },
  lopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Student", StudentSchema);
