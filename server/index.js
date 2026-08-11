const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const biodataRoutes = require('./routes/biodata');
const contactRequestRoutes = require('./routes/contactRequest');
const favoriteRoutes = require('./routes/favorites');
const successStoryRoutes = require('./routes/successStory');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payment');
const statsRoutes = require('./routes/stats');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:5174',
      /\.netlify\.app$/,  // Allow all Netlify preview/production URLs
      /\.vercel\.app$/    // Allow Vercel preview URLs if needed
    ];

    const isAllowed = allowedOrigins.some(pattern => {
      if (pattern instanceof RegExp) {
        return pattern.test(origin);
      }
      return pattern === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/biodata', biodataRoutes);
app.use('/api/contact-requests', contactRequestRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/recently-viewed', require('./routes/recentlyViewed'));
app.use('/api/success-stories', successStoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/contact-messages', require('./routes/contactMessage'));
app.use('/api/reports', require('./routes/report'));
app.use('/api/notifications', require('./routes/notification'));
app.use('/api/messages', require('./routes/message'));
app.use('/api/matches', require('./routes/match'));
app.use('/api/profile-views', require('./routes/profileView'));
app.use('/api/subscriptions', require('./routes/subscription'));
app.use('/api/wali', require('./routes/wali'));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Islamic Matrimony API Server',
    status: 'Running',
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
});

module.exports = app;
