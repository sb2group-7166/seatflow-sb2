import mongoose, { Schema, Document } from 'mongoose';

export interface IOperation extends Document {
  type: 'shift' | 'maintenance' | 'alert' | 'log';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  assignedTo: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  location?: string;
  notes?: string;
  metadata: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OperationSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ['shift', 'maintenance', 'alert', 'log'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number // in minutes
  },
  location: {
    type: String
  },
  notes: {
    type: String
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
OperationSchema.index({ type: 1 });
OperationSchema.index({ status: 1 });
OperationSchema.index({ priority: 1 });
OperationSchema.index({ assignedTo: 1 });
OperationSchema.index({ startTime: 1 });

// Virtual for duration calculation
OperationSchema.virtual('calculatedDuration').get(function() {
  if (this.endTime && this.startTime) {
    return Math.round((this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60));
  }
  return null;
});

// Pre-save middleware to calculate duration
OperationSchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    this.duration = this.calculatedDuration;
  }
  next();
});

// Methods
OperationSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.duration = this.calculatedDuration;
  return obj;
};

export default mongoose.model<IOperation>('Operation', OperationSchema); 