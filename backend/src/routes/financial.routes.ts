import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getFinancialSummary,
  getRevenueReport,
  getPaymentHistory,
  createPayment,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentMethods,
  getPaymentStatistics
} from '../controllers/financialController';
import { validatePayment } from '../middleware/validation';

const router = express.Router();

// Public routes
router.get('/methods', getPaymentMethods);
router.get('/statistics', getPaymentStatistics);

// Protected routes - Staff and Admin only
router.use(authenticate);

// Financial summary and reports
router.get('/summary', authorize(['admin', 'staff']), getFinancialSummary);
router.get('/revenue', authorize(['admin', 'staff']), getRevenueReport);
router.get('/history', authorize(['admin', 'staff']), getPaymentHistory);

// Payment management
router.post('/', validatePayment, authorize(['admin', 'staff']), createPayment);
router.get('/:id', authorize(['admin', 'staff']), getPaymentById);
router.put('/:id', validatePayment, authorize(['admin', 'staff']), updatePayment);
router.delete('/:id', authorize(['admin']), deletePayment);

export default router; 