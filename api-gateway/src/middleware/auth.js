const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// Environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY;
const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;
const supabaseJwksUrl =
  process.env.SUPABASE_JWKS_URL ||
  (supabaseUrl ? `${supabaseUrl}/auth/v1/.well-known/jwks.json` : null);

// Initialize Supabase Client
const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// In-memory cache for JWKS keys
let jwksCache = {
  keys: new Map(),
  lastFetched: 0
};

/**
 * Fetch and cache public keys from the Supabase JWKS endpoint
 */
async function getPublicKeyFromJwks(kid) {
  if (!supabaseJwksUrl) return null;

  const now = Date.now();
  // Refresh cache if older than 1 hour or kid is missing
  if (now - jwksCache.lastFetched > 3600000 || (kid && !jwksCache.keys.has(kid))) {
    try {
      const response = await fetch(supabaseJwksUrl);
      if (response.ok) {
        const data = await response.json();
        const newKeys = new Map();
        if (Array.isArray(data.keys)) {
          for (const k of data.keys) {
            try {
              const pubKey = crypto.createPublicKey({ key: k, format: 'jwk' });
              newKeys.set(k.kid, pubKey);
            } catch (err) {
              console.warn(`[JWKS Warning]: Failed to parse key ${k.kid}:`, err.message);
            }
          }
        }
        jwksCache = { keys: newKeys, lastFetched: now };
      }
    } catch (fetchErr) {
      console.warn('[JWKS Fetch Warning]:', fetchErr.message);
    }
  }

  if (kid && jwksCache.keys.has(kid)) {
    return jwksCache.keys.get(kid);
  }
  // Return the first key if kid is unspecified
  if (jwksCache.keys.size > 0) {
    return jwksCache.keys.values().next().value;
  }
  return null;
}

/**
 * Middleware to authenticate requests using Supabase JWT.
 * Supports JWKS asymmetric verification, Supabase Auth API verification,
 * and legacy symmetric HMAC verification.
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

    // Decode token header to inspect kid and algorithm
    let decodedHeader = null;
    try {
      decodedHeader = jwt.decode(token, { complete: true })?.header;
    } catch {
      // Ignore header decode error, proceed to strategies
    }

    // Strategy 1: Asymmetric JWKS Verification (Fast local verification for modern Supabase)
    if (supabaseJwksUrl) {
      try {
        const pubKey = await getPublicKeyFromJwks(decodedHeader?.kid);
        if (pubKey) {
          const decoded = jwt.verify(token, pubKey, {
            algorithms: ['ES256', 'RS256']
          });

          const role =
            decoded.app_metadata?.role ||
            decoded.user_metadata?.role ||
            decoded.role ||
            'CUSTOMER';
          const cooperativeId =
            decoded.app_metadata?.cooperative_id ||
            decoded.user_metadata?.cooperative_id ||
            null;

          userPayload = {
            id: decoded.sub,
            email: decoded.email,
            role: String(role).toUpperCase(),
            cooperativeId: cooperativeId,
            metadata: decoded.user_metadata || {}
          };
        }
      } catch (jwksErr) {
        // Fallback to Supabase Auth API
      }
    }

    // Strategy 2: Fast stateless symmetric JWT verification (if legacy SUPABASE_JWT_SECRET configured)
    if (!userPayload && supabaseJwtSecret) {
      try {
        const decoded = jwt.verify(token, supabaseJwtSecret);
        const role =
          decoded.app_metadata?.role ||
          decoded.user_metadata?.role ||
          decoded.role ||
          'CUSTOMER';
        const cooperativeId =
          decoded.app_metadata?.cooperative_id ||
          decoded.user_metadata?.cooperative_id ||
          null;

        userPayload = {
          id: decoded.sub,
          email: decoded.email,
          role: String(role).toUpperCase(),
          cooperativeId: cooperativeId,
          metadata: decoded.user_metadata || {}
        };
      } catch (jwtErr) {
        // Fallback to Supabase API
      }
    }

    // Strategy 3: Authoritative Verification through Supabase Auth API
    if (!userPayload) {
      if (!supabase) {
        return res.status(500).json({
          error: 'Configuration Error',
          message:
            'Neither SUPABASE_JWKS_URL, SUPABASE_PUBLISHABLE_KEY, nor SUPABASE_SECRET_KEY is configured on Gateway'
        });
      }

      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: error ? error.message : 'Invalid or expired Supabase token'
        });
      }

      const role =
        user.app_metadata?.role || user.user_metadata?.role || 'CUSTOMER';
      const cooperativeId =
        user.app_metadata?.cooperative_id ||
        user.user_metadata?.cooperative_id ||
        null;

      userPayload = {
        id: user.id,
        email: user.email,
        role: String(role).toUpperCase(),
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

    const hasRole =
      allowedRoles.includes(req.user.role) || req.user.role === 'SUPER_ADMIN';
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
