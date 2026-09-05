const express = require('express');
const { body } = require('express-validator');
const { registerCustomer, getCustomerProfile } = require('../controllers/userController');
const { extractUser } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const customerRegistrationValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number')
];

// Public registration
router.post('/register/customer', customerRegistrationValidation, registerCustomer);

// Authenticated customer routes
router.get('/profile/customer', extractUser, getCustomerProfile);
router.get('/profile/customer/:id', extractUser, getCustomerProfile);

module.exports = router;
