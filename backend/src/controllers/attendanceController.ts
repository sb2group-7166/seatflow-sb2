import { Request, Response } from 'express';
import { Attendance } from '../models/Attendance';
import { Student } from '../models/Student';

export const attendanceController = {
  // Record daily attendance
  async recordAttendance(req: Request, res: Response) {
    try {
      const { studentId, date, status, notes } = req.body;

      // Check if student exists
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Check if attendance already exists for this date
      const existingAttendance = await Attendance.findOne({
        studentId,
        date: new Date(date),
      });

      if (existingAttendance) {
        return res.status(400).json({ message: 'Attendance already recorded for this date' });
      }

      const attendance = new Attendance({
        studentId,
        date: new Date(date),
        status,
        notes,
      });

      await attendance.save();
      res.status(201).json(attendance);
    } catch (error) {
      res.status(500).json({ message: 'Error recording attendance', error });
    }
  },

  // Record check-in/check-out activity
  async recordActivity(req: Request, res: Response) {
    try {
      const { studentId, type, location } = req.body;
      const timestamp = new Date();

      // Find today's attendance record
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let attendance = await Attendance.findOne({
        studentId,
        date: today,
      });

      if (!attendance) {
        // Create new attendance record if it doesn't exist
        attendance = new Attendance({
          studentId,
          date: today,
          status: 'present',
        });
      }

      // Add activity
      attendance.activities.push({
        type,
        timestamp,
        location,
      });

      // Update check-in/check-out times
      if (type === 'check-in') {
        attendance.checkInTime = timestamp;
      } else if (type === 'check-out') {
        attendance.checkOutTime = timestamp;
      }

      await attendance.save();
      res.status(200).json(attendance);
    } catch (error) {
      res.status(500).json({ message: 'Error recording activity', error });
    }
  },

  // Get attendance history for a student
  async getStudentAttendance(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const { startDate, endDate } = req.query;

      const query: any = { studentId };

      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        };
      }

      const attendance = await Attendance.find(query)
        .sort({ date: -1 })
        .populate('studentId', 'name email');

      res.status(200).json(attendance);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching attendance history', error });
    }
  },

  // Get attendance statistics
  async getAttendanceStats(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const { startDate, endDate } = req.query;

      const query: any = { studentId };

      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        };
      }

      const stats = await Attendance.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching attendance statistics', error });
    }
  },
}; 