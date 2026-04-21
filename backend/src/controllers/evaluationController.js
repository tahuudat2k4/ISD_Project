import Class from '../models/Class.js';
import Evaluation from '../models/Evaluation.js';
import Student from '../models/Student.js';

const RATING_VALUES = {
	NOT_MET: 'CHUA_DAT',
	DEVELOPING: 'DANG_PHAT_TRIEN',
	MEETS: 'DAT_YEU_CAU',
	EXCEEDS: 'VUOT_TROI',
};
const SEMESTER_VALUES = {
	SEMESTER_1: 'HOC_KY_1',
	SEMESTER_2: 'HOC_KY_2',
};
const RATING_OPTIONS = Object.values(RATING_VALUES);
const LEGACY_RATING_MAP = {
	A: RATING_VALUES.EXCEEDS,
	B: RATING_VALUES.MEETS,
	C: RATING_VALUES.DEVELOPING,
	D: RATING_VALUES.NOT_MET,
};
const DATE_QUERY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const ACTIVE_STUDENT_STATUSES = ['Đang học', 'Nghỉ phép'];

const normalizeText = (value) => String(value || '').trim();

const normalizeRatingValue = (value) => {
	const normalizedValue = normalizeText(value).toUpperCase();
	if (!normalizedValue) {
		return '';
	}

	return LEGACY_RATING_MAP[normalizedValue] || normalizedValue;
};

const parseEvaluationDate = (value) => {
	if (!DATE_QUERY_REGEX.test(String(value || '').trim())) {
		return null;
	}

	const [yearString, monthString, dayString] = String(value).split('-');
	const year = Number(yearString);
	const month = Number(monthString);
	const day = Number(dayString);
	const parsed = new Date(Date.UTC(year, month - 1, day));

	if (
		Number.isNaN(parsed.getTime())
		|| parsed.getUTCFullYear() !== year
		|| parsed.getUTCMonth() !== month - 1
		|| parsed.getUTCDate() !== day
	) {
		return null;
	}

	return parsed;
};

const buildDateRange = (dateValue) => {
	const start = parseEvaluationDate(dateValue);
	if (!start) {
		return null;
	}

	const end = new Date(start);
	end.setUTCDate(end.getUTCDate() + 1);

	return { start, end };
};

const formatDateParam = (value) => value.toISOString().split('T')[0];

const getClassAccess = async (user, classId) => {
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
		return { ok: true, classItem, canManage: true };
	}

	const classTeacherId = classItem.giaoVienId?._id || classItem.giaoVienId;
	const canManage = Boolean(user?.teacherId && String(classTeacherId) === String(user.teacherId));

	return { ok: true, classItem, canManage };
};

const buildRecordPayload = ({ student, evaluation, classItem }) => ({
	id: String(student._id),
	studentId: String(student._id),
	studentCode: student.masoHS,
	studentName: student.hotenHS,
	classId: String(classItem._id),
	className: classItem.tenlop,
	rating: normalizeRatingValue(evaluation?.xeploai),
	evaluationId: evaluation ? String(evaluation._id) : '',
});

