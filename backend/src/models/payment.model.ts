import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  studentId: mongoose.Types.ObjectId;
  amount: number;
  type: 'seat_booking' | 'late_fee' | 'membership';
  status: 'pending' | 'completed' | 'failed';
  paymentDate: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['seat_booking', 'late_fee', 'membership'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model<IPayment>('Payment', paymentSchema); 