require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Service Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ service: 'Payment & Welfare Split Service', status: 'healthy', port: PORT });
});

// Mount Routes
app.use('/', paymentRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Payment Service Unhandled Error]:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`💳 Payment & Welfare Split Service listening on port ${PORT}`);
});

module.exports = app;
