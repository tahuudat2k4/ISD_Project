import Attendance from '../models/Attendance.js';
import Class from '../models/Class.js';
import Student from '../models/Student.js';

const ATTENDANCE_STATUSES = ['Có mặt', 'Đi muộn', 'Vắng'];
const DATE_QUERY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const parseAttendanceDate = (value) => {
	if (!DATE_QUERY_REGEX.test(String(value || '').trim())) {
		return null;
	}

	const [yearString, monthString, dayString] = String(value).split('-');
	const year = Number(yearString);
	const month = Number(monthString);
	const day = Number(dayString);
	const parsed = new Date(Date.UTC(year, month - 1, day));

	if (
		Number.isNaN(parsed.getTime()) ||
		parsed.getUTCFullYear() !== year ||
		parsed.getUTCMonth() !== month - 1 ||
		parsed.getUTCDate() !== day
	) {
		return null;
	}

	return parsed;
};

const formatDateParam = (value) => value.toISOString().split('T')[0];

const getNextUtcDate = (value) => {
	const nextDate = new Date(value);
	nextDate.setUTCDate(nextDate.getUTCDate() + 1);
	return nextDate;
};

const normalizeAttendanceStatus = (attendance) => {
	if (attendance?.status && ATTENDANCE_STATUSES.includes(attendance.status)) {
		return attendance.status;
	}

	return attendance?.dihoc ? 'Có mặt' : 'Vắng';
};

const buildStats = (records = []) => ({
	total: records.length,
	present: records.filter((record) => record.status === 'Có mặt').length,
	late: records.filter((record) => record.status === 'Đi muộn').length,
	absent: records.filter((record) => record.status === 'Vắng').length,
	unmarked: records.filter((record) => !record.status).length,
});

const getTeacherManageableClassIds = async (teacherId) => {
	if (!teacherId) {
		return [];
	}

	const classes = await Class.find({ giaoVienId: teacherId }).select('_id').lean();
	return classes.map((classItem) => String(classItem._id));
};

const getAttendanceClassesPayload = async (user) => {
	const classes = await Class.find()
		.select('_id malop tenlop giaoVienId')
		.populate('giaoVienId', 'hotenGV masoGV')
		.sort({ tenlop: 1 })
		.lean();

	const manageableClassIds = user?.role === 'TEACHER'
		? new Set(await getTeacherManageableClassIds(user.teacherId))
		: null;

	const data = classes.map((classItem) => ({
		id: classItem._id,
		code: classItem.malop,
		name: classItem.tenlop,
		teacherId: classItem.giaoVienId?._id || classItem.giaoVienId || null,
		teacherName: classItem.giaoVienId?.hotenGV || '',
		canManage: user?.role === 'ADMIN' || manageableClassIds?.has(String(classItem._id)) || false,
	}));

	return {
		data,
		meta: {
			scope: user?.role === 'TEACHER' ? 'teacher' : 'all',
			manageableCount: data.filter((classItem) => classItem.canManage).length,
		},
	};
};

const getManagedClassOrError = async (user, classId) => {
	const classItem = await Class.findById(classId)
		.select('_id malop tenlop giaoVienId')
		.populate('giaoVienId', 'hotenGV masoGV')
		.lean();

	if (!classItem) {
		return {
			ok: false,
			status: 404,
			message: 'Không tìm thấy lớp học',
		};
	}

	if (user?.role === 'ADMIN') {
		return {
			ok: true,
			classItem,
		};
	}

	const isManageable = Boolean(
		user?.teacherId &&
		classItem.giaoVienId &&
		String(classItem.giaoVienId._id || classItem.giaoVienId) === String(user.teacherId)
	);

	if (!isManageable) {
		return {
			ok: false,
			status: 403,
			message: 'Giáo viên chỉ có thể điểm danh lớp mình phụ trách',
		};
	}

	return {
		ok: true,
		classItem,
	};
};

const buildAttendanceResponse = async ({ classItem, attendanceDate }) => {
	const students = await Student.find({ lopId: classItem._id })
		.select('_id masoHS hotenHS')
		.sort({ masoHS: 1, hotenHS: 1 })
		.lean();

	const studentIds = students.map((student) => student._id);
	const nextDate = getNextUtcDate(attendanceDate);
	const attendances = studentIds.length
		? await Attendance.find({
			masoHS: { $in: studentIds },
			ngayDD: {
				$gte: attendanceDate,
				$lt: nextDate,
			},
		})
			.select('_id masoHS status dihoc ghichuDD updatedAt')
			.lean()
		: [];

	const attendanceMap = new Map(
		attendances.map((attendance) => [String(attendance.masoHS), attendance])
	);

	const records = students.map((student) => {
		const attendance = attendanceMap.get(String(student._id));

		return {
			id: String(student._id),
			studentId: String(student._id),
			studentCode: student.masoHS,
			studentName: student.hotenHS,
			status: attendance ? normalizeAttendanceStatus(attendance) : '',
			note: attendance?.ghichuDD || '',
			attendanceId: attendance?._id ? String(attendance._id) : null,
			updatedAt: attendance?.updatedAt || null,
		};
	});

	return {
		class: {
			id: String(classItem._id),
			code: classItem.malop,
			name: classItem.tenlop,
			teacherId: classItem.giaoVienId?._id ? String(classItem.giaoVienId._id) : String(classItem.giaoVienId || ''),
			teacherName: classItem.giaoVienId?.hotenGV || '',
		},
		date: formatDateParam(attendanceDate),
		records,
		stats: buildStats(records),
	};
};

