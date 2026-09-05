require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');
const workerRoutes = require('./routes/workerRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Service Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ service: 'User & Worker Management Service', status: 'healthy', port: PORT });
});

// Mount Routes
app.use('/', userRoutes);
app.use('/', workerRoutes);
app.use('/', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[User Service Unhandled Error]:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`👤 User & Worker Management Service listening on port ${PORT}`);
});

module.exports = app;
