import mongoose, { Document, Schema } from 'mongoose';

export interface ISeat extends Document {
  seatNumber: string;
  status: 'available' | 'occupied' | 'maintenance';
  type: 'regular' | 'premium' | 'group';
  price: number;
  studentId?: mongoose.Types.ObjectId;
  bookingStart?: Date;
  bookingEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const seatSchema = new Schema<ISeat>({
  seatNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available'
  },
  type: {
    type: String,
    enum: ['regular', 'premium', 'group'],
    default: 'regular'
  },
  price: {
    type: Number,
    required: true
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  bookingStart: {
    type: Date
  },
  bookingEnd: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model<ISeat>('Seat', seatSchema); 