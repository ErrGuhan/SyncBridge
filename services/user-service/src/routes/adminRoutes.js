const express = require('express');
const { body } = require('express-validator');
const { verifyWorkerProfile, getPendingWorkers } = require('../controllers/adminController');
const { getSecretaryQueue, resolveSecretaryTask } = require('../controllers/verificationController');
const { extractUser, requireRole } = require('../middleware/auth');

const router = express.Router();

// Cooperative Admin / Super Admin Guard
router.use(extractUser);
router.use(requireRole('COOP_ADMIN', 'SUPER_ADMIN'));

// List workers awaiting verification
router.get('/admin/workers/pending', getPendingWorkers);

// Primary Cooperative Secretary Manual Review Queue
router.get('/admin/secretary-queue', getSecretaryQueue);
router.post('/admin/secretary-queue/:taskId/resolve', resolveSecretaryTask);

// Approve / Reject worker profile
router.patch(
  '/admin/workers/:id/verify',
  [
    body('status').isIn(['VERIFIED', 'REJECTED', 'SUSPENDED']).withMessage('Invalid status')
  ],
  verifyWorkerProfile
);

module.exports = router;

