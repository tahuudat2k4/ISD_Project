import bcrypt from 'bcrypt';
import Teacher from '../models/Teacher.js';
import User from '../models/User.js';

const validatePassword = (password) => {
	if (!password) {
		return 'Mật khẩu là bắt buộc';
	}

	if (password.length < 6) {
		return 'Mật khẩu phải có ít nhất 6 ký tự';
	}

	if (password.length > 50) {
		return 'Mật khẩu không được vượt quá 50 ký tự';
	}

	return null;
};

const canDeleteTeacherAccount = (status) => {
	return status === 'inactive' || status === 'Không hoạt động';
};

export const getTeachers = async (req, res) => {
	try {
		const currentTeacherId = req.user?.teacherId ? String(req.user.teacherId) : null;
		const items = await Teacher.find().lean();
		const data = items.map((teacher) => ({
			...teacher,
			isCurrentUser: currentTeacherId === String(teacher._id),
		}));
		return res.status(200).json({ success: true, data });
	} catch (error) {
		console.log('Error fetching teachers:', error);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

export const getTeacherAccountManagement = async (req, res) => {
	try {
		   // Lấy page và limit từ query, mặc định page=1, limit=10
		   const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
		   const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
		   const skip = (page - 1) * limit;

		   // Đếm tổng số giáo viên
		   const total = await Teacher.countDocuments();

		   // Lấy danh sách giáo viên, sắp xếp tăng dần theo mã giáo viên
		   const teachers = await Teacher.find()
			   .sort({ masoGV: 1 })
			   .skip(skip)
			   .limit(limit)
			   .lean();

		   const teacherIds = teachers.map((teacher) => teacher._id);
		   const accounts = await User.find({ teacherId: { $in: teacherIds } })
			   .select('teacherId username isActive createdAt')
			   .lean();

		   const accountMap = new Map(accounts.map((account) => [String(account.teacherId), account]));
		   const data = teachers.map((teacher) => {
			   const account = accountMap.get(String(teacher._id));
			   return {
				   teacherId: teacher._id,
				   masoGV: teacher.masoGV,
				   hotenGV: teacher.hotenGV,
				   email: teacher.email || '',
				   sdt: teacher.sdt || '',
				   subject: teacher.subject || '',
				   class: teacher.class || '',
				   status: teacher.status || '',
				   hasAccount: Boolean(account),
				   account: account
					   ? {
						   id: account._id,
						   username: account.username,
						   isActive: account.isActive,
						   createdAt: account.createdAt,
					   }
					   : null,
			   };
		   });

		   return res.status(200).json({
			   success: true,
			   data,
			   pagination: {
				   total,
				   page,
				   limit,
				   totalPages: Math.ceil(total / limit)
			   }
		   });
	} catch (error) {
		console.log('Error fetching teacher account management data:', error);
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
		const { masoGV, hotenGV, gioitinh, ngaysinh, diachi, email, sdt, ngayvaolam, trinhdohocvan, kinhnghiem, subject, class: className, status } = req.body || {};

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
			status,
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

export const createTeacherAccount = async (req, res) => {
	try {
		const { username, password } = req.body || {};
		const normalizedUsername = username?.trim();
		const normalizedPassword = password?.trim();

		if (!normalizedUsername || !normalizedPassword) {
			return res.status(400).json({
				success: false,
				message: 'Tên đăng nhập và mật khẩu là bắt buộc',
			});
		}

		const passwordError = validatePassword(normalizedPassword);
		if (passwordError) {
			return res.status(400).json({
				success: false,
				message: passwordError,
			});
		}

		const teacher = await Teacher.findById(req.params.id);
		if (!teacher) {
			return res.status(404).json({ success: false, message: 'Teacher not found' });
		}

		const [existingTeacherAccount, existingUsername] = await Promise.all([
			User.findOne({ teacherId: teacher._id }),
			User.findOne({ username: normalizedUsername }),
		]);

		if (existingTeacherAccount) {
			return res.status(400).json({
				success: false,
				message: 'Giáo viên này đã có tài khoản',
			});
		}

		if (existingUsername) {
			return res.status(400).json({
				success: false,
				message: 'Tên đăng nhập đã tồn tại',
			});
		}

		const hashedPassword = await bcrypt.hash(normalizedPassword, 10);
		const created = await User.create({
			username: normalizedUsername,
			password: hashedPassword,
			role: 'TEACHER',
			teacherId: teacher._id,
		});

		return res.status(201).json({
			success: true,
			message: 'Tạo tài khoản giáo viên thành công',
			data: {
				id: created._id,
				username: created.username,
				role: created.role,
				teacherId: created.teacherId,
				isActive: created.isActive,
			},
		});
	} catch (error) {
		console.log('Error creating teacher account:', error);
		return res.status(400).json({ success: false, message: error.message || 'Yêu cầu không hợp lệ' });
	}
};

export const resetTeacherAccountPassword = async (req, res) => {
	try {
		const normalizedPassword = req.body?.password?.trim();
		const passwordError = validatePassword(normalizedPassword);

		if (passwordError) {
			return res.status(400).json({
				success: false,
				message: passwordError,
			});
		}

		const teacher = await Teacher.findById(req.params.id).select('_id hotenGV masoGV').lean();
		if (!teacher) {
			return res.status(404).json({ success: false, message: 'Teacher not found' });
		}

		const account = await User.findOne({ teacherId: teacher._id });
		if (!account) {
			return res.status(404).json({ success: false, message: 'Giáo viên này chưa có tài khoản' });
		}

		account.password = await bcrypt.hash(normalizedPassword, 10);
		await account.save();

		return res.status(200).json({
			success: true,
			message: `Đã đặt lại mật khẩu cho ${teacher.hotenGV} (${teacher.masoGV})`,
		});
	} catch (error) {
		console.log('Error resetting teacher account password:', error);
		return res.status(400).json({ success: false, message: error.message || 'Yêu cầu không hợp lệ' });
	}
};

export const deleteTeacherAccount = async (req, res) => {
	try {
		const teacher = await Teacher.findById(req.params.id).select('_id hotenGV masoGV status').lean();
		if (!teacher) {
			return res.status(404).json({ success: false, message: 'Teacher not found' });
		}

		if (!canDeleteTeacherAccount(teacher.status)) {
			return res.status(400).json({
				success: false,
				message: 'Vui lòng chuyển trạng thái giáo viên sang Không hoạt động trước khi xóa tài khoản',
			});
		}

		const deletedAccount = await User.findOneAndDelete({ teacherId: teacher._id });
		if (!deletedAccount) {
			return res.status(404).json({ success: false, message: 'Giáo viên này chưa có tài khoản để xóa' });
		}

		return res.status(200).json({
			success: true,
			message: `Đã xóa tài khoản của ${teacher.hotenGV} (${teacher.masoGV})`,
		});
	} catch (error) {
		console.log('Error deleting teacher account:', error);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
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

export const updateMyTeacherProfile = async (req, res) => {
	try {
		if (!req.user?.teacherId) {
			return res.status(403).json({ success: false, message: 'Tài khoản này không liên kết với hồ sơ giáo viên' });
		}

		const {
			hotenGV,
			gioitinh,
			ngaysinh,
			diachi,
			email,
			sdt,
			ngayvaolam,
			trinhdohocvan,
			kinhnghiem,
			status,
		} = req.body || {};

		const update = {
			...(hotenGV !== undefined ? { hotenGV } : {}),
			...(gioitinh !== undefined ? { gioitinh } : {}),
			...(ngaysinh ? { ngaysinh: new Date(ngaysinh) } : {}),
			...(diachi !== undefined ? { diachi } : {}),
			...(email !== undefined ? { email } : {}),
			...(sdt !== undefined ? { sdt } : {}),
			...(ngayvaolam ? { ngayvaolam: new Date(ngayvaolam) } : {}),
			...(trinhdohocvan !== undefined ? { trinhdohocvan } : {}),
			...(kinhnghiem !== undefined ? { kinhnghiem } : {}),
			...(status !== undefined ? { status } : {}),
		};

		const updated = await Teacher.findByIdAndUpdate(req.user.teacherId, update, {
			new: true,
			runValidators: true,
		});

		if (!updated) {
			return res.status(404).json({ success: false, message: 'Teacher not found' });
		}

		return res.status(200).json({ success: true, data: updated });
	} catch (error) {
		console.log('Error updating own teacher profile:', error);
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
