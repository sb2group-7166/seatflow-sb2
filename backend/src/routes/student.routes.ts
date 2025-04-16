import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
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
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'));
    }
  }
});

// Routes
router.post('/', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'idProof', maxCount: 1 }
]), createStudent);

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.put('/:id', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'idProof', maxCount: 1 }
]), updateStudent);
router.delete('/:id', deleteStudent);

export default router; 