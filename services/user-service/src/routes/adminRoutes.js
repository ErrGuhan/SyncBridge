const express = require('express');
const { body } = require('express-validator');
const { verifyWorkerProfile, getPendingWorkers } = require('../controllers/adminController');
const { extractUser, requireRole } = require('../middleware/auth');

const router = express.Router();

// Cooperative Admin / Super Admin Guard
router.use(extractUser);
router.use(requireRole('COOP_ADMIN', 'SUPER_ADMIN'));

// List workers awaiting verification
router.get('/admin/workers/pending', getPendingWorkers);

// Approve / Reject worker profile
router.patch(
  '/admin/workers/:id/verify',
  [
    body('status').isIn(['VERIFIED', 'REJECTED', 'SUSPENDED']).withMessage('Invalid status')
  ],
  verifyWorkerProfile
);

module.exports = router;
