import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["ADMIN", "TEACHER"], required: true },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher"
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
