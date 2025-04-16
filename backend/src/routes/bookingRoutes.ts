import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getUserBookings,
  cancelBooking
} from '../controllers/bookingController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Protected routes - All authenticated users
router.post('/', authenticate, createBooking);
router.get('/my-bookings', authenticate, getUserBookings);
router.get('/:id', authenticate, getBookingById);
router.put('/:id/cancel', authenticate, cancelBooking);

// Protected routes - Staff and Admin only
router.get('/', authenticate, authorize(['admin', 'staff']), getAllBookings);
router.put('/:id/status', authenticate, authorize(['admin', 'staff']), updateBookingStatus);

export default router; 