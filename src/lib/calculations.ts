/**
 * Profit Pulse Calculation Engines
 * Implements the weighted scoring formulas for QPV and multi-layer evaluation
 */

import {
  BasicQPVInput,
  BasicQPVResult,
  QPVInterpretation,
  IdeaCategory,
  FullEvaluationInput,
  FullEvaluationResult,
  LayerScore,
  Gap,
  Obstacle,
  EnergyFilterStatus,
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

// ============================================================================
// TIER 2/3: Full Multi-Layer Evaluation (Profit Pulse 2.0)
// ============================================================================

// Layer weights from recovered specs
const LAYER_WEIGHTS = {
  founderReadiness: 0.30,      // 30%
  ideaCharacteristics: 0.40,   // 40%
  historicalPatterns: 0.20,    // 20%
  contextualViability: 0.10,   // 10%
}

// Sub-weights within Idea Characteristics layer
const IDEA_CHAR_WEIGHTS = {
  quickness: 0.15,       // 15% of total (37.5% of layer)
  profitability: 0.10,   // 10% of total (25% of layer)
  validationEase: 0.10,  // 10% of total (25% of layer)
  marketDemand: 0.05,    // 5% of total (12.5% of layer)
}

/**
 * Calculate Layer 1: Founder Readiness Score (30% weight)
 * Evaluates: Skills match, time availability, financial buffer
 */
function calculateFounderReadiness(input: FullEvaluationInput): LayerScore {
  const { skillMatch, timeAvailability, financialBuffer } = input.founderReadiness
  
  // Equal weight within layer (each 10% of total = 33.3% of layer)
  const raw = (skillMatch + timeAvailability + financialBuffer) / 3
  const weighted = raw * LAYER_WEIGHTS.founderReadiness
  const percentage = (raw / 10) * 100

  return { raw: parseFloat(raw.toFixed(2)), weighted: parseFloat(weighted.toFixed(2)), percentage: parseFloat(percentage.toFixed(1)) }
}

/**
 * Calculate Layer 2: Idea Characteristics Score (40% weight)
 * Enhanced QPV with Market Demand dimension
 */
function calculateIdeaCharacteristics(input: FullEvaluationInput): LayerScore {
  const { quickness, profitability, validationEase, marketDemand } = input.ideaCharacteristics
  
  // Weighted calculation within layer
  const raw = (
    (quickness * IDEA_CHAR_WEIGHTS.quickness) +
    (profitability * IDEA_CHAR_WEIGHTS.profitability) +
    (validationEase * IDEA_CHAR_WEIGHTS.validationEase) +
    (marketDemand * IDEA_CHAR_WEIGHTS.marketDemand)
  ) / LAYER_WEIGHTS.ideaCharacteristics // Normalize to 0-10 scale
  
  const weighted = raw * LAYER_WEIGHTS.ideaCharacteristics
  const percentage = (raw / 10) * 100

  return { raw: parseFloat(raw.toFixed(2)), weighted: parseFloat(weighted.toFixed(2)), percentage: parseFloat(percentage.toFixed(1)) }
}

/**
 * Calculate Layer 3: Historical Patterns Score (20% weight)
 * Based on category-specific failure data
 */
function calculateHistoricalPatterns(input: FullEvaluationInput): LayerScore {
  const failureData = getFailureModeData(input.category)
  
  // Convert abandonment/sustainability rates to scores (inverted - lower abandonment = higher score)
  const completionScore = 10 - (failureData.abandonmentRate / 10) // 0-10 scale
  const sustainabilityScore = failureData.sustainabilityRate / 10 // 0-10 scale
  
  // Completion risk is 15% weight, sustainability is 5% weight (within 20% layer)
  const raw = (completionScore * 0.75) + (sustainabilityScore * 0.25)
  const weighted = raw * LAYER_WEIGHTS.historicalPatterns
  const percentage = (raw / 10) * 100

  return { raw: parseFloat(raw.toFixed(2)), weighted: parseFloat(weighted.toFixed(2)), percentage: parseFloat(percentage.toFixed(1)) }
}

/**
 * Calculate Layer 4: Contextual Viability Score (10% weight)
 * Evaluates: Life stage fit, market timing
 */
function calculateContextualViability(input: FullEvaluationInput): LayerScore {
  const { lifeStageFit, marketTiming } = input.contextualViability
  
  // Equal weight within layer (each 5% of total = 50% of layer)
  const raw = (lifeStageFit + marketTiming) / 2
  const weighted = raw * LAYER_WEIGHTS.contextualViability
  const percentage = (raw / 10) * 100

  return { raw: parseFloat(raw.toFixed(2)), weighted: parseFloat(weighted.toFixed(2)), percentage: parseFloat(percentage.toFixed(1)) }
}

/**
 * Determine Energy Filter status
 */
function getEnergyFilterStatus(response: 'yes' | 'no' | 'maybe'): EnergyFilterStatus {
  switch (response) {
    case 'yes': return 'pass'
    case 'no': return 'fail'
    case 'maybe': return 'revise'
  }
}

/**
 * Generate strengths based on evaluation scores
 */
function generateStrengths(input: FullEvaluationInput, layers: FullEvaluationResult['layers']): string[] {
  const strengths: string[] = []
  
  // Founder Readiness strengths
  if (input.founderReadiness.skillMatch >= 8) {
    strengths.push('Strong skill match — you can start building immediately')
  }
  if (input.founderReadiness.timeAvailability >= 8) {
    strengths.push(`${input.founderReadiness.timeAvailability * 2}+ hours/week available — sufficient for launch phase`)
  }
  if (input.founderReadiness.financialBuffer >= 7) {
    strengths.push('Solid financial buffer — can weather slow initial traction')
  }
  
  // Idea Characteristics strengths
  if (input.ideaCharacteristics.quickness >= 8) {
    strengths.push('High quickness — can ship MVP in days, not weeks')
  }
  if (input.ideaCharacteristics.validationEase >= 8) {
    strengths.push('Easy validation — can test demand within 48 hours')
  }
  if (input.ideaCharacteristics.marketDemand >= 7) {
    strengths.push('Proven market demand — competitors validate the space')
  }
  
  // Contextual strengths
  if (input.contextualViability.marketTiming >= 8) {
    strengths.push('Excellent market timing — ride current trends')
  }
  if (input.contextualViability.lifeStageFit >= 8) {
    strengths.push('Great life stage fit — no major conflicts')
  }
  
  // Layer-level strengths
  if (layers.founderReadiness.percentage >= 70) {
    strengths.push('Overall founder readiness is strong')
  }
  if (layers.historicalPatterns.percentage >= 50) {
    strengths.push('Category has better-than-average success rates')
  }
  
  return strengths.slice(0, 5) // Limit to top 5
}

/**
 * Generate gaps (risks) based on evaluation scores
 */
function generateGaps(input: FullEvaluationInput, layers: FullEvaluationResult['layers']): Gap[] {
  const gaps: Gap[] = []
  
  // Critical gaps (scores <= 3)
  if (input.founderReadiness.financialBuffer <= 3) {
    gaps.push({
      type: 'critical',
      description: 'No financial buffer',
      mitigation: 'Ideas with 90+ day revenue cycles are high risk without runway',
      action: `Set validation milestone at $100 MRR within 30 days or pivot`
    })
  }
  
  if (input.founderReadiness.timeAvailability <= 3) {
    gaps.push({
      type: 'critical',
      description: 'Insufficient time availability',
      mitigation: 'Less than 10 hrs/week makes consistent progress difficult',
      action: 'Block dedicated time or consider simpler idea scope'
    })
  }
  
  // Warning gaps (scores 4-5)
  if (input.founderReadiness.skillMatch <= 5) {
    gaps.push({
      type: 'warning',
      description: `Skill gap in required areas`,
      mitigation: 'Missing skills slow down execution and increase failure risk',
      action: 'Add "learn core skill" to Week 1 plan or find co-founder'
    })
  }
  
  if (input.ideaCharacteristics.marketDemand <= 4) {
    gaps.push({
      type: 'warning',
      description: 'Unproven market demand',
      mitigation: 'Inventing new categories has high failure rate',
      action: 'Find 3 competitors or adjacent products before building'
    })
  }
  
  if (input.contextualViability.lifeStageFit <= 4) {
    gaps.push({
      type: 'warning',
      description: 'Life stage conflicts detected',
      mitigation: 'Major life events compete for attention and energy',
      action: 'Consider timing — delay launch or reduce scope'
    })
  }
  
  // Minor gaps (scores 6)
  if (input.ideaCharacteristics.profitability <= 6) {
    gaps.push({
      type: 'minor',
      description: 'Moderate profitability ceiling',
      mitigation: 'May require high volume or upsells to reach target revenue',
      action: 'Plan pricing strategy and expansion path early'
    })
  }
  
  if (layers.historicalPatterns.percentage < 40) {
    gaps.push({
      type: 'warning',
      description: 'Category has high historical failure rate',
      mitigation: 'Similar ideas often fail — study why',
      action: 'Review failure modes and implement mitigations before building'
    })
  }
  
  // Sort by severity
  const severityOrder = { critical: 0, warning: 1, minor: 2 }
  return gaps.sort((a, b) => severityOrder[a.type] - severityOrder[b.type]).slice(0, 5)
}

/**
 * Generate obstacles from failure mode data
 */
function generateObstacles(category: IdeaCategory): Obstacle[] {
  const failureData = getFailureModeData(category)
  
  return failureData.commonFailures.map(failure => ({
    name: failure.name,
    failureRate: failure.percentage,
    description: `${failure.percentage}% of ${getCategoryDisplayName(category)} ideas fail due to this`,
    mitigation: failure.mitigation,
    action: `Address before Week 2: ${failure.mitigation}`
  }))
}

/**
 * Calculate full Profit Pulse 2.0 evaluation
 * Combines all 4 layers into comprehensive assessment
 */
export function calculateFullEvaluation(input: FullEvaluationInput): FullEvaluationResult {
  // Calculate each layer
  const founderReadiness = calculateFounderReadiness(input)
  const ideaCharacteristics = calculateIdeaCharacteristics(input)
  const historicalPatterns = calculateHistoricalPatterns(input)
  const contextualViability = calculateContextualViability(input)
  
  const layers = {
    founderReadiness,
    ideaCharacteristics,
    historicalPatterns,
    contextualViability
  }
  
  // Calculate overall score (sum of weighted layer scores)
  const overallScore = parseFloat((
    founderReadiness.weighted +
    ideaCharacteristics.weighted +
    historicalPatterns.weighted +
    contextualViability.weighted
  ).toFixed(2))
  
  const interpretation = getInterpretation(overallScore)
  
  // Generate insights
  const strengths = generateStrengths(input, layers)
  const gaps = generateGaps(input, layers)
  const obstacles = generateObstacles(input.category)
  
  // Energy filter
  const energyFilterStatus = getEnergyFilterStatus(input.energyFilter.response)
  const energyFilterReasoning = input.energyFilter.reasoning || getDefaultEnergyReasoning(energyFilterStatus)
  
  return {
    overallScore,
    interpretation,
    layers,
    strengths,
    gaps,
    obstacles,
    energyFilterStatus,
    energyFilterReasoning,
    evaluatedAt: new Date(),
    ideaId: generateIdeaId(input.ideaName)
  }
}

/**
 * Get default energy filter reasoning
 */
function getDefaultEnergyReasoning(status: EnergyFilterStatus): string {
  switch (status) {
    case 'pass':
      return 'You would be proud to maintain this at $500/month'
    case 'fail':
      return 'This idea is misaligned with your values — not worth maintaining even if profitable'
    case 'revise':
      return 'The scope, audience, or business model needs adjustment before committing'
  }
}

/**
 * Generate a simple idea ID
 */
function generateIdeaId(ideaName: string): string {
  const timestamp = Date.now().toString(36)
  const slug = ideaName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20)
  return `${slug}-${timestamp}`
}
