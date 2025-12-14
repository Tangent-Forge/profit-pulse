'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Zap, TrendingUp, CheckCircle, ArrowRight, AlertCircle, ArrowLeft,
  User, Clock, DollarSign, Target, History, Calendar, Heart,
  AlertTriangle, CheckCircle2, XCircle, ChevronDown, ChevronUp,
  Download, Save, Lightbulb, Copy, FileText, Sparkles
} from 'lucide-react';
import {
  FullEvaluationInput,
  FullEvaluationResult,
  IdeaCategory,
  EnergyFilterStatus
} from '@/types';
import {
  calculateFullEvaluation,
  getInterpretationText,
  getScoreColor,
  getScoreGradient,
  getCategoryDisplayName
} from '@/lib/calculations';
import { getAllCategories } from '@/lib/failureModes';
import { generateImprovementSuggestions, calculatePotentialScore, generatePivotSuggestion, ImprovementSuggestion } from '@/lib/improvements';
import { generateMarkdownExport, generatePDFExport, downloadFile } from '@/lib/export';
import { analyzeIdea, AIIdeaAnalysis } from '@/lib/openai';

const CATEGORIES = getAllCategories();

const defaultFormData: FullEvaluationInput = {
  ideaName: '',
  description: '',
  category: 'other',
  founderReadiness: {
    skillMatch: 5,
    timeAvailability: 5,
    financialBuffer: 5
  },
  ideaCharacteristics: {
    quickness: 5,
    profitability: 5,
    validationEase: 5,
    marketDemand: 5
  },
  historicalPatterns: {},
  contextualViability: {
    lifeStageFit: 5,
    marketTiming: 5
  },
  energyFilter: {
    response: 'yes',
    reasoning: ''
  }
};

