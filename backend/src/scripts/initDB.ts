import mongoose from 'mongoose';
import { config } from '../config';

async function initializeDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB successfully');

    // Create collections with indexes
    const db = mongoose.connection.db;

    console.log('📦 Creating collections and indexes...');

    // Users collection
    await db.createCollection('users');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });

    // Financial collection
    await db.createCollection('financials');
    await db.collection('financials').createIndex({ createdAt: 1 });
    await db.collection('financials').createIndex({ status: 1 });
    await db.collection('financials').createIndex({ studentId: 1 });
    await db.collection('financials').createIndex({ type: 1 });

    // Operations collection
    await db.createCollection('operations');
    await db.collection('operations').createIndex({ startTime: 1 });
    await db.collection('operations').createIndex({ endTime: 1 });
    await db.collection('operations').createIndex({ type: 1 });
    await db.collection('operations').createIndex({ status: 1 });
    await db.collection('operations').createIndex({ assignedTo: 1 });

    // Reports collection
    await db.createCollection('reports');
    await db.collection('reports').createIndex({ createdAt: 1 });
    await db.collection('reports').createIndex({ type: 1 });
    await db.collection('reports').createIndex({ status: 1 });
    await db.collection('reports').createIndex({ generatedBy: 1 });

    // Create default admin user if not exists
    const adminExists = await db.collection('users').findOne({ role: 'admin' });
    if (!adminExists) {
      await db.collection('users').insertOne({
        name: 'Admin',
        email: 'admin@seatflow.com',
        password: '$2a$10$YourHashedPasswordHere', // Remember to change this
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('👤 Created default admin user');
    }

    console.log('✅ Database initialization completed successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the initialization
initializeDatabase(); 