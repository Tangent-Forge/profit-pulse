import { NextRequest, NextResponse } from 'next/server';

/**
 * Web Vitals endpoint
 * Receives Core Web Vitals metrics from the client
 *
 * Metrics tracked:
 * - CLS (Cumulative Layout Shift)
 * - FID (First Input Delay)
 * - FCP (First Contentful Paint)
 * - LCP (Largest Contentful Paint)
 * - TTFB (Time to First Byte)
 * - INP (Interaction to Next Paint)
 */
export async function POST(req: NextRequest) {
  try {
    const metric = await req.json();

    // Log metric (in production, send to analytics service)
    console.log('[Web Vitals]', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    });

    // TODO: Send to analytics service (e.g., Google Analytics, Vercel Analytics, etc.)
    // Example with GA4:
    // if (process.env.GA_MEASUREMENT_ID) {
    //   await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`, {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       client_id: metric.id,
    //       events: [{
    //         name: 'web_vitals',
    //         params: {
    //           metric_name: metric.name,
    //           metric_value: metric.value,
    //           metric_rating: metric.rating,
    //         },
    //       }],
    //     }),
    //   });
    // }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Web Vitals error:', error);
    return NextResponse.json({ error: 'Failed to record metric' }, { status: 500 });
  }
}
