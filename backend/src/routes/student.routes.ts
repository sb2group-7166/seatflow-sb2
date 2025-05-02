import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate } from '../middleware/auth';
import {
  createStudent,
  deleteStudent,
  getStudents,
  getStudentById,
  updateStudent,
} from '../controllers/student.controller';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Get all students
router.get('/', authenticate, getStudents);

// Get student by ID
router.get('/:id', authenticate, getStudentById);

// Create new student
router.post('/', authenticate, upload.array('files'), (req, res) => {
  createStudent(req as any, res);
});

// Update student
router.put('/:id', authenticate, upload.array('files'), (req, res) => {
  updateStudent(req as any, res);
});

// Delete student
router.delete('/:id', authenticate, deleteStudent);

export default router; 