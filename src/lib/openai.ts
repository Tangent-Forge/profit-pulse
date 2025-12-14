/**
 * Multi-Provider AI Integration for Profit Pulse
 * Supports: OpenAI, Anthropic, Groq, Together AI
 * 
 * Cost Comparison (per 1M tokens, as of Dec 2024):
 * ┌─────────────────┬──────────┬──────────┬─────────────────────────────────┐
 * │ Provider        │ Input    │ Output   │ Best For                        │
 * ├─────────────────┼──────────┼──────────┼─────────────────────────────────┤
 * │ GPT-4o-mini     │ $0.15    │ $0.60    │ Best quality/cost balance       │
 * │ GPT-4o          │ $2.50    │ $10.00   │ Complex analysis (overkill)     │
 * │ Claude 3 Haiku  │ $0.25    │ $1.25    │ Fast, good quality              │
 * │ Claude 3 Sonnet │ $3.00    │ $15.00   │ High quality (expensive)        │
 * │ Groq Llama 3    │ $0.05    │ $0.10    │ Fastest, cheapest               │
 * │ Together Llama  │ $0.20    │ $0.20    │ Open source, good value         │
 * └─────────────────┴──────────┴──────────┴─────────────────────────────────┘
 * 
 * Recommendation: GPT-4o-mini for production, Groq for high-volume/testing
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import Groq from 'groq-sdk';
import { IdeaCategory } from '@/types';

// Provider type
type AIProvider = 'openai' | 'anthropic' | 'groq' | 'together';

// Get configured provider
const getProvider = (): AIProvider => {
  return (process.env.AI_PROVIDER as AIProvider) || 'openai';
};

// Initialize clients lazily
let openaiClient: OpenAI | null = null;
let anthropicClient: Anthropic | null = null;
let groqClient: Groq | null = null;

const getOpenAI = () => {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
};

const getAnthropic = () => {
  if (!anthropicClient && process.env.ANTHROPIC_API_KEY) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropicClient;
};

const getGroq = () => {
  if (!groqClient && process.env.GROQ_API_KEY) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
};

// Model configurations per provider
const MODELS = {
  openai: {
    fast: 'gpt-4o-mini',      // $0.15/$0.60 per 1M tokens
    quality: 'gpt-4o',         // $2.50/$10.00 per 1M tokens
  },
  anthropic: {
    fast: 'claude-3-haiku-20240307',   // $0.25/$1.25 per 1M tokens
    quality: 'claude-3-5-sonnet-20241022', // $3.00/$15.00 per 1M tokens
  },
  groq: {
    fast: 'llama-3.1-8b-instant',      // $0.05/$0.10 per 1M tokens
    quality: 'llama-3.1-70b-versatile', // $0.59/$0.79 per 1M tokens
  },
  together: {
    fast: 'Qwen/Qwen2.5-7B-Instruct-Turbo',
    quality: 'Qwen/Qwen2.5-72B-Instruct-Turbo',
  },
};

/**
 * Unified chat completion across providers
 */
