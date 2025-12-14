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

/**
 * Generate PDF export of evaluation
 * Uses jsPDF for client-side PDF generation
 */
export async function generatePDFExport(
  input: FullEvaluationInput,
  result: FullEvaluationResult,
  suggestions?: ImprovementSuggestion[]
): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  
  let y = 20;
  const lineHeight = 7;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;

  const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });
  };

  const addSection = (title: string) => {
    y += 5;
    addText(title, 14, true);
    y += 2;
  };

  // Header
  doc.setFillColor(45, 45, 45);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 140, 0);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Profit Pulse', margin, 25);
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(12);
  doc.text('Evaluation Report', margin, 35);
  
  y = 55;
  doc.setTextColor(0, 0, 0);

  // Idea Info
  addText(`Idea: ${input.ideaName}`, 16, true);
  addText(`Category: ${getCategoryDisplayName(input.category)}`, 11);
  addText(`Evaluated: ${new Date(result.evaluatedAt).toLocaleDateString()}`, 10);
  y += 5;

  // Overall Score Box
  const scoreColor = result.interpretation === 'exceptional' ? [34, 197, 94] :
                     result.interpretation === 'strong' ? [255, 140, 0] :
                     result.interpretation === 'moderate' ? [234, 179, 8] : [239, 68, 68];
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.roundedRect(margin, y, 50, 25, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(`${result.overallScore}`, margin + 10, y + 17);
  doc.setFontSize(10);
  doc.text('/10', margin + 32, y + 17);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(getInterpretationText(result.interpretation), margin + 60, y + 15);
  y += 35;

  // Layer Breakdown
  addSection('Layer Breakdown');
  const layers = [
    { name: 'Founder Readiness', pct: result.layers.founderReadiness.percentage, weight: '30%' },
    { name: 'Idea Characteristics', pct: result.layers.ideaCharacteristics.percentage, weight: '40%' },
    { name: 'Historical Patterns', pct: result.layers.historicalPatterns.percentage, weight: '20%' },
    { name: 'Contextual Viability', pct: result.layers.contextualViability.percentage, weight: '10%' },
  ];
  
  layers.forEach(layer => {
    doc.setFontSize(10);
    doc.text(`${layer.name} (${layer.weight})`, margin, y);
    // Progress bar
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(margin + 70, y - 4, 80, 6, 1, 1, 'F');
    const barColor = layer.pct >= 70 ? [34, 197, 94] : layer.pct >= 50 ? [255, 140, 0] : [239, 68, 68];
    doc.setFillColor(barColor[0], barColor[1], barColor[2]);
    doc.roundedRect(margin + 70, y - 4, (layer.pct / 100) * 80, 6, 1, 1, 'F');
    doc.text(`${layer.pct}%`, margin + 155, y);
    y += 10;
  });
  y += 5;

  // Energy Filter
  addSection('Energy Filter');
  const filterColor = result.energyFilterStatus === 'pass' ? [34, 197, 94] :
                      result.energyFilterStatus === 'fail' ? [239, 68, 68] : [234, 179, 8];
  doc.setTextColor(filterColor[0], filterColor[1], filterColor[2]);
  addText(`Status: ${result.energyFilterStatus.toUpperCase()}`, 11, true);
  doc.setTextColor(100, 100, 100);
  addText(result.energyFilterReasoning, 10);
  doc.setTextColor(0, 0, 0);
  y += 3;

  // Strengths
  if (result.strengths.length > 0) {
    addSection('Strengths');
    result.strengths.forEach(strength => {
      addText(`✓ ${strength}`, 10);
    });
  }

  // Gaps
  if (result.gaps.length > 0) {
    addSection('Gaps to Address');
    result.gaps.forEach(gap => {
      const icon = gap.type === 'critical' ? '●' : gap.type === 'warning' ? '◐' : '○';
      addText(`${icon} ${gap.description}`, 10, true);
      addText(`   Action: ${gap.action}`, 9);
      y += 2;
    });
  }

  // Improvement Suggestions
  if (suggestions && suggestions.length > 0) {
    addSection('Improvement Suggestions');
    suggestions.slice(0, 3).forEach((suggestion, i) => {
      addText(`${i + 1}. ${suggestion.title}`, 10, true);
      addText(`   ${suggestion.action}`, 9);
      addText(`   Potential gain: +${suggestion.potentialScoreGain.toFixed(1)} points`, 9);
      y += 2;
    });
  }

  // Footer
  doc.setFillColor(45, 45, 45);
  doc.rect(0, 280, pageWidth, 20, 'F');
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.text('Generated by Profit Pulse — A Tangent Forge Product', margin, 290);
  doc.text('profitpulse.tangentforge.com', pageWidth - margin - 50, 290);

  // Download
  doc.save(`${input.ideaName.replace(/[^a-z0-9]/gi, '-')}-evaluation.pdf`);
}

/**
 * Generate Notion page content for export
 */
export function generateNotionExport(
  input: FullEvaluationInput,
  result: FullEvaluationResult,
  suggestions?: ImprovementSuggestion[]
): {
  title: string;
  properties: Record<string, unknown>;
  children: Array<{ type: string; [key: string]: unknown }>;
} {
  return {
    title: input.ideaName,
    properties: {
      'Score': { number: result.overallScore },
      'Category': { select: { name: getCategoryDisplayName(input.category) } },
      'Status': { select: { name: result.interpretation } },
      'Energy Filter': { select: { name: result.energyFilterStatus } },
      'Evaluated': { date: { start: new Date(result.evaluatedAt).toISOString().split('T')[0] } },
    },
    children: [
      {
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Overall Score' } }],
        },
      },
      {
        type: 'callout',
        callout: {
          icon: { emoji: result.interpretation === 'exceptional' ? '🚀' : result.interpretation === 'strong' ? '💪' : result.interpretation === 'moderate' ? '⚡' : '⚠️' },
          rich_text: [{ type: 'text', text: { content: `${result.overallScore}/10 — ${getInterpretationText(result.interpretation)}` } }],
        },
      },
      {
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Layer Breakdown' } }],
        },
      },
      {
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: `Founder Readiness: ${result.layers.founderReadiness.percentage}%` } }],
        },
      },
      {
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: `Idea Characteristics: ${result.layers.ideaCharacteristics.percentage}%` } }],
        },
      },
      {
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: `Historical Patterns: ${result.layers.historicalPatterns.percentage}%` } }],
        },
      },
      {
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: `Contextual Viability: ${result.layers.contextualViability.percentage}%` } }],
        },
      },
      {
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Strengths' } }],
        },
      },
      ...result.strengths.map(strength => ({
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: `✅ ${strength}` } }],
        },
      })),
      {
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Gaps to Address' } }],
        },
      },
      ...result.gaps.map(gap => ({
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: `${gap.type === 'critical' ? '🔴' : gap.type === 'warning' ? '🟠' : '🟡'} ${gap.description}: ${gap.action}` } }],
        },
      })),
      ...(suggestions && suggestions.length > 0 ? [
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Improvement Suggestions' } }],
          },
        },
        ...suggestions.map(s => ({
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: `${s.priority === 'high' ? '🔥' : s.priority === 'medium' ? '⚡' : '💡'} ${s.title}: ${s.action}` } }],
          },
        })),
      ] : []),
      {
        type: 'divider',
        divider: {},
      },
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'Generated by Profit Pulse — A Tangent Forge Product' }, annotations: { italic: true, color: 'gray' } }],
        },
      },
    ],
  };
}
