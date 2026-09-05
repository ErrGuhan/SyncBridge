require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const http = require('http');
const { Server } = require('socket.io');
const bookingRoutes = require('./routes/bookingRoutes');
const { initEmergencySocket } = require('./socket/emergencySocket');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3002;

// Initialize Socket.io with permissive CORS for microservices mesh
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

// Initialize real-time emergency dispatch engine
initEmergencySocket(io);

// Make io accessible to route handlers via req.app.get('io')
app.set('io', io);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Service Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'Booking & Geo-Matching Service',
    status: 'healthy',
    port: PORT,
    realTimeSockets: 'ACTIVE'
  });
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

server.listen(PORT, () => {
  console.log(`📅 Booking & Geo-Matching Service listening on port ${PORT}`);
  console.log(`⚡ Emergency Dispatch WebSockets listening on ws://localhost:${PORT}`);
});

module.exports = { app, server, io };

