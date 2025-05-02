import express from 'express';
import financialRoutes from './financial.routes';
import systemRoutes from './system.routes';
import operationRoutes from './operation.routes';
import reportRoutes from './report.routes';
import authRoutes from './auth.routes';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/financial', authenticate, financialRoutes);
router.use('/system', authenticate, systemRoutes);
router.use('/operation', authenticate, operationRoutes);
router.use('/report', authenticate, reportRoutes);

export default router; 