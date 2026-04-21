import Class from '../models/Class.js';
import Lesson from '../models/Lesson.js';

const TOPIC_OPTIONS = [
	'Toán',
	'Tiếng Việt',
	'Âm Nhạc',
	'Mỹ Thuật',
	'Thể Dục',
	'Kể Chuyện',
	'Tiếng Anh',
	'Khoa Học',
];

const DATE_QUERY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MAX_ATTACHMENT_SIZE = 8 * 1024 * 1024;
const ATTACHMENT_MIME_TYPES = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ATTACHMENT_TYPE_BY_EXTENSION = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.gif': 'image/gif',
	'.doc': 'application/msword',
	'.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildExactCaseInsensitiveRegex = (value) => new RegExp(`^${escapeRegExp(String(value).trim())}$`, 'i');

const normalizeText = (value) => String(value || '').trim();

const getFileExtension = (fileName = '') => {
	const normalizedName = String(fileName).trim().toLowerCase();
	const lastDotIndex = normalizedName.lastIndexOf('.');

	return lastDotIndex >= 0 ? normalizedName.slice(lastDotIndex) : '';
};

const resolveAttachmentMimeType = (mimeType, fileName) => {
	const normalizedMimeType = normalizeText(mimeType).toLowerCase();
	if (ATTACHMENT_MIME_TYPES.includes(normalizedMimeType)) {
		return normalizedMimeType;
	}

	return ATTACHMENT_TYPE_BY_EXTENSION[getFileExtension(fileName)] || '';
};

const normalizeGrade = (classItem) => {
	const rawCode = String(classItem?.khoiId?.makhoi || '').trim().toUpperCase();

	if (rawCode === 'MAM') {
		return 'mam';
	}

	if (rawCode === 'CHOI') {
		return 'choi';
	}

	if (rawCode === 'LA') {
		return 'la';
	}

	const rawName = String(classItem?.khoiId?.tenkhoi || '')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();

	if (rawName.includes('mam')) {
		return 'mam';
	}

	if (rawName.includes('choi')) {
		return 'choi';
	}

	if (rawName.includes('la')) {
		return 'la';
	}

	return 'all';
};

const parseLessonDate = (value) => {
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

const normalizeAttachment = (attachment) => {
	if (!attachment || typeof attachment !== 'object') {
		return null;
	}

	const fileName = normalizeText(attachment.fileName);
	const mimeType = resolveAttachmentMimeType(attachment.mimeType, fileName);
	const dataUrl = normalizeText(attachment.dataUrl);
	const size = Number(attachment.size) || 0;

	if (!fileName || !mimeType || !dataUrl || size <= 0) {
		return null;
	}

	if (!ATTACHMENT_MIME_TYPES.includes(mimeType)) {
		throw new Error('Chỉ hỗ trợ tải lên ảnh hoặc tài liệu Word (.doc, .docx)');
	}

	const isExactMimePrefix = dataUrl.startsWith(`data:${mimeType};base64,`);
	const isGenericMimePrefix = /^data:(application\/octet-stream|);base64,/i.test(dataUrl);

	if (!isExactMimePrefix && !isGenericMimePrefix) {
		throw new Error('Tệp đính kèm không hợp lệ');
	}

	if (size > MAX_ATTACHMENT_SIZE) {
		throw new Error('Tệp đính kèm vượt quá 8MB');
	}

	return {
		fileName,
		mimeType,
		size,
		dataUrl: isExactMimePrefix
			? dataUrl
			: dataUrl.replace(/^data:[^;]*;base64,/i, `data:${mimeType};base64,`),
	};
};

const emptyAttachmentPayload = () => ({
	fileName: '',
	mimeType: '',
	size: 0,
	dataUrl: '',
});

const findLessonById = async (lessonId) => {
	return Lesson.findById(lessonId)
		.populate({
			path: 'lopId',
			select: '_id malop tenlop phonghoc khoiId giaoVienId',
			populate: [
				{ path: 'khoiId', select: 'makhoi tenkhoi' },
				{ path: 'giaoVienId', select: 'hotenGV masoGV' },
			],
		})
		.populate('masoGV', 'hotenGV masoGV');
};

const buildLessonPayload = (lesson, currentUser) => {
	const classItem = lesson.lopId;
	const classTeacherId = classItem?.giaoVienId?._id || classItem?.giaoVienId || null;
	const canManageClass = currentUser?.role === 'ADMIN'
		|| (currentUser?.teacherId && String(classTeacherId) === String(currentUser.teacherId));

	return {
		id: String(lesson._id),
		code: lesson.maBaiGiang,
		title: lesson.tenbaihoc,
		grade: normalizeGrade(classItem),
		classId: String(classItem?._id || ''),
		className: classItem?.tenlop || '',
		teacherId: String(lesson.masoGV?._id || lesson.masoGV || ''),
		teacher: lesson.masoGV?.hotenGV || '',
		date: formatDateParam(lesson.ngayhoc),
		content: lesson.noidungbaihoc || '',
		duration: lesson.thoiluong || '',
		topic: lesson.chude || '',
		room: lesson.phonghoc || classItem?.phonghoc || '',
		notes: lesson.ghichu || '',
		attachment: lesson.taiLieuDinhKem?.dataUrl
			? {
				fileName: lesson.taiLieuDinhKem.fileName,
				mimeType: lesson.taiLieuDinhKem.mimeType,
				size: lesson.taiLieuDinhKem.size,
				dataUrl: lesson.taiLieuDinhKem.dataUrl,
			}
			: null,
		canManageClass,
	};
};

const getManagedClassOrError = async (user, classId) => {
	const classItem = await Class.findById(classId)
		.select('_id malop tenlop phonghoc khoiId giaoVienId')
		.populate('khoiId', 'makhoi tenkhoi')
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
		return { ok: true, classItem };
	}

	const classTeacherId = classItem.giaoVienId?._id || classItem.giaoVienId;
	const isManageable = Boolean(user?.teacherId && String(classTeacherId) === String(user.teacherId));

	if (!isManageable) {
		return {
			ok: false,
			status: 403,
			message: 'Bạn chỉ có thể quản lý bài giảng của lớp mình phụ trách',
		};
	}

	return { ok: true, classItem };
};

