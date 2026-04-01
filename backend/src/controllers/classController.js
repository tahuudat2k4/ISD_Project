import Class from '../models/Class.js';
import Grade from '../models/Grade.js';
import Teacher from '../models/Teacher.js';

const DEFAULT_GRADES = {
	MAM: 'Mầm',
	CHOI: 'Chồi',
	LA: 'Lá',
};

const resolveGradeId = async ({ khoiId, makhoi }) => {
	let resolvedGradeId = khoiId;

	if (!resolvedGradeId && makhoi) {
		const normalizedCode = String(makhoi).trim().toUpperCase();
		let grade = await Grade.findOne({ makhoi: normalizedCode });

		if (!grade && DEFAULT_GRADES[normalizedCode]) {
			grade = await Grade.create({
				makhoi: normalizedCode,
				tenkhoi: DEFAULT_GRADES[normalizedCode],
			});
		}

		resolvedGradeId = grade?._id;
	}

	return resolvedGradeId;
};

export const getClasses = async (req, res) => {
	try {
		const items = await Class.find().populate('khoiId').populate('giaoVienId');
		return res.status(200).json({ success: true, data: items });
	} catch (error) {
		console.log('Error fetching classes:', error);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

export const getClassById = async (req, res) => {
	try {
		const item = await Class.findById(req.params.id).populate('khoiId').populate('giaoVienId');
		if (!item) return res.status(404).json({ success: false, message: 'Class not found' });
		return res.status(200).json({ success: true, data: item });
	} catch (error) {
		console.log('Error fetching class:', error);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

export const createClass = async (req, res) => {
	try {
		const {
			malop,
			tenlop,
			khoiId,
			makhoi,
			giaoVienId,
			status,
			succhua,
			giaovienphutro,
			phonghoc,
			giohoc,
			ngaythanhlap,
			cosovatchat,
			ghichu,
		} = req.body || {};

		const resolvedGradeId = await resolveGradeId({ khoiId, makhoi });

		if (!malop || !tenlop || !resolvedGradeId || !giaoVienId) {
			return res.status(400).json({
				success: false,
				message: 'Mã lớp, tên lớp, khối lớp và giáo viên chủ nhiệm là bắt buộc',
			});
		}

		const existing = await Class.findOne({ malop: malop.trim() });
		if (existing) {
			return res.status(400).json({
				success: false,
				message: 'Mã lớp đã tồn tại',
			});
		}

		const created = await Class.create({
			malop: malop.trim(),
			tenlop: tenlop.trim(),
			status: status || 'Hoạt động',
			succhua: Number(succhua) > 0 ? Number(succhua) : 30,
			giaovienphutro: giaovienphutro?.trim() || '',
			phonghoc: phonghoc?.trim() || '',
			giohoc: giohoc?.trim() || '',
			ngaythanhlap: ngaythanhlap ? new Date(ngaythanhlap) : undefined,
			cosovatchat: Array.isArray(cosovatchat)
				? cosovatchat.filter(Boolean).map((item) => String(item).trim()).filter(Boolean)
				: [],
			ghichu: ghichu?.trim() || '',
			khoiId: resolvedGradeId,
			giaoVienId,
		});
		await Teacher.findByIdAndUpdate(giaoVienId, { class: tenlop.trim() });
		const item = await Class.findById(created._id).populate('khoiId').populate('giaoVienId');
		return res.status(201).json({ success: true, message: 'Tạo lớp học thành công', data: item });
	} catch (error) {
		console.log('Error creating class:', error);
		if (error?.code === 11000) {
			return res.status(400).json({ success: false, message: 'Mã lớp đã tồn tại' });
		}
		return res.status(400).json({ success: false, message: error.message || 'Không thể tạo lớp học' });
	}
};

export const updateClass = async (req, res) => {
	try {
		const existing = await Class.findById(req.params.id);
		if (!existing) return res.status(404).json({ success: false, message: 'Class not found' });
		const previousTeacherId = existing.giaoVienId ? String(existing.giaoVienId) : '';

		const {
			malop,
			tenlop,
			khoiId,
			makhoi,
			giaoVienId,
			status,
			succhua,
			giaovienphutro,
			phonghoc,
			giohoc,
			ngaythanhlap,
			cosovatchat,
			ghichu,
		} = req.body || {};
		const normalizedMalop = malop?.trim();
		const normalizedTenlop = tenlop?.trim();
		const resolvedGradeId = await resolveGradeId({ khoiId, makhoi });

		if (!normalizedMalop || !normalizedTenlop || !resolvedGradeId || !giaoVienId) {
			return res.status(400).json({
				success: false,
				message: 'Mã lớp, tên lớp, khối lớp và giáo viên chủ nhiệm là bắt buộc',
			});
		}

		const duplicate = await Class.findOne({
			malop: normalizedMalop,
			_id: { $ne: req.params.id },
		});

		if (duplicate) {
			return res.status(400).json({ success: false, message: 'Mã lớp đã tồn tại' });
		}

		existing.malop = normalizedMalop;
		existing.tenlop = normalizedTenlop;
		existing.khoiId = resolvedGradeId;
		existing.giaoVienId = giaoVienId;
		existing.status = status || existing.status || 'Hoạt động';
		existing.succhua = Number(succhua) > 0 ? Number(succhua) : existing.succhua || 30;
		existing.giaovienphutro = giaovienphutro?.trim() || '';
		existing.phonghoc = phonghoc?.trim() || '';
		existing.giohoc = giohoc?.trim() || '';
		existing.ngaythanhlap = ngaythanhlap ? new Date(ngaythanhlap) : null;
		existing.cosovatchat = Array.isArray(cosovatchat)
			? cosovatchat.filter(Boolean).map((item) => String(item).trim()).filter(Boolean)
			: [];
		existing.ghichu = ghichu?.trim() || '';
		await existing.save();

		const nextTeacherId = String(giaoVienId);

		if (previousTeacherId && previousTeacherId !== nextTeacherId) {
			await Teacher.findByIdAndUpdate(previousTeacherId, { class: '' });
		}

		await Teacher.findByIdAndUpdate(giaoVienId, { class: normalizedTenlop });

		const updated = await Class.findById(req.params.id).populate('khoiId').populate('giaoVienId');
		if (!updated) return res.status(404).json({ success: false, message: 'Class not found' });
		return res.status(200).json({ success: true, data: updated });
	} catch (error) {
		console.log('Error updating class:', error);
		if (error?.code === 11000) {
			return res.status(400).json({ success: false, message: 'Mã lớp đã tồn tại' });
		}
		return res.status(400).json({ success: false, message: error.message || 'Không thể cập nhật lớp học' });
	}
};

export const deleteClass = async (req, res) => {
	try {
		const deleted = await Class.findByIdAndDelete(req.params.id);
		if (!deleted) return res.status(404).json({ success: false, message: 'Class not found' });
		if (deleted.giaoVienId) {
			await Teacher.findByIdAndUpdate(deleted.giaoVienId, { class: '' });
		}
		return res.status(200).json({ success: true, message: 'Deleted successfully' });
	} catch (error) {
		console.log('Error deleting class:', error);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};
