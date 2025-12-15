import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * Health check endpoint for monitoring
 * GET /api/health
 *
 * Returns:
 * - 200: Service is healthy
 * - 503: Service is unhealthy (database connection failed)
 */
export async function GET() {
  const healthcheck = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'ok',
    checks: {
      database: 'unknown' as 'healthy' | 'unhealthy' | 'unknown',
    },
  };

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    healthcheck.checks.database = 'healthy';
  } catch (error) {
    console.error('Database health check failed:', error);
    healthcheck.checks.database = 'unhealthy';
    healthcheck.status = 'error';

    return NextResponse.json(healthcheck, { status: 503 });
  }

  return NextResponse.json(healthcheck, { status: 200 });
}
