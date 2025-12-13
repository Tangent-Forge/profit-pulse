import Link from 'next/link';
import { ArrowLeft, Zap, Plus } from 'lucide-react';

export default function DashboardPage() {
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">My Ideas</h1>
              <p className="text-[var(--tf-smoked-gray)]">
                Track and compare your evaluated business ideas
              </p>
            </div>
            <Link
              href="/evaluate"
              className="flex items-center gap-2 px-4 py-2 bg-[var(--tf-forge-orange)] hover:bg-[var(--tf-ember-glow)] text-white font-medium rounded-lg transition-all"
            >
              <Plus size={20} />
              New Evaluation
            </Link>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--tf-steel-gray)] flex items-center justify-center">
              <Zap className="text-[var(--tf-muted-steel)]" size={40} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No ideas evaluated yet</h3>
            <p className="text-[var(--tf-muted-steel)] mb-6 max-w-md mx-auto">
              Start by evaluating your first business idea with our free QPV calculator or unlock the full multi-layer analysis.
            </p>
            <Link
              href="/evaluate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--tf-forge-orange)] to-[var(--tf-ember-glow)] hover:from-[var(--tf-ember-glow)] hover:to-[var(--tf-forge-orange)] text-white font-bold rounded-lg transition-all shadow-lg"
            >
              <Zap size={20} />
              Evaluate Your First Idea
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
