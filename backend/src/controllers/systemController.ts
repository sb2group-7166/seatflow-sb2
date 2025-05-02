import { Request, Response } from 'express';
import SystemSettings from '../models/system.model';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Get system settings
export const getSystemSettings = async (req: Request, res: Response) => {
  try {
    const settings = await SystemSettings.findOne().sort({ createdAt: -1 });
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system settings', error });
  }
};

// Update system settings
export const updateSystemSettings = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const settings = await SystemSettings.findOneAndUpdate(
      {},
      { ...req.body, updatedBy: req.user?._id || 'system' },
      { new: true, upsert: true }
    );

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating system settings', error });
  }
};

// Get system logs
export const getSystemLogs = async (req: Request, res: Response) => {
  try {
    const { type = 'error', limit = 100 } = req.query;
    const logPath = path.join(__dirname, '../../logs', `${type}.log`);

    if (!fs.existsSync(logPath)) {
      return res.json([]);
    }

    const logs = fs.readFileSync(logPath, 'utf-8')
      .split('\n')
      .filter(line => line.trim())
      .slice(-Number(limit))
      .map(line => JSON.parse(line));

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system logs', error });
  }
};

// Get system status
export const getSystemStatus = async (req: Request, res: Response) => {
  try {
    const settings = await SystemSettings.findOne().sort({ createdAt: -1 });
    const status = {
      maintenanceMode: settings?.maintenanceMode || false,
      lastBackup: settings?.lastBackup,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    };

    res.json(status);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system status', error });
  }
};

// Update maintenance mode
export const updateMaintenanceMode = async (req: Request, res: Response) => {
  try {
    const { maintenanceMode, message } = req.body;

    const settings = await SystemSettings.findOneAndUpdate(
      {},
      {
        maintenanceMode,
        maintenanceMessage: message || 'System is under maintenance. Please try again later.',
        updatedBy: req.user?._id || 'system'
      },
      { new: true, upsert: true }
    );

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating maintenance mode', error });
  }
};

// Get backup status
export const getBackupStatus = async (req: Request, res: Response) => {
  try {
    const settings = await SystemSettings.findOne().sort({ createdAt: -1 });
    const backupDir = path.join(__dirname, '../../backups');

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backups = fs.readdirSync(backupDir)
      .filter(file => file.endsWith('.gz'))
      .map(file => ({
        name: file,
        size: fs.statSync(path.join(backupDir, file)).size,
        date: fs.statSync(path.join(backupDir, file)).mtime
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    res.json({
      lastBackup: settings?.lastBackup,
      backupFrequency: settings?.backupFrequency,
      backups
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching backup status', error });
  }
};

// Create backup
export const createBackup = async (req: Request, res: Response) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `backup-${timestamp}.gz`;
    const backupPath = path.join(__dirname, '../../backups', backupName);

    const { stdout, stderr } = await execAsync(
      `mongodump --uri="${process.env.MONGODB_URI}" --archive="${backupPath}" --gzip`
    );

    if (stderr) {
      throw new Error(stderr);
    }

    await SystemSettings.findOneAndUpdate(
      {},
      { lastBackup: new Date() },
      { upsert: true }
    );

    res.json({ message: 'Backup created successfully', backupName });
  } catch (error) {
    res.status(500).json({ message: 'Error creating backup', error });
  }
};

// Restore backup
export const restoreBackup = async (req: Request, res: Response) => {
  try {
    const { backupName } = req.body;
    const backupPath = path.join(__dirname, '../../backups', backupName);

    if (!fs.existsSync(backupPath)) {
      return res.status(404).json({ message: 'Backup file not found' });
    }

    const { stdout, stderr } = await execAsync(
      `mongorestore --uri="${process.env.MONGODB_URI}" --archive="${backupPath}" --gzip --drop`
    );

    if (stderr) {
      throw new Error(stderr);
    }

    res.json({ message: 'Backup restored successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error restoring backup', error });
  }
};

// Get system metrics
export const getSystemMetrics = async (req: Request, res: Response) => {
  try {
    const metrics = {
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      uptime: process.uptime(),
      version: process.version,
      platform: process.platform,
      arch: process.arch
    };

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system metrics', error });
  }
}; 