import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  fatherName: string;
  studentId: string;
  email: string;
  phone: string;
  profilePhoto?: string;
  idProof?: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  fatherName: {
    type: String,
    required: [true, 'Father\'s/Husband\'s name is required'],
    trim: true
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  profilePhoto: {
    type: String,
    default: null
  },
  idProof: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'suspended'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export const Student = mongoose.model<IStudent>('Student', studentSchema); 