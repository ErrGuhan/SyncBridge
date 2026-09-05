# Cooperative Gig Services Platform - Master Universal Debugging Runbook

This guide contains the **Master Universal Debugging Prompt Template** along with production-grade solutions for the four most common failure modes in this microservices architecture.

---

## 1. Master Universal Debugging Prompt Template

Copy and paste this exact prompt whenever you encounter an error in local development or production:

```text
Act as a Senior Debugging Engineer. I encountered an error in my [Insert Stack: e.g., Next.js / Express / Prisma / PostgreSQL] setup while trying to execute [Insert Feature: e.g., automated UPI split routing].

Error Stack Trace / Console Output:
[PASTE YOUR ERROR HERE]

Relevant Code Snippet:
```[language]
[PASTE RELEVANT CODE HERE]
```

Please perform the following:
1. Identify the root cause of this error (e.g., CORS header missing, unhandled Promise rejection, Prisma schema mismatch, expired JWT).
2. Provide the exact corrected code snippet to fix the issue.
3. Explain what changed and how to prevent similar runtime issues in a microservices environment.
```

---

## 2. Common Production Failure Modes & Resolution Playbook

### Scenario A: Supabase JWT Mismatch & Injected Gateway Headers

#### Symptom:
Downstream service logs `401 Unauthorized` or `Missing required user context` even though the user signed in on the frontend.

#### Root Cause:
1. The frontend request sent the Bearer token to API Gateway (`localhost:3000`).
2. The Gateway decoded the Supabase JWT but did not attach internal headers (`x-user-id`, `x-user-role`, `x-gateway-secret`) to downstream proxy requests.
3. The downstream service (`user-service`, `booking-service`, or `payment-service`) looks for `req.headers['x-user-id']` or attempts to re-verify the token against a mismatched secret.

#### Resolution:
1. **Frontend**: Use `frontend/src/lib/api.ts` which automatically injects `sessionStorage.getItem('supabase_token')` or `sb-*-auth-token`.
2. **API Gateway (`api-gateway/src/server.js`)**: Ensure `proxyReqOptDecorator` propagates trust headers:
   ```javascript
   proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
     proxyReqOpts.headers['x-gateway-secret'] = GATEWAY_SHARED_SECRET;
     proxyReqOpts.headers['x-forwarded-by'] = 'CoopGig-API-Gateway';
     if (srcReq.user) {
       proxyReqOpts.headers['x-user-id'] = srcReq.user.id;
       proxyReqOpts.headers['x-user-role'] = srcReq.user.role;
       if (srcReq.user.cooperativeId) {
         proxyReqOpts.headers['x-user-cooperative-id'] = srcReq.user.cooperativeId;
       }
     }
     return proxyReqOpts;
   }
   ```
3. **Downstream Services**: Verify `extractUser` middleware validates `x-gateway-secret`:
   ```javascript
   function extractUser(req, res, next) {
     const secret = req.headers['x-gateway-secret'];
     if (secret !== process.env.GATEWAY_SHARED_SECRET) {
       return res.status(403).json({ error: 'Direct access forbidden. Requests must pass through API Gateway.' });
     }
     req.user = {
       id: req.headers['x-user-id'],
       role: req.headers['x-user-role'],
       cooperativeId: req.headers['x-user-cooperative-id']
     };
     next();
   }
   ```

---

### Scenario B: CORS Preflight & 401 Unauthorized Redirection

#### Symptom:
Browser console displays:
`Access to fetch at 'http://localhost:3000/api/bookings' from origin 'http://localhost:3004' has been blocked by CORS policy: Response to preflight request doesn't pass access control check.`

#### Root Cause:
When custom headers (`Authorization`, `x-gateway-secret`) are sent, browsers issue an `OPTIONS` HTTP preflight request before the actual `GET`/`POST`. If an authentication middleware runs on `OPTIONS`, it returns `401`, failing CORS.

#### Resolution:
1. In Express, mount `app.use(cors())` **before** any auth middleware.
2. In `frontend/src/lib/api.ts`, catch `401` gracefully and avoid infinite redirect loops:
   ```typescript
   if (response.status === 401) {
     if (typeof window !== 'undefined') {
       sessionStorage.removeItem('supabase_token');
       if (!window.location.pathname.includes('/login')) {
         window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
       }
     }
     throw new ApiError(401, 'Session expired. Redirecting to login...');
   }
   ```

---

### Scenario C: Prisma Connection Pool Exhaustion in Microservices

#### Symptom:
`Timed out fetching a new connection from the connection pool. More than 10 connections opened concurrently.`

#### Root Cause:
Each microservice (`user-service`, `booking-service`, `payment-service`) instantiates its own `new PrismaClient()`. In Node.js development mode, hot-reloading or multiple modules re-instantiating `PrismaClient` rapidly exhausts the PostgreSQL `max_connections` (default 100).

#### Resolution:
1. **Singleton Client Pattern**: Use a shared global singleton:
   ```javascript
   // lib/prisma.js
   const { PrismaClient } = require('@prisma/client');

   const globalForPrisma = global;
   const prisma = globalForPrisma.prisma || new PrismaClient({
     log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
   });

   if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
   module.exports = prisma;
   ```
2. **Pool Size Configuration in `DATABASE_URL`**:
   Tune connection limits per service:
   `postgresql://postgres:password@localhost:5432/coop_gig_db?schema=public&connection_limit=5&pool_timeout=10`

---

### Scenario D: Double Bookings & Race Conditions in Emergency Dispatch

#### Symptom:
Two workers simultaneously click "Accept" on an emergency job. Both get confirmed, creating a conflicting dispatch.

#### Root Cause:
HTTP requests execute concurrently. A naive database read `if (booking.status === 'PENDING')` has a race condition between the `SELECT` and `UPDATE` queries.

#### Resolution:
Use Redis distributed locking or atomic leases in `services/booking-service/src/socket/emergencySocket.js`:
```javascript
// Atomically acquire lock before updating database
const lockResult = emergencyLock.acquire(bookingId, workerId);
if (!lockResult.acquired) {
  return socket.emit('EMERGENCY_LOCK_FAILED', {
    message: 'Another worker-member accepted this emergency job 1ms earlier.'
  });
}

// Winning worker confirmed; broadcast cancellation to others
socket.emit('EMERGENCY_ACCEPT_CONFIRMED', { bookingId, status: 'CONFIRMED' });
io.to('workers-channel').emit('EMERGENCY_JOB_TAKEN', { bookingId, claimedBy: workerId });
```
