# AI Provider Configuration Guide

Profit Pulse supports multiple AI providers for idea analysis, allowing you to choose based on cost, quality, and speed requirements.

## Overview

The app uses **two separate AI configurations**:
- **Free Tier**: Cost-optimized AI for public evaluations (defaults to Groq)
- **Paid Tier**: Higher quality AI for premium features (defaults to OpenAI GPT-4o-mini)

This dual-provider approach minimizes costs while maintaining quality where it matters.

## Supported Providers

### Cost Comparison (per 1M tokens - December 2024)

| Provider | Input | Output | Best For | Speed |
|----------|-------|--------|----------|-------|
| **Groq Llama 3.1-8b** | $0.05 | $0.10 | **FREE TIER** - Cheapest, fastest | ⚡⚡⚡ |
| **OpenAI GPT-4o-mini** | $0.15 | $0.60 | **PAID TIER** - Best quality/cost | ⚡⚡ |
| Together Qwen 2.5-7B | $0.20 | $0.20 | Alternative (open source) | ⚡⚡ |
| Claude 3 Haiku | $0.25 | $1.25 | Fast, good quality | ⚡⚡ |
| OpenAI GPT-4o | $2.50 | $10.00 | Premium (overkill) | ⚡ |
| Claude 3.5 Sonnet | $3.00 | $15.00 | Premium (overkill) | ⚡ |

### Real-World Costs

#### Free Tier (Groq)
- **Cost per evaluation**: ~$0.00005 (five-hundredths of a cent)
- **10,000 free evaluations**: ~$0.50
- **Monthly budget impact**: Negligible even with heavy use

#### Paid Tier (OpenAI GPT-4o-mini)
- **Cost per evaluation**: ~$0.0003 (three-hundredths of a cent)
- **1,000 paid evaluations**: ~$0.30
- **Monthly budget impact**: Very low

## Configuration

### Environment Variables

Add to your `.env.local`:

```bash
# Primary AI provider (for paid features)
AI_PROVIDER=openai

# Free tier AI provider (for public evaluations)
AI_FREE_TIER_PROVIDER=groq

# Provider API Keys (add only what you need)
OPENAI_API_KEY=sk-proj-...
GROQ_API_KEY=gsk_...
ANTHROPIC_API_KEY=sk-ant-...
TOGETHER_API_KEY=...
```

### Provider Setup

#### 1. Groq (Recommended for Free Tier)

**Why Groq?**
- Fastest inference (sub-second responses)
- Cheapest pricing ($0.05/$0.10 per 1M tokens)
- Good quality for structured analysis
- Perfect for high-volume free tier

**Setup:**
1. Sign up: https://console.groq.com/
2. Get API key: https://console.groq.com/keys
3. Add to `.env.local`: `GROQ_API_KEY=gsk_...`
4. Set free tier provider: `AI_FREE_TIER_PROVIDER=groq`

**Models Used:**
- Fast: `llama-3.1-8b-instant`
- Quality: `llama-3.1-70b-versatile`

#### 2. OpenAI (Recommended for Paid Tier)

**Why OpenAI?**
- Best quality/cost balance with GPT-4o-mini
- Excellent structured output (JSON mode)
- Reliable and consistent
- Best for strategic insights

**Setup:**
1. Sign up: https://platform.openai.com/
2. Get API key: https://platform.openai.com/api-keys
3. Add to `.env.local`: `OPENAI_API_KEY=sk-proj-...`
4. Set paid provider: `AI_PROVIDER=openai`

**Models Used:**
- Fast: `gpt-4o-mini` ($0.15/$0.60)
- Quality: `gpt-4o` ($2.50/$10.00)

#### 3. Anthropic (Claude)

**Why Claude?**
- High-quality reasoning
- Long context windows
- Good for complex analysis
- More expensive than OpenAI mini

