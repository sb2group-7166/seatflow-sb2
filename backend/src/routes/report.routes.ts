import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getReportTypes,
  generateReport,
  getReportById,
  getReportHistory,
  deleteReport
} from '../controllers/reportController';

const router = express.Router();

// Get report types
router.get('/types', authenticate, getReportTypes);

// Generate report
router.post('/generate', authenticate, generateReport);

// Get report by ID
router.get('/:id', authenticate, getReportById);

// Get report history
router.get('/', authenticate, getReportHistory);

// Delete report
router.delete('/:id', authenticate, deleteReport);

export default router; 