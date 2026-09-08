/**
 * SyncBridge — Next.js Middleware: Server-Side Role-Based Route Protection
 *
 * Gates portal routes by the user's role stored in the auth session cookie.
 * This is a server-side check — it cannot be bypassed by hiding nav links.
 *
 * Role → Protected Path mapping:
 *   WORKER           → /portal/worker
 *   SOCIETY_SECRETARY → /portal/admin
 *   FEDERATION_ADMIN → /portal/management
 *   CUSTOMER         → /portal/customer
 *   DEVELOPER        → /portal/developer (any authenticated user OK for demo)
 */

import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Route → allowed roles map
// ---------------------------------------------------------------------------

const ROUTE_ROLE_MAP: Record<string, string[]> = {
  '/portal/worker': ['WORKER', 'SUPER_ADMIN'],
  '/portal/admin': ['SOCIETY_SECRETARY', 'FEDERATION_ADMIN', 'SUPER_ADMIN'],
  '/portal/management': ['FEDERATION_ADMIN', 'SUPER_ADMIN'],
  '/portal/customer': ['CUSTOMER', 'SUPER_ADMIN'],
  '/portal/developer': ['WORKER', 'SOCIETY_SECRETARY', 'FEDERATION_ADMIN', 'CUSTOMER', 'SUPER_ADMIN', 'MANAGEMENT', 'DEVELOPER'],
};

// ---------------------------------------------------------------------------
// Middleware config — only run on portal routes
// ---------------------------------------------------------------------------

export const config = {
  matcher: ['/portal/:path*'],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Find the protected route prefix
  const protectedRoute = Object.keys(ROUTE_ROLE_MAP).find(route =>
    pathname.startsWith(route)
  );

  if (!protectedRoute) {
    // Not a protected route — pass through
    return NextResponse.next();
  }

  // ---------------------------------------------------------------------------
  // Read user session from cookie or Authorization header
  // We store the user JSON in localStorage on the client side (AuthContext).
  // For server-side checks, we rely on the cookie set during login.
  // In demo mode: the user role is in the `syncbridge_role` cookie.
  // In production: would validate the Supabase JWT and extract role from claims.
  // ---------------------------------------------------------------------------

  // Check for demo-mode role cookie (set by AuthContext on loginAsDemoUser)
  const roleCookie = req.cookies.get('syncbridge_role')?.value;
  const tokenCookie = req.cookies.get('syncbridge_auth')?.value;

  // If no auth signal at all: redirect to role-specific login
  if (!roleCookie && !tokenCookie) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    if (pathname.startsWith('/portal/worker')) {
      loginUrl.searchParams.set('role', 'worker');
    } else if (pathname.startsWith('/portal/admin')) {
      loginUrl.searchParams.set('role', 'admin');
    } else if (pathname.startsWith('/portal/customer')) {
      loginUrl.searchParams.set('role', 'customer');
    }
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = roleCookie?.toUpperCase();

  if (userRole && protectedRoute) {
    const allowedRoles = ROUTE_ROLE_MAP[protectedRoute];
    if (!allowedRoles.includes(userRole)) {
      // Wrong role for this portal — redirect to the correct portal
      const correctPortal = getCorrectPortal(userRole);
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = correctPortal;
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

function getCorrectPortal(role: string): string {
  switch (role) {
    case 'WORKER': return '/portal/worker';
    case 'SOCIETY_SECRETARY': return '/portal/admin';
    case 'FEDERATION_ADMIN': return '/portal/management';
    case 'CUSTOMER': return '/portal/customer';
    default: return '/';
  }
}
