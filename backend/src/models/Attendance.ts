import { Schema, model, Document } from 'mongoose';

export interface IAttendance extends Document {
  studentId: Schema.Types.ObjectId;
  date: Date;
  status: 'present' | 'absent' | 'late';
  checkInTime?: Date;
  checkOutTime?: Date;
  activities: {
    type: 'check-in' | 'check-out';
    timestamp: Date;
    location?: string;
  }[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      required: true,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    activities: [{
      type: {
        type: String,
        enum: ['check-in', 'check-out'],
        required: true,
      },
      timestamp: {
        type: Date,
        required: true,
      },
      location: {
        type: String,
      },
    }],
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

export const Attendance = model<IAttendance>('Attendance', attendanceSchema); 