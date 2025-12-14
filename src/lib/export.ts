/**
 * Export Functionality
 * Generate PDF and Markdown exports of evaluations
 */

import { FullEvaluationInput, FullEvaluationResult } from '@/types';
import { getInterpretationText, getCategoryDisplayName } from './calculations';
import { ImprovementSuggestion } from './improvements';

/**
 * Generate Markdown export of evaluation
 */
export function generateMarkdownExport(
  input: FullEvaluationInput,
  result: FullEvaluationResult,
  suggestions?: ImprovementSuggestion[]
): string {
  const lines: string[] = [];

  // Header
  lines.push(`# Profit Pulse Evaluation Report`);
  lines.push(``);
  lines.push(`**Idea:** ${input.ideaName}`);
  lines.push(`**Category:** ${getCategoryDisplayName(input.category)}`);
  lines.push(`**Evaluated:** ${new Date(result.evaluatedAt).toLocaleDateString()}`);
  lines.push(`**ID:** ${result.ideaId}`);
  lines.push(``);

  // Overall Score
  lines.push(`## Overall Score: ${result.overallScore}/10`);
  lines.push(``);
  lines.push(`**Interpretation:** ${getInterpretationText(result.interpretation)}`);
  lines.push(``);

  // Description
  if (input.description) {
    lines.push(`### Description`);
    lines.push(``);
    lines.push(input.description);
    lines.push(``);
  }

  // Layer Breakdown
  lines.push(`## Layer Breakdown`);
  lines.push(``);
  lines.push(`| Layer | Score | Weight | Contribution |`);
  lines.push(`|-------|-------|--------|--------------|`);
  lines.push(`| Founder Readiness | ${result.layers.founderReadiness.percentage}% | 30% | ${result.layers.founderReadiness.weighted.toFixed(2)} |`);
  lines.push(`| Idea Characteristics | ${result.layers.ideaCharacteristics.percentage}% | 40% | ${result.layers.ideaCharacteristics.weighted.toFixed(2)} |`);
  lines.push(`| Historical Patterns | ${result.layers.historicalPatterns.percentage}% | 20% | ${result.layers.historicalPatterns.weighted.toFixed(2)} |`);
  lines.push(`| Contextual Viability | ${result.layers.contextualViability.percentage}% | 10% | ${result.layers.contextualViability.weighted.toFixed(2)} |`);
  lines.push(``);

  // Energy Filter
  lines.push(`## Energy Filter`);
  lines.push(``);
  lines.push(`**Status:** ${result.energyFilterStatus.toUpperCase()}`);
  lines.push(``);
  lines.push(`> ${result.energyFilterReasoning}`);
  lines.push(``);

  // Strengths
  if (result.strengths.length > 0) {
    lines.push(`## Strengths`);
    lines.push(``);
    result.strengths.forEach(strength => {
      lines.push(`- ✅ ${strength}`);
    });
    lines.push(``);
  }

  // Gaps
  if (result.gaps.length > 0) {
    lines.push(`## Gaps to Address`);
    lines.push(``);
    result.gaps.forEach(gap => {
      const icon = gap.type === 'critical' ? '🔴' : gap.type === 'warning' ? '🟠' : '🟡';
      lines.push(`### ${icon} ${gap.description}`);
      lines.push(``);
      lines.push(`**Risk:** ${gap.mitigation}`);
      lines.push(``);
      lines.push(`**Action:** ${gap.action}`);
      lines.push(``);
    });
  }

  // Obstacles
  if (result.obstacles.length > 0) {
    lines.push(`## Category-Specific Obstacles`);
    lines.push(``);
    lines.push(`These are the top failure modes for ${getCategoryDisplayName(input.category)} ideas:`);
    lines.push(``);
    result.obstacles.forEach(obstacle => {
      lines.push(`### ${obstacle.name} (${obstacle.failureRate}% failure rate)`);
      lines.push(``);
      lines.push(`**Mitigation:** ${obstacle.mitigation}`);
      lines.push(``);
    });
  }

  // Improvement Suggestions
  if (suggestions && suggestions.length > 0) {
    lines.push(`## Improvement Suggestions`);
    lines.push(``);
    suggestions.forEach((suggestion, i) => {
      const priorityIcon = suggestion.priority === 'high' ? '🔥' : suggestion.priority === 'medium' ? '⚡' : '💡';
      lines.push(`### ${i + 1}. ${priorityIcon} ${suggestion.title}`);
      lines.push(``);
      lines.push(`**Category:** ${suggestion.category}`);
      lines.push(``);
      lines.push(suggestion.description);
      lines.push(``);
      lines.push(`**Impact:** ${suggestion.impact}`);
      lines.push(``);
      lines.push(`**Action:** ${suggestion.action}`);
      lines.push(``);
    });
  }

  // Input Details
  lines.push(`## Input Details`);
  lines.push(``);
  lines.push(`### Founder Readiness`);
  lines.push(``);
  lines.push(`- Skill Match: ${input.founderReadiness.skillMatch}/10`);
  lines.push(`- Time Availability: ${input.founderReadiness.timeAvailability}/10`);
  lines.push(`- Financial Buffer: ${input.founderReadiness.financialBuffer}/10`);
  lines.push(``);
  lines.push(`### Idea Characteristics`);
  lines.push(``);
  lines.push(`- Quickness: ${input.ideaCharacteristics.quickness}/10`);
  lines.push(`- Profitability: ${input.ideaCharacteristics.profitability}/10`);
  lines.push(`- Validation Ease: ${input.ideaCharacteristics.validationEase}/10`);
  lines.push(`- Market Demand: ${input.ideaCharacteristics.marketDemand}/10`);
  lines.push(``);
  lines.push(`### Contextual Viability`);
  lines.push(``);
  lines.push(`- Life Stage Fit: ${input.contextualViability.lifeStageFit}/10`);
  lines.push(`- Market Timing: ${input.contextualViability.marketTiming}/10`);
  lines.push(``);

  // Footer
  lines.push(`---`);
  lines.push(``);
  lines.push(`*Generated by Profit Pulse — A Tangent Forge Product*`);
  lines.push(`*https://profitpulse.tangentforge.com*`);

  return lines.join('\n');
}