export const getAttendanceClasses = async (req, res) => {
	try {
		const payload = await getAttendanceClassesPayload(req.user);
		return res.status(200).json({ success: true, ...payload });
	} catch (error) {
		console.log('Error fetching attendance classes:', error);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

export const getAttendanceRecords = async (req, res) => {
	try {
		const classId = String(req.query.classId || '').trim();
		const attendanceDate = parseAttendanceDate(req.query.date);

		if (!classId) {
			return res.status(400).json({ success: false, message: 'classId là bắt buộc' });
		}

		if (!attendanceDate) {
			return res.status(400).json({ success: false, message: 'Ngày điểm danh không hợp lệ, cần đúng định dạng yyyy-mm-dd' });
		}

		const classValidation = await getManagedClassOrError(req.user, classId);
		if (!classValidation.ok) {
			return res.status(classValidation.status).json({ success: false, message: classValidation.message });
		}

		const data = await buildAttendanceResponse({
			classItem: classValidation.classItem,
			attendanceDate,
		});

		return res.status(200).json({ success: true, data });
	} catch (error) {
		console.log('Error fetching attendance records:', error);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

export const saveAttendanceRecords = async (req, res) => {
	try {
		const classId = String(req.body?.classId || '').trim();
		const attendanceDate = parseAttendanceDate(req.body?.date);
		const rawRecords = Array.isArray(req.body?.records) ? req.body.records : [];

		if (!classId) {
			return res.status(400).json({ success: false, message: 'classId là bắt buộc' });
		}

		if (!attendanceDate) {
			return res.status(400).json({ success: false, message: 'Ngày điểm danh không hợp lệ, cần đúng định dạng yyyy-mm-dd' });
		}

		if (!rawRecords.length) {
			return res.status(400).json({ success: false, message: 'Danh sách điểm danh không được để trống' });
		}

		const classValidation = await getManagedClassOrError(req.user, classId);
		if (!classValidation.ok) {
			return res.status(classValidation.status).json({ success: false, message: classValidation.message });
		}

		const records = rawRecords.map((record) => ({
			studentId: String(record?.studentId || '').trim(),
			status: String(record?.status || '').trim(),
			note: String(record?.note || '').trim(),
		}));

		const hasInvalidRecord = records.some((record) => !record.studentId || !ATTENDANCE_STATUSES.includes(record.status));
		if (hasInvalidRecord) {
			return res.status(400).json({
				success: false,
				message: 'Mỗi học sinh phải có trạng thái điểm danh hợp lệ',
			});
		}

		if (records.some((record) => record.note.length > 255)) {
			return res.status(400).json({
				success: false,
				message: 'Ghi chú điểm danh không được vượt quá 255 ký tự',
			});
		}

		const uniqueStudentIds = [...new Set(records.map((record) => record.studentId))];
		if (uniqueStudentIds.length !== records.length) {
			return res.status(400).json({ success: false, message: 'Danh sách điểm danh có học sinh bị lặp' });
		}

		const validStudents = await Student.find({
			_id: { $in: uniqueStudentIds },
			lopId: classId,
		})
			.select('_id')
			.lean();

		if (validStudents.length !== uniqueStudentIds.length) {
			return res.status(400).json({
				success: false,
				message: 'Danh sách học sinh điểm danh không hợp lệ với lớp đã chọn',
			});
		}

		const teacherId = req.user?.role === 'TEACHER'
			? req.user.teacherId
			: classValidation.classItem.giaoVienId?._id || classValidation.classItem.giaoVienId;

		await Attendance.bulkWrite(
			records.map((record) => ({
				updateOne: {
					filter: {
						masoHS: record.studentId,
						ngayDD: attendanceDate,
					},
					update: {
						$set: {
							ngayDD: attendanceDate,
							status: record.status,
							dihoc: record.status !== 'Vắng',
							masoHS: record.studentId,
							masoGV: teacherId,
							ghichuDD: record.note,
						},
					},
					upsert: true,
				},
			}))
		);

		const data = await buildAttendanceResponse({
			classItem: classValidation.classItem,
			attendanceDate,
		});

		return res.status(200).json({
			success: true,
			message: `Đã lưu điểm danh cho lớp ${classValidation.classItem.tenlop} ngày ${formatDateParam(attendanceDate)}`,
			data,
		});
	} catch (error) {
		console.log('Error saving attendance records:', error);
		return res.status(400).json({ success: false, message: error.message || 'Không thể lưu điểm danh' });
	}
};