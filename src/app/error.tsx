'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Zap, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--tf-charcoal)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Zap className="text-[var(--tf-error)] animate-pulse" size={64} />
          </div>

          <h1 className="text-4xl font-bold text-white">
            Oops! Something went wrong
          </h1>

          <p className="text-[var(--tf-smoked-gray)] text-lg">
            We encountered an unexpected error. This has been logged and we'll look into it.
          </p>

          {error.message && (
            <div className="bg-[var(--tf-deep-charcoal)] border border-[var(--tf-steel-gray)] rounded-lg p-4">
              <p className="text-sm text-[var(--tf-muted-steel)] font-mono">
                {error.message}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all bg-gradient-to-r from-[var(--tf-forge-orange)] to-[var(--tf-ember-glow)] text-white shadow-lg hover:from-[var(--tf-ember-glow)] hover:to-[var(--tf-forge-orange)]"
          >
            <RefreshCw size={20} />
            Try again
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all bg-[var(--tf-deep-charcoal)] text-[var(--tf-smoked-gray)] border border-[var(--tf-steel-gray)] hover:bg-[var(--tf-steel-gray)]"
          >
            <Home size={20} />
            Go home
          </Link>
        </div>

        <p className="text-sm text-[var(--tf-muted-steel)]">
          If this problem persists, please{' '}
          <Link href="/contact" className="text-[var(--tf-forge-orange)] hover:text-[var(--tf-ember-glow)]">
            contact support
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
