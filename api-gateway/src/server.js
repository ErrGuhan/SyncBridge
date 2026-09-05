require('dotenv').config();
const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const {
  authenticateSupabase,
  optionalAuth,
  requireRole
} = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Downstream Service URLs
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || 'http://localhost:3002';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3003';
const GATEWAY_SHARED_SECRET = process.env.GATEWAY_SHARED_SECRET || 'internal-gateway-secret-key';

// Global Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// ----------------------------------------------------------------------------
// PROXY HELPER CONFIGURATION
// ----------------------------------------------------------------------------

/**
 * Common proxy options generator for downstream microservices.
 * Injects authenticated user context and internal trust headers.
 */
const createProxyOptions = (serviceName) => ({
  // Strip mount path and forward the subpath (e.g., /api/bookings/my-list -> /my-list)
  proxyReqPathResolver: (req) => {
    return req.url;
  },

  // Decorate downstream request headers with verified identity and roles
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    // 1. Inject internal trust secret to ensure downstream services trust injected headers
    proxyReqOpts.headers['x-gateway-secret'] = GATEWAY_SHARED_SECRET;
    proxyReqOpts.headers['x-forwarded-by'] = 'CoopGig-API-Gateway';

    // 2. Propagate authenticated user data if present
    if (srcReq.user) {
      proxyReqOpts.headers['x-user-id'] = srcReq.user.id;
      proxyReqOpts.headers['x-user-email'] = srcReq.user.email;
      proxyReqOpts.headers['x-user-role'] = srcReq.user.role;
      
      if (srcReq.user.cooperativeId) {
        proxyReqOpts.headers['x-user-cooperative-id'] = srcReq.user.cooperativeId;
      }
    }

    return proxyReqOpts;
  },

  // Error handler for downstream microservice timeouts or connection failures
  proxyErrorHandler: (err, res, next) => {
    console.error(`[Gateway Error] Failed to connect to ${serviceName}:`, err.message);
    
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: `${serviceName} is currently unreachable. Please try again later.`,
        service: serviceName
      });
    }

    if (err.code === 'ETIMEDOUT') {
      return res.status(504).json({
        error: 'Gateway Timeout',
        message: `${serviceName} timed out processing the request.`,
        service: serviceName
      });
    }

    return res.status(502).json({
      error: 'Bad Gateway',
      message: `Error communicating with ${serviceName}`,
      details: err.message
    });
  },

  timeout: 10000 // 10s downstream timeout
});

// ----------------------------------------------------------------------------
// HEALTH CHECK ROUTE
// ----------------------------------------------------------------------------
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      userService: USER_SERVICE_URL,
      bookingService: BOOKING_SERVICE_URL,
      paymentService: PAYMENT_SERVICE_URL
    }
  });
});

// ----------------------------------------------------------------------------
// ROUTE 1: USER SERVICE (Port 3001)
// ----------------------------------------------------------------------------
// Public endpoints (registration, login, public worker discovery) vs Protected

// Public worker search & service categories can be browsed without login
app.use(
  '/api/users/public',
  proxy(USER_SERVICE_URL, {
    ...createProxyOptions('User Service'),
    proxyReqPathResolver: (req) => `/public${req.url}`
  })
);

// Protected User routes (Profile management, verification docs, coop admin ops)
app.use(
  '/api/users',
  authenticateSupabase,
  proxy(USER_SERVICE_URL, createProxyOptions('User Service'))
);

// ----------------------------------------------------------------------------
// ROUTE 2: BOOKING SERVICE (Port 3002)
// ----------------------------------------------------------------------------
// All booking creation, assignment, and status updates require authentication
app.use(
  '/api/bookings',
  authenticateSupabase,
  proxy(BOOKING_SERVICE_URL, createProxyOptions('Booking Service'))
);

// ----------------------------------------------------------------------------
// ROUTE 3: PAYMENT SERVICE (Port 3003)
// ----------------------------------------------------------------------------
// Webhooks from Stripe/Payment gateways bypass Supabase JWT (verified by webhook signature downstream)
app.use(
  '/api/payments/webhook',
  proxy(PAYMENT_SERVICE_URL, {
    ...createProxyOptions('Payment Service'),
    proxyReqPathResolver: (req) => `/webhook${req.url}`
  })
);

// High-security payment endpoints: Escrow release, payouts, customer checkout
app.use(
  '/api/payments',
  authenticateSupabase,
  proxy(PAYMENT_SERVICE_URL, createProxyOptions('Payment Service'))
);

// ----------------------------------------------------------------------------
// FALLBACK & 404
// ----------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Start Gateway
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📡 Routing to User Service:    ${USER_SERVICE_URL}`);
  console.log(`📡 Routing to Booking Service: ${BOOKING_SERVICE_URL}`);
  console.log(`📡 Routing to Payment Service: ${PAYMENT_SERVICE_URL}`);
  console.log(`🔐 Supabase JWT Auth:         Active at Gateway level`);
  console.log(`=======================================================`);
});

module.exports = app;