export default function FullEvaluatePage() {
  const [formData, setFormData] = useState<FullEvaluationInput>(defaultFormData);
  const [result, setResult] = useState<FullEvaluationResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    obstacles: true,
    gaps: true,
    improvements: true
  });
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [pivotSuggestion, setPivotSuggestion] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIIdeaAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAiInsights, setShowAiInsights] = useState(false);

  const steps = [
    { id: 'basics', title: 'Idea Basics', icon: Target },
    { id: 'founder', title: 'Founder Readiness', icon: User },
    { id: 'idea', title: 'Idea Characteristics', icon: Zap },
    { id: 'context', title: 'Context & Timing', icon: Calendar },
    { id: 'energy', title: 'Energy Filter', icon: Heart }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const evalResult = calculateFullEvaluation(formData);
    setResult(evalResult);
    
    // Generate improvement suggestions
    const improvementSuggestions = generateImprovementSuggestions(formData, evalResult);
    setSuggestions(improvementSuggestions);
    
    // Generate pivot suggestion for low-scoring ideas
    const pivot = generatePivotSuggestion(formData, evalResult);
    setPivotSuggestion(pivot);
    
    setShowResult(true);
  };

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);
    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.ideaName,
          description: formData.description,
          category: formData.category,
          qpvScore: result.overallScore,
          evaluation: { input: formData, result, suggestions },
        }),
      });
      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportMarkdown = () => {
    if (!result) return;
    const markdown = generateMarkdownExport(formData, result, suggestions);
    downloadFile(markdown, `${formData.ideaName.replace(/[^a-z0-9]/gi, '-')}-evaluation.md`, 'text/markdown');
  };

  const handleCopyMarkdown = async () => {
    if (!result) return;
    const markdown = generateMarkdownExport(formData, result, suggestions);
    await navigator.clipboard.writeText(markdown);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleExportPDF = async () => {
    if (!result) return;
    await generatePDFExport(formData, result, suggestions);
  };

  const handleAIAnalysis = async () => {
    if (!formData.ideaName || !formData.description) return;
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeIdea(formData.ideaName, formData.description);
      if (analysis) {
        setAiAnalysis(analysis);
        setShowAiInsights(true);
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFormData(defaultFormData);
    setResult(null);
    setShowResult(false);
    setCurrentStep(0);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getEnergyStatusIcon = (status: EnergyFilterStatus) => {
    switch (status) {
      case 'pass': return <CheckCircle2 className="text-[var(--tf-success-glow)]" size={24} />;
      case 'fail': return <XCircle className="text-[var(--tf-error-glow)]" size={24} />;
      case 'revise': return <AlertTriangle className="text-[var(--tf-forge-orange)]" size={24} />;
    }
  };

  const getEnergyStatusText = (status: EnergyFilterStatus) => {
    switch (status) {
      case 'pass': return 'PASS';
      case 'fail': return 'FAIL';
      case 'revise': return 'REVISE';
    }
  };

  const getGapIcon = (type: 'critical' | 'warning' | 'minor') => {
    switch (type) {
      case 'critical': return <XCircle className="text-[var(--tf-error-glow)]" size={20} />;
      case 'warning': return <AlertTriangle className="text-[var(--tf-forge-orange)]" size={20} />;
      case 'minor': return <AlertCircle className="text-[var(--tf-copper-sheen)]" size={20} />;
    }
  };

  // Results View
  if (showResult && result) {
    return (
      <div className="min-h-screen bg-[var(--tf-charcoal)]">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 text-[var(--tf-muted-steel)] hover:text-white transition-all mb-8"
          >
            <ArrowLeft size={20} />
            Evaluate Another Idea
          </button>

          <div className="space-y-6">
            {/* Overall Score Card */}
            <div className="bg-[var(--tf-deep-charcoal)]/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-xl text-[var(--tf-muted-steel)] mb-2">Overall Launch Readiness</h2>
                <div className={`text-7xl md:text-8xl font-bold mb-4 bg-gradient-to-r ${getScoreGradient(result.interpretation)} bg-clip-text text-transparent`}>
                  {result.overallScore}
                  <span className="text-3xl md:text-4xl text-[var(--tf-muted-steel)]">/10</span>
                </div>
                <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${getScoreColor(result.interpretation)}`}>
                  {getInterpretationText(result.interpretation)}
                </h3>
                <p className="text-lg text-[var(--tf-smoked-gray)]">
                  for &ldquo;{formData.ideaName}&rdquo;
                </p>
              </div>

              {/* Layer Breakdown */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="bg-[var(--tf-steel-gray)]/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="text-[var(--tf-forge-orange)]" size={18} />
                    <span className="text-sm text-[var(--tf-muted-steel)]">Founder Readiness</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{result.layers.founderReadiness.percentage}%</div>
                  <div className="text-xs text-[var(--tf-muted-steel)]">30% weight</div>
                </div>
                <div className="bg-[var(--tf-steel-gray)]/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="text-[var(--tf-success-glow)]" size={18} />
                    <span className="text-sm text-[var(--tf-muted-steel)]">Idea Characteristics</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{result.layers.ideaCharacteristics.percentage}%</div>
                  <div className="text-xs text-[var(--tf-muted-steel)]">40% weight</div>
                </div>
                <div className="bg-[var(--tf-steel-gray)]/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <History className="text-[var(--tf-copper-sheen)]" size={18} />
                    <span className="text-sm text-[var(--tf-muted-steel)]">Historical Patterns</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{result.layers.historicalPatterns.percentage}%</div>
                  <div className="text-xs text-[var(--tf-muted-steel)]">20% weight</div>
                </div>
                <div className="bg-[var(--tf-steel-gray)]/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="text-[var(--tf-ember-glow)]" size={18} />
                    <span className="text-sm text-[var(--tf-muted-steel)]">Contextual Viability</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{result.layers.contextualViability.percentage}%</div>
                  <div className="text-xs text-[var(--tf-muted-steel)]">10% weight</div>
                </div>
              </div>

              {/* Energy Filter */}
              <div className="flex items-center justify-center gap-4 p-4 bg-[var(--tf-steel-gray)]/20 rounded-lg mb-6">
                {getEnergyStatusIcon(result.energyFilterStatus)}
                <div>
                  <span className="text-sm text-[var(--tf-muted-steel)]">Energy Filter: </span>
                  <span className={`font-bold ${
                    result.energyFilterStatus === 'pass' ? 'text-[var(--tf-success-glow)]' :
                    result.energyFilterStatus === 'fail' ? 'text-[var(--tf-error-glow)]' :
                    'text-[var(--tf-forge-orange)]'
                  }`}>
                    {getEnergyStatusText(result.energyFilterStatus)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--tf-steel-gray)] hover:bg-[var(--tf-deep-charcoal)] text-white rounded-lg transition-all disabled:opacity-50"
                >
                  <Save size={18} />
                  {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save to Dashboard'}
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--tf-forge-orange)] hover:bg-[var(--tf-ember-glow)] text-white rounded-lg transition-all"
                >
                  <FileText size={18} />
                  Export PDF
                </button>
                <button
                  onClick={handleExportMarkdown}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--tf-steel-gray)] hover:bg-[var(--tf-deep-charcoal)] text-white rounded-lg transition-all"
                >
                  <Download size={18} />
                  Export Markdown
                </button>
                <button
                  onClick={handleCopyMarkdown}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--tf-steel-gray)] hover:bg-[var(--tf-deep-charcoal)] text-white rounded-lg transition-all"
                >
                  <Copy size={18} />
                  {copySuccess ? 'Copied!' : 'Copy Report'}
                </button>
                <button
                  onClick={handleAIAnalysis}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all disabled:opacity-50"
                >
                  <Sparkles size={18} />
                  {isAnalyzing ? 'Analyzing...' : '🤖 AI Insights'}
                </button>
              </div>

              {/* AI Insights Panel */}
              {showAiInsights && aiAnalysis && (
                <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Sparkles className="text-purple-400" size={24} />
                      AI Analysis
                    </h3>
                    <button
                      onClick={() => setShowAiInsights(false)}
                      className="text-[var(--tf-muted-steel)] hover:text-white"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-purple-300 mb-2">Suggested Category</h4>
                      <p className="text-white">{getCategoryDisplayName(aiAnalysis.suggestedCategory)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-purple-300 mb-2">Target Audience</h4>
                      <p className="text-[var(--tf-smoked-gray)]">{aiAnalysis.targetAudience}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-purple-300 mb-2">Unique Value Proposition</h4>
                      <p className="text-[var(--tf-smoked-gray)]">{aiAnalysis.uniqueValueProposition}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-purple-300 mb-2">Market Validation</h4>
                      <p className="text-[var(--tf-smoked-gray)]">{aiAnalysis.marketValidation}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-purple-300 mb-2">Competitors</h4>
                      <ul className="space-y-1">
                        {aiAnalysis.competitors.map((comp, i) => (
                          <li key={i} className="text-[var(--tf-smoked-gray)] text-sm">• {comp}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-purple-300 mb-2">Potential Risks</h4>
                      <ul className="space-y-1">
                        {aiAnalysis.potentialRisks.map((risk, i) => (
                          <li key={i} className="text-[var(--tf-smoked-gray)] text-sm">⚠️ {risk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-bold text-purple-300 mb-2">Quick Wins</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.quickWins.map((win, i) => (
                        <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm">
                          ✨ {win}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Strengths */}
            {result.strengths.length > 0 && (
              <div className="bg-[var(--tf-deep-charcoal)]/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-[var(--tf-success-glow)]" size={24} />
                  Your Strengths
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-3 text-[var(--tf-smoked-gray)]">
                      <CheckCircle className="text-[var(--tf-success-glow)] flex-shrink-0 mt-0.5" size={18} />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gaps / Risks */}
            {result.gaps.length > 0 && (
              <div className="bg-[var(--tf-deep-charcoal)]/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <button
                  onClick={() => toggleSection('gaps')}
                  className="w-full flex items-center justify-between text-xl font-bold text-white mb-4"
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="text-[var(--tf-forge-orange)]" size={24} />
                    Your Specific Gaps to Address
                  </span>
                  {expandedSections.gaps ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.gaps && (
                  <div className="space-y-4">
                    {result.gaps.map((gap, i) => (
                      <div key={i} className={`p-4 rounded-lg border-l-4 ${
                        gap.type === 'critical' ? 'bg-red-900/20 border-[var(--tf-error-glow)]' :
                        gap.type === 'warning' ? 'bg-orange-900/20 border-[var(--tf-forge-orange)]' :
                        'bg-yellow-900/20 border-[var(--tf-copper-sheen)]'
                      }`}>
                        <div className="flex items-start gap-3">
                          {getGapIcon(gap.type)}
                          <div className="flex-1">
                            <h4 className="font-bold text-white mb-1">{gap.description}</h4>
                            <p className="text-sm text-[var(--tf-muted-steel)] mb-2">{gap.mitigation}</p>
                            <p className="text-sm text-[var(--tf-forge-orange)]">→ {gap.action}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Improvement Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-gradient-to-br from-[var(--tf-forge-orange)]/10 to-[var(--tf-ember-glow)]/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-[var(--tf-forge-orange)]/30">
                <button
                  onClick={() => toggleSection('improvements')}
                  className="w-full flex items-center justify-between text-xl font-bold text-white mb-4"
                >
                  <span className="flex items-center gap-2">
                    <Lightbulb className="text-[var(--tf-forge-orange)]" size={24} />
                    How to Improve Your Score
                    {suggestions.length > 0 && (
                      <span className="text-sm font-normal text-[var(--tf-muted-steel)]">
                        (Potential: +{suggestions.reduce((sum, s) => sum + s.potentialScoreGain, 0).toFixed(1)} points)
                      </span>
                    )}
                  </span>
                  {expandedSections.improvements ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.improvements && (
                  <div className="space-y-4">
                    {pivotSuggestion && (
                      <div className="p-4 bg-[var(--tf-error-glow)]/10 border border-[var(--tf-error-glow)]/30 rounded-lg mb-4">
                        <h4 className="font-bold text-[var(--tf-error-glow)] mb-2 flex items-center gap-2">
                          <AlertTriangle size={18} />
                          Consider a Pivot
                        </h4>
                        <p className="text-[var(--tf-smoked-gray)]">{pivotSuggestion}</p>
                      </div>
                    )}
                    {suggestions.map((suggestion, i) => (
                      <div key={i} className={`p-4 rounded-lg border-l-4 ${
                        suggestion.priority === 'high' ? 'bg-[var(--tf-forge-orange)]/10 border-[var(--tf-forge-orange)]' :
                        suggestion.priority === 'medium' ? 'bg-[var(--tf-copper-sheen)]/10 border-[var(--tf-copper-sheen)]' :
                        'bg-[var(--tf-steel-gray)]/20 border-[var(--tf-muted-steel)]'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-white flex items-center gap-2">
                            {suggestion.priority === 'high' ? '🔥' : suggestion.priority === 'medium' ? '⚡' : '💡'}
                            {suggestion.title}
                          </h4>
                          <span className="text-xs px-2 py-1 rounded bg-[var(--tf-success-glow)]/20 text-[var(--tf-success-glow)]">
                            +{suggestion.potentialScoreGain.toFixed(1)} pts
                          </span>
                        </div>
                        <p className="text-sm text-[var(--tf-muted-steel)] mb-2">{suggestion.description}</p>
                        <p className="text-sm text-[var(--tf-smoked-gray)] mb-2"><strong>Impact:</strong> {suggestion.impact}</p>
                        <p className="text-sm text-[var(--tf-forge-orange)]">→ {suggestion.action}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Obstacles That Kill Ideas Like This */}
            <div className="bg-[var(--tf-deep-charcoal)]/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <button
                onClick={() => toggleSection('obstacles')}
                className="w-full flex items-center justify-between text-xl font-bold text-white mb-4"
              >
                <span className="flex items-center gap-2">
                  <AlertCircle className="text-[var(--tf-error-glow)]" size={24} />
                  Obstacles That Kill {getCategoryDisplayName(formData.category)} Ideas
                </span>
                {expandedSections.obstacles ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {expandedSections.obstacles && (
                <div className="space-y-4">
                  {result.obstacles.map((obstacle, i) => (
                    <div key={i} className="p-4 bg-[var(--tf-steel-gray)]/20 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-white">{obstacle.name}</h4>
                        <span className="text-sm font-bold text-[var(--tf-error-glow)]">{obstacle.failureRate}%</span>
                      </div>
                      <p className="text-sm text-[var(--tf-muted-steel)] mb-2">{obstacle.description}</p>
                      <p className="text-sm text-[var(--tf-success-glow)]">✓ Mitigation: {obstacle.mitigation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTA for Tier 3 */}
            <div className="bg-gradient-to-r from-[var(--tf-forged-bronze)]/30 to-[var(--tf-dark-copper)]/30 border-2 border-[var(--tf-dark-copper)]/50 rounded-xl p-6">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <Zap className="text-[var(--tf-forge-orange)] flex-shrink-0" size={32} />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Want the 48-Hour Execution Blueprint?
                  </h3>
                  <p className="text-[var(--tf-smoked-gray)] mb-4">
                    Get a step-by-step, timeboxed checklist to go from idea to live product, plus validation plan and recommended tech stack.
                  </p>
                  <Link
                    href="/checkout?tier=explorer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--tf-forge-orange)] to-[var(--tf-ember-glow)] hover:from-[var(--tf-ember-glow)] hover:to-[var(--tf-forge-orange)] text-white font-bold rounded-lg transition-all"
                  >
                    Unlock Execution Blueprint — $29
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form View
  return (
    <div className="min-h-screen bg-[var(--tf-charcoal)]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--tf-muted-steel)] hover:text-white transition-all mb-8"
        >
          <ArrowLeft size={20} />
          Back to home
        </Link>

        <div className="bg-[var(--tf-deep-charcoal)]/50 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Profit Pulse 2.0 Full Evaluation</h1>
            <p className="text-[var(--tf-smoked-gray)]">
              Complete 4-layer analysis with failure mode detection and personalized insights
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8 overflow-x-auto pb-2">
            {steps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(i)}
                className={`flex flex-col items-center gap-1 min-w-[80px] transition-all ${
                  i === currentStep ? 'text-[var(--tf-forge-orange)]' :
                  i < currentStep ? 'text-[var(--tf-success-glow)]' : 'text-[var(--tf-muted-steel)]'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  i === currentStep ? 'border-[var(--tf-forge-orange)] bg-[var(--tf-forge-orange)]/20' :
                  i < currentStep ? 'border-[var(--tf-success-glow)] bg-[var(--tf-success-glow)]/20' :
                  'border-[var(--tf-steel-gray)]'
                }`}>
                  <step.icon size={20} />
                </div>
                <span className="text-xs text-center">{step.title}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 0: Basics */}
            {currentStep === 0 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-white mb-4">Tell us about your idea</h3>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--tf-smoked-gray)] mb-2">Idea Name</label>
                  <input
                    type="text"
                    value={formData.ideaName}
                    onChange={(e) => setFormData({ ...formData, ideaName: e.target.value })}
                    placeholder="e.g., AI Cold Email Tool"
                    className="w-full px-4 py-3 bg-[var(--tf-steel-gray)] border border-[var(--tf-steel-gray)] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--tf-forge-orange)]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--tf-smoked-gray)] mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your idea in one clear sentence..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[var(--tf-steel-gray)] border border-[var(--tf-steel-gray)] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--tf-forge-orange)]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category-select" className="block text-sm font-medium text-[var(--tf-smoked-gray)] mb-2">Category</label>
                  <select
                    id="category-select"
                    title="Select idea category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as IdeaCategory })}
                    className="w-full px-4 py-3 bg-[var(--tf-steel-gray)] border border-[var(--tf-steel-gray)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--tf-forge-orange)]"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{getCategoryDisplayName(cat)}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 1: Founder Readiness */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-fadeIn">
                <h3 className="text-xl font-bold text-white mb-4">
                  <User className="inline mr-2 text-[var(--tf-forge-orange)]" size={24} />
                  Founder Readiness (30% weight)
                </h3>
                <p className="text-[var(--tf-muted-steel)] mb-6">Can YOU execute this idea RIGHT NOW?</p>

                <SliderInput
                  label="Skill Match"
                  value={formData.founderReadiness.skillMatch}
                  onChange={(v) => setFormData({
                    ...formData,
                    founderReadiness: { ...formData.founderReadiness, skillMatch: v }
                  })}
                  description="Do you have the skills to build this?"
                  labels={['Need to learn everything', '50% skills present', 'Can start today']}
                  icon={<Target className="text-[var(--tf-forge-orange)]" size={24} />}
                  colorClass="text-[var(--tf-forge-orange)]"
                />

                <SliderInput
                  label="Time Availability"
                  value={formData.founderReadiness.timeAvailability}
                  onChange={(v) => setFormData({
                    ...formData,
                    founderReadiness: { ...formData.founderReadiness, timeAvailability: v }
                  })}
                  description="Hours per week you can dedicate"
                  labels={['<5 hrs/week', '10-15 hrs/week', '20+ hrs/week']}
                  icon={<Clock className="text-[var(--tf-success-glow)]" size={24} />}
                  colorClass="text-[var(--tf-success-glow)]"
                />

                <SliderInput
                  label="Financial Buffer"
                  value={formData.founderReadiness.financialBuffer}
                  onChange={(v) => setFormData({
                    ...formData,
                    founderReadiness: { ...formData.founderReadiness, financialBuffer: v }
                  })}
                  description="Runway if this doesn't generate income immediately"
                  labels={['Need income NOW', '3-month buffer', '6+ month buffer']}
                  icon={<DollarSign className="text-[var(--tf-copper-sheen)]" size={24} />}
                  colorClass="text-[var(--tf-copper-sheen)]"
                />
              </div>
            )}

            {/* Step 2: Idea Characteristics */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-fadeIn">
                <h3 className="text-xl font-bold text-white mb-4">
                  <Zap className="inline mr-2 text-[var(--tf-success-glow)]" size={24} />
                  Idea Characteristics (40% weight)
                </h3>
                <p className="text-[var(--tf-muted-steel)] mb-6">Is the IDEA structurally sound?</p>

                <SliderInput
                  label="Quickness"
                  value={formData.ideaCharacteristics.quickness}
                  onChange={(v) => setFormData({
                    ...formData,
                    ideaCharacteristics: { ...formData.ideaCharacteristics, quickness: v }
                  })}
                  description="How fast can you ship a testable version?"
                  labels={['Months', 'Weeks', '48 Hours']}
                  icon={<Zap className="text-[var(--tf-forge-orange)]" size={24} />}
                  colorClass="text-[var(--tf-forge-orange)]"
                />

                <SliderInput
                  label="Profitability"
                  value={formData.ideaCharacteristics.profitability}
                  onChange={(v) => setFormData({
                    ...formData,
                    ideaCharacteristics: { ...formData.ideaCharacteristics, profitability: v }
                  })}
                  description="Revenue potential relative to effort"
                  labels={['Hard to monetize', '$500/mo', '$1k+/mo']}
                  icon={<TrendingUp className="text-[var(--tf-success-glow)]" size={24} />}
                  colorClass="text-[var(--tf-success-glow)]"
                />

                <SliderInput
                  label="Validation Ease"
                  value={formData.ideaCharacteristics.validationEase}
                  onChange={(v) => setFormData({
                    ...formData,
                    ideaCharacteristics: { ...formData.ideaCharacteristics, validationEase: v }
                  })}
                  description="How quickly can you get real demand signals?"
                  labels={['Very hard', 'Few days', '24-48 hours']}
                  icon={<CheckCircle className="text-[var(--tf-copper-sheen)]" size={24} />}
                  colorClass="text-[var(--tf-copper-sheen)]"
                />

                <SliderInput
                  label="Market Demand"
                  value={formData.ideaCharacteristics.marketDemand}
                  onChange={(v) => setFormData({
                    ...formData,
                    ideaCharacteristics: { ...formData.ideaCharacteristics, marketDemand: v }
                  })}
                  description="Is there proven demand for this category?"
                  labels={['New category', 'Adjacent market', 'Competitors exist']}
                  icon={<Target className="text-[var(--tf-ember-glow)]" size={24} />}
                  colorClass="text-[var(--tf-ember-glow)]"
                />
              </div>
            )}

            {/* Step 3: Context & Timing */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-fadeIn">
                <h3 className="text-xl font-bold text-white mb-4">
                  <Calendar className="inline mr-2 text-[var(--tf-ember-glow)]" size={24} />
                  Contextual Viability (10% weight)
                </h3>
                <p className="text-[var(--tf-muted-steel)] mb-6">Does your LIFE support this right now?</p>

                <SliderInput
                  label="Life Stage Fit"
                  value={formData.contextualViability.lifeStageFit}
                  onChange={(v) => setFormData({
                    ...formData,
                    contextualViability: { ...formData.contextualViability, lifeStageFit: v }
                  })}
                  description="Any major life events competing for attention?"
                  labels={['Major conflicts', 'Some conflicts', 'Clear runway']}
                  icon={<User className="text-[var(--tf-forge-orange)]" size={24} />}
                  colorClass="text-[var(--tf-forge-orange)]"
                />

                <SliderInput
                  label="Market Timing"
                  value={formData.contextualViability.marketTiming}
                  onChange={(v) => setFormData({
                    ...formData,
                    contextualViability: { ...formData.contextualViability, marketTiming: v }
                  })}
                  description="Is this the right time for THIS idea?"
                  labels={['Bad timing', 'Neutral', 'Perfect timing']}
                  icon={<TrendingUp className="text-[var(--tf-success-glow)]" size={24} />}
                  colorClass="text-[var(--tf-success-glow)]"
                />
              </div>
            )}

            {/* Step 4: Energy Filter */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-white mb-4">
                  <Heart className="inline mr-2 text-[var(--tf-error-glow)]" size={24} />
                  Energy Filter (Qualitative Gate)
                </h3>
                
                <div className="bg-[var(--tf-steel-gray)]/30 rounded-xl p-6 mb-6">
                  <p className="text-xl text-white text-center mb-2">
                    &ldquo;If this made $500/month, would you still be proud to maintain it?&rdquo;
                  </p>
                  <p className="text-sm text-[var(--tf-muted-steel)] text-center">
                    This prevents building profitable products you&apos;ll ultimately resent or abandon.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {(['yes', 'maybe', 'no'] as const).map((response) => (
                    <button
                      key={response}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        energyFilter: { ...formData.energyFilter, response }
                      })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.energyFilter.response === response
                          ? response === 'yes' ? 'border-[var(--tf-success-glow)] bg-[var(--tf-success-glow)]/20' :
                            response === 'no' ? 'border-[var(--tf-error-glow)] bg-[var(--tf-error-glow)]/20' :
                            'border-[var(--tf-forge-orange)] bg-[var(--tf-forge-orange)]/20'
                          : 'border-[var(--tf-steel-gray)] hover:border-[var(--tf-muted-steel)]'
                      }`}
                    >
                      <div className="text-2xl mb-1">
                        {response === 'yes' ? '✅' : response === 'no' ? '❌' : '🤔'}
                      </div>
                      <div className="font-bold text-white capitalize">{response}</div>
                      <div className="text-xs text-[var(--tf-muted-steel)]">
                        {response === 'yes' ? 'Pass' : response === 'no' ? 'Fail' : 'Revise'}
                      </div>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--tf-smoked-gray)] mb-2">
                    Why? (optional)
                  </label>
                  <textarea
                    value={formData.energyFilter.reasoning || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      energyFilter: { ...formData.energyFilter, reasoning: e.target.value }
                    })}
                    placeholder="Explain your reasoning..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[var(--tf-steel-gray)] border border-[var(--tf-steel-gray)] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--tf-forge-orange)]"
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-[var(--tf-steel-gray)]">
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-6 py-3 bg-[var(--tf-steel-gray)] hover:bg-[var(--tf-deep-charcoal)] text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-3 bg-gradient-to-r from-[var(--tf-forge-orange)] to-[var(--tf-ember-glow)] hover:from-[var(--tf-ember-glow)] hover:to-[var(--tf-forge-orange)] text-white font-bold rounded-lg transition-all"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-[var(--tf-forge-orange)] to-[var(--tf-ember-glow)] hover:from-[var(--tf-ember-glow)] hover:to-[var(--tf-forge-orange)] text-white font-bold rounded-lg transition-all"
                >
                  Calculate Full Evaluation
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Reusable Slider Input Component
function SliderInput({
  label,
  value,
  onChange,
  description,
  labels,
  icon,
  colorClass
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  description: string;
  labels: [string, string, string];
  icon: React.ReactNode;
  colorClass: string;
}) {
  const inputId = `slider-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <label htmlFor={inputId} className="text-base md:text-lg font-medium text-white">{label}</label>
        </div>
        <span className={`text-2xl md:text-3xl font-bold ${colorClass}`}>{value}</span>
      </div>
      <p className="text-sm text-[var(--tf-muted-steel)]">{description}</p>
      <input
        id={inputId}
        type="range"
        min="0"
        max="10"
        step="1"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        title={`${label}: ${value}/10`}
        className="w-full h-3 rounded-lg cursor-pointer"
      />
      <div className="flex justify-between text-xs text-[var(--tf-muted-steel)]">
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
        <span>{labels[2]}</span>
      </div>
    </div>
  );
}
