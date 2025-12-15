# Production Deployment Guide

This guide covers deploying Profit Pulse to production with all necessary security and reliability features.

## Table of Contents
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Deployment on Netlify](#deployment-on-netlify)
- [Post-Deployment](#post-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)

---

## Pre-Deployment Checklist

Before deploying to production, ensure all of the following are complete:

### Critical Requirements ✓
- [ ] All npm security vulnerabilities fixed (`npm audit` returns 0 vulnerabilities)
- [ ] Database migrations initialized (`prisma/migrations/` directory exists)
- [ ] Environment variables configured (see below)
- [ ] Stripe webhook endpoint configured
- [ ] Test suite passing (`npm test`)
- [ ] Production build successful (`npm run build`)

### Recommended
- [ ] Error tracking configured (Sentry or similar)
- [ ] Rate limiting tested
- [ ] Health check endpoint verified (`/api/health`)
- [ ] Database backups configured
- [ ] SSL/TLS certificate ready (Netlify provides this automatically)

---

## Environment Variables

### Required in Production

```bash
# ============================================================================
# DATABASE
# ============================================================================
DATABASE_URL="postgresql://user:password@host:6543/db?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/db"  # For migrations

# ============================================================================
# AUTHENTICATION
# ============================================================================
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"
NEXTAUTH_URL="https://your-domain.com"

# ============================================================================
# STRIPE PAYMENTS
# ============================================================================
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Create Price IDs in Stripe Dashboard for your products
STRIPE_PRICE_STARTER="price_..."  # $9 tier
STRIPE_PRICE_EXPLORER="price_..." # $29 tier

# ============================================================================
# APP CONFIGURATION
# ============================================================================
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_APP_ENV="production"
NODE_ENV="production"

# ============================================================================
# OPTIONAL: AI PROVIDERS
# ============================================================================
# At least one AI provider API key should be set
OPENAI_API_KEY="sk-proj-..."         # Recommended: GPT-4o-mini
AI_PROVIDER="openai"                  # or: anthropic, groq, together

# Alternative providers (optional)
ANTHROPIC_API_KEY="sk-ant-..."
GROQ_API_KEY="gsk_..."
TOGETHER_API_KEY="..."

# ============================================================================
# OPTIONAL: RATE LIMITING (Recommended for production)
# ============================================================================
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
```

### Generating Secrets

```bash
# Generate NEXTAUTH_SECRET (must be at least 32 characters)
openssl rand -base64 32

# Test if secrets are properly formatted
echo $NEXTAUTH_SECRET | wc -c  # Should be > 32
```

---

## Database Setup

### 1. Create Production Database

Using Supabase (recommended):

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings > Database**
3. Copy both connection strings:
   - **Pooler connection** (port 6543) → `DATABASE_URL`
   - **Direct connection** (port 5432) → `DIRECT_URL`

### 2. Run Migrations

```bash
# Set environment variables
export DATABASE_URL="postgresql://..."
export DIRECT_URL="postgresql://..."

# Run migrations
npm run db:migrate:prod

# Verify
npx prisma studio  # Open database GUI to verify tables
```

### 3. Seed Data (Optional)

If you have seed data:

```bash
npm run db:seed
```

---

## Deployment on Netlify

### Initial Setup

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Link Project**
   ```bash
   netlify link
   ```

3. **Configure Environment Variables**
   ```bash
   # Set via Netlify CLI
   netlify env:set DATABASE_URL "postgresql://..."
   netlify env:set NEXTAUTH_SECRET "..."
   netlify env:set NEXTAUTH_URL "https://your-domain.com"
   # ... (set all required variables)
   ```

   Or via Netlify Dashboard:
   - Go to **Site settings > Environment variables**
   - Add all variables from the list above

### Deploy

```bash
# Deploy to production
netlify deploy --prod

# Or let Netlify auto-deploy from git
git push origin main
```

### Build Configuration

The `netlify.toml` is already configured:

```toml
[build]
  command = "npx prisma generate && npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
```

---

## Stripe Configuration

### 1. Create Products & Prices

In [Stripe Dashboard](https://dashboard.stripe.com):

1. **Products > Add Product**
   - Starter: $9 one-time payment
   - Explorer: $29 one-time payment

2. Copy Price IDs and set them in environment variables:
   ```bash
   STRIPE_PRICE_STARTER=price_...
   STRIPE_PRICE_EXPLORER=price_...
   ```

### 2. Configure Webhook

1. **Stripe Dashboard > Developers > Webhooks**
2. **Add endpoint**: `https://your-domain.com/api/webhook`
3. **Select events**:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
4. **Copy webhook signing secret** → `STRIPE_WEBHOOK_SECRET`

### 3. Test Webhook

```bash
# Use Stripe CLI to test locally first
stripe listen --forward-to localhost:3000/api/webhook
stripe trigger checkout.session.completed
```

---

## Post-Deployment

### 1. Verify Deployment

```bash
# Check health endpoint
curl https://your-domain.com/api/health

# Expected response:
# {
#   "uptime": 123.45,
#   "timestamp": 1234567890,
#   "status": "ok",
#   "checks": {
#     "database": "healthy"
#   }
# }
```

### 2. Test Critical Paths

- [ ] Homepage loads
- [ ] QPV calculator works
- [ ] Full evaluation wizard works
- [ ] Stripe checkout flow completes
- [ ] Credits are granted after payment
- [ ] User can save ideas
- [ ] Dashboard displays saved ideas

### 3. Monitor Logs

```bash
# Netlify logs
netlify logs --prod

# Or via Netlify Dashboard:
# Deploys > [your deploy] > Function logs
```

### 4. Configure DNS (if using custom domain)

1. **Netlify Dashboard > Domain settings**
2. **Add custom domain**
3. **Update DNS records** at your registrar:
   ```
   CNAME  @  your-site.netlify.app
   ```
4. **Enable HTTPS** (automatic with Netlify)

---

## Monitoring & Maintenance

### Health Checks

Setup external monitoring (e.g., [UptimeRobot](https://uptimerobot.com/)):

- **Endpoint**: `https://your-domain.com/api/health`
- **Interval**: 5 minutes
- **Alert on**: HTTP status ≠ 200

### Error Tracking (Recommended)

Install Sentry:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Configure in `sentry.client.config.ts`:

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_APP_ENV,
  tracesSampleRate: 0.1,
});
```

### Database Backups

**Supabase** (automatic):
- Daily backups enabled by default
- Point-in-time recovery available (Pro plan)

**Manual backup**:
```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### Performance Monitoring

Monitor key metrics:

- **Response time**: < 200ms (p95)
- **Error rate**: < 0.1%
- **Uptime**: > 99.9%
- **Database connections**: Monitor pool usage

### Security

Regular maintenance tasks:

```bash
# Check for vulnerabilities (monthly)
npm audit

# Update dependencies (quarterly)
npm update

# Review webhook event logs (weekly)
# Check for failed payments or duplicate credits
```

### Scaling

When you need to scale:

1. **Database**: Upgrade Supabase plan or migrate to dedicated PostgreSQL
2. **Rate limiting**: Switch from in-memory to Redis (Upstash)
3. **CDN**: Enable Netlify Edge (automatic)
4. **Serverless functions**: Increase timeout/memory in Netlify

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check if using correct URL (pooled vs direct)
# Migrations: use DIRECT_URL
# Queries: use DATABASE_URL
```

### Webhook Not Receiving Events

1. Check webhook URL is correct in Stripe
2. Verify webhook secret matches
3. Check Netlify function logs
4. Test with Stripe CLI: `stripe trigger checkout.session.completed`

### Rate Limiting Issues

```bash
# Temporarily disable for testing
export SKIP_RATE_LIMIT=true

# Check Redis connection (if using Upstash)
curl $UPSTASH_REDIS_REST_URL -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"
```

---

## Rollback Plan

If deployment fails:

```bash
# Revert to previous deployment
netlify rollback

# Or redeploy previous commit
git revert HEAD
git push origin main
```

---

## Support

For issues:
- Check logs: `netlify logs --prod`
- Review error tracking (Sentry)
- Consult [Netlify Docs](https://docs.netlify.com)
- Check [Next.js Docs](https://nextjs.org/docs)

---

**Last Updated**: December 2025
