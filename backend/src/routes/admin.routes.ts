import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

export const adminRoutes = Router();

adminRoutes.use(authMiddleware, requireRole('ADMIN'));

adminRoutes.get('/stats', AdminController.stats);
adminRoutes.get('/users', AdminController.listUsers);
adminRoutes.post('/users/:id/deactivate', AdminController.deactivateUser);
adminRoutes.get('/audit-logs', AdminController.auditLogs);
