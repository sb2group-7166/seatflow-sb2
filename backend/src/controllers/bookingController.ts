import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Seat from '../models/Seat';
import User from '../models/User';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const {
      seatId,
      startTime,
      endTime,
      bookingType,
      price
    } = req.body;

    const userId = req.user.userId;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if seat exists and is available
    const seat = await Seat.findById(seatId);
    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    if (seat.status !== 'available') {
      return res.status(400).json({ message: 'Seat is not available' });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      seat: seatId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          startTime: { $lt: new Date(endTime) },
          endTime: { $gt: new Date(startTime) }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Seat is already booked for this time period' });
    }

    const booking = new Booking({
      user: userId,
      seat: seatId,
      startTime,
      endTime,
      bookingType,
      price,
      status: 'pending'
    });

    await booking.save();

    // Update seat status
    seat.status = 'reserved';
    seat.currentBooking = booking._id;
    await seat.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking: await booking.populate(['user', 'seat'])
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { status, startDate, endDate, userId } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (userId) filter.user = userId;
    if (startDate || endDate) {
      filter.startTime = {};
      if (startDate) filter.startTime.$gte = new Date(startDate as string);
      if (endDate) filter.startTime.$lte = new Date(endDate as string);
    }

    const bookings = await Booking.find(filter)
      .populate(['user', 'seat'])
      .sort({ startTime: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate(['user', 'seat']);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has permission to view this booking
    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only allow admin or booking owner to update status
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    const oldStatus = booking.status;
    booking.status = status;

    if (status === 'confirmed') {
      booking.paymentStatus = 'paid';
    } else if (status === 'cancelled') {
      // Update seat status if booking is cancelled
      const seat = await Seat.findById(booking.seat);
      if (seat && seat.currentBooking?.toString() === booking._id.toString()) {
        seat.status = 'available';
        seat.currentBooking = null;
        await seat.save();
      }
    } else if (status === 'completed') {
      const seat = await Seat.findById(booking.seat);
      if (seat) {
        seat.status = 'available';
        seat.currentBooking = null;
        await seat.save();
      }
    }

    booking.updatedAt = new Date();
    await booking.save();

    res.json({
      message: 'Booking status updated successfully',
      booking: await booking.populate(['user', 'seat'])
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
};

export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    const { status } = req.query;
    
    const filter: any = { user: userId };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('seat')
      .sort({ startTime: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user bookings', error: error.message });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only allow admin or booking owner to cancel
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Check if booking can be cancelled
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({ message: 'Cannot cancel booking in current status' });
    }

    booking.status = 'cancelled';
    booking.updatedAt = new Date();

    // Update seat status
    const seat = await Seat.findById(booking.seat);
    if (seat && seat.currentBooking?.toString() === booking._id.toString()) {
      seat.status = 'available';
      seat.currentBooking = null;
      await seat.save();
    }

    await booking.save();

    res.json({
      message: 'Booking cancelled successfully',
      booking: await booking.populate(['user', 'seat'])
    });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
}; 