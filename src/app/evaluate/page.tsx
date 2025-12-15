'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, TrendingUp, CheckCircle, ArrowRight, AlertCircle, ArrowLeft, Target, Lightbulb, AlertTriangle, Loader2 } from 'lucide-react';
import { BasicQPVInput, QPVInterpretation } from '@/types';
import { getInterpretationText, getScoreColor, getScoreGradient, getCategoryDisplayName } from '@/lib/calculations';
import { FreeAnalysis } from '@/lib/openai';

interface EvaluationResult {
  qpv: {
    score: number;
    interpretation: QPVInterpretation;
    failureTeaser: string;
  };
  ai: FreeAnalysis | null;
}

export default function EvaluatePage() {
  const [formData, setFormData] = useState<BasicQPVInput>({
    ideaName: '',
    description: '',
    quickness: 5,
    profitability: 5,
    validationEase: 5
  });

  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/evaluate/free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResult(data);
      setShowResult(true);
    } catch (err) {
      console.error('Evaluation error:', err);
      setError('Unable to complete analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFormData({
      ideaName: '',
      description: '',
      quickness: 5,
      profitability: 5,
      validationEase: 5
    });
    setResult(null);
    setShowResult(false);
  };

  if (showResult && result) {
    const qpv = result.qpv;
    const ai = result.ai;

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

          <div className="bg-[var(--tf-deep-charcoal)]/50 backdrop-blur-sm rounded-2xl p-6 md:p-12 shadow-2xl">
            <div className="space-y-8 animate-fadeIn">
              {/* Result Display */}
              <div className="text-center">
                <div className={`text-7xl md:text-8xl font-bold mb-4 bg-gradient-to-r ${getScoreGradient(qpv.interpretation)} bg-clip-text text-transparent`}>
                  {qpv.score}
                  <span className="text-3xl md:text-4xl text-[var(--tf-muted-steel)]">/10</span>
                </div>
                <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${getScoreColor(qpv.interpretation)}`}>
                  {getInterpretationText(qpv.interpretation)}
                </h3>
                <p className="text-lg md:text-xl text-[var(--tf-smoked-gray)] mb-2">
                  for &ldquo;{formData.ideaName}&rdquo;
                </p>
                {ai && (
                  <p className="text-sm text-[var(--tf-muted-steel)] mb-8">
                    Category: {getCategoryDisplayName(ai.suggestedCategory)}
                  </p>
                )}
              </div>

              {/* Score Breakdown */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-[var(--tf-deep-charcoal)] rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="text-[var(--tf-forge-orange)]" size={24} />
                    <h4 className="font-bold text-white">Quickness</h4>
                  </div>
                  <div className="text-3xl font-bold text-[var(--tf-forge-orange)]">{formData.quickness}/10</div>
                  <p className="text-sm text-[var(--tf-muted-steel)] mt-2">40% weight</p>
                </div>

                <div className="bg-[var(--tf-deep-charcoal)] rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="text-[var(--tf-success-glow)]" size={24} />
                    <h4 className="font-bold text-white">Profitability</h4>
                  </div>
                  <div className="text-3xl font-bold text-[var(--tf-success-glow)]">{formData.profitability}/10</div>
                  <p className="text-sm text-[var(--tf-muted-steel)] mt-2">30% weight</p>
                </div>

                <div className="bg-[var(--tf-deep-charcoal)] rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="text-[var(--tf-copper-sheen)]" size={24} />
                    <h4 className="font-bold text-white">Validation Ease</h4>
                  </div>
                  <div className="text-3xl font-bold text-[var(--tf-copper-sheen)]">{formData.validationEase}/10</div>
                  <p className="text-sm text-[var(--tf-muted-steel)] mt-2">30% weight</p>
                </div>
              </div>

              {/* AI Analysis Section */}
              {ai && (
                <div className="space-y-6">
                  {/* Target Audience */}
                  <div className="bg-[var(--tf-deep-charcoal)] rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Target className="text-[var(--tf-copper-sheen)]" size={24} />
                      <h4 className="font-bold text-white text-lg">Target Audience</h4>
                    </div>
                    <p className="text-[var(--tf-smoked-gray)]">{ai.targetAudience}</p>
                  </div>

                  {/* Validation Steps */}
                  <div className="bg-[var(--tf-deep-charcoal)] rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="text-[var(--tf-success-glow)]" size={24} />
                      <h4 className="font-bold text-white text-lg">Quick Validation Steps</h4>
                    </div>
                    <ul className="space-y-2">
                      {ai.validationSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[var(--tf-smoked-gray)]">
                          <span className="text-[var(--tf-forge-orange)] font-bold mt-1">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quick Win */}
                  <div className="bg-[var(--tf-deep-charcoal)] rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Lightbulb className="text-[var(--tf-forge-orange)]" size={24} />
                      <h4 className="font-bold text-white text-lg">Quick Win</h4>
                    </div>
                    <p className="text-[var(--tf-smoked-gray)]">{ai.quickWin}</p>
                  </div>

                  {/* Top Risk */}
                  <div className="bg-[var(--tf-deep-charcoal)] rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className="text-[var(--tf-error-glow)]" size={24} />
                      <h4 className="font-bold text-white text-lg">Watch Out For</h4>
                    </div>
                    <p className="text-[var(--tf-smoked-gray)]">{ai.topRisk}</p>
                  </div>
                </div>
              )}

              {/* Upgrade CTA */}
              <div className="bg-gradient-to-r from-[var(--tf-forged-bronze)]/30 to-[var(--tf-dark-copper)]/30 border-2 border-[var(--tf-dark-copper)]/50 rounded-xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <AlertCircle className="text-[var(--tf-forge-orange)] flex-shrink-0 mt-1" size={32} />
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                      {ai ? ai.upgradeTeaser : `Your idea scored ${qpv.score}/10. But here's the problem...`}
                    </h3>
                    <p className="text-base md:text-lg text-[var(--tf-smoked-gray)] mb-6">
                      {qpv.failureTeaser}
                    </p>
                    <div className="mb-6 space-y-2">
                      <p className="text-sm text-[var(--tf-smoked-gray)]">
                        <strong className="text-white">What you&apos;re missing:</strong>
                      </p>
                      <ul className="text-sm text-[var(--tf-smoked-gray)] space-y-1 ml-4">
                        <li>• <strong>The WHY:</strong> Category-specific failure mode analysis with percentages</li>
                        <li>• <strong>The PITFALLS:</strong> Critical gaps with specific mitigations</li>
                        <li>• <strong>The PLAN:</strong> Week-by-week execution roadmap</li>
                        <li>• <strong>Founder Readiness:</strong> Skills, time, and financial buffer assessment</li>
                        <li>• <strong>Historical Patterns:</strong> What actually kills ideas in your category</li>
                      </ul>
                    </div>
                    <Link
                      href="/checkout?tier=starter"
                      className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[var(--tf-forge-orange)] to-[var(--tf-ember-glow)] hover:from-[var(--tf-ember-glow)] hover:to-[var(--tf-forge-orange)] text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
                    >
                      Get Full Profit Pulse 2.0 Analysis
                      <ArrowRight size={20} />
                    </Link>
                    <p className="text-sm text-[var(--tf-muted-steel)] mt-4">
                      Complete 4-layer evaluation • Failure mode breakdown • Execution plan • Comparison tools
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-[var(--tf-steel-gray)] hover:bg-[var(--tf-deep-charcoal)] text-white font-medium rounded-lg transition-all"
                >
                  Evaluate Another Idea
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

        <div className="bg-[var(--tf-deep-charcoal)]/50 backdrop-blur-sm rounded-2xl p-6 md:p-12 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Free AI-Powered Idea Analysis</h1>
            <p className="text-[var(--tf-smoked-gray)]">
              Get your QPV score + AI-generated insights on audience, validation, and risks
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Idea Information */}
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Tell us about your idea</h3>

              <div>
                <label className="block text-sm font-medium text-[var(--tf-smoked-gray)] mb-2">
                  Idea Name
                </label>
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
                <label className="block text-sm font-medium text-[var(--tf-smoked-gray)] mb-2">
                  One-Sentence Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your idea in one clear sentence..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--tf-steel-gray)] border border-[var(--tf-steel-gray)] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--tf-forge-orange)]"
                  required
                />
              </div>
            </div>

            {/* QPV Scoring */}
            <div className="space-y-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Rate your idea (0-10 scale)</h3>

              {/* Quickness */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="text-[var(--tf-forge-orange)]" size={24} />
                    <label className="text-base md:text-lg font-medium text-white">
                      Quickness (40% weight)
                    </label>
                  </div>
                  <span className="text-2xl md:text-3xl font-bold text-[var(--tf-forge-orange)]">{formData.quickness}</span>
                </div>
                <p className="text-sm text-[var(--tf-muted-steel)]">
                  How fast can you ship a testable version? (0 = Months | 10 = Live in 48 hours)
                </p>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={formData.quickness}
                  onChange={(e) => setFormData({ ...formData, quickness: parseInt(e.target.value) })}
                  className="w-full h-3 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[var(--tf-muted-steel)]">
                  <span>Months</span>
                  <span>Weeks</span>
                  <span>Days</span>
                  <span>48 Hours</span>
                </div>
              </div>

              {/* Profitability */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="text-[var(--tf-success-glow)]" size={24} />
                    <label className="text-base md:text-lg font-medium text-white">
                      Profitability (30% weight)
                    </label>
                  </div>
                  <span className="text-2xl md:text-3xl font-bold text-[var(--tf-success-glow)]">{formData.profitability}</span>
                </div>
                <p className="text-sm text-[var(--tf-muted-steel)]">
                  Revenue potential relative to effort (0 = Hard to monetize | 10 = Clear $1k+/month path)
                </p>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={formData.profitability}
                  onChange={(e) => setFormData({ ...formData, profitability: parseInt(e.target.value) })}
                  className="w-full h-3 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[var(--tf-muted-steel)]">
                  <span>Hard to monetize</span>
                  <span>$100/mo</span>
                  <span>$500/mo</span>
                  <span>$1k+/mo</span>
                </div>
              </div>

              {/* Validation Ease */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-[var(--tf-copper-sheen)]" size={24} />
                    <label className="text-base md:text-lg font-medium text-white">
                      Validation Ease (30% weight)
                    </label>
                  </div>
                  <span className="text-2xl md:text-3xl font-bold text-[var(--tf-copper-sheen)]">{formData.validationEase}</span>
                </div>
                <p className="text-sm text-[var(--tf-muted-steel)]">
                  How quickly can you get real demand signals? (0 = Hard to validate | 10 = Pre-sales in 24 hours)
                </p>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={formData.validationEase}
                  onChange={(e) => setFormData({ ...formData, validationEase: parseInt(e.target.value) })}
                  className="w-full h-3 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[var(--tf-muted-steel)]">
                  <span>Very hard</span>
                  <span>1-2 weeks</span>
                  <span>Few days</span>
                  <span>24-48 hours</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={isAnalyzing}
                className="px-8 md:px-12 py-3 md:py-4 bg-gradient-to-r from-[var(--tf-forge-orange)] to-[var(--tf-ember-glow)] hover:from-[var(--tf-ember-glow)] hover:to-[var(--tf-forge-orange)] text-white text-base md:text-lg font-bold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Analyzing with AI...
                  </>
                ) : (
                  'Get Free AI-Powered Analysis'
                )}
              </button>
              {error && (
                <p className="text-[var(--tf-error-glow)] text-sm">{error}</p>
              )}
            </div>

            {/* Free Tier Note */}
            <p className="text-center text-sm text-[var(--tf-muted-steel)]">
              100% free • No signup required • AI-powered insights in seconds
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
