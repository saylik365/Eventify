import { Router } from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  addCoHost,
  removeCoHost,
  inviteGuest,
  removeGuest,
  getMyEvents,
  getCohostEvents,
  getGuestEvents
} from '../controllers/eventController.js';
import auth from '../middleware/auth.js';
import { eventRole, isGuest, attachUserRole } from '../middleware/rbac.js';
import Report from '../models/Report.js';
import User from '../models/User.js';

const router = Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes
router.post('/', auth, createEvent);
router.put('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);
router.post('/:id/rsvp', isGuest, rsvpEvent);
router.post('/:id/cohosts', eventRole(['owner', 'coHost']), addCoHost);
router.delete('/:id/cohosts/:userId', eventRole(['owner', 'coHost']), removeCoHost);
router.put('/:id/add-cohost', eventRole(['owner']), addCoHost);
router.put('/:id/remove-cohost', eventRole(['owner']), removeCoHost);
router.put('/:id/invite-guest', eventRole(['owner', 'cohost']), inviteGuest);
router.put('/:id/remove-guest', eventRole(['owner', 'cohost']), removeGuest);
router.get('/mine', auth, getMyEvents);
router.get('/cohost', auth, getCohostEvents);
router.get('/guest', auth, getGuestEvents);

// Report an event or user
router.post('/reports', auth, async (req, res) => {
  const { type, targetId, reason } = req.body;
  if (!['user', 'event'].includes(type)) return res.status(400).json({ message: 'Invalid report type' });
  if (!targetId || !reason) return res.status(400).json({ message: 'Missing targetId or reason' });
  try {
    const report = new Report({
      type,
      targetId,
      reason,
      reporter: req.user.id,
    });
    await report.save();
    res.json({ message: 'Reported' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit report', error: err.message });
  }
});

// Public: Get all users (for user directory)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.use(attachUserRole);

export default router; 