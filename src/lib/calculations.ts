/**
 * Profit Pulse Calculation Engines
 * Implements the weighted scoring formulas for QPV and multi-layer evaluation
 */

import {
  BasicQPVInput,
  BasicQPVResult,
  QPVInterpretation,
  IdeaCategory,
} from '@/types'
import { getFailureModeData } from './failureModes'

// ============================================================================
// TIER 1: Basic QPV Calculator (Free)
// ============================================================================

/**
 * Calculate basic QPV score
 * Formula: (Q × 0.4) + (P × 0.3) + (V × 0.3)
 */
export function calculateBasicQPV(input: BasicQPVInput): BasicQPVResult {
  const { quickness, profitability, validationEase } = input

  // Weighted QPV formula
  const score = (quickness * 0.4) + (profitability * 0.3) + (validationEase * 0.3)

  // Get interpretation
  const interpretation = getInterpretation(score)

  // Get failure teaser (for upgrade CTA)
  const failureData = getFailureModeData('other') // Generic for Tier 1
  const failureTeaser = `But ${failureData.abandonmentRate}% of similar ideas fail. Want to see why?`

  return {
    score: parseFloat(score.toFixed(2)),
    interpretation,
    failureTeaser
  }
}

/**
 * Get QPV interpretation based on score
 */
export function getInterpretation(score: number): QPVInterpretation {
  if (score >= 8.0) return 'exceptional'
  if (score >= 6.0) return 'strong'
  if (score >= 4.0) return 'moderate'
  return 'weak'
}

/**
 * Get interpretation text
 */
export function getInterpretationText(interpretation: QPVInterpretation): string {
  switch (interpretation) {
    case 'exceptional':
      return 'Exceptional — launch this now'
    case 'strong':
      return 'Strong — prioritize within 1-2 weeks'
    case 'moderate':
      return 'Moderate — validate further before committing'
    case 'weak':
      return 'Weak — reconsider or pivot significantly'
  }
}

/**
 * Get score color class based on interpretation
 */
export function getScoreColor(interpretation: QPVInterpretation): string {
  switch (interpretation) {
    case 'exceptional': return 'text-tf-success-glow'
    case 'strong': return 'text-tf-forge-orange'
    case 'moderate': return 'text-tf-copper-sheen'
    case 'weak': return 'text-tf-error-glow'
    default: return 'text-tf-muted-steel'
  }
}

/**
 * Get score gradient class based on interpretation
 */
export function getScoreGradient(interpretation: QPVInterpretation): string {
  switch (interpretation) {
    case 'exceptional': return 'from-tf-success to-tf-success-glow'
    case 'strong': return 'from-tf-forge-orange to-tf-ember-glow'
    case 'moderate': return 'from-tf-dark-copper to-tf-copper-sheen'
    case 'weak': return 'from-tf-error to-tf-error-glow'
    default: return 'from-tf-steel-gray to-tf-muted-steel'
  }
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: IdeaCategory): string {
  const names: Record<IdeaCategory, string> = {
    'ai-wrapper': 'AI Wrapper/Tool',
    'saas-tool': 'SaaS Tool',
    'micro-saas': 'Micro-SaaS',
    'notion-template': 'Notion Template',
    'digital-product': 'Digital Product',
    'newsletter': 'Newsletter',
    'content-creator': 'Content Creator',
    'community': 'Community',
    'marketplace': 'Marketplace',
    'info-product': 'Info Product/Course',
    'agency-service': 'Agency/Service',
    'consulting': 'Consulting',
    'productized-service': 'Productized Service',
    'ecommerce': 'E-commerce',
    'mobile-app': 'Mobile App',
    'chrome-extension': 'Chrome Extension',
    'other': 'Other'
  }
  return names[category] || category
}
