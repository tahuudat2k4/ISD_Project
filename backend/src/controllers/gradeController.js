import Grade from '../models/Grade.js';

const DEFAULT_GRADES = [
	{ makhoi: 'MAM', tenkhoi: 'Mầm' },
	{ makhoi: 'CHOI', tenkhoi: 'Chồi' },
	{ makhoi: 'LA', tenkhoi: 'Lá' },
];

export const getGrades = async (req, res) => {
	try {
		const existing = await Grade.find().lean();
		if (existing.length < DEFAULT_GRADES.length) {
			const existingCodes = new Set(existing.map((item) => item.makhoi));
			const missingGrades = DEFAULT_GRADES.filter((grade) => !existingCodes.has(grade.makhoi));

			if (missingGrades.length > 0) {
				await Grade.insertMany(missingGrades, { ordered: false });
			}
		}

		const items = await Grade.find().sort({ tenkhoi: 1, makhoi: 1 });
		return res.status(200).json({ success: true, data: items });
	} catch (error) {
		console.log('Error fetching grades:', error);
		return res.status(500).json({ success: false, message: 'Không thể tải danh sách khối lớp' });
	}
};