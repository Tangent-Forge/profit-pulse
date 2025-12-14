/**
 * Improvement Suggestions Engine
 * Generates actionable recommendations to improve idea scores
 */

import { FullEvaluationInput, FullEvaluationResult, IdeaCategory } from '@/types';
import { getCategoryDisplayName } from './calculations';

export interface ImprovementSuggestion {
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  impact: string;
  action: string;
  potentialScoreGain: number;
}

/**
 * Generate improvement suggestions based on evaluation results
 */
export function generateImprovementSuggestions(
  input: FullEvaluationInput,
  result: FullEvaluationResult
): ImprovementSuggestion[] {
  const suggestions: ImprovementSuggestion[] = [];

  // Analyze each layer and generate targeted improvements
  
  // Layer 1: Founder Readiness improvements
  if (result.layers.founderReadiness.percentage < 70) {
    if (input.founderReadiness.skillMatch < 6) {
      suggestions.push({
        priority: 'high',
        category: 'Founder Readiness',
        title: 'Address Skill Gap',
        description: `Your skill match score of ${input.founderReadiness.skillMatch}/10 is limiting your readiness.`,
        impact: 'Could improve overall score by 0.5-1.0 points',
        action: 'Consider: (1) Take a focused 2-week crash course, (2) Find a technical co-founder, or (3) Use no-code tools to bridge the gap',
        potentialScoreGain: 0.8,
      });
    }
    
    if (input.founderReadiness.timeAvailability < 5) {
      suggestions.push({
        priority: 'high',
        category: 'Founder Readiness',
        title: 'Increase Time Commitment',
        description: `Only ${input.founderReadiness.timeAvailability * 2} hours/week may not be enough for consistent progress.`,
        impact: 'Could improve overall score by 0.3-0.6 points',
        action: 'Block 2-hour daily slots, delegate other responsibilities, or consider a simpler MVP scope',
        potentialScoreGain: 0.5,
      });
    }
    
    if (input.founderReadiness.financialBuffer < 5) {
      suggestions.push({
        priority: 'medium',
        category: 'Founder Readiness',
        title: 'Build Financial Runway',
        description: 'Limited financial buffer increases pressure and risk of premature abandonment.',
        impact: 'Could improve overall score by 0.2-0.4 points',
        action: 'Set a validation milestone (e.g., $100 MRR in 30 days) before going all-in, or keep day job while validating',
        potentialScoreGain: 0.3,
      });
    }
  }

  // Layer 2: Idea Characteristics improvements
  if (result.layers.ideaCharacteristics.percentage < 70) {
    if (input.ideaCharacteristics.quickness < 6) {
      suggestions.push({
        priority: 'high',
        category: 'Idea Characteristics',
        title: 'Simplify Your MVP',
        description: `Quickness score of ${input.ideaCharacteristics.quickness}/10 suggests scope is too large.`,
        impact: 'Could improve overall score by 0.6-1.0 points (highest weight layer)',
        action: 'Cut features to ship in 48 hours: What\'s the ONE thing that proves demand? Build only that.',
        potentialScoreGain: 0.9,
      });
    }
    
    if (input.ideaCharacteristics.validationEase < 6) {
      suggestions.push({
        priority: 'high',
        category: 'Idea Characteristics',
        title: 'Design for Faster Validation',
        description: 'Slow validation means longer time to learn if the idea works.',
        impact: 'Could improve overall score by 0.4-0.6 points',
        action: 'Pre-sell before building: Create a landing page with "Buy Now" button, run $50 in ads, measure clicks',
        potentialScoreGain: 0.5,
      });
    }
    
    if (input.ideaCharacteristics.marketDemand < 5) {
      suggestions.push({
        priority: 'medium',
        category: 'Idea Characteristics',
        title: 'Validate Market Demand',
        description: 'Unproven market demand is a major risk factor.',
        impact: 'Could improve overall score by 0.2-0.3 points',
        action: 'Find 3 competitors or adjacent products. If none exist, you may be inventing a category (high risk).',
        potentialScoreGain: 0.25,
      });
    }
    
    if (input.ideaCharacteristics.profitability < 6) {
      suggestions.push({
        priority: 'medium',
        category: 'Idea Characteristics',
        title: 'Improve Revenue Model',
        description: `Profitability score of ${input.ideaCharacteristics.profitability}/10 suggests monetization challenges.`,
        impact: 'Could improve overall score by 0.3-0.5 points',
        action: 'Consider: (1) Higher price point with more value, (2) Recurring revenue model, (3) Upsell path to enterprise',
        potentialScoreGain: 0.4,
      });
    }
  }

  // Layer 3: Historical Patterns improvements
  if (result.layers.historicalPatterns.percentage < 50) {
    suggestions.push({
      priority: 'medium',
      category: 'Historical Patterns',
      title: `Study ${getCategoryDisplayName(input.category)} Failures`,
      description: `${getCategoryDisplayName(input.category)} ideas have high historical failure rates.`,
      impact: 'Understanding failure modes can prevent common mistakes',
      action: 'Review the top 3 failure modes for your category and implement mitigations BEFORE building',
      potentialScoreGain: 0.3,
    });
  }

  // Layer 4: Contextual Viability improvements
  if (result.layers.contextualViability.percentage < 60) {
    if (input.contextualViability.lifeStageFit < 5) {
      suggestions.push({
        priority: 'low',
        category: 'Contextual Viability',
        title: 'Address Life Stage Conflicts',
        description: 'Major life events competing for attention increase failure risk.',
        impact: 'Could improve overall score by 0.1-0.2 points',
        action: 'Consider delaying launch by 3-6 months, or reduce scope to "maintenance mode" level of effort',
        potentialScoreGain: 0.15,
      });
    }
    
    if (input.contextualViability.marketTiming < 5) {
      suggestions.push({
        priority: 'low',
        category: 'Contextual Viability',
        title: 'Reconsider Market Timing',
        description: 'Poor market timing can doom even great ideas.',
        impact: 'Could improve overall score by 0.1-0.2 points',
        action: 'Research: Is the market growing? Are there recent funding rounds in this space? Any regulatory tailwinds?',
        potentialScoreGain: 0.15,
      });
    }
  }

  // Energy Filter improvements
  if (result.energyFilterStatus === 'revise') {
    suggestions.push({
      priority: 'high',
      category: 'Energy Filter',
      title: 'Refine Your Idea Scope',
      description: 'You\'re uncertain about maintaining this at $500/month - that\'s a red flag.',
      impact: 'Critical for long-term sustainability',
      action: 'Ask: What would need to change for you to be proud of this? Adjust scope, audience, or business model accordingly.',
      potentialScoreGain: 0,
    });
  }

  // "Close but missing" feedback for ideas scoring 5-7
  if (result.overallScore >= 5 && result.overallScore < 7) {
    const lowestLayer = Object.entries(result.layers)
      .sort((a, b) => a[1].percentage - b[1].percentage)[0];
    
    suggestions.unshift({
      priority: 'high',
      category: 'Quick Win',
      title: `Your idea is close! Focus on ${formatLayerName(lowestLayer[0])}`,
      description: `At ${result.overallScore}/10, you're in the "moderate" zone. A few targeted improvements could push you to "strong" (7+).`,
      impact: `Improving ${formatLayerName(lowestLayer[0])} from ${lowestLayer[1].percentage}% could add 0.5-1.0 points`,
      action: `Your lowest-scoring layer is ${formatLayerName(lowestLayer[0])} at ${lowestLayer[1].percentage}%. Focus your energy here first.`,
      potentialScoreGain: 1.0,
    });
  }

  // Sort by priority and potential score gain
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return suggestions
    .sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.potentialScoreGain - a.potentialScoreGain;
    })
    .slice(0, 5); // Return top 5 suggestions
}

