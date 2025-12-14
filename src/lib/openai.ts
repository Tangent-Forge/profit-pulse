/**
 * OpenAI Integration for Profit Pulse
 * AI-powered idea analysis and recommendations
 */

import OpenAI from 'openai';
import { IdeaCategory } from '@/types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured');
    return null;
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a business idea analyst. Analyze the given business idea and provide structured feedback.
          
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
- other: Doesn't fit other categories

Respond in JSON format only.`,
        },
        {
          role: 'user',
          content: `Analyze this business idea:

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
}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    const analysis = JSON.parse(content) as AIIdeaAnalysis;
    return analysis;
  } catch (error) {
    console.error('OpenAI analysis error:', error);
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
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a startup advisor helping founders improve their business ideas. 
Provide specific, actionable recommendations. Be concise and practical.`,
        },
        {
          role: 'user',
          content: `Help improve this business idea:

Name: ${ideaName}
Description: ${description}
Category: ${category}
Current Score: ${overallScore}/10
Weakest Area: ${weakestLayer} (${weakestLayerScore}%)

Provide 3 specific, actionable recommendations to improve the score. 
Each recommendation should be 1-2 sentences max.
Focus on the weakest area.
Return as a JSON array of strings.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    return parsed.recommendations || parsed;
  } catch (error) {
    console.error('OpenAI recommendations error:', error);
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
  if (!process.env.OPENAI_API_KEY || overallScore >= 5) {
    return null;
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a startup advisor. The user has a low-scoring business idea. 
Suggest ONE specific pivot that could dramatically improve their chances of success.
Be direct and specific. One paragraph max.`,
        },
        {
          role: 'user',
          content: `This idea scored ${overallScore}/10:

Name: ${ideaName}
Description: ${description}
Category: ${category}

Suggest one specific pivot or modification that could significantly improve this idea's viability.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('OpenAI pivot error:', error);
    return null;
  }
}
