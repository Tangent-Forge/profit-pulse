// Mock Stripe to avoid initialization issues in tests
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({}));
});

import {
  PRICING_TIERS,
  getTierByPriceId,
  formatAmount,
  formatAmountForStripe,
  formatAmountFromStripe,
} from '../stripe';

describe('PRICING_TIERS', () => {
  it('should have all required tiers', () => {
    expect(PRICING_TIERS.FREE).toBeDefined();
    expect(PRICING_TIERS.STARTER).toBeDefined();
    expect(PRICING_TIERS.EXPLORER).toBeDefined();
  });

  it('should have correct prices', () => {
    expect(PRICING_TIERS.FREE.price).toBe(0);
    expect(PRICING_TIERS.STARTER.price).toBe(900); // $9 in cents
    expect(PRICING_TIERS.EXPLORER.price).toBe(2900); // $29 in cents
  });

  it('should have correct credit amounts', () => {
    expect(PRICING_TIERS.FREE.credits.evaluations).toBe(0);
    expect(PRICING_TIERS.FREE.credits.blueprints).toBe(0);

    expect(PRICING_TIERS.STARTER.credits.evaluations).toBe(1);
    expect(PRICING_TIERS.STARTER.credits.blueprints).toBe(1);

    expect(PRICING_TIERS.EXPLORER.credits.evaluations).toBe(5);
    expect(PRICING_TIERS.EXPLORER.credits.blueprints).toBe(2);
  });

  it('should mark EXPLORER as popular', () => {
    expect(PRICING_TIERS.EXPLORER.isPopular).toBe(true);
    expect(PRICING_TIERS.FREE.isPopular).toBeUndefined();
    expect(PRICING_TIERS.STARTER.isPopular).toBeUndefined();
  });
});

describe('getTierByPriceId', () => {
  it('should return correct tier for valid price ID', () => {
    const tier = getTierByPriceId('price_starter');
    expect(tier).toBeDefined();
    expect(tier?.id).toBe('starter');
  });

  it('should return undefined for invalid price ID', () => {
    const tier = getTierByPriceId('invalid_price_id');
    expect(tier).toBeUndefined();
  });

  it('should not return tier for null price ID', () => {
    const tier = getTierByPriceId('free'); // FREE has null priceId
    expect(tier).toBeUndefined();
  });
});

describe('formatAmount', () => {
  it('should format cents to dollars correctly', () => {
    expect(formatAmount(900)).toBe('$9.00');
    expect(formatAmount(2900)).toBe('$29.00');
    expect(formatAmount(0)).toBe('$0.00');
  });

  it('should handle decimal cents', () => {
    expect(formatAmount(999)).toBe('$9.99');
    expect(formatAmount(1050)).toBe('$10.50');
  });

  it('should support different currencies', () => {
    const eur = formatAmount(1000, 'eur');
    expect(eur).toContain('10');
  });
});

describe('formatAmountForStripe', () => {
  it('should convert dollars to cents for USD', () => {
    expect(formatAmountForStripe(9, 'usd')).toBe(900);
    expect(formatAmountForStripe(29, 'usd')).toBe(2900);
  });

  it('should handle decimal amounts', () => {
    expect(formatAmountForStripe(9.99, 'usd')).toBe(999);
    expect(formatAmountForStripe(10.50, 'usd')).toBe(1050);
  });
});

describe('formatAmountFromStripe', () => {
  it('should convert cents to dollars for USD', () => {
    expect(formatAmountFromStripe(900, 'usd')).toBe(9);
    expect(formatAmountFromStripe(2900, 'usd')).toBe(29);
  });

  it('should handle zero', () => {
    expect(formatAmountFromStripe(0, 'usd')).toBe(0);
  });
});
