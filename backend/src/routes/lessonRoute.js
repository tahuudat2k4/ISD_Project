import express from 'express';
import { createLesson, deleteLesson, getLessons, updateLesson } from '../controllers/lessonController.js';
import { requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', requireRole('ADMIN', 'TEACHER'), getLessons);
router.post('/', requireRole('ADMIN', 'TEACHER'), createLesson);
router.put('/:id', requireRole('ADMIN', 'TEACHER'), updateLesson);
router.delete('/:id', requireRole('ADMIN', 'TEACHER'), deleteLesson);

export default router;