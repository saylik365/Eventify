import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOtp } from '../utils/sendOtp.js';
import Event from '../models/Event.js';

// Helper to generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const registerUser = async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const user = new User({ name, email, password: hashedPassword, otp, role });
    await user.save();
    await sendOtp(email, otp);
    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP or email' });
    }
    user.isVerified = true;
    user.otp = undefined;
    await user.save();
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: 'User not found or not verified' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const promoteUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'admin') return res.status(400).json({ message: 'User is already an admin' });
  user.role = 'admin';
  await user.save();
  res.json({ message: 'User promoted to admin', user });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(401).json({ message: 'User not found' });
    // Find events where user is owner, cohost, or guest
    const [ownerOf, cohostOf, guestOf] = await Promise.all([
      Event.find({ owner: user._id }).select('_id'),
      Event.find({ coHosts: user._id }).select('_id'),
      Event.find({ 'guests.userId': user._id }).select('_id'),
    ]);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      ownerOf: ownerOf.map(e => e._id),
      cohostOf: cohostOf.map(e => e._id),
      guestOf: guestOf.map(e => e._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 