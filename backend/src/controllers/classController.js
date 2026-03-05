import Class from '../models/Class.js';

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
		const created = await Class.create(req.body);
		return res.status(201).json({ success: true, data: created });
	} catch (error) {
		console.log('Error creating class:', error);
		return res.status(400).json({ success: false, message: error.message });
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
