import { Router } from 'express';
import { registerUser, verifyOtp, loginUser, promoteUser, getMe } from '../controllers/authController.js';
import { isAdmin, attachUserRole } from '../middleware/rbac.js';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginUser);
router.post('/promote/:userId', isAdmin, promoteUser);
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

export default router; 