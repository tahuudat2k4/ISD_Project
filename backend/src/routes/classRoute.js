import express from 'express';
import { getClasses, getClassById, createClass, updateClass, deleteClass } from '../controllers/classController.js';
import { requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getClasses);
router.get('/:id', getClassById);
router.post('/', requireRole('ADMIN'), createClass);
router.put('/:id', requireRole('ADMIN'), updateClass);
router.delete('/:id', requireRole('ADMIN'), deleteClass);

export default router;
