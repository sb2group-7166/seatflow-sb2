import express from 'express';
import {
  getOperationsSummary,
  getShiftSchedule,
  updateShiftSchedule,
  getStaffAssignments,
  updateStaffAssignments,
  getMaintenanceTasks,
  createMaintenanceTask,
  updateMaintenanceTask,
  getSystemAlerts,
  acknowledgeAlert,
  getOperationLogs
} from '../controllers/operationController';
import { validateOperation } from '../middleware/validation';
import { authorize } from '../middleware/auth';

const router = express.Router();

// Operations summary
router.get('/summary', getOperationsSummary);

// Shift management
router.get('/shifts', getShiftSchedule);
router.put('/shifts', validateOperation, authorize(['admin', 'manager']), updateShiftSchedule);

// Staff assignments
router.get('/assignments', getStaffAssignments);
router.put('/assignments', validateOperation, authorize(['admin', 'manager']), updateStaffAssignments);

// Maintenance tasks
router.get('/maintenance', getMaintenanceTasks);
router.post('/maintenance', validateOperation, authorize(['admin', 'manager']), createMaintenanceTask);
router.put('/maintenance/:id', validateOperation, authorize(['admin', 'manager']), updateMaintenanceTask);

// System alerts
router.get('/alerts', getSystemAlerts);
router.put('/alerts/:id/acknowledge', authorize(['admin', 'manager']), acknowledgeAlert);

// Operation logs
router.get('/logs', authorize(['admin']), getOperationLogs);

export default router; 