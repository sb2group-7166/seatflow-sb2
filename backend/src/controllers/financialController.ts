import { Request, Response } from 'express';
import Financial from '../models/financial.model';
import { validationResult } from 'express-validator';

// Get financial summary
export const getFinancialSummary = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query: any = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const summary = await Financial.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          averageAmount: { $avg: '$amount' }
        }
      }
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching financial summary', error });
  }
};

// Get revenue report
export const getRevenueReport = async (req: Request, res: Response) => {
  try {
    const { period = 'month' } = req.query;
    
    const groupBy = period === 'day' ? '$dayOfMonth' : 
                   period === 'week' ? '$week' : 
                   period === 'month' ? '$month' : '$year';

    const report = await Financial.aggregate([
      {
        $match: {
          type: 'payment',
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            [groupBy]: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          totalRevenue: { $sum: '$amount' },
          transactionCount: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          [`_id.${groupBy}`]: 1
        }
      }
    ]);

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating revenue report', error });
  }
};

// Get payment history
export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const { studentId, status, type, page = 1, limit = 10 } = req.query;
    
    const query: any = {};
    if (studentId) query.studentId = studentId;
    if (status) query.status = status;
    if (type) query.type = type;

    const payments = await Financial.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('studentId', 'name email');

    const total = await Financial.countDocuments(query);

    res.json({
      payments,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment history', error });
  }
};

// Create payment
export const createPayment = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const payment = new Financial(req.body);
    await payment.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment', error });
  }
};

// Get payment by ID
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const payment = await Financial.findById(req.params.id)
      .populate('studentId', 'name email')
      .populate('bookingId');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment', error });
  }
};

// Update payment
export const updatePayment = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const payment = await Financial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment', error });
  }
};

// Delete payment
export const deletePayment = async (req: Request, res: Response) => {
  try {
    const payment = await Financial.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment', error });
  }
};

// Get payment methods
export const getPaymentMethods = async (req: Request, res: Response) => {
  try {
    const methods = await Financial.distinct('paymentMethod');
    res.json(methods);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment methods', error });
  }
};

// Get payment statistics
export const getPaymentStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await Financial.aggregate([
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          averageAmount: { $avg: '$amount' },
          successRate: {
            $avg: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json(stats[0] || {
      totalPayments: 0,
      totalAmount: 0,
      averageAmount: 0,
      successRate: 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment statistics', error });
  }
}; 