**Setup:**
1. Sign up: https://console.anthropic.com/
2. Get API key: https://console.anthropic.com/settings/keys
3. Add to `.env.local`: `ANTHROPIC_API_KEY=sk-ant-...`
4. Set provider: `AI_PROVIDER=anthropic`

**Models Used:**
- Fast: `claude-3-haiku-20240307`
- Quality: `claude-3-5-sonnet-20241022`

#### 4. Together AI

**Why Together?**
- Open source models
- Good value for money
- Supports Qwen 2.5 (excellent quality)
- OpenAI-compatible API

**Setup:**
1. Sign up: https://api.together.xyz/
2. Get API key: https://api.together.xyz/settings/api-keys
3. Add to `.env.local`: `TOGETHER_API_KEY=...`
4. Set provider: `AI_PROVIDER=together`

**Models Used:**
- Fast: `Qwen/Qwen2.5-7B-Instruct-Turbo`
- Quality: `Qwen/Qwen2.5-72B-Instruct-Turbo`

## Testing Different Providers

### Quick Switch

To test different providers, just change the environment variable:

```bash
# Test Groq for free tier
AI_FREE_TIER_PROVIDER=groq npm run dev

# Test OpenAI for paid tier
AI_PROVIDER=openai npm run dev

# Test Claude for both
AI_FREE_TIER_PROVIDER=anthropic AI_PROVIDER=anthropic npm run dev
```

### Comparison Testing

Create a script to test all providers:

```bash
# test-providers.sh
#!/bin/bash

echo "Testing Groq..."
AI_FREE_TIER_PROVIDER=groq npm run dev &
sleep 5
curl -X POST http://localhost:3000/api/evaluate/free -H "Content-Type: application/json" -d '{"ideaName":"Test","description":"Testing provider","quickness":5,"profitability":5,"validationEase":5}'

echo "\nTesting OpenAI..."
AI_FREE_TIER_PROVIDER=openai npm run dev &
# ... repeat for other providers
```

## Architecture

### Code Structure

```
src/lib/openai.ts
├── chatCompletion()          # Unified provider interface
├── getProvider()             # Get paid tier provider
├── getFreeTierProvider()     # Get free tier provider
├── analyzeFreeIdea()         # Free tier analysis (uses Groq)
├── analyzeIdea()             # Full analysis (uses OpenAI)
└── generateAIRecommendations() # Paid features
```

### Provider Selection Logic

```typescript
// Free tier endpoint
const freeTierProvider = getFreeTierProvider(); // Returns 'groq' by default
await chatCompletion(system, user, { provider: freeTierProvider });

// Paid tier features
const paidProvider = getProvider(); // Returns 'openai' by default
await chatCompletion(system, user, { provider: paidProvider });
```

## Free vs Paid Tier Analysis

### Free Tier (Groq)
**What users get:**
- ✅ QPV score calculation
- ✅ AI-suggested category
- ✅ Target audience identification
- ✅ 3 quick validation steps
- ✅ One quick win action
- ✅ Top risk to watch
- ✅ Upgrade teaser question

**What's missing:**
- ❌ Failure mode analysis
- ❌ Founder readiness assessment
- ❌ Historical patterns
- ❌ Detailed execution plan
- ❌ Gap analysis with mitigations
- ❌ Comparison tools

### Paid Tier (OpenAI)
**Full Profit Pulse 2.0 includes:**
- ✅ Everything in free tier
- ✅ 4-layer evaluation (founder, idea, history, context)
- ✅ Category-specific failure modes with percentages
- ✅ Critical gaps with mitigation strategies
- ✅ Week-by-week execution plan
- ✅ Obstacles from historical data
- ✅ Energy filter assessment
- ✅ Comparison tools

## Cost Optimization Strategies

### 1. Use Groq for Free Tier
```bash
AI_FREE_TIER_PROVIDER=groq  # ~$0.00005 per request
```

At this cost, even 100,000 free evaluations per month = **$5/month**.

