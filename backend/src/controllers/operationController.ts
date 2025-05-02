import { Request, Response } from 'express';
import Operation from '../models/operation.model';
import { validationResult } from 'express-validator';

// Get operations summary
export const getOperationsSummary = async (req: Request, res: Response) => {
  try {
    const summary = await Operation.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
          },
          failed: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching operations summary', error });
  }
};

// Get shift schedule
export const getShiftSchedule = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query: any = { type: 'shift' };
    if (startDate && endDate) {
      query.startTime = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const shifts = await Operation.find(query)
      .populate('assignedTo', 'name email')
      .sort({ startTime: 1 });

    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shift schedule', error });
  }
};

// Update shift schedule
export const updateShiftSchedule = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { shifts } = req.body;
    const operations = [];

    for (const shift of shifts) {
      const operation = await Operation.findByIdAndUpdate(
        shift._id,
        { ...shift, type: 'shift' },
        { new: true, runValidators: true }
      );
      operations.push(operation);
    }

    res.json(operations);
  } catch (error) {
    res.status(500).json({ message: 'Error updating shift schedule', error });
  }
};

// Get staff assignments
export const getStaffAssignments = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    
    const query: any = { type: 'shift' };
    if (date) {
      const startDate = new Date(date as string);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      query.startTime = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const assignments = await Operation.find(query)
      .populate('assignedTo', 'name email')
      .sort({ startTime: 1 });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff assignments', error });
  }
};

// Update staff assignments
export const updateStaffAssignments = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { assignments } = req.body;
    const operations = [];

    for (const assignment of assignments) {
      const operation = await Operation.findByIdAndUpdate(
        assignment._id,
        { assignedTo: assignment.assignedTo },
        { new: true, runValidators: true }
      );
      operations.push(operation);
    }

    res.json(operations);
  } catch (error) {
    res.status(500).json({ message: 'Error updating staff assignments', error });
  }
};

// Get maintenance tasks
export const getMaintenanceTasks = async (req: Request, res: Response) => {
  try {
    const { status, priority } = req.query;
    
    const query: any = { type: 'maintenance' };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Operation.find(query)
      .populate('assignedTo', 'name email')
      .sort({ priority: -1, startTime: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching maintenance tasks', error });
  }
};

// Create maintenance task
export const createMaintenanceTask = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = new Operation({
      ...req.body,
      type: 'maintenance'
    });
    await task.save();

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating maintenance task', error });
  }
};

// Update maintenance task
export const updateMaintenanceTask = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Operation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating maintenance task', error });
  }
};

// Get system alerts
export const getSystemAlerts = async (req: Request, res: Response) => {
  try {
    const { status, priority } = req.query;
    
    const query: any = { type: 'alert' };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const alerts = await Operation.find(query)
      .sort({ priority: -1, createdAt: -1 });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system alerts', error });
  }
};

// Acknowledge alert
export const acknowledgeAlert = async (req: Request, res: Response) => {
  try {
    const alert = await Operation.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Error acknowledging alert', error });
  }
};

// Get operation logs
export const getOperationLogs = async (req: Request, res: Response) => {
  try {
    const { type, status, startDate, endDate, page = 1, limit = 50 } = req.query;
    
    const query: any = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const logs = await Operation.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('assignedTo', 'name email');

    const total = await Operation.countDocuments(query);

    res.json({
      logs,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching operation logs', error });
  }
}; 