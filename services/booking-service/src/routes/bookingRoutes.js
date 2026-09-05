const express = require('express');
const { body, query } = require('express-validator');
const {
  createBooking,
  getNearbyWorkers,
  respondToBooking,
  updateBookingStatus,
  getBookingById,
  getDemandForecast
} = require('../controllers/bookingController');
const { extractUser, requireRole } = require('../middleware/auth');

const router = express.Router();

// 1. Fetch available workers matching Category within radius (Public or authenticated)
router.get(
  '/workers/nearby',
  [
    query('categoryId').notEmpty().withMessage('categoryId is required'),
    query('lat').isFloat({ min: -90, max: 90 }).withMessage('Valid lat is required'),
    query('lng').isFloat({ min: -180, max: 180 }).withMessage('Valid lng is required')
  ],
  getNearbyWorkers
);

// 1b. AI Demand Forecasting Route for Cooperative Admin & Worker Surge Alerts
router.get('/demand-forecast', getDemandForecast);

// All following routes require authenticated user context from Gateway
router.use(extractUser);

// 2. Create a new booking request from a customer
router.post(
  '/',
  requireRole('CUSTOMER'),
  [
    body('serviceCategoryId').notEmpty().withMessage('Service category is required'),
    body('scheduledDate').isISO8601().withMessage('Valid scheduled date is required'),
    body('serviceAddressLine1').notEmpty().withMessage('Service address is required'),
    body('serviceLatitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
    body('serviceLongitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
    body('totalAmount').isFloat({ gt: 0 }).withMessage('Total amount must be greater than 0')
  ],
  createBooking
);

// 3. Worker Accept or Decline pending booking
router.patch(
  '/:id/respond',
  requireRole('WORKER'),
  [
    body('action').isIn(['ACCEPT', 'DECLINE']).withMessage('Action must be ACCEPT or DECLINE')
  ],
  respondToBooking
);

// 4. Update Booking Status (Pending -> Confirmed -> In Progress -> Completed)
router.patch(
  '/:id/status',
  [
    body('status').isIn(['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED'])
      .withMessage('Invalid target status')
  ],
  updateBookingStatus
);

// 5. Get Booking by ID
router.get('/:id', getBookingById);

module.exports = router;
