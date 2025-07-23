import mongoose from 'mongoose';

const attendeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  attendees: [attendeeSchema],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coHosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  guests: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rsvpStatus: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
  }],
  flagged: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event; 