'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, BarChart3, Trophy, TrendingUp, TrendingDown, 
  Zap, User, History, Calendar, CheckCircle2, XCircle, AlertTriangle
} from 'lucide-react';
import { getInterpretationText, getScoreColor, getCategoryDisplayName } from '@/lib/calculations';

interface SavedIdea {
  id: string;
  title: string;
  description: string | null;
  category: string;
  qpvScore: number | null;
  evaluation: {
    input: {
      ideaName: string;
      category: string;
    };
    result: {
      overallScore: number;
      interpretation: 'exceptional' | 'strong' | 'moderate' | 'weak';
      layers: {
        founderReadiness: { percentage: number; raw: number };
        ideaCharacteristics: { percentage: number; raw: number };
        historicalPatterns: { percentage: number; raw: number };
        contextualViability: { percentage: number; raw: number };
      };
      energyFilterStatus: 'pass' | 'fail' | 'revise';
      strengths: string[];
      gaps: Array<{ type: string; description: string }>;
    };
  } | null;
  createdAt: string;
}

export default function ComparePage() {
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const response = await fetch('/api/ideas');
      if (response.ok) {
        const data = await response.json();
        setIdeas(data.ideas || []);
      }
    } catch (error) {
      console.error('Failed to fetch ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 5) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedIdeas = ideas.filter(idea => selectedIds.includes(idea.id));
  
  const getWinner = () => {
    if (selectedIdeas.length < 2) return null;
    const withScores = selectedIdeas.filter(i => i.evaluation?.result);
    if (withScores.length < 2) return null;
    return withScores.reduce((best, current) => 
      (current.evaluation?.result?.overallScore || 0) > (best.evaluation?.result?.overallScore || 0) ? current : best
    );
  };

  const winner = getWinner();

  const getLayerIcon = (layer: string) => {
    switch (layer) {
      case 'founderReadiness': return <User size={16} />;
      case 'ideaCharacteristics': return <Zap size={16} />;
      case 'historicalPatterns': return <History size={16} />;
      case 'contextualViability': return <Calendar size={16} />;
      default: return <BarChart3 size={16} />;
    }
  };

  const getLayerName = (layer: string) => {
    switch (layer) {
      case 'founderReadiness': return 'Founder Readiness';
      case 'ideaCharacteristics': return 'Idea Characteristics';
      case 'historicalPatterns': return 'Historical Patterns';
      case 'contextualViability': return 'Contextual Viability';
      default: return layer;
    }
  };

  const getEnergyIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle2 className="text-green-500" size={16} />;
      case 'fail': return <XCircle className="text-red-500" size={16} />;
      default: return <AlertTriangle className="text-yellow-500" size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--tf-charcoal)]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[var(--tf-muted-steel)] hover:text-white transition-all mb-8"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="bg-[var(--tf-deep-charcoal)]/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <BarChart3 className="text-[var(--tf-forge-orange)]" />
                Compare Ideas
              </h1>
              <p className="text-[var(--tf-smoked-gray)]">
                Select 2-5 ideas to compare side-by-side
              </p>
            </div>
            {selectedIds.length >= 2 && (
              <button
                onClick={() => setComparing(!comparing)}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--tf-forge-orange)] hover:bg-[var(--tf-ember-glow)] text-white font-bold rounded-lg transition-all"
              >
                {comparing ? 'Edit Selection' : `Compare ${selectedIds.length} Ideas`}
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-[var(--tf-forge-orange)] border-t-transparent rounded-full animate-spin" />
              <p className="text-[var(--tf-muted-steel)]">Loading your ideas...</p>
            </div>
          ) : ideas.length < 2 ? (
            <div className="text-center py-16">
              <BarChart3 className="mx-auto mb-4 text-[var(--tf-muted-steel)]" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">Need More Ideas</h3>
              <p className="text-[var(--tf-muted-steel)] mb-6">
                You need at least 2 evaluated ideas to compare. Currently you have {ideas.length}.
              </p>
              <Link
                href="/evaluate/full"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--tf-forge-orange)] hover:bg-[var(--tf-ember-glow)] text-white font-bold rounded-lg"
              >
                <Zap size={20} />
                Evaluate an Idea
              </Link>
            </div>
          ) : !comparing ? (
            /* Selection Mode */
            <div className="space-y-4">
              <p className="text-sm text-[var(--tf-muted-steel)] mb-4">
                Selected: {selectedIds.length}/5 ideas
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ideas.map((idea) => {
                  const isSelected = selectedIds.includes(idea.id);
                  const result = idea.evaluation?.result;
                  
                  return (
                    <button
                      key={idea.id}
                      onClick={() => toggleSelect(idea.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-[var(--tf-forge-orange)] bg-[var(--tf-forge-orange)]/10'
                          : 'border-[var(--tf-steel-gray)] hover:border-[var(--tf-copper-sheen)]'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-white truncate pr-2">{idea.title}</h3>
                        {result && (
                          <span className={`text-2xl font-bold ${getScoreColor(result.interpretation)}`}>
                            {result.overallScore}
                          </span>
                        )}
                      </div>
                      {result && (
                        <p className="text-xs text-[var(--tf-muted-steel)]">
                          {getInterpretationText(result.interpretation)}
                        </p>
                      )}
                      {isSelected && (
                        <div className="mt-2 text-xs text-[var(--tf-forge-orange)] font-bold">
                          ✓ Selected
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Comparison View */
            <div className="space-y-8">
              {/* Winner Banner */}
              {winner && (
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-4">
                  <Trophy className="text-yellow-500" size={32} />
                  <div>
                    <p className="text-sm text-yellow-200">Recommended Winner</p>
                    <p className="text-xl font-bold text-white">{winner.title}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-3xl font-bold text-yellow-400">{winner.evaluation?.result?.overallScore}</p>
                    <p className="text-xs text-yellow-200">/10</p>
                  </div>
                </div>
              )}

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--tf-steel-gray)]">
                      <th className="text-left py-3 px-4 text-[var(--tf-muted-steel)] font-medium">Metric</th>
                      {selectedIdeas.map(idea => (
                        <th key={idea.id} className="text-center py-3 px-4">
                          <div className="text-white font-bold">{idea.title}</div>
                          <div className="text-xs text-[var(--tf-muted-steel)]">
                            {getCategoryDisplayName(idea.category as Parameters<typeof getCategoryDisplayName>[0])}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Overall Score */}
                    <tr className="border-b border-[var(--tf-steel-gray)]/50 bg-[var(--tf-steel-gray)]/10">
                      <td className="py-3 px-4 font-bold text-white">Overall Score</td>
                      {selectedIdeas.map(idea => {
                        const score = idea.evaluation?.result?.overallScore || 0;
                        const isWinner = winner?.id === idea.id;
                        return (
                          <td key={idea.id} className="text-center py-3 px-4">
                            <span className={`text-2xl font-bold ${isWinner ? 'text-yellow-400' : getScoreColor(idea.evaluation?.result?.interpretation || 'weak')}`}>
                              {score}
                            </span>
                            {isWinner && <Trophy className="inline ml-2 text-yellow-400" size={16} />}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Layer Scores */}
                    {['founderReadiness', 'ideaCharacteristics', 'historicalPatterns', 'contextualViability'].map(layer => {
                      const scores = selectedIdeas.map(idea => 
                        idea.evaluation?.result?.layers?.[layer as keyof typeof idea.evaluation.result.layers]?.percentage || 0
                      );
                      const maxScore = Math.max(...scores);
                      
                      return (
                        <tr key={layer} className="border-b border-[var(--tf-steel-gray)]/50">
                          <td className="py-3 px-4 text-[var(--tf-smoked-gray)] flex items-center gap-2">
                            {getLayerIcon(layer)}
                            {getLayerName(layer)}
                          </td>
                          {selectedIdeas.map((idea, idx) => {
                            const pct = scores[idx];
                            const isBest = pct === maxScore && maxScore > 0;
                            return (
                              <td key={idea.id} className="text-center py-3 px-4">
                                <div className="flex items-center justify-center gap-2">
                                  <span className={`font-bold ${isBest ? 'text-green-400' : 'text-white'}`}>
                                    {pct}%
                                  </span>
                                  {isBest && <TrendingUp className="text-green-400" size={14} />}
                                  {pct === Math.min(...scores) && scores.length > 1 && pct !== maxScore && (
                                    <TrendingDown className="text-red-400" size={14} />
                                  )}
                                </div>
                                <div className="w-full bg-[var(--tf-steel-gray)] rounded-full h-2 mt-1">
                                  <div 
                                    className={`h-2 rounded-full ${isBest ? 'bg-green-500' : 'bg-[var(--tf-copper-sheen)]'}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}

                    {/* Energy Filter */}
                    <tr className="border-b border-[var(--tf-steel-gray)]/50">
                      <td className="py-3 px-4 text-[var(--tf-smoked-gray)]">Energy Filter</td>
                      {selectedIdeas.map(idea => (
                        <td key={idea.id} className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            {getEnergyIcon(idea.evaluation?.result?.energyFilterStatus || 'revise')}
                            <span className="text-white capitalize">
                              {idea.evaluation?.result?.energyFilterStatus || 'N/A'}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Strengths Count */}
                    <tr className="border-b border-[var(--tf-steel-gray)]/50">
                      <td className="py-3 px-4 text-[var(--tf-smoked-gray)]">Strengths</td>
                      {selectedIdeas.map(idea => (
                        <td key={idea.id} className="text-center py-3 px-4 text-green-400">
                          {idea.evaluation?.result?.strengths?.length || 0} identified
                        </td>
                      ))}
                    </tr>

                    {/* Gaps Count */}
                    <tr>
                      <td className="py-3 px-4 text-[var(--tf-smoked-gray)]">Gaps/Risks</td>
                      {selectedIdeas.map(idea => (
                        <td key={idea.id} className="text-center py-3 px-4 text-orange-400">
                          {idea.evaluation?.result?.gaps?.length || 0} to address
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Recommendation */}
              {winner && (
                <div className="bg-[var(--tf-deep-charcoal)] rounded-xl p-6 border border-[var(--tf-steel-gray)]">
                  <h3 className="text-lg font-bold text-white mb-4">💡 Recommendation</h3>
                  <p className="text-[var(--tf-smoked-gray)]">
                    Based on the overall scores and layer analysis, <strong className="text-white">{winner.title}</strong> appears 
                    to be the strongest candidate with a score of <strong className="text-[var(--tf-forge-orange)]">{winner.evaluation?.result?.overallScore}/10</strong>.
                    {winner.evaluation?.result?.interpretation === 'exceptional' && (
                      <span className="text-green-400"> This idea is rated as exceptional — consider launching immediately.</span>
                    )}
                    {winner.evaluation?.result?.interpretation === 'strong' && (
                      <span className="text-[var(--tf-forge-orange)]"> This idea is rated as strong — prioritize within 1-2 weeks.</span>
                    )}
                    {winner.evaluation?.result?.interpretation === 'moderate' && (
                      <span className="text-yellow-400"> This idea is rated as moderate — validate further before committing.</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
