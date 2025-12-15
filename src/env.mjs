import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const isProduction = process.env.NODE_ENV === 'production';

export const env = createEnv({
  server: {
    // Required in production, optional in development
    DATABASE_URL: isProduction
      ? z.string().url('DATABASE_URL must be a valid URL')
      : z.string().url().optional(),

    NEXTAUTH_SECRET: isProduction
      ? z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters')
      : z.string().min(1).optional(),

    NEXTAUTH_URL: isProduction
      ? z.string().url('NEXTAUTH_URL must be a valid URL')
      : z.string().url().optional(),

    STRIPE_SECRET_KEY: isProduction
      ? z.string().min(1, 'STRIPE_SECRET_KEY is required in production')
      : z.string().min(1).optional(),

    STRIPE_WEBHOOK_SECRET: isProduction
      ? z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required in production')
      : z.string().min(1).optional(),

    // OAuth providers are always optional
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),

    // AI Provider keys - optional (supports multiple providers)
    OPENAI_API_KEY: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),
    GROQ_API_KEY: z.string().optional(),
    TOGETHER_API_KEY: z.string().optional(),
    AI_PROVIDER: z.enum(['openai', 'anthropic', 'groq', 'together']).default('openai'),

    // Database direct URL for migrations
    DIRECT_URL: z.string().url().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: isProduction
      ? z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL')
      : z.string().url().optional(),

    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: isProduction
      ? z.string().min(1, 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required in production')
      : z.string().min(1).optional(),

    NEXT_PUBLIC_APP_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Error tracking
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
    AI_PROVIDER: process.env.AI_PROVIDER,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  // Don't throw during build if we're in CI or building with placeholder values
  emptyStringAsUndefined: true,
});
