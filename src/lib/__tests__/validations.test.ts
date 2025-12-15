import {
  checkoutRequestSchema,
  createIdeaSchema,
  updateIdeaSchema,
  basicQPVInputSchema,
  validateRequest,
  formatValidationError,
} from '../validations';

describe('checkoutRequestSchema', () => {
  it('should validate valid checkout request', () => {
    const valid = { priceId: 'price_123' };
    const result = validateRequest(checkoutRequestSchema, valid);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.priceId).toBe('price_123');
    }
  });

  it('should reject empty priceId', () => {
    const invalid = { priceId: '' };
    const result = validateRequest(checkoutRequestSchema, invalid);

    expect(result.success).toBe(false);
  });
});

describe('createIdeaSchema', () => {
  it('should validate valid idea creation', () => {
    const valid = {
      title: 'My Idea',
      description: 'A great idea',
      category: 'saas-tool',
      qpvScore: 7.5,
    };
    const result = validateRequest(createIdeaSchema, valid);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('My Idea');
    }
  });

  it('should reject missing title', () => {
    const invalid = { description: 'No title' };
    const result = validateRequest(createIdeaSchema, invalid);

    expect(result.success).toBe(false);
  });

  it('should reject title longer than 200 characters', () => {
    const invalid = { title: 'a'.repeat(201) };
    const result = validateRequest(createIdeaSchema, invalid);

    expect(result.success).toBe(false);
  });

  it('should reject invalid category', () => {
    const invalid = { title: 'My Idea', category: 'invalid-category' };
    const result = validateRequest(createIdeaSchema, invalid);

    expect(result.success).toBe(false);
  });
});

describe('basicQPVInputSchema', () => {
  it('should validate valid QPV inputs', () => {
    const valid = {
      quickness: 8,
      profitability: 7,
      validationEase: 6,
    };
    const result = validateRequest(basicQPVInputSchema, valid);

    expect(result.success).toBe(true);
  });

  it('should reject values above 10', () => {
    const invalid = {
      quickness: 11,
      profitability: 7,
      validationEase: 6,
    };
    const result = validateRequest(basicQPVInputSchema, invalid);

    expect(result.success).toBe(false);
  });

  it('should reject negative values', () => {
    const invalid = {
      quickness: -1,
      profitability: 7,
      validationEase: 6,
    };
    const result = validateRequest(basicQPVInputSchema, invalid);

    expect(result.success).toBe(false);
  });
});

describe('formatValidationError', () => {
  it('should format validation errors correctly', () => {
    const invalid = { title: '' };
    const result = validateRequest(createIdeaSchema, invalid);

    if (!result.success) {
      const formatted = formatValidationError(result.error);

      expect(formatted.length).toBeGreaterThan(0);
      expect(formatted[0]).toHaveProperty('field');
      expect(formatted[0]).toHaveProperty('message');
    }
  });
});
