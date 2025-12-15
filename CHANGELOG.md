# Changelog

All notable changes to Profit Pulse will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - AI-Powered Free Tier
- **Free tier AI analysis** using cost-optimized Groq provider (~$0.00005 per request)
- Target audience identification powered by AI
- 3 quick validation steps generated per idea
- Quick win action recommendations
- Top risk identification with specific warnings
- Category auto-suggestion based on idea description
- Intelligent upgrade teasers to drive conversion
- Multi-provider AI support (OpenAI, Anthropic, Groq, Together AI)
- Separate free/paid tier AI provider configuration
- AI Configuration Guide with cost comparison and setup instructions
- Free tier API endpoint (`/api/evaluate/free`) with AI integration
- Enhanced evaluation UI with AI insights display
- Loading states and error handling for AI requests

### Added - Production Readiness
- Input validation schemas for all API routes using Zod
- Webhook event tracking table (WebhookEvent) for idempotency
- Rate limiting middleware with Upstash/Redis support
- Health check endpoint (`/api/health`) for monitoring
- Comprehensive test suite with Jest + React Testing Library (35+ tests)
- Database migration framework with documentation
- Production deployment guide (`docs/PRODUCTION_DEPLOYMENT.md`)
- Testing guide with unit and E2E test instructions
- Middleware for global rate limiting
- API request validation with detailed error messages
- Sentry error tracking integration (client, server, edge)
- Web Vitals performance monitoring
- Playwright E2E testing setup with accessibility tests
- Error boundaries (`error.tsx`, `global-error.tsx`)
- Loading states for better UX
- Custom authentication pages (sign-in, sign-up)
- User signup API endpoint with validation

### Added - Features
- Full 4-layer evaluation system (Profit Pulse 2.0)
- Founder Readiness layer (30% weight)
- Contextual Viability layer (10% weight)
- Enhanced Idea Characteristics layer (40% weight)
- Historical Patterns layer with failure mode database (20% weight)
- Energy Filter qualitative gate
- Strengths/gaps/obstacles generation
- Multi-step evaluation wizard UI
- Promo code support in checkout

### Changed - AI & Free Tier
- **Free tier now provides real value** - AI-powered insights instead of just math
- Evaluation page title changed to "Free AI-Powered Idea Analysis"
- Results page shows AI insights (audience, validation, risks, quick wins)
- Upgrade CTA updated to emphasize "THE WHY, PITFALLS & PLAN" differentiation
- CTA messaging now clearly lists what's missing from free tier
- Free tier button changed to "Get Free AI-Powered Analysis"
- Added "AI-powered insights in seconds" to free tier messaging
- Environment variables expanded with AI provider configuration
- `chatCompletion()` now accepts optional `provider` parameter for testing

### Changed - Security & Reliability
- Updated Next.js from 16.0.8 to 16.0.10 (fixes 2 HIGH severity vulnerabilities)
- Updated jsPDF from 2.5.2 to 3.0.4 (fixes HIGH severity vulnerabilities)
- Environment variables now required in production (DATABASE_URL, NEXTAUTH_SECRET, etc.)
- Webhook processing now uses database transactions for atomicity
- Re-added custom auth pages (sign-in, sign-up) with modern design
- All API endpoints now validate input before processing
- Root layout now includes Web Vitals monitoring component

### Changed - Developer Experience
- Added database management scripts (db:migrate, db:studio, etc.)
- Added test scripts (test, test:watch, test:coverage, test:e2e)
- Environment validation enforces 32+ character secrets in production
- Added migration README with troubleshooting guide
- Updated README with production features and testing instructions
- Expanded test coverage to 35+ tests across 4 test suites

### Fixed
- Webhook idempotency - prevents duplicate credit grants on retries
- Database connection handling in webhook routes
- Environment variable validation (now enforced in production)
- Auth configuration (created custom sign-in/sign-up pages)
- Missing rate limit protection on API routes
- Error handling with proper error boundaries
- Missing loading states for async operations

### Security
- All npm vulnerabilities resolved (0 vulnerabilities)
- Input validation prevents malformed data and injection attacks
- Rate limiting prevents brute force and spam
- Webhook event deduplication prevents double-charging
- Database transactions ensure credit grant atomicity

## [0.2.0] - 2025-12-14

### Added
- Full evaluation page (`/evaluate/full`) with 5-step wizard
- Layer score calculations in `calculations.ts`
- SliderInput component for evaluation inputs
- Results display with layer breakdowns
- Navigation link to full evaluation from homepage

### Changed
- Renamed "Evaluate" button to "Quick QPV" on homepage
- Added "Full Evaluation" button with gradient styling

## [0.1.0] - 2025-12-07

### Added
- Initial release
- Basic QPV Calculator (Quickness, Profitability, Validation Ease)
- Weighted scoring formula (Q×40% + P×30% + V×30%)
- Score interpretation (Excellent/Good/Moderate/Needs Work)
- Failure mode teaser based on idea category
- 17 idea categories with historical failure data
- Stripe checkout integration
- NextAuth authentication setup
- Prisma database schema (User, Credit, Idea, Transaction)
- Netlify deployment configuration
- Landing page with pricing tiers

### Technical
- Next.js 16 with App Router
- React 19 with Turbopack
- Tailwind CSS 4
- PostgreSQL via Supabase
- Stripe payments

---

**Maintained By:** Tangent Forge Development Team
