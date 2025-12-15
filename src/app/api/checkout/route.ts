import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe, getTierByPriceId } from '@/lib/stripe';
import { checkoutRequestSchema, validateRequest, formatValidationError } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const validation = validateRequest(checkoutRequestSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: formatValidationError(validation.error)
        },
        { status: 400 }
      );
    }

    const { priceId } = validation.data;

    // Get the tier information
    const tier = getTierByPriceId(priceId);
    if (!tier) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // Get the session to verify the user is authenticated
    const session = await getServerSession(authOptions);

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: tier.name,
              description: tier.description,
            },
            unit_amount: tier.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?cancelled=true`,
      metadata: {
        tierId: tier.id,
        userId: session?.user?.id || 'anonymous',
        evaluations: tier.credits.evaluations.toString(),
        blueprints: tier.credits.blueprints.toString(),
        product: 'profit_pulse',
        brand: 'tangent_forge',
      },
      customer_email: session?.user?.email || undefined,
      // Enable promotion codes for testing
      allow_promotion_codes: true,
      // Enable invoice creation
      invoice_creation: {
        enabled: true,
      },
      // Expire session after 30 minutes
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60),
    });

    if (!checkoutSession.url) {
      throw new Error('Failed to create checkout session');
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: unknown) {
    console.error('Error creating checkout session:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
