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

  // Check if we've already processed this event (idempotency)
  const existingEvent = await prisma.webhookEvent.findUnique({
    where: { eventId: event.id },
  });

  if (existingEvent?.processed) {
    console.log(`Event ${event.id} already processed, skipping`);
    return NextResponse.json({ received: true, skipped: true });
  }

  // Record the event
  let webhookRecord;
  try {
    webhookRecord = await prisma.webhookEvent.upsert({
      where: { eventId: event.id },
      create: {
        eventId: event.id,
        eventType: event.type,
        payload: event as any,
        processed: false,
      },
      update: {},
    });
  } catch (error) {
    console.error('Error creating webhook record:', error);
    return NextResponse.json(
      { error: 'Failed to record webhook event' },
      { status: 500 }
    );
  }

  // Handle the event
  try {
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

        // Use a transaction to ensure atomicity
        await prisma.$transaction(async (tx) => {
          // Create transaction record
          await tx.transaction.create({
            data: {
              userId,
              amount: session.amount_total || 0,
              currency: session.currency || 'usd',
              status: 'completed',
              type: 'purchase',
              metadata: {
                stripeSessionId: session.id,
                tierId,
                eventId: event.id,
              },
            },
          });

          // Add evaluation credits
          if (evaluations && parseInt(evaluations) > 0) {
            await tx.credit.create({
              data: {
                userId,
                type: 'EVALUATION',
                amount: parseInt(evaluations),
              },
            });
          }

          // Add blueprint credits
          if (blueprints && parseInt(blueprints) > 0) {
            await tx.credit.create({
              data: {
                userId,
                type: 'BLUEPRINT',
                amount: parseInt(blueprints),
              },
            });
          }
        });

        console.log(`Credits added for user ${userId}: ${evaluations} evaluations, ${blueprints} blueprints`);
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

    // Mark event as processed
    await prisma.webhookEvent.update({
      where: { id: webhookRecord.id },
      data: {
        processed: true,
        processedAt: new Date(),
      },
    });

    return NextResponse.json({ received: true, processed: true });
  } catch (error) {
    // Record the error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await prisma.webhookEvent.update({
      where: { id: webhookRecord.id },
      data: {
        error: errorMessage,
      },
    });

    console.error('Error processing webhook:', error);

    // Return 500 so Stripe will retry
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
