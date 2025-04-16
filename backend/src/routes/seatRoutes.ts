import express from 'express';
import {
  createSeat,
  getAllSeats,
  getSeatById,
  updateSeat,
  deleteSeat,
  getSeatAvailability,
  updateSeatStatus
} from '../controllers/seatController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getAllSeats);
router.get('/:id', getSeatById);
router.get('/:id/availability', getSeatAvailability);

// Protected routes - Staff and Admin only
router.post('/', authenticate, authorize(['admin', 'staff']), createSeat);
router.put('/:id', authenticate, authorize(['admin', 'staff']), updateSeat);
router.delete('/:id', authenticate, authorize(['admin']), deleteSeat);
router.put('/:id/status', authenticate, authorize(['admin', 'staff']), updateSeatStatus);

export default router; 