import express from 'express';
import { getAttendanceClasses, getAttendanceRecords, saveAttendanceRecords } from '../controllers/attendanceController.js';
import { requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/classes', requireRole('ADMIN', 'TEACHER'), getAttendanceClasses);
router.get('/records', requireRole('ADMIN', 'TEACHER'), getAttendanceRecords);
router.post('/records', requireRole('ADMIN', 'TEACHER'), saveAttendanceRecords);

export default router;