async function chatCompletion(
  systemPrompt: string,
  userPrompt: string,
  options: { json?: boolean; quality?: boolean } = {}
): Promise<string | null> {
  const provider = getProvider();
  const modelTier = options.quality ? 'quality' : 'fast';

  try {
    switch (provider) {
      case 'openai': {
        const client = getOpenAI();
        if (!client) return null;
        
        const response = await client.chat.completions.create({
          model: MODELS.openai[modelTier],
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 1000,
          ...(options.json && { response_format: { type: 'json_object' } }),
        });
        return response.choices[0]?.message?.content || null;
      }

      case 'anthropic': {
        const client = getAnthropic();
        if (!client) return null;

        const response = await client.messages.create({
          model: MODELS.anthropic[modelTier],
          max_tokens: 1000,
          system: systemPrompt + (options.json ? '\n\nRespond in valid JSON format only.' : ''),
          messages: [{ role: 'user', content: userPrompt }],
        });
        const content = response.content[0];
        return content.type === 'text' ? content.text : null;
      }

      case 'groq': {
        const client = getGroq();
        if (!client) return null;

        const response = await client.chat.completions.create({
          model: MODELS.groq[modelTier],
          messages: [
            { role: 'system', content: systemPrompt + (options.json ? '\n\nRespond in valid JSON format only.' : '') },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });
        return response.choices[0]?.message?.content || null;
      }

      case 'together': {
        // Together AI uses OpenAI-compatible API
        const togetherClient = new OpenAI({
          apiKey: process.env.TOGETHER_API_KEY,
          baseURL: 'https://api.together.xyz/v1',
        });

        const response = await togetherClient.chat.completions.create({
          model: MODELS.together[modelTier],
          messages: [
            { role: 'system', content: systemPrompt + (options.json ? '\n\nRespond in valid JSON format only.' : '') },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });
        return response.choices[0]?.message?.content || null;
      }

      default:
        console.warn(`Unknown AI provider: ${provider}`);
        return null;
    }
  } catch (error) {
    console.error(`AI completion error (${provider}):`, error);
    return null;
  }
}

export interface AIIdeaAnalysis {
  suggestedCategory: IdeaCategory;
  targetAudience: string;
  competitors: string[];
  uniqueValueProposition: string;
  potentialRisks: string[];
  marketValidation: string;
  quickWins: string[];
}

/**
 * Analyze an idea description using AI
 */
export async function analyzeIdea(
  ideaName: string,
  description: string
): Promise<AIIdeaAnalysis | null> {
  const systemPrompt = `You are a business idea analyst. Analyze the given business idea and provide structured feedback.
          
Categories to choose from:
- ai-wrapper: AI tools built on top of APIs like OpenAI
- saas-tool: Software as a Service products
- micro-saas: Small, focused SaaS products
- notion-template: Notion templates and systems
- digital-product: Digital downloads, tools, assets
- newsletter: Email newsletters
- content-creator: YouTube, TikTok, podcasts
- community: Paid communities, memberships
- marketplace: Two-sided marketplaces
- info-product: Courses, ebooks, guides
- agency-service: Service agencies
- consulting: Consulting services
- productized-service: Packaged services with fixed scope
- ecommerce: Physical or digital product stores
- mobile-app: Mobile applications
- chrome-extension: Browser extensions
- other: Doesn't fit other categories`;

  const userPrompt = `Analyze this business idea:

Name: ${ideaName}
Description: ${description}

Provide analysis in this exact JSON format:
{
  "suggestedCategory": "one of the categories listed",
  "targetAudience": "specific description of ideal customer",
  "competitors": ["competitor1", "competitor2", "competitor3"],
  "uniqueValueProposition": "what makes this different",
  "potentialRisks": ["risk1", "risk2", "risk3"],
  "marketValidation": "how to quickly validate demand",
  "quickWins": ["quick win 1", "quick win 2"]
}`;

  try {
    const content = await chatCompletion(systemPrompt, userPrompt, { json: true });
    if (!content) return null;

    const analysis = JSON.parse(content) as AIIdeaAnalysis;
    return analysis;
  } catch (error) {
    console.error('AI analysis error:', error);
    return null;
  }
}

/**
 * Generate personalized improvement recommendations
 */
export async function generateAIRecommendations(
  ideaName: string,
  description: string,
  category: IdeaCategory,
  overallScore: number,
  weakestLayer: string,
  weakestLayerScore: number
): Promise<string[] | null> {
  const systemPrompt = `You are a startup advisor helping founders improve their business ideas. 
Provide specific, actionable recommendations. Be concise and practical.`;

  const userPrompt = `Help improve this business idea:

Name: ${ideaName}
Description: ${description}
Category: ${category}
Current Score: ${overallScore}/10
Weakest Area: ${weakestLayer} (${weakestLayerScore}%)

Provide 3 specific, actionable recommendations to improve the score. 
Each recommendation should be 1-2 sentences max.
Focus on the weakest area.
Return as JSON: {"recommendations": ["rec1", "rec2", "rec3"]}`;

  try {
    const content = await chatCompletion(systemPrompt, userPrompt, { json: true });
    if (!content) return null;

    const parsed = JSON.parse(content);
    return parsed.recommendations || parsed;
  } catch (error) {
    console.error('AI recommendations error:', error);
    return null;
  }
}

/**
 * Generate a pivot suggestion for low-scoring ideas
 */
export async function generateAIPivotSuggestion(
  ideaName: string,
  description: string,
  category: IdeaCategory,
  overallScore: number
): Promise<string | null> {
  if (overallScore >= 5) {
    return null;
  }

  const systemPrompt = `You are a startup advisor. The user has a low-scoring business idea. 
Suggest ONE specific pivot that could dramatically improve their chances of success.
Be direct and specific. One paragraph max.`;

  const userPrompt = `This idea scored ${overallScore}/10:

Name: ${ideaName}
Description: ${description}
Category: ${category}

Suggest one specific pivot or modification that could significantly improve this idea's viability.`;

  try {
    return await chatCompletion(systemPrompt, userPrompt);
  } catch (error) {
    console.error('AI pivot error:', error);
    return null;
  }
}
