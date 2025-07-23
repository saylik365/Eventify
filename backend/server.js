import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import eventRoutes from './routes/eventRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/adminRoutes.js';
import usersRoutes from './routes/users.js';

// Load environment variables from .env
dotenv.config();
// console.log("DEBUG MONGO_URI:", process.env.MONGO_URI);

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Change this if your frontend runs on a different port
  credentials: true,
}));
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRoutes);

// Test route
app.get('/api/health', (req, res) => {
  res.send('API is running...');
});

// Read PORT and MONGO_URI from .env
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Error: MONGO_URI not set in .env');
  process.exit(1);
}

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
