import express from 'express';
import Payment from '../models/payment.model';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all payments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.find().populate('studentId');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments' });
  }
});

// Get payment by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('studentId');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment' });
  }
});

// Create new payment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: 'Error creating payment' });
  }
});

// Update payment status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: 'Error updating payment status' });
  }
});

// Get payments by student
router.get('/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.find({ studentId: req.params.studentId });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student payments' });
  }
});

// Get payment summary
router.get('/summary/monthly', authenticateToken, async (req, res) => {
  try {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const payments = await Payment.aggregate([
      {
        $match: {
          paymentDate: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth
          },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment summary' });
  }
});

export default router; 