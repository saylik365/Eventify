import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// Public: Get all users (for user directory)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'name email role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

export default router; 