import express from 'express';
import dotenv from 'dotenv';
import chalk from 'chalk';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoute from './routes/authRoute.js';
import attendanceRoute from './routes/attendanceRoute.js';
import classRoute from './routes/classRoute.js';
import evaluationRoute from './routes/evaluationRoute.js';
import gradeRoute from './routes/gradeRoute.js';
import lessonRoute from './routes/lessonRoute.js';
import studentRoute from './routes/studentRoute.js';
import teacherRoute from './routes/teacherRoute.js';
import { protectedRoute } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));
app.use(cors({
    credentials: true,
}));
// public routes
app.use('/api/auth', authRoute);
app.use(protectedRoute);
// protected routes
app.use('/api/attendance', attendanceRoute);
app.use('/api/classes', classRoute);
app.use('/api/evaluations', evaluationRoute);
app.use('/api/grades', gradeRoute);
app.use('/api/lessons', lessonRoute);
app.use('/api/students', studentRoute);
app.use('/api/teachers', teacherRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(chalk.black.bgMagenta(`👽 Server is running on http://localhost: ${PORT} !`));
    })
});
