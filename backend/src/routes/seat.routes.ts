import express from 'express';
import Seat from '../models/seat.model';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all seats
router.get('/', authenticateToken, async (req, res) => {
  try {
    const seats = await Seat.find();
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching seats' });
  }
});

// Get seat by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }
    res.json(seat);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching seat' });
  }
});

// Create new seat
router.post('/', authenticateToken, async (req, res) => {
  try {
    const seat = new Seat(req.body);
    await seat.save();
    res.status(201).json(seat);
  } catch (error) {
    res.status(400).json({ message: 'Error creating seat' });
  }
});

// Update seat
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const seat = await Seat.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }
    res.json(seat);
  } catch (error) {
    res.status(400).json({ message: 'Error updating seat' });
  }
});

// Book seat
router.post('/:id/book', authenticateToken, async (req, res) => {
  try {
    const { studentId, startTime, endTime } = req.body;
    const seat = await Seat.findById(req.params.id);

    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    if (seat.status !== 'available') {
      return res.status(400).json({ message: 'Seat is not available' });
    }

    seat.status = 'occupied';
    seat.studentId = studentId;
    seat.bookingStart = startTime;
    seat.bookingEnd = endTime;

    await seat.save();
    res.json(seat);
  } catch (error) {
    res.status(400).json({ message: 'Error booking seat' });
  }
});

// Release seat
router.post('/:id/release', authenticateToken, async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);

    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    seat.status = 'available';
    seat.studentId = undefined;
    seat.bookingStart = undefined;
    seat.bookingEnd = undefined;

    await seat.save();
    res.json(seat);
  } catch (error) {
    res.status(400).json({ message: 'Error releasing seat' });
  }
});

export default router; 