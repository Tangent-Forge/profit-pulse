/**
 * API Request Validation Schemas
 * All API endpoints should validate input using these schemas
 */

import { z } from 'zod';
import { IdeaCategory } from '@/types';

// ============================================================================
// Checkout API Validation
// ============================================================================

export const checkoutRequestSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

// ============================================================================
// Ideas API Validation
// ============================================================================

export const createIdeaSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  category: z.enum([
    'ai-wrapper',
    'saas-tool',
    'micro-saas',
    'notion-template',
    'digital-product',
    'newsletter',
    'content-creator',
    'community',
    'marketplace',
    'info-product',
    'agency-service',
    'consulting',
    'productized-service',
    'ecommerce',
    'mobile-app',
    'chrome-extension',
    'other'
  ] as const).optional(),
  qpvScore: z.number().min(0).max(10).optional(),
  evaluation: z.any().optional(), // JSON field - validated separately
});

export type CreateIdeaRequest = z.infer<typeof createIdeaSchema>;

export const updateIdeaSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  qpvScore: z.number().min(0).max(10).optional(),
  evaluation: z.any().optional(), // JSON field
  blueprint: z.any().optional(), // JSON field
});

export type UpdateIdeaRequest = z.infer<typeof updateIdeaSchema>;

// ============================================================================
// QPV Calculator Validation
// ============================================================================

export const basicQPVInputSchema = z.object({
  quickness: z.number().min(0).max(10, 'Quickness must be between 0 and 10'),
  profitability: z.number().min(0).max(10, 'Profitability must be between 0 and 10'),
  validationEase: z.number().min(0).max(10, 'Validation Ease must be between 0 and 10'),
  category: z.enum([
    'ai-wrapper',
    'saas-tool',
    'micro-saas',
    'notion-template',
    'digital-product',
    'newsletter',
    'content-creator',
    'community',
    'marketplace',
    'info-product',
    'agency-service',
    'consulting',
    'productized-service',
    'ecommerce',
    'mobile-app',
    'chrome-extension',
    'other'
  ] as const).optional(),
});

export type BasicQPVInput = z.infer<typeof basicQPVInputSchema>;

// ============================================================================
// Full Evaluation Validation
// ============================================================================

export const fullEvaluationInputSchema = z.object({
  ideaName: z.string().min(1, 'Idea name is required').max(200),
  category: z.enum([
    'ai-wrapper',
    'saas-tool',
    'micro-saas',
    'notion-template',
    'digital-product',
    'newsletter',
    'content-creator',
    'community',
    'marketplace',
    'info-product',
    'agency-service',
    'consulting',
    'productized-service',
    'ecommerce',
    'mobile-app',
    'chrome-extension',
    'other'
  ] as const),

  founderReadiness: z.object({
    skillMatch: z.number().min(0).max(10),
    timeAvailability: z.number().min(0).max(10),
    financialBuffer: z.number().min(0).max(10),
  }),

  ideaCharacteristics: z.object({
    quickness: z.number().min(0).max(10),
    profitability: z.number().min(0).max(10),
    validationEase: z.number().min(0).max(10),
    marketDemand: z.number().min(0).max(10),
  }),

  contextualViability: z.object({
    lifeStageFit: z.number().min(0).max(10),
    marketTiming: z.number().min(0).max(10),
  }),

  energyFilter: z.object({
    response: z.enum(['yes', 'no', 'maybe']),
    reasoning: z.string().max(500).optional(),
  }),
});

export type FullEvaluationInput = z.infer<typeof fullEvaluationInputSchema>;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate request body against schema
 * Returns parsed data or throws validation error
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: result.data };
}

/**
 * Format Zod validation errors for API responses
 */
export function formatValidationError(error: z.ZodError): { field: string; message: string }[] {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}
