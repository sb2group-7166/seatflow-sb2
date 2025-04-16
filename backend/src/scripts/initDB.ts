import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/database';
import User from '../models/User';
import Seat from '../models/Seat';
import { Student } from '../models/student.model';
import Booking from '../models/Booking';
import Payment from '../models/payment.model';

const initDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Seat.deleteMany({});
    await Student.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@seatflow.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });

    // Create sample seats
    const seats = await Seat.create([
      {
        seatNumber: 'A1',
        section: 'A',
        status: 'available',
        floor: 1,
        type: 'standard',
        position: { x: 0, y: 0 },
        features: ['power_outlet', 'usb_port'],
        isActive: true
      },
      {
        seatNumber: 'B1',
        section: 'B',
        status: 'available',
        floor: 1,
        type: 'premium',
        position: { x: 1, y: 0 },
        features: ['power_outlet', 'usb_port', 'adjustable_height'],
        isActive: true
      }
    ]);

    // Create sample student
    const student = await Student.create({
      name: 'John Doe',
      fatherName: 'Michael Doe',
      studentId: 'STD001',
      email: 'john.doe@example.com',
      phone: '1234567890',
      status: 'active'
    });

    // Create sample booking
    const booking = await Booking.create({
      user: adminUser._id,
      seat: seats[0]._id,
      startTime: new Date(),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      status: 'confirmed',
      bookingType: 'daily',
      price: {
        amount: 100,
        currency: 'INR'
      },
      paymentStatus: 'paid'
    });

    // Create sample payment
    await Payment.create({
      studentId: student._id,
      amount: 100,
      type: 'seat_booking',
      status: 'completed',
      paymentDate: new Date(),
      description: 'Daily seat booking payment'
    });

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await disconnectDB();
  }
};

initDatabase(); 