### 2. Use GPT-4o-mini for Paid Tier
```bash
AI_PROVIDER=openai  # Uses gpt-4o-mini by default
```

Best quality/cost ratio for strategic insights.

### 3. Rate Limiting
Already implemented in `/src/middleware.ts`:
- Free tier: 60 requests/min per IP
- Prevents abuse
- Minimal cost impact even without limits

### 4. Caching (Future Enhancement)
Consider caching AI responses for identical inputs:
```typescript
// Future: Cache key = hash(ideaName + description + scores)
const cacheKey = generateHash(input);
const cached = await redis.get(cacheKey);
if (cached) return cached;
```

## Monitoring Costs

### 1. OpenAI Dashboard
- https://platform.openai.com/usage
- View daily spending
- Set usage limits

### 2. Groq Dashboard
- https://console.groq.com/usage
- Monitor free tier usage
- Track rate limits

### 3. Application Logs
All AI calls log to console:
```bash
[AI] Free tier analysis: groq (300 tokens in, 400 tokens out) = $0.00005
[AI] Paid analysis: openai (500 tokens in, 800 tokens out) = $0.00037
```

## Troubleshooting

### Provider Not Working

1. **Check API key is set**
   ```bash
   echo $OPENAI_API_KEY
   echo $GROQ_API_KEY
   ```

2. **Verify provider name is correct**
   ```bash
   AI_PROVIDER=openai  # ✅ Correct
   AI_PROVIDER=OpenAI  # ❌ Case sensitive!
   ```

3. **Check API key has funds/credits**
   - OpenAI: https://platform.openai.com/account/billing
   - Groq: https://console.groq.com/

4. **Test provider directly**
   ```typescript
   import { analyzeFreeIdea } from '@/lib/openai';
   const result = await analyzeFreeIdea('Test', 'Description', 5.0);
   console.log(result);
   ```

### Slow Responses

1. **Groq is fastest** - Switch free tier:
   ```bash
   AI_FREE_TIER_PROVIDER=groq
   ```

2. **Check network latency** - Provider APIs vary by region

3. **Reduce max_tokens** in `openai.ts`:
   ```typescript
   max_tokens: 1000  // Lower = faster
   ```

### High Costs

1. **Ensure Groq for free tier**:
   ```bash
   AI_FREE_TIER_PROVIDER=groq  # Not openai!
   ```

2. **Check which provider is being used**:
   ```bash
   grep "AI completion" logs | tail -100
   ```

3. **Set up billing alerts** in provider dashboards

## Best Practices

1. **Use Groq for free tier** - No reason not to, it's fast and cheap
2. **Use OpenAI mini for paid** - Best quality/cost balance
3. **Don't use GPT-4o or Sonnet** - Overkill for this use case
4. **Monitor costs weekly** - Set up billing alerts
5. **Test with Groq first** - Fastest feedback loop
6. **Cache aggressively** - Same inputs → same outputs

## FAQ

**Q: Can I use the same provider for both tiers?**
A: Yes, just set both to the same value:
```bash
AI_PROVIDER=groq
AI_FREE_TIER_PROVIDER=groq
```

**Q: What if I don't have a Groq API key?**
A: The app will gracefully degrade. Free tier will return QPV score without AI insights.

**Q: Can I switch providers without redeploying?**
A: Yes! Just update environment variables in your hosting platform (Vercel, Railway, etc.)

**Q: Which provider gives best results?**
A: For this use case: OpenAI GPT-4o-mini > Claude Haiku > Groq Llama > Together Qwen

**Q: How do I add a new provider?**
A: Add to `src/lib/openai.ts`:
1. Add provider type to `AIProvider`
2. Add client initialization function
3. Add case to `chatCompletion()` switch
4. Update `MODELS` object

## Related Documentation

- [Production Deployment Guide](./PRODUCTION_DEPLOYMENT.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Environment Variables](.env.example)
