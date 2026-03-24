import express from 'express';
import { getGrades } from '../controllers/gradeController.js';

const router = express.Router();

router.get('/', getGrades);

export default router;