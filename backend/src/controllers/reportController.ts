import { Request, Response } from 'express';
import Report from '../models/report.model';
import { validationResult } from 'express-validator';
import Financial from '../models/financial.model';
import Operation from '../models/operation.model';
import { generatePDF, generateExcel, generateCSV } from '../utils/reportGenerator';

// Get report types
export const getReportTypes = async (req: Request, res: Response) => {
  try {
    const types = await Report.distinct('type');
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report types', error });
  }
};

// Generate report
export const generateReport = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, period, filters, format = 'json' } = req.body;
    let data;

    switch (type) {
      case 'revenue':
        data = await generateRevenueReport(period, filters);
        break;
      case 'attendance':
        data = await generateAttendanceReport(period, filters);
        break;
      case 'utilization':
        data = await generateUtilizationReport(period, filters);
        break;
      case 'activity':
        data = await generateActivityReport(period, filters);
        break;
      case 'trends':
        data = await generateTrendsReport(period, filters);
        break;
      case 'performance':
        data = await generatePerformanceReport(period, filters);
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    const report = new Report({
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
      description: `Report generated for ${period.start} to ${period.end}`,
      period,
      filters,
      data,
      format,
      status: 'completed',
      generatedBy: req.user?._id || 'system'
    });

    await report.save();

    // Generate file if needed
    if (format !== 'json') {
      const filePath = await generateReportFile(report, format);
      report.downloadUrl = filePath;
      await report.save();
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error });
  }
};

// Get report by ID
export const getReportById = async (req: Request, res: Response) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('generatedBy', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report', error });
  }
};

// Get report history
export const getReportHistory = async (req: Request, res: Response) => {
  try {
    const { type, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    const query: any = {};
    if (type) query.type = type;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('generatedBy', 'name email');

    const total = await Report.countDocuments(query);

    res.json({
      reports,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report history', error });
  }
};

// Delete report
export const deleteReport = async (req: Request, res: Response) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Delete associated file if exists
    if (report.downloadUrl) {
      // Add file deletion logic here
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting report', error });
  }
};

// Helper functions for report generation
async function generateRevenueReport(period: { start: Date; end: Date }, filters: any) {
  const query: any = {
    createdAt: {
      $gte: new Date(period.start),
      $lte: new Date(period.end)
    }
  };

  if (filters.paymentMethod) {
    query.paymentMethod = filters.paymentMethod;
  }

  const revenue = await Financial.aggregate([
    { $match: query },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return revenue;
}

async function generateAttendanceReport(period: { start: Date; end: Date }, filters: any) {
  const query: any = {
    type: 'shift',
    startTime: {
      $gte: new Date(period.start),
      $lte: new Date(period.end)
    }
  };

  if (filters.assignedTo) {
    query.assignedTo = filters.assignedTo;
  }

  const attendance = await Operation.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$assignedTo',
        totalShifts: { $sum: 1 },
        completedShifts: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        name: '$user.name',
        email: '$user.email',
        totalShifts: 1,
        completedShifts: 1,
        attendanceRate: {
          $multiply: [
            { $divide: ['$completedShifts', '$totalShifts'] },
            100
          ]
        }
      }
    }
  ]);

  return attendance;
}

async function generateUtilizationReport(period: { start: Date; end: Date }, filters: any) {
  // Implementation depends on your seat/space utilization data model
  // This is a placeholder implementation
  return {
    period,
    filters,
    utilization: []
  };
}

async function generateActivityReport(period: { start: Date; end: Date }, filters: any) {
  const query: any = {
    createdAt: {
      $gte: new Date(period.start),
      $lte: new Date(period.end)
    }
  };

  if (filters.type) {
    query.type = filters.type;
  }

  const activities = await Operation.aggregate([
    { $match: query },
    {
      $group: {
        _id: {
          type: '$type',
          status: '$status'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.type',
        statuses: {
          $push: {
            status: '$_id.status',
            count: '$count'
          }
        },
        total: { $sum: '$count' }
      }
    }
  ]);

  return activities;
}

async function generateTrendsReport(period: { start: Date; end: Date }, filters: any) {
  // Implementation depends on your specific trend analysis requirements
  // This is a placeholder implementation
  return {
    period,
    filters,
    trends: []
  };
}

async function generatePerformanceReport(period: { start: Date; end: Date }, filters: any) {
  // Implementation depends on your performance metrics
  // This is a placeholder implementation
  return {
    period,
    filters,
    performance: []
  };
}

async function generateReportFile(report: any, format: string): Promise<string> {
  let filePath = '';
  
  switch (format) {
    case 'pdf':
      filePath = await generatePDF(report);
      break;
    case 'excel':
      filePath = await generateExcel(report);
      break;
    case 'csv':
      filePath = await generateCSV(report);
      break;
  }

  return filePath;
} 