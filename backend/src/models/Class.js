import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema({
  malop: { type: String, required: true, unique: true },
  tenlop: { type: String, required: true },
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
