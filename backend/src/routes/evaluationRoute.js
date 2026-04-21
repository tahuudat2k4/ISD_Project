import express from 'express';
import { getEvaluationRecords, saveEvaluationRecords } from '../controllers/evaluationController.js';
import { requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', requireRole('ADMIN', 'TEACHER'), getEvaluationRecords);
router.put('/', requireRole('ADMIN', 'TEACHER'), saveEvaluationRecords);

export default router;
