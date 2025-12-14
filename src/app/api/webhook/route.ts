import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

// Disable body parsing for webhook
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Get metadata from the session
      const { userId, tierId, evaluations, blueprints } = session.metadata || {};
      
      if (!userId || userId === 'anonymous') {
        console.log('Anonymous purchase - credits will be assigned on signup');
        // Store the session for later assignment
        // This could be handled with a pending_credits table
        break;
      }

      try {
        // Create transaction record
        await prisma.transaction.create({
          data: {
            userId,
            amount: session.amount_total || 0,
            currency: session.currency || 'usd',
            status: 'completed',
            type: 'purchase',
            metadata: {
              stripeSessionId: session.id,
              tierId,
            },
          },
        });

        // Add evaluation credits
        if (evaluations && parseInt(evaluations) > 0) {
          await prisma.credit.create({
            data: {
              userId,
              type: 'EVALUATION',
              amount: parseInt(evaluations),
            },
          });
        }

        // Add blueprint credits
        if (blueprints && parseInt(blueprints) > 0) {
          await prisma.credit.create({
            data: {
              userId,
              type: 'BLUEPRINT',
              amount: parseInt(blueprints),
            },
          });
        }

        console.log(`Credits added for user ${userId}: ${evaluations} evaluations, ${blueprints} blueprints`);
      } catch (error) {
        console.error('Error processing payment:', error);
        // Don't return error - Stripe will retry
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment failed: ${paymentIntent.id}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
