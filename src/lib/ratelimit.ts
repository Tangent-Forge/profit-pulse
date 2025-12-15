/**
 * Rate Limiting Utilities
 * Uses Upstash Redis in production, in-memory for development
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter for development
class InMemoryRateLimiter {
  private requests: Map<string, number[]> = new Map();

  async limit(identifier: string, options: { maxRequests: number; window: number }): Promise<{ success: boolean; reset: number }> {
    const now = Date.now();
    const windowMs = options.window * 1000;

    const userRequests = this.requests.get(identifier) || [];
    const recentRequests = userRequests.filter((time) => now - time < windowMs);

    if (recentRequests.length >= options.maxRequests) {
      const oldestRequest = Math.min(...recentRequests);
      const reset = oldestRequest + windowMs;

      return { success: false, reset };
    }

    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    // Cleanup old entries periodically
    if (Math.random() < 0.01) {
      this.cleanup(windowMs);
    }

    return { success: true, reset: now + windowMs };
  }

  private cleanup(windowMs: number) {
    const now = Date.now();
    for (const [key, timestamps] of this.requests.entries()) {
      const recent = timestamps.filter((time) => now - time < windowMs);
      if (recent.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recent);
      }
    }
  }
}

// Initialize rate limiters
const inMemoryLimiter = new InMemoryRateLimiter();

// Create Upstash rate limiter if credentials are available
let upstashLimiter: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  upstashLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: true,
  });
}

/**
 * Rate limit configurations for different endpoints
 */
export const rateLimitConfigs = {
  // General API routes - 60 requests per minute
  api: {
    maxRequests: 60,
    window: 60,
  },
  // Checkout - 10 requests per minute (prevent spam)
  checkout: {
    maxRequests: 10,
    window: 60,
  },
  // Ideas creation - 30 requests per minute
  ideas: {
    maxRequests: 30,
    window: 60,
  },
  // Auth - 5 attempts per minute (prevent brute force)
  auth: {
    maxRequests: 5,
    window: 60,
  },
};

/**
 * Apply rate limiting to a request
 * Returns null if allowed, or NextResponse with 429 if rate limited
 */
export async function rateLimit(
  req: NextRequest,
  config: { maxRequests: number; window: number } = rateLimitConfigs.api
): Promise<NextResponse | null> {
  // Get identifier (IP address or user ID from session)
  const identifier =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    req.ip ||
    'unknown';

  try {
    let result: { success: boolean; reset?: number };

    if (upstashLimiter) {
      // Use Upstash in production
      const upstashResult = await upstashLimiter.limit(identifier);
      result = {
        success: upstashResult.success,
        reset: upstashResult.reset,
      };
    } else {
      // Use in-memory limiter in development
      result = await inMemoryLimiter.limit(identifier, config);
    }

    if (!result.success) {
      const resetDate = new Date(result.reset || Date.now() + config.window * 1000);

      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'You have exceeded the rate limit. Please try again later.',
          retryAfter: resetDate.toISOString(),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((resetDate.getTime() - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetDate.getTime().toString(),
          },
        }
      );
    }

    return null; // Request allowed
  } catch (error) {
    console.error('Rate limit error:', error);
    // On error, allow the request (fail open)
    return null;
  }
}

/**
 * Middleware wrapper for rate limiting
 * Use this in API routes
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config?: { maxRequests: number; window: number }
) {
  return async (req: NextRequest) => {
    const rateLimitResponse = await rateLimit(req, config);

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    return handler(req);
  };
}
