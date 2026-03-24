import Class from '../models/Class.js';
import Grade from '../models/Grade.js';
import Teacher from '../models/Teacher.js';

const DEFAULT_GRADES = {
	MAM: 'Mầm',
	CHOI: 'Chồi',
	LA: 'Lá',
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
		const { malop, tenlop, khoiId, makhoi, giaoVienId } = req.body || {};

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
		const updated = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!updated) return res.status(404).json({ success: false, message: 'Class not found' });
		return res.status(200).json({ success: true, data: updated });
	} catch (error) {
		console.log('Error updating class:', error);
		return res.status(400).json({ success: false, message: error.message });
	}
};

export const deleteClass = async (req, res) => {
	try {
		const deleted = await Class.findByIdAndDelete(req.params.id);
		if (!deleted) return res.status(404).json({ success: false, message: 'Class not found' });
		return res.status(200).json({ success: true, message: 'Deleted successfully' });
	} catch (error) {
		console.log('Error deleting class:', error);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};
