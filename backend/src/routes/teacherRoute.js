import express from 'express';
import {
	getTeachers,
	getTeacherById,
	createTeacher,
	updateTeacher,
	deleteTeacher,
	getTeacherAccountManagement,
	createTeacherAccount,
} from '../controllers/teacherController.js';
import { requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/account-management', requireRole('ADMIN'), getTeacherAccountManagement);
router.get('/', getTeachers);
router.get('/:id', getTeacherById);
router.post('/', createTeacher);
router.post('/:id/account', requireRole('ADMIN'), createTeacherAccount);
router.put('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);

export default router;
