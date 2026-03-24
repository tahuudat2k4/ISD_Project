import express from 'express';
import { getStudents, getStudentById, createStudent, updateStudent, deleteStudent } from '../controllers/studentController.js';
import { requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', requireRole('ADMIN'), createStudent);
router.put('/:id', requireRole('ADMIN'), updateStudent);
router.delete('/:id', requireRole('ADMIN'), deleteStudent);

export default router;
