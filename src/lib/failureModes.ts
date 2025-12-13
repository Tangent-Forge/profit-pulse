/**
 * Failure Mode Database
 * Historical data on why ideas in each category fail
 */

import { FailureModeData, IdeaCategory } from '@/types'

const failureModeDatabase: Record<IdeaCategory, FailureModeData> = {
  'ai-wrapper': {
    category: 'ai-wrapper',
    abandonmentRate: 78,
    sustainabilityRate: 22,
    commonFailures: [
      { name: 'API dependency risk', percentage: 45, mitigation: 'Build unique value layer on top of API' },
      { name: 'Race to bottom pricing', percentage: 35, mitigation: 'Focus on specific niche, not general tool' },
      { name: 'Feature parity with ChatGPT', percentage: 20, mitigation: 'Solve workflow problem, not just wrap API' },
    ]
  },
  'saas-tool': {
    category: 'saas-tool',
    abandonmentRate: 65,
    sustainabilityRate: 35,
    commonFailures: [
      { name: 'Scope creep before PMF', percentage: 40, mitigation: 'Ship MVP in 2 weeks, iterate based on feedback' },
      { name: 'Underestimating support burden', percentage: 30, mitigation: 'Build self-serve docs from day 1' },
      { name: 'Churn from poor onboarding', percentage: 30, mitigation: 'Optimize first 5 minutes of user experience' },
    ]
  },
  'micro-saas': {
    category: 'micro-saas',
    abandonmentRate: 55,
    sustainabilityRate: 45,
    commonFailures: [
      { name: 'Market too small', percentage: 35, mitigation: 'Validate $10k MRR ceiling before building' },
      { name: 'Solo founder burnout', percentage: 35, mitigation: 'Automate everything, limit support hours' },
      { name: 'Platform dependency', percentage: 30, mitigation: 'Diversify integrations early' },
    ]
  },
  'notion-template': {
    category: 'notion-template',
    abandonmentRate: 70,
    sustainabilityRate: 30,
    commonFailures: [
      { name: 'Low perceived value', percentage: 45, mitigation: 'Bundle with video training or community' },
      { name: 'Easy to replicate', percentage: 35, mitigation: 'Build personal brand around template' },
      { name: 'One-time purchase ceiling', percentage: 20, mitigation: 'Create template ecosystem with updates' },
    ]
  },
  'digital-product': {
    category: 'digital-product',
    abandonmentRate: 60,
    sustainabilityRate: 40,
    commonFailures: [
      { name: 'No distribution channel', percentage: 40, mitigation: 'Build audience before product' },
      { name: 'Refund rate too high', percentage: 30, mitigation: 'Set clear expectations, offer preview' },
      { name: 'Support overhead', percentage: 30, mitigation: 'Create comprehensive FAQ and docs' },
    ]
  },
  'newsletter': {
    category: 'newsletter',
    abandonmentRate: 80,
    sustainabilityRate: 20,
    commonFailures: [
      { name: 'Consistency burnout', percentage: 50, mitigation: 'Batch write 4 weeks ahead' },
      { name: 'Slow subscriber growth', percentage: 30, mitigation: 'Cross-promote, guest posts, paid ads' },
      { name: 'Monetization challenges', percentage: 20, mitigation: 'Plan revenue model before 1k subs' },
    ]
  },
  'content-creator': {
    category: 'content-creator',
    abandonmentRate: 85,
    sustainabilityRate: 15,
    commonFailures: [
      { name: 'Algorithm dependency', percentage: 40, mitigation: 'Build email list from day 1' },
      { name: 'Content treadmill burnout', percentage: 40, mitigation: 'Repurpose content across platforms' },
      { name: 'Delayed monetization', percentage: 20, mitigation: 'Offer paid product at 1k followers' },
    ]
  },
  'community': {
    category: 'community',
    abandonmentRate: 75,
    sustainabilityRate: 25,
    commonFailures: [
      { name: 'Cold start problem', percentage: 40, mitigation: 'Seed with 50 engaged founding members' },
      { name: 'Moderation burden', percentage: 35, mitigation: 'Establish clear rules, empower moderators' },
      { name: 'Value proposition unclear', percentage: 25, mitigation: 'Define unique benefit vs free alternatives' },
    ]
  },
  'marketplace': {
    category: 'marketplace',
    abandonmentRate: 82,
    sustainabilityRate: 18,
    commonFailures: [
      { name: 'Chicken-and-egg problem', percentage: 50, mitigation: 'Subsidize one side, constrain geography' },
      { name: 'Disintermediation', percentage: 30, mitigation: 'Provide value beyond matching' },
      { name: 'Unit economics', percentage: 20, mitigation: 'Validate take rate before scaling' },
    ]
  },
  'info-product': {
    category: 'info-product',
    abandonmentRate: 65,
    sustainabilityRate: 35,
    commonFailures: [
      { name: 'No unique insight', percentage: 40, mitigation: 'Share proprietary framework or data' },
      { name: 'Completion rate issues', percentage: 35, mitigation: 'Design for quick wins, not comprehensiveness' },
      { name: 'Refund abuse', percentage: 25, mitigation: 'Drip content, offer payment plans' },
    ]
  },
  'agency-service': {
    category: 'agency-service',
    abandonmentRate: 50,
    sustainabilityRate: 50,
    commonFailures: [
      { name: 'Founder as bottleneck', percentage: 45, mitigation: 'Document processes, hire early' },
      { name: 'Scope creep', percentage: 35, mitigation: 'Fixed scope packages, change order process' },
      { name: 'Client concentration', percentage: 20, mitigation: 'No client > 30% of revenue' },
    ]
  },
  'consulting': {
    category: 'consulting',
    abandonmentRate: 45,
    sustainabilityRate: 55,
    commonFailures: [
      { name: 'Feast or famine cycles', percentage: 45, mitigation: 'Always be marketing, even when busy' },
      { name: 'Underpricing', percentage: 35, mitigation: 'Value-based pricing, raise rates 20%' },
      { name: 'No leverage', percentage: 20, mitigation: 'Productize knowledge into courses/tools' },
    ]
  },
  'productized-service': {
    category: 'productized-service',
    abandonmentRate: 55,
    sustainabilityRate: 45,
    commonFailures: [
      { name: 'Delivery inconsistency', percentage: 40, mitigation: 'SOPs for everything, QA checklist' },
      { name: 'Hiring challenges', percentage: 35, mitigation: 'Build talent pipeline before scaling' },
      { name: 'Margin compression', percentage: 25, mitigation: 'Automate intake and delivery' },
    ]
  },
  'ecommerce': {
    category: 'ecommerce',
    abandonmentRate: 70,
    sustainabilityRate: 30,
    commonFailures: [
      { name: 'Customer acquisition cost', percentage: 40, mitigation: 'Build organic channel before paid' },
      { name: 'Inventory/fulfillment', percentage: 35, mitigation: 'Start with dropship or print-on-demand' },
      { name: 'Competition on price', percentage: 25, mitigation: 'Differentiate on brand, not price' },
    ]
  },
  'mobile-app': {
    category: 'mobile-app',
    abandonmentRate: 80,
    sustainabilityRate: 20,
    commonFailures: [
      { name: 'App store discovery', percentage: 40, mitigation: 'Build audience before app launch' },
      { name: 'Development complexity', percentage: 35, mitigation: 'Start with web app, validate first' },
      { name: 'Retention cliff', percentage: 25, mitigation: 'Focus on Day 1 and Day 7 retention' },
    ]
  },
  'chrome-extension': {
    category: 'chrome-extension',
    abandonmentRate: 65,
    sustainabilityRate: 35,
    commonFailures: [
      { name: 'Chrome Web Store changes', percentage: 40, mitigation: 'Build direct distribution channel' },
      { name: 'Monetization friction', percentage: 35, mitigation: 'Freemium with clear upgrade path' },
      { name: 'Feature absorbed by browser', percentage: 25, mitigation: 'Solve workflow, not feature gap' },
    ]
  },
  'other': {
    category: 'other',
    abandonmentRate: 68,
    sustainabilityRate: 32,
    commonFailures: [
      { name: 'Unclear value proposition', percentage: 40, mitigation: 'Define specific problem and audience' },
      { name: 'Execution complexity', percentage: 35, mitigation: 'Start with simplest possible version' },
      { name: 'Market timing', percentage: 25, mitigation: 'Validate demand before building' },
    ]
  },
}

export function getFailureModeData(category: IdeaCategory): FailureModeData {
  return failureModeDatabase[category] || failureModeDatabase['other']
}

export function getAllCategories(): IdeaCategory[] {
  return Object.keys(failureModeDatabase) as IdeaCategory[]
}
