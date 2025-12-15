# Profit Pulse

**Stop overthinking. Start building.**

The only idea evaluation tool that tells you why ideas like yours fail — and how to avoid it.

[![Netlify Status](https://api.netlify.com/api/v1/badges/5c798f4b-5f16-4457-8783-c7adc4d0a7a1/deploy-status)](https://app.netlify.com/sites/profit-pulse-app/deploys)

## Overview

Profit Pulse is a business idea evaluation framework that helps founders cut through shiny object syndrome. It uses the **QPV Matrix** (Quickness, Profitability, Validation Ease) to score ideas and predict failure modes based on historical patterns.

### Features

- **Free AI-Powered Analysis** — QPV scoring + AI-generated insights on target audience, validation steps, risks, and quick wins (no signup required)
- **Multi-Layer Evaluation** — 4-layer analysis covering founder readiness, idea characteristics, historical patterns, and contextual viability
- **Failure Mode Detection** — Category-specific failure rates and mitigation strategies
- **Multi-Provider AI** — Supports OpenAI, Anthropic (Claude), Groq, and Together AI with easy configuration
- **Execution Blueprints** — Actionable plans with validation checkpoints

### Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | QPV score + AI insights (audience, validation, risks, quick wins), no signup |
| Starter | $9 | Full 4-layer evaluation, failure mode analysis, execution blueprint |
| Explorer | $29 | 5 evaluations, 2 blueprints, comparison tools, historical patterns |

## Tech Stack

- **Framework**: Next.js 16.0.10 (App Router, Turbopack)
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js with custom pages
- **Payments**: Stripe
- **AI**: Multi-provider support (OpenAI, Anthropic, Groq, Together AI)
- **Testing**: Jest + React Testing Library + Playwright
- **Error Tracking**: Sentry
- **Performance**: Web Vitals monitoring
- **Rate Limiting**: Upstash Redis
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (local or cloud)
- Stripe account (for payments)

### Installation

```bash
# Clone the repository
git clone https://github.com/Tangent-Forge/profit-pulse.git
cd profit-pulse

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials
```

### Environment Variables

Create a `.env.local` file with:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/profit_pulse"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# AI Providers (choose based on cost/quality needs)
AI_PROVIDER=openai              # For paid features (openai|anthropic|groq|together)
AI_FREE_TIER_PROVIDER=groq      # For free tier (defaults to groq for cost efficiency)
GROQ_API_KEY="gsk_..."          # Recommended for free tier (~$0.00005/request)
OPENAI_API_KEY="sk-proj-..."    # Optional, for paid tier
```

See [AI Configuration Guide](./docs/AI_CONFIGURATION.md) for detailed provider setup and cost comparison.

### Development

```bash
# Start development server
npm run dev

# Run database migrations
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Run tests
npm test                 # Unit tests
npm run test:e2e         # E2E tests
npm run test:coverage    # Coverage report
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Testing

```bash
# Unit tests
npm test
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# E2E tests (Playwright)
npm run playwright:install   # Install browsers (first time)
npm run test:e2e            # Run E2E tests
npm run test:e2e:ui         # Run with UI mode
```

See [Testing Guide](docs/TESTING_GUIDE.md) for more details.

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── api/                   # API routes
│   │   ├── auth/              # Authentication (NextAuth + signup)
│   │   ├── checkout/          # Stripe checkout
│   │   ├── ideas/             # Ideas CRUD
│   │   ├── webhook/           # Stripe webhooks (with idempotency)
│   │   ├── health/            # Health check endpoint
│   │   └── analytics/         # Web Vitals endpoint
│   ├── auth/                  # Custom auth pages
│   │   ├── signin/            # Sign-in page
│   │   └── signup/            # Sign-up page
│   ├── dashboard/             # User dashboard
│   ├── evaluate/              # QPV Calculator
│   ├── error.tsx              # Error boundary
│   ├── loading.tsx            # Loading state
│   └── global-error.tsx       # Global error handler
├── lib/                       # Utilities
│   ├── calculations.ts        # QPV scoring engine
│   ├── failureModes.ts        # Category failure data
│   ├── validations.ts         # Zod validation schemas
│   ├── ratelimit.ts           # Rate limiting logic
│   ├── auth.ts                # NextAuth config
│   ├── db.ts                  # Prisma client
│   ├── stripe.ts              # Stripe config
│   └── __tests__/             # Unit tests
├── components/                # React components
│   └── web-vitals.tsx         # Performance monitoring
├── middleware.ts              # Global middleware (rate limiting)
├── types/                     # TypeScript definitions
├── e2e/                       # Playwright E2E tests
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
└── docs/                      # Documentation
    ├── PRODUCTION_DEPLOYMENT.md
    └── TESTING_GUIDE.md
```

## Production Features

### Security
- ✅ Zero npm vulnerabilities
- ✅ Input validation on all API routes (Zod)
- ✅ Rate limiting (in-memory dev, Redis production)
- ✅ Webhook idempotency (prevents duplicate charges)
- ✅ Environment variable validation
- ✅ CSRF protection via NextAuth

### Reliability
- ✅ Database transactions for payment processing
- ✅ Health check endpoint (`/api/health`)
- ✅ Error boundaries and global error handling
- ✅ Graceful loading states
- ✅ Web Vitals performance monitoring

### Testing
- ✅ 35+ unit tests (Jest + React Testing Library)
- ✅ E2E tests (Playwright)
- ✅ Accessibility testing (@axe-core)

### Monitoring
- ✅ Sentry error tracking (optional)
- ✅ Web Vitals analytics
- ✅ Webhook event logging

## Deployment

See the comprehensive [Production Deployment Guide](docs/PRODUCTION_DEPLOYMENT.md) for detailed instructions.

### Quick Deploy (Netlify)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Link to Netlify site
netlify link

# Deploy to production
netlify deploy --prod
```

### Required Environment Variables

See `.env.example` for full list. Critical variables:

- `DATABASE_URL` — PostgreSQL connection
- `NEXTAUTH_SECRET` — Min 32 characters
- `NEXTAUTH_URL` — Your production URL
- `STRIPE_SECRET_KEY` — Stripe secret key
- `STRIPE_WEBHOOK_SECRET` — Webhook signing secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key

### Optional (Recommended)

- `NEXT_PUBLIC_SENTRY_DSN` — Error tracking
- `UPSTASH_REDIS_REST_URL` — Rate limiting (production)
- `UPSTASH_REDIS_REST_TOKEN` — Rate limiting token

## Related Projects

Profit Pulse is part of the **Tangent Forge** product suite:

- [PathFinder](https://github.com/Tangent-Forge/pathfinder) — Career path discovery
- [Prompt Finder](https://github.com/Tangent-Forge/prompt-finder) — College essay coach
- [Geo Finder](https://github.com/Tangent-Forge/geo-finder) — Location matching

## License

© 2025 Tangent Forge. All rights reserved.
