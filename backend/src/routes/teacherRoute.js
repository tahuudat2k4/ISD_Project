import express from 'express';
import {
	getTeachers,
	getTeacherById,
	createTeacher,
	updateTeacher,
	deleteTeacher,
	getTeacherAccountManagement,
	createTeacherAccount,
	resetTeacherAccountPassword,
	deleteTeacherAccount,
} from '../controllers/teacherController.js';
import { requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/account-management', requireRole('ADMIN'), getTeacherAccountManagement);
router.get('/', getTeachers);
router.get('/:id', getTeacherById);
router.post('/', requireRole('ADMIN'), createTeacher);
router.post('/:id/account', requireRole('ADMIN'), createTeacherAccount);
router.patch('/:id/account/password', requireRole('ADMIN'), resetTeacherAccountPassword);
router.delete('/:id/account', requireRole('ADMIN'), deleteTeacherAccount);
router.put('/:id', requireRole('ADMIN'), updateTeacher);
router.delete('/:id', requireRole('ADMIN'), deleteTeacher);

export default router;