/**
 * Format layer name for display
 */
function formatLayerName(layerKey: string): string {
  const names: Record<string, string> = {
    founderReadiness: 'Founder Readiness',
    ideaCharacteristics: 'Idea Characteristics',
    historicalPatterns: 'Historical Patterns',
    contextualViability: 'Contextual Viability',
  };
  return names[layerKey] || layerKey;
}

/**
 * Calculate potential score if all suggestions are implemented
 */
export function calculatePotentialScore(
  currentScore: number,
  suggestions: ImprovementSuggestion[]
): number {
  const totalGain = suggestions.reduce((sum, s) => sum + s.potentialScoreGain, 0);
  // Cap at 10 and apply diminishing returns
  const adjustedGain = Math.min(totalGain * 0.7, 10 - currentScore);
  return Math.min(10, currentScore + adjustedGain);
}

/**
 * Generate a "pivot suggestion" for low-scoring ideas
 */
export function generatePivotSuggestion(
  input: FullEvaluationInput,
  result: FullEvaluationResult
): string | null {
  if (result.overallScore >= 5) return null;

  const pivots: string[] = [];

  // Suggest category pivot if historical patterns are poor
  if (result.layers.historicalPatterns.percentage < 30) {
    const betterCategories: IdeaCategory[] = ['consulting', 'agency-service', 'productized-service'];
    if (!betterCategories.includes(input.category)) {
      pivots.push(`Consider repositioning as a service first (consulting/agency) to validate demand before building product.`);
    }
  }

  // Suggest scope reduction if quickness is low
  if (input.ideaCharacteristics.quickness < 4) {
    pivots.push(`Your idea may be too complex. What's the simplest version that still solves the core problem?`);
  }

  // Suggest audience pivot if validation is hard
  if (input.ideaCharacteristics.validationEase < 4) {
    pivots.push(`Consider targeting a more accessible audience. Who would be easiest to reach and sell to?`);
  }

  return pivots.length > 0 ? pivots[0] : null;
}
