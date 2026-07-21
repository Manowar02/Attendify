import express from 'express';
import { getTimetable, addTimetableEntry, deleteTimetableEntry } from '../controllers/timetableController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getTimetable).post(protect, addTimetableEntry);
router.route('/:id').delete(protect, deleteTimetableEntry);

export default router;
