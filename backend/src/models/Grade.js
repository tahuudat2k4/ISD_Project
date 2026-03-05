import mongoose from "mongoose";

const GradeSchema = new mongoose.Schema({
  makhoi: { type: String, required: true, unique: true },
  tenkhoi: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Grade", GradeSchema);
