import { Router } from 'express';
import { 
  getAdminStats, getAdminUsers, getAdminReports,
  flagEvent, featureEvent, warnUser, deactivateUser, deleteUser, getUserEvents, demoteUser
} from '../controllers/adminController.js';
import { isAdmin, attachUserRole } from '../middleware/rbac.js';
import auth from '../middleware/auth.js';
import Report from '../models/Report.js';

const router = Router();

router.get('/stats', auth, attachUserRole, isAdmin, getAdminStats);
router.get('/users', auth, attachUserRole, isAdmin, getAdminUsers);
router.get('/reports', auth, attachUserRole, isAdmin, async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'name email')
      .sort({ time: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reports', error: err.message });
  }
});

// Admin actions
router.post('/events/:id/flag', auth, attachUserRole, isAdmin, flagEvent);
router.post('/events/:id/feature', auth, attachUserRole, isAdmin, featureEvent);
router.post('/users/:id/warn', auth, attachUserRole, isAdmin, warnUser);
router.patch('/users/:id/deactivate', auth, attachUserRole, isAdmin, deactivateUser);
router.delete('/users/:id', auth, attachUserRole, isAdmin, deleteUser);
router.get('/users/:id/events', auth, attachUserRole, isAdmin, getUserEvents);
router.post('/demote/:id', auth, attachUserRole, isAdmin, demoteUser);

export default router; 