/**
 * Generate JSON export of evaluation
 */
export function generateJSONExport(
  input: FullEvaluationInput,
  result: FullEvaluationResult,
  suggestions?: ImprovementSuggestion[]
): string {
  return JSON.stringify({
    version: '2.0',
    exportedAt: new Date().toISOString(),
    input,
    result,
    suggestions: suggestions || [],
  }, null, 2);
}

/**
 * Generate CSV export for multiple ideas
 */
export function generateCSVExport(
  ideas: Array<{
    input: FullEvaluationInput;
    result: FullEvaluationResult;
  }>
): string {
  const headers = [
    'Idea Name',
    'Category',
    'Overall Score',
    'Interpretation',
    'Founder Readiness %',
    'Idea Characteristics %',
    'Historical Patterns %',
    'Contextual Viability %',
    'Energy Filter',
    'Skill Match',
    'Time Availability',
    'Financial Buffer',
    'Quickness',
    'Profitability',
    'Validation Ease',
    'Market Demand',
    'Life Stage Fit',
    'Market Timing',
    'Evaluated At',
  ];

  const rows = ideas.map(({ input, result }) => [
    `"${input.ideaName.replace(/"/g, '""')}"`,
    getCategoryDisplayName(input.category),
    result.overallScore,
    result.interpretation,
    result.layers.founderReadiness.percentage,
    result.layers.ideaCharacteristics.percentage,
    result.layers.historicalPatterns.percentage,
    result.layers.contextualViability.percentage,
    result.energyFilterStatus,
    input.founderReadiness.skillMatch,
    input.founderReadiness.timeAvailability,
    input.founderReadiness.financialBuffer,
    input.ideaCharacteristics.quickness,
    input.ideaCharacteristics.profitability,
    input.ideaCharacteristics.validationEase,
    input.ideaCharacteristics.marketDemand,
    input.contextualViability.lifeStageFit,
    input.contextualViability.marketTiming,
    new Date(result.evaluatedAt).toISOString(),
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

/**
 * Parse CSV import
 */
export function parseCSVImport(csv: string): Array<Partial<FullEvaluationInput>> {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const ideas: Array<Partial<FullEvaluationInput>> = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const idea: Partial<FullEvaluationInput> = {};

    headers.forEach((header, j) => {
      const value = values[j];
      if (header === 'idea name') idea.ideaName = value;
      if (header === 'description') idea.description = value;
      // Add more field mappings as needed
    });

    if (idea.ideaName) {
      ideas.push(idea);
    }
  }

  return ideas;
}

/**
 * Download helper for browser
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
