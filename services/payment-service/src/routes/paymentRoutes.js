const express = require('express');
const { body } = require('express-validator');
const { processBookingPayment, getPaymentReceipt } = require('../controllers/paymentController');
const { extractUser, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(extractUser);

// Process completed booking payment (80% Worker, 15% Coop Admin, 5% Worker Welfare)
router.post(
  '/process',
  [
    body('bookingId').notEmpty().withMessage('bookingId is required'),
    body('amount').optional().isFloat({ gt: 0 }).withMessage('Amount must be positive'),
    body('paymentMethod').optional().isIn(['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'DIGITAL_WALLET', 'COOP_CREDITS'])
  ],
  processBookingPayment
);

// Fetch transaction receipt
router.get('/receipt/:identifier', getPaymentReceipt);

module.exports = router;
