import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  type: 'attendance' | 'revenue' | 'utilization' | 'activity' | 'trends' | 'performance' | 'custom';
  title: string;
  description: string;
  period: {
    start: Date;
    end: Date;
  };
  filters: {
    [key: string]: any;
  };
  data: {
    [key: string]: any;
  };
  format: 'json' | 'csv' | 'pdf' | 'excel';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  generatedBy: mongoose.Types.ObjectId;
  downloadUrl?: string;
  metadata: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ['attendance', 'revenue', 'utilization', 'activity', 'trends', 'performance', 'custom'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  period: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  filters: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  },
  data: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  },
  format: {
    type: String,
    enum: ['json', 'csv', 'pdf', 'excel'],
    default: 'json'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  generatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  downloadUrl: {
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
ReportSchema.index({ type: 1 });
ReportSchema.index({ status: 1 });
ReportSchema.index({ 'period.start': 1, 'period.end': 1 });
ReportSchema.index({ generatedBy: 1 });

// Virtual for report duration
ReportSchema.virtual('duration').get(function() {
  return Math.round((this.period.end.getTime() - this.period.start.getTime()) / (1000 * 60 * 60 * 24));
});

// Methods
ReportSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.duration = this.duration;
  return obj;
};

export default mongoose.model<IReport>('Report', ReportSchema); 