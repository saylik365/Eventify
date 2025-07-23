import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  type: { type: String, enum: ['user', 'event'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  reason: { type: String, required: true },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  time: { type: Date, default: Date.now },
});

const Report = mongoose.model('Report', reportSchema);
export default Report; 