import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
    masoGV: { type: String, required: true, unique: true },
    hotenGV: { type: String, required: true },
    gioitinh: { type: String },
    ngaysinh: { type: Date },
    diachi: { type: String },
    email: { type: String },
    sdt: { type: String },
    ngayvaolam: { type: Date },
    trinhdohocvan: { type: String },
    kinhnghiem: { type: String },
    subject: { type: String },
    class: { type: String },
    status: { type: String, default: "Đang làm việc" } // Trạng thái làm việc
}, { timestamps: true });

export default mongoose.model("Teacher", TeacherSchema);
