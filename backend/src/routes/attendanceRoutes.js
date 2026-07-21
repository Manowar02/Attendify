import express from 'express';
import { getAttendance, markAttendance, setSubjectStatus, addExtraClass, removeExtraClass } from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getAttendance);
router.route('/mark').post(protect, markAttendance);
router.route('/subject-status').post(protect, setSubjectStatus);
router.route('/extra-class').post(protect, addExtraClass).delete(protect, removeExtraClass);

export default router;
