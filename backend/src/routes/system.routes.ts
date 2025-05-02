import express from 'express';
import {
  getSystemSettings,
  updateSystemSettings,
  getSystemLogs,
  getSystemStatus,
  updateMaintenanceMode,
  getBackupStatus,
  createBackup,
  restoreBackup,
  getSystemMetrics
} from '../controllers/systemController';
import { validateSystemSettings } from '../middleware/validation';
import { authorize } from '../middleware/auth';

const router = express.Router();

// System settings
router.get('/settings', getSystemSettings);
router.put('/settings', validateSystemSettings, authorize(['admin']), updateSystemSettings);

// System status and metrics
router.get('/status', getSystemStatus);
router.get('/metrics', getSystemMetrics);

// Maintenance mode
router.put('/maintenance', authorize(['admin']), updateMaintenanceMode);

// System logs
router.get('/logs', authorize(['admin']), getSystemLogs);

// Backup management
router.get('/backup', authorize(['admin']), getBackupStatus);
router.post('/backup', authorize(['admin']), createBackup);
router.post('/backup/restore', authorize(['admin']), restoreBackup);

export default router; 