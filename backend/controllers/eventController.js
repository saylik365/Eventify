import Event from '../models/Event.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location } = req.body;
    const eventDateTime = new Date(`${date}T${time}`);
    if (eventDateTime < new Date()) {
      return res.status(400).json({ message: 'Event date and time must be in the future.' });
    }
    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      owner: req.user._id,
      createdBy: req.user._id,
      coHosts: [],
      guests: [],
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Create Event Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 })
      .populate('owner', 'name email')
      .populate('coHosts', 'name email')
      .populate('guests.userId', 'name email');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id)
      .populate('owner', 'name email')
      .populate('coHosts', 'name email')
      .populate('guests.userId', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const updates = ['title', 'description', 'date', 'time', 'location'];
    updates.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const user = await User.findById(req.user.id);
    if (event.createdBy.toString() !== req.user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Delete Event Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addCoHost = async (req, res) => {
  const event = await Event.findById(req.params.id);
  const { userId } = req.body;
  if (!event) return res.status(404).json({ message: 'Event not found' });
  if (event.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Only owner can add co-hosts' });
  if ([event.owner.toString(), ...event.coHosts.map(String), ...event.guests.map(String)].includes(userId)) {
    return res.status(400).json({ message: 'User already has a role in this event' });
  }
  event.coHosts.push(userId);
  await event.save();
  res.json({ message: 'Co-host added', event });
};

export const removeCoHost = async (req, res) => {
  const event = await Event.findById(req.params.id);
  const { userId } = req.body;
  if (!event) return res.status(404).json({ message: 'Event not found' });
  if (event.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Only owner can remove co-hosts' });
  event.coHosts = event.coHosts.filter(id => id.toString() !== userId);
  await event.save();
  res.json({ message: 'Co-host removed', event });
};

export const inviteGuest = async (req, res) => {
  const event = await Event.findById(req.params.id);
  const { userId } = req.body;
  if (!event) return res.status(404).json({ message: 'Event not found' });
  const isOwner = event.owner.toString() === req.user._id.toString();
  const isCoHost = event.coHosts.map(String).includes(req.user._id.toString());
  if (!isOwner && !isCoHost) return res.status(403).json({ message: 'Only owner or co-host can invite guests' });
  if ([event.owner.toString(), ...event.coHosts.map(String), ...event.guests.map(String)].includes(userId)) {
    return res.status(400).json({ message: 'User already has a role in this event' });
  }
  event.guests.push(userId);
  await event.save();
  res.json({ message: 'Guest invited', event });
};

export const removeGuest = async (req, res) => {
  const event = await Event.findById(req.params.id);
  const { userId } = req.body;
  if (!event) return res.status(404).json({ message: 'Event not found' });
  const isOwner = event.owner.toString() === req.user._id.toString();
  const isCoHost = event.coHosts.map(String).includes(req.user._id.toString());
  if (!isOwner && !isCoHost) return res.status(403).json({ message: 'Only owner or co-host can remove guests' });
  event.guests = event.guests.filter(id => id.toString() !== userId);
  await event.save();
  res.json({ message: 'Guest removed', event });
};

export const rsvpEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  const guest = event.guests.find(g => g.userId.toString() === req.userId);
  if (!guest) return res.status(403).json({ message: 'You are not invited to this event' });
  const { rsvpStatus } = req.body;
  if (!['pending', 'accepted', 'declined'].includes(rsvpStatus)) {
    return res.status(400).json({ message: 'Invalid RSVP status' });
  }
  guest.rsvpStatus = rsvpStatus;
  await event.save();
  res.json({ message: 'RSVP updated', event });
};

export const getMyEvents = async (req, res) => {
  try {
    console.log('req.user:', req.user); // <--- Add this line
    const events = await Event.find({ owner: req.user._id })
      .populate('owner', 'name email')
      .populate('coHosts', 'name email')
      .populate('guests', 'name email');
    res.json(events);
  } catch (err) {
    console.error('getMyEvents error:', err); // <--- This should print the error
    res.status(500).json({ message: 'Failed to fetch owned events', error: err.message });
  }
};

export const getCohostEvents = async (req, res) => {
  try {
    const events = await Event.find({ coHosts: req.user._id })
      .populate('owner', 'name email')
      .populate('coHosts', 'name email')
      .populate('guests', 'name email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch co-host events', error: err.message });
  }
};

export const getGuestEvents = async (req, res) => {
  try {
    const events = await Event.find({ 'guests.userId': req.user._id })
      .populate('owner', 'name email')
      .populate('coHosts', 'name email')
      .populate('guests.userId', 'name email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch guest events', error: err.message });
  }
}; 