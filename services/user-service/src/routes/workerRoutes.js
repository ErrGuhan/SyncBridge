const express = require('express');
const { body } = require('express-validator');
const {
  registerWorker,
  updateWorkerStatus,
  addCertification,
  getWorkerProfile
} = require('../controllers/workerController');
const { extractUser, requireRole } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const workerRegistrationValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required for worker verification'),
  body('hourlyRate').optional().isNumeric().withMessage('Hourly rate must be a valid number'),
  body('latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
];

// Public registration endpoint
router.post('/register/worker', workerRegistrationValidation, registerWorker);

// Authenticated worker actions
router.get('/workers/me', extractUser, requireRole('WORKER'), getWorkerProfile);
router.patch('/workers/me/status', extractUser, requireRole('WORKER'), updateWorkerStatus);
router.post('/workers/me/certifications', extractUser, requireRole('WORKER'), addCertification);

module.exports = router;
