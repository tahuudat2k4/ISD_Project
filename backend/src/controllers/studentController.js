import Student from '../models/Student.js';
import Class from '../models/Class.js';

const studentClassPopulate = {
	path: 'lopId',
	populate: {
		path: 'khoiId',
	},
};

const getTeacherAccessibleClasses = async (teacherId) => {
	if (!teacherId) {
		return [];
	}

	return Class.find({ giaoVienId: teacherId })
		.select('_id malop tenlop')
		.sort({ tenlop: 1 })
		.lean();
};

const buildStudentsResponseMeta = (classes, role) => ({
	scope: role === 'TEACHER' ? 'teacher' : 'all',
	accessibleClasses: classes.map((classItem) => ({
		id: classItem._id,
		code: classItem.malop,
		name: classItem.tenlop,
	})),
});

const getTeacherAccessibleClassIds = async (teacherId) => {
	const accessibleClasses = await getTeacherAccessibleClasses(teacherId);
	return accessibleClasses.map((classItem) => String(classItem._id));
};

const findTeacherManagedStudent = async (teacherId, studentId) => {
	const accessibleClassIds = await getTeacherAccessibleClassIds(teacherId);

	if (!accessibleClassIds.length) {
		return null;
	}

	return Student.findOne({
		_id: studentId,
		lopId: { $in: accessibleClassIds },
	});
};

export const getStudents = async (req, res) => {
	try {
		const items = await Student.find().populate(studentClassPopulate);
		const accessibleClasses = req.user?.role === 'TEACHER'
			? await getTeacherAccessibleClasses(req.user.teacherId)
			: await Class.find()
				.select('_id malop tenlop')
				.sort({ tenlop: 1 })
				.lean();

		return res.status(200).json({
			success: true,
			data: items,
			meta: buildStudentsResponseMeta(accessibleClasses, req.user?.role),
		});
	} catch (error) {
		console.log('Error fetching students:', error);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

export const getStudentById = async (req, res) => {
	try {
		let item;

		if (req.user?.role === 'TEACHER') {
			const accessibleClasses = await getTeacherAccessibleClasses(req.user.teacherId);
			const classIds = accessibleClasses.map((classItem) => classItem._id);

			item = classIds.length
				? await Student.findOne({ _id: req.params.id, lopId: { $in: classIds } }).populate(studentClassPopulate)
				: null;
		} else {
			item = await Student.findById(req.params.id).populate(studentClassPopulate);
		}

		if (!item) return res.status(404).json({ success: false, message: 'Student not found' });
		return res.status(200).json({ success: true, data: item });
	} catch (error) {
		console.log('Error fetching student:', error);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

export const createStudent = async (req, res) => {
	try {
		const created = await Student.create(req.body);
		return res.status(201).json({ success: true, data: created });
	} catch (error) {
		console.log('Error creating student:', error);
		return res.status(400).json({ success: false, message: error.message });
	}
};

export const updateStudent = async (req, res) => {
	try {
		let targetStudent;
		const payload = { ...req.body };

		if (req.user?.role === 'TEACHER') {
			targetStudent = await findTeacherManagedStudent(req.user.teacherId, req.params.id);

			if (!targetStudent) {
				return res.status(403).json({
					success: false,
					message: 'Bạn chỉ có thể cập nhật học sinh trong lớp mình phụ trách',
				});
			}

			if (payload.lopId && String(payload.lopId) !== String(targetStudent.lopId)) {
				return res.status(400).json({
					success: false,
					message: 'Giáo viên chủ nhiệm không thể chuyển học sinh sang lớp khác',
				});
			}

			payload.lopId = targetStudent.lopId;
		} else {
			targetStudent = await Student.findById(req.params.id);
		}

		if (!targetStudent) return res.status(404).json({ success: false, message: 'Student not found' });

		const updated = await Student.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
		if (!updated) return res.status(404).json({ success: false, message: 'Student not found' });
		return res.status(200).json({ success: true, data: updated });
	} catch (error) {
		console.log('Error updating student:', error);
		return res.status(400).json({ success: false, message: error.message });
	}
};

export const deleteStudent = async (req, res) => {
	try {
		const student = req.user?.role === 'TEACHER'
			? await findTeacherManagedStudent(req.user.teacherId, req.params.id)
			: await Student.findById(req.params.id);

		if (req.user?.role === 'TEACHER' && !student) {
			return res.status(403).json({
				success: false,
				message: 'Bạn chỉ có thể xóa học sinh trong lớp mình phụ trách',
			});
		}

		if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

		if (student.status !== 'Nghỉ học') {
			return res.status(400).json({
				success: false,
				message: 'Chỉ có thể xóa học sinh khi trạng thái là Nghỉ học. Vui lòng cập nhật trạng thái trước.',
			});
		}

		await Student.findByIdAndDelete(req.params.id);
		return res.status(200).json({ success: true, message: 'Deleted successfully' });
	} catch (error) {
		console.log('Error deleting student:', error);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};
