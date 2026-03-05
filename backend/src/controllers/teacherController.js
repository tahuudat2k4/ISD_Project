import Teacher from '../models/Teacher.js';

export const getTeachers = async (req, res) => {
	try {
		const items = await Teacher.find();
		return res.status(200).json({ success: true, data: items });
	} catch (error) {
		console.log('Error fetching teachers:', error);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

export const getTeacherById = async (req, res) => {
	try {
		const item = await Teacher.findById(req.params.id);
		if (!item) return res.status(404).json({ success: false, message: 'Teacher not found' });
		return res.status(200).json({ success: true, data: item });
	} catch (error) {
		console.log('Error fetching teacher:', error);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

export const createTeacher = async (req, res) => {
	try {
		const { masoGV, hotenGV, gioitinh, ngaysinh, diachi, email, sdt, ngayvaolam, trinhdohocvan, kinhnghiem, subject, class: className } = req.body || {};

		if (!masoGV || !hotenGV) {
			return res.status(400).json({ success: false, message: 'Mã số giáo viên và Họ tên là bắt buộc' });
		}

		const existing = await Teacher.findOne({ masoGV });
		if (existing) {
			return res.status(400).json({ success: false, message: 'Mã số giáo viên đã tồn tại' });
		}

		const payload = {
			masoGV,
			hotenGV,
			gioitinh,
			ngaysinh: ngaysinh ? new Date(ngaysinh) : undefined,
			diachi,
			email,
			sdt,
			ngayvaolam: ngayvaolam ? new Date(ngayvaolam) : undefined,
			trinhdohocvan,
			kinhnghiem,
			subject,
			class: className,
		};

		const created = await Teacher.create(payload);
		return res.status(201).json({ success: true, data: created });
	} catch (error) {
		console.log('Error creating teacher:', error);
		if (error?.code === 11000) {
			return res.status(400).json({ success: false, message: 'Giáo viên đã tồn tại (trùng khóa duy nhất)' });
		}
		return res.status(400).json({ success: false, message: error.message || 'Yêu cầu không hợp lệ' });
	}
};

export const updateTeacher = async (req, res) => {
	try {
		const { ngaysinh, ngayvaolam, class: className, ...rest } = req.body || {};
		const update = {
			...rest,
			...(ngaysinh ? { ngaysinh: new Date(ngaysinh) } : {}),
			...(ngayvaolam ? { ngayvaolam: new Date(ngayvaolam) } : {}),
			...(className !== undefined ? { class: className } : {}),
		};
		const updated = await Teacher.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
		if (!updated) return res.status(404).json({ success: false, message: 'Teacher not found' });
		return res.status(200).json({ success: true, data: updated });
	} catch (error) {
		console.log('Error updating teacher:', error);
		return res.status(400).json({ success: false, message: error.message || 'Yêu cầu không hợp lệ' });
	}
};

export const deleteTeacher = async (req, res) => {
	try {
		const deleted = await Teacher.findByIdAndDelete(req.params.id);
		if (!deleted) return res.status(404).json({ success: false, message: 'Teacher not found' });
		return res.status(200).json({ success: true, message: 'Deleted successfully' });
	} catch (error) {
		console.log('Error deleting teacher:', error);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};
