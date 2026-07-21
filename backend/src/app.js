import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://attendify-six-beryl.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_, response) => {
  response.json({ status: 'ok', service: 'attendify-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/attendance', attendanceRoutes);

app.use((_, response) => {
  response.status(404).json({ message: 'Route not found' });
});

export default app;
