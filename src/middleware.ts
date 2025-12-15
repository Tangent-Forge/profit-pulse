import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, rateLimitConfigs } from '@/lib/ratelimit';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    // Skip rate limiting for health check and webhook endpoints
    if (pathname === '/api/health' || pathname === '/api/webhook') {
      return NextResponse.next();
    }

    // Apply stricter limits for specific endpoints
    let config = rateLimitConfigs.api;

    if (pathname.startsWith('/api/checkout')) {
      config = rateLimitConfigs.checkout;
    } else if (pathname.startsWith('/api/ideas')) {
      config = rateLimitConfigs.ideas;
    } else if (pathname.startsWith('/api/auth')) {
      config = rateLimitConfigs.auth;
    }

    const rateLimitResponse = await rateLimit(req, config);

    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
