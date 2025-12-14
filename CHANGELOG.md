# Changelog

All notable changes to Profit Pulse will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Full 4-layer evaluation system (Profit Pulse 2.0)
- Founder Readiness layer (30% weight)
- Contextual Viability layer (10% weight)
- Enhanced Idea Characteristics layer (40% weight)
- Historical Patterns layer with failure mode database (20% weight)
- Energy Filter qualitative gate
- Strengths/gaps/obstacles generation
- Multi-step evaluation wizard UI
- Promo code support in checkout

### Changed
- Updated checkout to include invoice creation
- Added session expiry (30 minutes) to checkout

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
