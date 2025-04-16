import { Request, Response } from 'express';
import Seat from '../models/Seat';
import Booking from '../models/Booking';

export const createSeat = async (req: Request, res: Response) => {
  try {
    const {
      seatNumber,
      section,
      floor,
      type,
      position,
      features
    } = req.body;

    const existingSeat = await Seat.findOne({ seatNumber, section });
    if (existingSeat) {
      return res.status(400).json({ message: 'Seat already exists in this section' });
    }

    const seat = new Seat({
      seatNumber,
      section,
      floor,
      type,
      position,
      features
    });

    await seat.save();

    res.status(201).json({
      message: 'Seat created successfully',
      seat
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating seat', error: error.message });
  }
};

export const getAllSeats = async (req: Request, res: Response) => {
  try {
    const { section, floor, type, status } = req.query;
    const filter: any = {};

    if (section) filter.section = section;
    if (floor) filter.floor = floor;
    if (type) filter.type = type;
    if (status) filter.status = status;

    const seats = await Seat.find(filter)
      .populate('currentBooking')
      .sort({ seatNumber: 1 });

    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching seats', error: error.message });
  }
};

export const getSeatById = async (req: Request, res: Response) => {
  try {
    const seat = await Seat.findById(req.params.id)
      .populate('currentBooking');
    
    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    res.json(seat);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching seat', error: error.message });
  }
};

export const updateSeat = async (req: Request, res: Response) => {
  try {
    const {
      seatNumber,
      section,
      floor,
      type,
      position,
      features,
      status
    } = req.body;

    const seat = await Seat.findById(req.params.id);
    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    if (seatNumber && section) {
      const existingSeat = await Seat.findOne({
        _id: { $ne: req.params.id },
        seatNumber,
        section
      });
      if (existingSeat) {
        return res.status(400).json({ message: 'Seat number already exists in this section' });
      }
    }

    if (seatNumber) seat.seatNumber = seatNumber;
    if (section) seat.section = section;
    if (floor) seat.floor = floor;
    if (type) seat.type = type;
    if (position) seat.position = position;
    if (features) seat.features = features;
    if (status) seat.status = status;

    seat.updatedAt = new Date();
    await seat.save();

    res.json({
      message: 'Seat updated successfully',
      seat
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating seat', error: error.message });
  }
};

export const deleteSeat = async (req: Request, res: Response) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    const hasActiveBookings = await Booking.exists({
      seat: seat._id,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (hasActiveBookings) {
      return res.status(400).json({ message: 'Cannot delete seat with active bookings' });
    }

    await seat.deleteOne();
    res.json({ message: 'Seat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting seat', error: error.message });
  }
};

export const getSeatAvailability = async (req: Request, res: Response) => {
  try {
    const { startTime, endTime } = req.query;
    const seatId = req.params.id;

    if (!startTime || !endTime) {
      return res.status(400).json({ message: 'Start time and end time are required' });
    }

    const seat = await Seat.findById(seatId);
    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    const conflictingBooking = await Booking.findOne({
      seat: seatId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          startTime: { $lt: new Date(endTime as string) },
          endTime: { $gt: new Date(startTime as string) }
        }
      ]
    });

    res.json({
      isAvailable: !conflictingBooking,
      currentBooking: conflictingBooking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking seat availability', error: error.message });
  }
};

export const updateSeatStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const seat = await Seat.findById(req.params.id);
    
    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    if (status === 'maintenance') {
      seat.lastMaintenance = new Date();
    }

    seat.status = status;
    seat.updatedAt = new Date();
    await seat.save();

    res.json({
      message: 'Seat status updated successfully',
      seat
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating seat status', error: error.message });
  }
}; 