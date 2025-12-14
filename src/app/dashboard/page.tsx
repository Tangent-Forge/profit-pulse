'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Plus, Trash2, Download, BarChart3, Calendar, TrendingUp, GitCompare } from 'lucide-react';
import { getInterpretationText, getScoreColor } from '@/lib/calculations';
import { generateMarkdownExport, generateCSVExport, downloadFile } from '@/lib/export';

interface SavedIdea {
  id: string;
  title: string;
  description: string | null;
  qpvScore: number | null;
  evaluation: {
    input: unknown;
    result: {
      overallScore: number;
      interpretation: 'exceptional' | 'strong' | 'moderate' | 'weak';
      layers: {
        founderReadiness: { percentage: number };
        ideaCharacteristics: { percentage: number };
        historicalPatterns: { percentage: number };
        contextualViability: { percentage: number };
      };
      evaluatedAt: string;
    };
    suggestions: unknown[];
  } | null;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this idea?')) return;
    try {
      const response = await fetch(`/api/ideas/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setIdeas(ideas.filter(idea => idea.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete idea:', error);
    }
  };

  const handleExportSelected = () => {
    const selectedIdeas = ideas.filter(idea => selectedIds.has(idea.id));
    if (selectedIdeas.length === 0) return;

    const exportData = selectedIdeas
      .filter(idea => idea.evaluation?.result && idea.evaluation?.input)
      .map(idea => ({
        input: idea.evaluation!.input as Parameters<typeof generateMarkdownExport>[0],
        result: idea.evaluation!.result as Parameters<typeof generateMarkdownExport>[1],
      }));

    if (exportData.length > 0) {
      const csv = generateCSVExport(exportData);
      downloadFile(csv, 'profit-pulse-ideas.csv', 'text/csv');
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (selectedIds.size === ideas.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(ideas.map(i => i.id)));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--tf-charcoal)]">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--tf-muted-steel)] hover:text-white transition-all mb-8"
        >
          <ArrowLeft size={20} />
          Back to home
        </Link>

        <div className="bg-[var(--tf-deep-charcoal)]/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">My Ideas</h1>
              <p className="text-[var(--tf-smoked-gray)]">
                Track and compare your evaluated business ideas
              </p>
            </div>
            <div className="flex gap-3">
              {selectedIds.size > 0 && (
                <button
                  onClick={handleExportSelected}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--tf-steel-gray)] hover:bg-[var(--tf-deep-charcoal)] text-white rounded-lg transition-all"
                >
                  <Download size={18} />
                  Export ({selectedIds.size})
                </button>
              )}
              <Link
                href="/compare"
                className="flex items-center gap-2 px-4 py-2 bg-[var(--tf-steel-gray)] hover:bg-[var(--tf-deep-charcoal)] text-white rounded-lg transition-all"
              >
                <GitCompare size={18} />
                Compare
              </Link>
              <Link
                href="/evaluate/full"
                className="flex items-center gap-2 px-4 py-2 bg-[var(--tf-forge-orange)] hover:bg-[var(--tf-ember-glow)] text-white font-medium rounded-lg transition-all"
              >
                <Plus size={20} />
                New Evaluation
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-[var(--tf-forge-orange)] border-t-transparent rounded-full animate-spin" />
              <p className="text-[var(--tf-muted-steel)]">Loading your ideas...</p>
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--tf-steel-gray)] flex items-center justify-center">
                <Zap className="text-[var(--tf-muted-steel)]" size={40} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No ideas evaluated yet</h3>
              <p className="text-[var(--tf-muted-steel)] mb-6 max-w-md mx-auto">
                Start by evaluating your first business idea with our free QPV calculator or unlock the full multi-layer analysis.
              </p>
              <Link
                href="/evaluate/full"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--tf-forge-orange)] to-[var(--tf-ember-glow)] hover:from-[var(--tf-ember-glow)] hover:to-[var(--tf-forge-orange)] text-white font-bold rounded-lg transition-all shadow-lg"
              >
                <Zap size={20} />
                Evaluate Your First Idea
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Select All */}
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--tf-steel-gray)]">
                <input
                  type="checkbox"
                  checked={selectedIds.size === ideas.length}
                  onChange={selectAll}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-[var(--tf-muted-steel)]">
                  {selectedIds.size === ideas.length ? 'Deselect all' : 'Select all'} ({ideas.length} ideas)
                </span>
              </div>

              {/* Ideas List */}
              {ideas.map((idea) => {
                const result = idea.evaluation?.result;
                const interpretation = result?.interpretation || 'moderate';
                
                return (
                  <div
                    key={idea.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedIds.has(idea.id)
                        ? 'border-[var(--tf-forge-orange)] bg-[var(--tf-forge-orange)]/5'
                        : 'border-[var(--tf-steel-gray)] hover:border-[var(--tf-copper-sheen)]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(idea.id)}
                        onChange={() => toggleSelect(idea.id)}
                        className="w-4 h-4 rounded mt-1"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-white truncate">{idea.title}</h3>
                            {idea.description && (
                              <p className="text-sm text-[var(--tf-muted-steel)] line-clamp-2 mt-1">
                                {idea.description}
                              </p>
                            )}
                          </div>
                          
                          {result && (
                            <div className="text-right flex-shrink-0">
                              <div className={`text-3xl font-bold ${getScoreColor(interpretation)}`}>
                                {result.overallScore}
                              </div>
                              <div className="text-xs text-[var(--tf-muted-steel)]">
                                {getInterpretationText(interpretation)}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Layer Breakdown Mini */}
                        {result && (
                          <div className="flex gap-4 mt-3 text-xs">
                            <div className="flex items-center gap-1">
                              <BarChart3 size={12} className="text-[var(--tf-forge-orange)]" />
                              <span className="text-[var(--tf-muted-steel)]">FR: {result.layers.founderReadiness.percentage}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap size={12} className="text-[var(--tf-success-glow)]" />
                              <span className="text-[var(--tf-muted-steel)]">IC: {result.layers.ideaCharacteristics.percentage}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp size={12} className="text-[var(--tf-copper-sheen)]" />
                              <span className="text-[var(--tf-muted-steel)]">HP: {result.layers.historicalPatterns.percentage}%</span>
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--tf-steel-gray)]/50">
                          <div className="flex items-center gap-1 text-xs text-[var(--tf-muted-steel)]">
                            <Calendar size={12} />
                            {new Date(idea.createdAt).toLocaleDateString()}
                          </div>
                          <button
                            onClick={() => handleDelete(idea.id)}
                            className="p-2 text-[var(--tf-muted-steel)] hover:text-[var(--tf-error-glow)] transition-all"
                            title="Delete idea"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
