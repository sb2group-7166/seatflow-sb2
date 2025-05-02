import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config';

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB successfully');

    const db = mongoose.connection.db;

    console.log('🌱 Seeding sample data...');

    // Create sample users
    const users = await db.collection('users').insertMany([
      {
        name: 'Staff User',
        email: 'staff@seatflow.com',
        password: await bcrypt.hash('staff123', 10),
        role: 'staff',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Manager User',
        email: 'manager@seatflow.com',
        password: await bcrypt.hash('manager123', 10),
        role: 'manager',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create sample financial records
    await db.collection('financials').insertMany([
      {
        type: 'payment',
        amount: 100.00,
        currency: 'USD',
        status: 'completed',
        paymentMethod: 'credit_card',
        reference: 'PAY001',
        description: 'Monthly subscription payment',
        studentId: new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'refund',
        amount: 50.00,
        currency: 'USD',
        status: 'completed',
        paymentMethod: 'bank_transfer',
        reference: 'REF001',
        description: 'Partial refund for cancellation',
        studentId: new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create sample operations
    await db.collection('operations').insertMany([
      {
        type: 'shift',
        status: 'completed',
        title: 'Morning Shift',
        description: 'Regular morning shift operations',
        assignedTo: users.insertedIds[0],
        startTime: new Date(),
        endTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'maintenance',
        status: 'pending',
        priority: 'high',
        title: 'System Maintenance',
        description: 'Regular system maintenance and updates',
        assignedTo: users.insertedIds[1],
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create sample reports
    await db.collection('reports').insertMany([
      {
        type: 'revenue',
        title: 'Monthly Revenue Report',
        description: 'Revenue analysis for current month',
        period: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date()
        },
        status: 'completed',
        format: 'pdf',
        generatedBy: users.insertedIds[1],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'attendance',
        title: 'Staff Attendance Report',
        description: 'Staff attendance analysis',
        period: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          end: new Date()
        },
        status: 'completed',
        format: 'excel',
        generatedBy: users.insertedIds[1],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('✅ Sample data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the seeding
seedDatabase(); 