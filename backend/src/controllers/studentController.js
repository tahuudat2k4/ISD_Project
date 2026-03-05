import Student from '../models/Student.js';

export const getStudents = async (req, res) => {
	try {
		const items = await Student.find().populate('lopId');
		return res.status(200).json({ success: true, data: items });
	} catch (error) {
		console.log('Error fetching students:', error);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

export const getStudentById = async (req, res) => {
	try {
		const item = await Student.findById(req.params.id).populate('lopId');
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
		const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!updated) return res.status(404).json({ success: false, message: 'Student not found' });
		return res.status(200).json({ success: true, data: updated });
	} catch (error) {
		console.log('Error updating student:', error);
		return res.status(400).json({ success: false, message: error.message });
	}
};

export const deleteStudent = async (req, res) => {
	try {
		const deleted = await Student.findByIdAndDelete(req.params.id);
		if (!deleted) return res.status(404).json({ success: false, message: 'Student not found' });
		return res.status(200).json({ success: true, message: 'Deleted successfully' });
	} catch (error) {
		console.log('Error deleting student:', error);
		return res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};
