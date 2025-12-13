import Stripe from 'stripe';

// Initialize Stripe with the secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
  typescript: true,
});

// Pricing configuration
export const PRICING_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free QPV',
    description: 'Quick evaluation of any idea',
    price: 0,
    priceId: null,
    features: [
      'Weighted QPV score (0-10)',
      'Instant interpretation',
      'No signup required',
    ],
    credits: {
      evaluations: 0,
      blueprints: 0,
    },
  },
  STARTER: {
    id: 'starter',
    name: 'Starter',
    description: 'Full Evaluation + Blueprint',
    price: 900, // in cents
    priceId: process.env.STRIPE_PRICE_STARTER || 'price_starter',
    features: [
      '1 Full Evaluation',
      '1 Execution Blueprint',
      '4-layer scoring (30+ data points)',
      'Failure mode analysis',
      'Export to PDF/Markdown',
    ],
    credits: {
      evaluations: 1,
      blueprints: 1,
    },
  },
  EXPLORER: {
    id: 'explorer',
    name: 'Explorer',
    description: 'For Serious Validators',
    price: 2900, // in cents
    priceId: process.env.STRIPE_PRICE_EXPLORER || 'price_explorer',
    features: [
      '5 Full Evaluations',
      '2 Execution Blueprints',
      'Compare ideas side-by-side',
      'Export to Notion',
      'Save $16 vs separate',
    ],
    credits: {
      evaluations: 5,
      blueprints: 2,
    },
    isPopular: true,
  },
} as const;

// Helper function to get tier by price ID
export function getTierByPriceId(priceId: string) {
  return Object.values(PRICING_TIERS).find((tier) => tier.priceId === priceId);
}

// Helper function to format amount for display
export function formatAmount(amount: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100);
}

// Helper function to format amount for Stripe
export function formatAmountForStripe(amount: number, currency: string): number {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });

  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}

// Helper function to format amount from Stripe
export function formatAmountFromStripe(amount: number, currency: string): number {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });

  const parts = numberFormat.formatToParts(100);
  let zeroDecimalCurrency = true;
  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : amount / 100;
}
