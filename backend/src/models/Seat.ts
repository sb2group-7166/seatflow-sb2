import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true, unique: true },
  section: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['available', 'occupied', 'maintenance', 'reserved'],
    default: 'available'
  },
  floor: { type: Number, required: true },
  type: { 
    type: String,
    enum: ['standard', 'premium', 'vip'],
    default: 'standard'
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  features: [{
    type: String,
    enum: ['power_outlet', 'usb_port', 'adjustable_height', 'footrest']
  }],
  currentBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  isActive: { type: Boolean, default: true },
  lastMaintenance: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

seatSchema.index({ seatNumber: 1, section: 1 }, { unique: true });

export default mongoose.model('Seat', seatSchema); 