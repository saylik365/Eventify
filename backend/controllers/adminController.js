import User from '../models/User.js';
import Event from '../models/Event.js';
import mongoose from 'mongoose';

export const getAdminStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const events = await Event.countDocuments();
    const rsvps = await Event.aggregate([{ $unwind: '$attendees' }, { $count: 'total' }]);
    res.json({
      users,
      events,
      rsvps: rsvps[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

export const getAdminReports = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    // Count active RSVPs (attendees with status === 'active')
    const events = await Event.find({}, 'attendees');
    let activeRsvps = 0;
    events.forEach(event => {
      if (event.attendees && Array.isArray(event.attendees)) {
        activeRsvps += event.attendees.filter(a => a.status === 'active').length;
      }
    });
    res.json({ totalUsers, totalEvents, activeRsvps });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reports', error: err.message });
  }
};

export const flagEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { flagged: true }, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event flagged', event });
  } catch (error) {
    console.error('Flag Event Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const featureEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { featured: true }, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event featured', event });
  } catch (error) {
    console.error('Feature Event Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const warnUser = async (req, res) => {
  try {
    // Placeholder: implement warning logic if needed
    res.json({ message: 'User warned (placeholder)' });
  } catch (error) {
    console.error('Warn User Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deactivated', user });
  } catch (error) {
    console.error('Deactivate User Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserEvents = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const objectId = mongoose.Types.ObjectId.isValid(ownerId) ? mongoose.Types.ObjectId(ownerId) : ownerId;
    const events = await Event.find({ owner: objectId });
    res.json(events);
  } catch (error) {
    console.error('Get User Events Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const demoteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = 'user';
    await user.save();
    res.json({ message: 'User demoted to user', user });
  } catch (error) {
    console.error('Demote User Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 