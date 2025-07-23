import Event from '../models/Event.js';
import User from '../models/User.js';

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id || req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find event IDs the user has RSVP'd to
    const rsvpdEvents = await Event.find({ attendees: userId }, '_id location');
    const rsvpdEventIds = rsvpdEvents.map(e => e._id.toString());
    const attendedLocations = rsvpdEvents.map(e => e.location);

    // Use user's location if available, or attended locations
    const locationCriteria = [];
    if (user.location) locationCriteria.push(user.location);
    attendedLocations.forEach(loc => {
      if (loc && !locationCriteria.includes(loc)) locationCriteria.push(loc);
    });

    // Find events not RSVP'd by user, sorted by date, matching location
    const query = {
      attendees: { $ne: userId },
      ...(locationCriteria.length > 0 && { location: { $in: locationCriteria } })
    };
    const recommendedEvents = await Event.find(query)
      .sort({ date: 1 })
      .limit(5);

    res.json(recommendedEvents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 