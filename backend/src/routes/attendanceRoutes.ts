import { Router } from 'express';
import { attendanceController } from '../controllers/attendanceController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Record daily attendance
router.post('/record', authenticateToken, attendanceController.recordAttendance);

// Record check-in/check-out activity
router.post('/activity', authenticateToken, attendanceController.recordActivity);

// Get attendance history for a student
router.get('/student/:studentId', authenticateToken, attendanceController.getStudentAttendance);

// Get attendance statistics
router.get('/stats/:studentId', authenticateToken, attendanceController.getAttendanceStats);

export default router; 