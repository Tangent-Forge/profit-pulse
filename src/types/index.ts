/**
 * Profit Pulse Type Definitions
 * Based on Profit Pulse 2.0 Multi-Layer Evaluation System
 */

// ============================================================================
// TIER 1: Basic QPV Score (Free Tier)
// ============================================================================

export interface BasicQPVInput {
  ideaName: string
  description: string
  quickness: number // 0-10: How fast can you ship?
  profitability: number // 0-10: Revenue potential vs effort
  validationEase: number // 0-10: How quickly can you validate demand?
}

export interface BasicQPVResult {
  score: number // Weighted score 0-10
  interpretation: QPVInterpretation
  failureTeaser?: string // Teaser for upgrade
}

export type QPVInterpretation =
  | 'exceptional' // 8.0-10.0: Launch this now
  | 'strong'      // 6.0-7.9: Prioritize within 1-2 weeks
  | 'moderate'    // 4.0-5.9: Validate further before committing
  | 'weak'        // 0.0-3.9: Reconsider or pivot significantly

// ============================================================================
// TIER 2/3: Profit Pulse 2.0 - Multi-Layer Evaluation
// ============================================================================

// Layer 1: Founder Readiness (30% weight)
export interface FounderReadiness {
  skillMatch: number // 0-10: Do you have the skills NOW?
  timeAvailability: number // 0-10: Hours per week available
  financialBuffer: number // 0-10: Runway/emergency fund
}

// Layer 2: Idea Characteristics (40% weight)
export interface IdeaCharacteristics {
  quickness: number // 0-10: Time to ship (15% weight)
  profitability: number // 0-10: Revenue potential (10% weight)
  validationEase: number // 0-10: Speed to validate (10% weight)
  marketDemand: number // 0-10: Proven demand exists? (5% weight)
}

// Layer 3: Historical Success Patterns (20% weight)
export interface HistoricalPatterns {
  completionRisk: number // 0-10: How often do similar ideas get abandoned?
  sustainability: number // 0-10: % still active after 6 months
  category: IdeaCategory
}

export type IdeaCategory =
  | 'ai-wrapper'
  | 'saas-tool'
  | 'micro-saas'
  | 'notion-template'
  | 'digital-product'
  | 'newsletter'
  | 'content-creator'
  | 'community'
  | 'marketplace'
  | 'info-product'
  | 'agency-service'
  | 'consulting'
  | 'productized-service'
  | 'ecommerce'
  | 'mobile-app'
  | 'chrome-extension'
  | 'other'

// Layer 4: Contextual Viability (10% weight)
export interface ContextualViability {
  lifeStageFit: number // 0-10: Conflicts with major life events?
  marketTiming: number // 0-10: Right time for THIS idea?
}

// Energy Filter (Qualitative Gate)
export interface EnergyFilter {
  response: 'yes' | 'no' | 'maybe'
  reasoning?: string
}

export type EnergyFilterStatus = 'pass' | 'fail' | 'revise'

// Complete Evaluation Input
export interface FullEvaluationInput {
  // Basic Info
  ideaName: string
  description: string
  category: IdeaCategory

  // Layer 1: Founder Readiness
  founderReadiness: FounderReadiness

  // Layer 2: Idea Characteristics
  ideaCharacteristics: IdeaCharacteristics

  // Layer 3: Historical Patterns (partially auto-calculated)
  historicalPatterns: Partial<HistoricalPatterns>

  // Layer 4: Contextual Viability
  contextualViability: ContextualViability

  // Energy Filter
  energyFilter: EnergyFilter
}

// ============================================================================
// EVALUATION RESULTS
// ============================================================================

export interface LayerScore {
  raw: number // 0-10 scale
  weighted: number // After applying layer weight
  percentage: number // 0-100%
}

export interface FullEvaluationResult {
  // Overall Score
  overallScore: number // 0-10
  interpretation: QPVInterpretation

  // Layer Breakdown
  layers: {
    founderReadiness: LayerScore
    ideaCharacteristics: LayerScore
    historicalPatterns: LayerScore
    contextualViability: LayerScore
  }

  // Strengths & Gaps
  strengths: string[]
  gaps: Gap[]

  // Failure Mode Analysis
  obstacles: Obstacle[]

  // Energy Filter Result
  energyFilterStatus: EnergyFilterStatus
  energyFilterReasoning: string

  // Metadata
  evaluatedAt: Date
  ideaId: string
}

export interface Gap {
  type: 'critical' | 'warning' | 'minor'
  description: string
  mitigation: string
  action: string
}

export interface Obstacle {
  name: string
  failureRate: number // Percentage
  description: string
  mitigation: string
  action: string
}

// ============================================================================
// PRICING TIERS
// ============================================================================

export interface PricingTier {
  id: string
  name: string
  description: string
  price: string
  priceId: string
  features: string[]
  isPopular?: boolean
  buttonText: string
}

// ============================================================================
// FAILURE MODE DATABASE
// ============================================================================

export interface FailureModeData {
  category: IdeaCategory
  abandonmentRate: number // 0-100%
  sustainabilityRate: number // 0-100%
  commonFailures: {
    name: string
    percentage: number
    mitigation: string
  }[]
}
