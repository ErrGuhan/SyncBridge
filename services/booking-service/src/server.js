require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Service Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ service: 'Booking & Geo-Matching Service', status: 'healthy', port: PORT });
});

// Mount Routes
app.use('/', bookingRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Booking Service Unhandled Error]:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`📅 Booking & Geo-Matching Service listening on port ${PORT}`);
});

module.exports = app;
