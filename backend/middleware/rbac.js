import Event from '../models/Event.js';
import User from '../models/User.js';

// Global role middleware
export const isAdmin = async (req, res, next) => {
  // Check if user still exists and is admin
  const user = await User.findById(req.user.id);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  req.userRole = user.role;
  req.userId = user._id.toString();
  next();
};

// Event-level role utilities
export const isOwner = (event, userId) => event.owner.toString() === userId;
export const isCoHost = (event, userId) => event.coHosts.map(id => id.toString()).includes(userId);
export const isGuest = (event, userId) => event.guests.some(g => g.userId.toString() === userId);

// Composite event role middleware
export const eventRole = (roles) => async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  const userId = req.user._id.toString();
  const isAllowed = roles.some(role =>
    (role === 'owner' && event.owner.toString() === userId) ||
    (role === 'cohost' && event.coHosts.map(String).includes(userId)) ||
    (role === 'guest' && event.guests.map(String).includes(userId))
  );
  if (!isAllowed) return res.status(403).json({ message: 'Access denied' });
  next();
};

// Attach user role/id from JWT (assumes req.user is set by auth middleware)
export const attachUserRole = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(401).json({ message: 'User not found' });
  req.userRole = user.role;
  req.userId = user._id.toString();
  next();
}; 