export const getLessons = async (req, res) => {
	try {
		const lessons = await Lesson.find()
			.populate({
				path: 'lopId',
				select: '_id malop tenlop phonghoc khoiId giaoVienId',
				populate: [
					{ path: 'khoiId', select: 'makhoi tenkhoi' },
					{ path: 'giaoVienId', select: 'hotenGV masoGV' },
				],
			})
			.populate('masoGV', 'hotenGV masoGV')
			.sort({ ngayhoc: -1, createdAt: -1 });

		const items = lessons
			.filter((lesson) => lesson.lopId && lesson.masoGV)
			.map((lesson) => buildLessonPayload(lesson, req.user));

		return res.status(200).json({ success: true, data: items });
	} catch (error) {
		console.log('Error fetching lessons:', error);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

export const createLesson = async (req, res) => {
	try {
		const {
			classId,
			code,
			title,
			topic,
			date,
			content,
			duration,
			room,
			notes,
			attachment,
		} = req.body || {};

		const normalizedClassId = normalizeText(classId);
		const normalizedCode = normalizeText(code).toUpperCase();
		const normalizedTitle = normalizeText(title);
		const normalizedTopic = normalizeText(topic);
		const lessonDate = parseLessonDate(date);
		const normalizedAttachment = normalizeAttachment(attachment);

		if (!normalizedClassId || !normalizedCode || !normalizedTitle || !normalizedTopic || !lessonDate) {
			return res.status(400).json({
				success: false,
				message: 'Lớp học, mã bài giảng, tên bài giảng, môn học và ngày học là bắt buộc',
			});
		}

		if (!TOPIC_OPTIONS.includes(normalizedTopic)) {
			return res.status(400).json({ success: false, message: 'Môn học không hợp lệ' });
		}

		const classValidation = await getManagedClassOrError(req.user, normalizedClassId);
		if (!classValidation.ok) {
			return res.status(classValidation.status).json({ success: false, message: classValidation.message });
		}

		const existingCode = await Lesson.findOne({
			maBaiGiang: { $regex: buildExactCaseInsensitiveRegex(normalizedCode) },
		});

		if (existingCode) {
			return res.status(400).json({ success: false, message: 'Mã bài giảng đã tồn tại' });
		}

		const classTeacherId = classValidation.classItem.giaoVienId?._id || classValidation.classItem.giaoVienId;
		const created = await Lesson.create({
			maBaiGiang: normalizedCode,
			ngayhoc: lessonDate,
			tenbaihoc: normalizedTitle,
			chude: normalizedTopic,
			thoiluong: normalizeText(duration),
			phonghoc: normalizeText(room) || classValidation.classItem.phonghoc || '',
			taiLieuDinhKem: normalizedAttachment || undefined,
			ghichu: normalizeText(notes),
			lopId: classValidation.classItem._id,
			masoGV: classTeacherId,
			noidungbaihoc: normalizeText(content),
		});

		const createdLesson = await findLessonById(created._id);

		return res.status(201).json({
			success: true,
			message: `Đã tạo bài giảng cho lớp ${classValidation.classItem.tenlop}`,
			data: buildLessonPayload(createdLesson, req.user),
		});
	} catch (error) {
		console.log('Error creating lesson:', error);
		return res.status(400).json({ success: false, message: error.message || 'Không thể tạo bài giảng' });
	}
};

export const updateLesson = async (req, res) => {
	try {
		const lessonId = normalizeText(req.params.id);
		const existingLesson = await findLessonById(lessonId);

		if (!existingLesson) {
			return res.status(404).json({ success: false, message: 'Không tìm thấy bài giảng' });
		}

		const currentClassValidation = await getManagedClassOrError(req.user, existingLesson.lopId?._id || existingLesson.lopId);
		if (!currentClassValidation.ok) {
			return res.status(currentClassValidation.status).json({ success: false, message: currentClassValidation.message });
		}

		const {
			classId,
			code,
			title,
			topic,
			date,
			content,
			duration,
			room,
			notes,
			attachment,
			removeAttachment,
		} = req.body || {};

		const normalizedClassId = normalizeText(classId) || String(existingLesson.lopId?._id || '');
		const normalizedCode = normalizeText(code || existingLesson.maBaiGiang).toUpperCase();
		const normalizedTitle = normalizeText(title || existingLesson.tenbaihoc);
		const normalizedTopic = normalizeText(topic || existingLesson.chude);
		const normalizedDateValue = normalizeText(date);
		const lessonDate = normalizedDateValue ? parseLessonDate(normalizedDateValue) : existingLesson.ngayhoc;
		const shouldRemoveAttachment = Boolean(removeAttachment);

		if (!normalizedClassId || !normalizedCode || !normalizedTitle || !normalizedTopic || !lessonDate) {
			return res.status(400).json({
				success: false,
				message: 'Lớp học, mã bài giảng, tên bài giảng, môn học và ngày học là bắt buộc',
			});
		}

		if (!TOPIC_OPTIONS.includes(normalizedTopic)) {
			return res.status(400).json({ success: false, message: 'Môn học không hợp lệ' });
		}

		const targetClassValidation = await getManagedClassOrError(req.user, normalizedClassId);
		if (!targetClassValidation.ok) {
			return res.status(targetClassValidation.status).json({ success: false, message: targetClassValidation.message });
		}

		const existingCode = await Lesson.findOne({
			_id: { $ne: existingLesson._id },
			maBaiGiang: { $regex: buildExactCaseInsensitiveRegex(normalizedCode) },
		});

		if (existingCode) {
			return res.status(400).json({ success: false, message: 'Mã bài giảng đã tồn tại' });
		}

		let nextAttachment = existingLesson.taiLieuDinhKem?.dataUrl
			? {
				fileName: existingLesson.taiLieuDinhKem.fileName,
				mimeType: existingLesson.taiLieuDinhKem.mimeType,
				size: existingLesson.taiLieuDinhKem.size,
				dataUrl: existingLesson.taiLieuDinhKem.dataUrl,
			}
			: emptyAttachmentPayload();

		if (shouldRemoveAttachment) {
			nextAttachment = emptyAttachmentPayload();
		} else if (attachment !== undefined) {
			nextAttachment = normalizeAttachment(attachment) || emptyAttachmentPayload();
		}

		const classTeacherId = targetClassValidation.classItem.giaoVienId?._id || targetClassValidation.classItem.giaoVienId;
		existingLesson.maBaiGiang = normalizedCode;
		existingLesson.ngayhoc = lessonDate;
		existingLesson.tenbaihoc = normalizedTitle;
		existingLesson.chude = normalizedTopic;
		existingLesson.thoiluong = normalizeText(duration) || existingLesson.thoiluong || '';
		existingLesson.phonghoc = normalizeText(room) || targetClassValidation.classItem.phonghoc || existingLesson.phonghoc || '';
		existingLesson.ghichu = normalizeText(notes) || existingLesson.ghichu || '';
		existingLesson.noidungbaihoc = normalizeText(content) || existingLesson.noidungbaihoc || '';
		existingLesson.taiLieuDinhKem = nextAttachment;
		existingLesson.lopId = targetClassValidation.classItem._id;
		existingLesson.masoGV = classTeacherId;

		await existingLesson.save();

		const updatedLesson = await findLessonById(existingLesson._id);

		return res.status(200).json({
			success: true,
			message: `Đã cập nhật bài giảng ${normalizedCode}`,
			data: buildLessonPayload(updatedLesson, req.user),
		});
	} catch (error) {
		console.log('Error updating lesson:', error);
		return res.status(400).json({ success: false, message: error.message || 'Không thể cập nhật bài giảng' });
	}
};

export const deleteLesson = async (req, res) => {
	try {
		const lessonId = normalizeText(req.params.id);
		const existingLesson = await findLessonById(lessonId);

		if (!existingLesson) {
			return res.status(404).json({ success: false, message: 'Không tìm thấy bài giảng' });
		}

		const classValidation = await getManagedClassOrError(req.user, existingLesson.lopId?._id || existingLesson.lopId);
		if (!classValidation.ok) {
			return res.status(classValidation.status).json({ success: false, message: classValidation.message });
		}

		await Lesson.findByIdAndDelete(existingLesson._id);

		return res.status(200).json({
			success: true,
			message: `Đã xóa bài giảng ${existingLesson.maBaiGiang}`,
		});
	} catch (error) {
		console.log('Error deleting lesson:', error);
		return res.status(400).json({ success: false, message: error.message || 'Không thể xóa bài giảng' });
	}
};