export const getEvaluationRecords = async (req, res) => {
	try {
		const classId = normalizeText(req.query.classId);
		const dateValue = normalizeText(req.query.date);
		const dateRange = buildDateRange(dateValue);

		if (!classId || !dateRange) {
			return res.status(400).json({
				success: false,
				message: 'Lớp học và ngày đánh giá là bắt buộc',
			});
		}

		const classValidation = await getClassAccess(req.user, classId);
		if (!classValidation.ok) {
			return res.status(classValidation.status).json({ success: false, message: classValidation.message });
		}

		const students = await Student.find({
			lopId: classValidation.classItem._id,
			status: { $in: ACTIVE_STUDENT_STATUSES },
		})
			.select('_id masoHS hotenHS status lopId')
			.sort({ hotenHS: 1, masoHS: 1 })
			.lean();

		const evaluations = students.length
			? await Evaluation.find({
				masoHS: { $in: students.map((student) => student._id) },
				ngayNX: { $gte: dateRange.start, $lt: dateRange.end },
			})
				.select('_id ngayNX hocKy xeploai masoHS masoGV updatedAt')
				.sort({ updatedAt: -1, createdAt: -1 })
				.lean()
			: [];

		const evaluationsByStudentId = new Map(
			evaluations.map((evaluation) => [String(evaluation.masoHS), evaluation])
		);

		const records = students.map((student) => buildRecordPayload({
			student,
			evaluation: evaluationsByStudentId.get(String(student._id)),
			classItem: classValidation.classItem,
		}));

		return res.status(200).json({
			success: true,
			data: records,
			meta: {
				class: {
					id: String(classValidation.classItem._id),
					code: classValidation.classItem.malop,
					name: classValidation.classItem.tenlop,
					canManage: classValidation.canManage,
				},
				date: formatDateParam(dateRange.start),
				total: records.length,
			},
		});
	} catch (error) {
		console.log('Error fetching evaluation records:', error);
		return res.status(500).json({ success: false, message: 'Không thể tải dữ liệu xếp loại học sinh' });
	}
};

export const saveEvaluationRecords = async (req, res) => {
	try {
		const classId = normalizeText(req.body?.classId);
		const dateValue = normalizeText(req.body?.date);
		const records = Array.isArray(req.body?.records) ? req.body.records : [];
		const dateRange = buildDateRange(dateValue);

		if (!classId || !dateRange) {
			return res.status(400).json({
				success: false,
				message: 'Lớp học và ngày đánh giá là bắt buộc',
			});
		}

		const classValidation = await getClassAccess(req.user, classId);
		if (!classValidation.ok) {
			return res.status(classValidation.status).json({ success: false, message: classValidation.message });
		}

		if (!classValidation.canManage) {
			return res.status(403).json({
				success: false,
				message: 'Bạn chỉ có thể xếp loại học sinh trong lớp mình phụ trách',
			});
		}

		const students = await Student.find({
			lopId: classValidation.classItem._id,
			status: { $in: ACTIVE_STUDENT_STATUSES },
		})
			.select('_id masoHS hotenHS')
			.lean();

		const studentIds = new Set(students.map((student) => String(student._id)));
		const normalizedRecords = records.map((record) => ({
			studentId: normalizeText(record?.studentId),
			rating: normalizeRatingValue(record?.rating),
		}));

		if (normalizedRecords.some((record) => !record.studentId || !studentIds.has(record.studentId))) {
			return res.status(400).json({ success: false, message: 'Danh sách học sinh không hợp lệ' });
		}

		if (normalizedRecords.some((record) => record.rating && !RATING_OPTIONS.includes(record.rating))) {
			return res.status(400).json({ success: false, message: 'Xếp loại không hợp lệ' });
		}

		const operations = normalizedRecords.map((record) => {
			if (!record.rating) {
				return {
					deleteMany: {
						filter: {
							masoHS: record.studentId,
							ngayNX: { $gte: dateRange.start, $lt: dateRange.end },
						},
					},
				};
			}

			return {
				updateOne: {
					filter: {
						masoHS: record.studentId,
						ngayNX: { $gte: dateRange.start, $lt: dateRange.end },
					},
					update: {
						$set: {
							ngayNX: dateRange.start,
							xeploai: record.rating,
							masoHS: record.studentId,
							masoGV: classValidation.classItem.giaoVienId?._id || classValidation.classItem.giaoVienId,
						},
					},
					upsert: true,
				},
			};
		});

		if (operations.length > 0) {
			await Evaluation.bulkWrite(operations);
		}

		return res.status(200).json({
			success: true,
			message: `Đã lưu xếp loại cho lớp ${classValidation.classItem.tenlop} ngày ${formatDateParam(dateRange.start)}`,
		});
	} catch (error) {
		console.log('Error saving evaluation records:', error);
		return res.status(400).json({ success: false, message: error.message || 'Không thể lưu xếp loại học sinh' });
	}
};
