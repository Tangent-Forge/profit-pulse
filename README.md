# Profit Pulse

**Stop overthinking. Start building.**

The only idea evaluation tool that tells you why ideas like yours fail — and how to avoid it.

[![Netlify Status](https://api.netlify.com/api/v1/badges/5c798f4b-5f16-4457-8783-c7adc4d0a7a1/deploy-status)](https://app.netlify.com/sites/profit-pulse-app/deploys)

## Overview

Profit Pulse is a business idea evaluation framework that helps founders cut through shiny object syndrome. It uses the **QPV Matrix** (Quickness, Profitability, Validation Ease) to score ideas and predict failure modes based on historical patterns.

### Features

- **Free QPV Calculator** — Weighted scoring (Q×40% + P×30% + V×30%) with instant interpretation
- **Multi-Layer Evaluation** — 4-layer analysis covering founder readiness, idea characteristics, historical patterns, and contextual viability
- **Failure Mode Detection** — Category-specific failure rates and mitigation strategies
- **Execution Blueprints** — Actionable plans with validation checkpoints

### Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free QPV | $0 | Quick score, instant results, no signup |
| Starter | $9 | 1 full evaluation, 1 blueprint, failure analysis |
| Explorer | $29 | 5 evaluations, 2 blueprints, comparison tools |

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js
- **Payments**: Stripe
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
```

### Development

```bash
# Start development server
npm run dev

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio (database GUI)
npx prisma studio
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── checkout/      # Stripe checkout
│   │   └── webhook/       # Stripe webhooks
│   ├── dashboard/         # User dashboard
│   ├── evaluate/          # QPV Calculator
│   └── success/           # Payment success
├── lib/                   # Utilities
│   ├── calculations.ts    # QPV scoring engine
│   ├── failureModes.ts    # Category failure data
│   ├── auth.ts            # NextAuth config
│   ├── db.ts              # Prisma client
│   └── stripe.ts          # Stripe config
├── types/                 # TypeScript definitions
└── prisma/
    └── schema.prisma      # Database schema
```

## Deployment

### Netlify (Recommended)

The app is configured for Netlify deployment with the `@netlify/plugin-nextjs` plugin.

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Link to Netlify site
netlify link

# Deploy to production
netlify deploy --prod
```

**Important**: The `prebuild` script automatically runs `prisma generate` before each build to ensure the Prisma client is up to date.

### Environment Variables on Netlify

Set these in **Site settings > Environment variables**:

- `DATABASE_URL`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Related Projects

Profit Pulse is part of the **Tangent Forge** product suite:

- [PathFinder](https://github.com/Tangent-Forge/pathfinder) — Career path discovery
- [Prompt Finder](https://github.com/Tangent-Forge/prompt-finder) — College essay coach
- [Geo Finder](https://github.com/Tangent-Forge/geo-finder) — Location matching

## License

© 2025 Tangent Forge. All rights reserved.
