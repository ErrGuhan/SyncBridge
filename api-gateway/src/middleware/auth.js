const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;

const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Middleware to authenticate requests using Supabase JWT.
 * Verifies the bearer token, extracts user identity & role,
 * and attaches them to `req.user`.
 */
async function authenticateSupabase(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or malformed Authorization header with Bearer token'
      });
    }

    const token = authHeader.split(' ')[1];

    let userPayload = null;

    // Strategy 1: Fast stateless JWT verification via SUPABASE_JWT_SECRET (if configured)
    if (supabaseJwtSecret) {
      try {
        const decoded = jwt.verify(token, supabaseJwtSecret);
        
        // Supabase stores custom user roles in app_metadata or user_metadata
        const role = decoded.app_metadata?.role || decoded.user_metadata?.role || decoded.role || 'CUSTOMER';
        const cooperativeId = decoded.app_metadata?.cooperative_id || decoded.user_metadata?.cooperative_id || null;

        userPayload = {
          id: decoded.sub,
          email: decoded.email,
          role: role.toUpperCase(),
          cooperativeId: cooperativeId,
          metadata: decoded.user_metadata || {}
        };
      } catch (jwtErr) {
        // Fallback to Supabase API if local verification fails or secret is mismatched
      }
    }

    // Strategy 2: Verification through Supabase Auth API
    if (!userPayload) {
      if (!supabase) {
        return res.status(500).json({
          error: 'Configuration Error',
          message: 'Neither SUPABASE_JWT_SECRET nor SUPABASE_URL/ANON_KEY is configured on Gateway'
        });
      }

      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: error ? error.message : 'Invalid or expired Supabase token'
        });
      }

      const role = user.app_metadata?.role || user.user_metadata?.role || 'CUSTOMER';
      const cooperativeId = user.app_metadata?.cooperative_id || user.user_metadata?.cooperative_id || null;

      userPayload = {
        id: user.id,
        email: user.email,
        role: role.toUpperCase(),
        cooperativeId: cooperativeId,
        metadata: user.user_metadata || {}
      };
    }

    // Attach verified user context to request object
    req.user = userPayload;
    next();
  } catch (err) {
    console.error('[API Gateway Auth Error]:', err.message);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication failed'
    });
  }
}

/**
 * Optional authentication: Attaches user if token is valid,
 * but allows guest access if no token is present.
 */
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  return authenticateSupabase(req, res, next);
}

/**
 * Role-Based Access Control (RBAC) middleware generator.
 * @param  {...string} allowedRoles Allowed roles (e.g., 'COOP_ADMIN', 'WORKER')
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
    }

    const hasRole = allowedRoles.includes(req.user.role) || req.user.role === 'SUPER_ADMIN';
    if (!hasRole) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Insufficient permissions. Requires one of: [${allowedRoles.join(', ')}]`
      });
    }

    next();
  };
}

module.exports = {
  authenticateSupabase,
  optionalAuth,
  requireRole
};
