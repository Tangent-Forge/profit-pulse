# Changelog

All notable changes to Profit Pulse will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Production Readiness
- Input validation schemas for all API routes using Zod
- Webhook event tracking table (WebhookEvent) for idempotency
- Rate limiting middleware with Upstash/Redis support
- Health check endpoint (`/api/health`) for monitoring
- Comprehensive test suite with Jest + React Testing Library
- Database migration framework with documentation
- Production deployment guide (`docs/PRODUCTION_DEPLOYMENT.md`)
- Middleware for global rate limiting
- API request validation with detailed error messages

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

### Changed - Security & Reliability
- Updated Next.js from 16.0.8 to 16.0.10 (fixes 2 HIGH severity vulnerabilities)
- Updated jsPDF from 2.5.2 to 3.0.4 (fixes HIGH severity vulnerabilities)
- Environment variables now required in production (DATABASE_URL, NEXTAUTH_SECRET, etc.)
- Webhook processing now uses database transactions for atomicity
- Removed custom auth pages (using NextAuth defaults until custom pages are built)
- All API endpoints now validate input before processing

### Changed - Developer Experience
- Added database management scripts (db:migrate, db:studio, etc.)
- Added test scripts (test, test:watch, test:coverage)
- Environment validation enforces 32+ character secrets in production
- Added migration README with troubleshooting guide

### Fixed
- Webhook idempotency - prevents duplicate credit grants on retries
- Database connection handling in webhook routes
- Environment variable validation (now enforced in production)
- Auth configuration (removed broken custom page references)
- Missing rate limit protection on API routes

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
