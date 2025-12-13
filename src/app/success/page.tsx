'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<{ evaluations: number; blueprints: number } | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found');
      setIsLoading(false);
      return;
    }

    const verifySession = async () => {
      try {
        const response = await fetch('/api/verify-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error('Failed to verify payment');
        }

        const data = await response.json();
        setCredits(data.credits);
        setIsLoading(false);
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError('Failed to verify your payment. Please contact support.');
        setIsLoading(false);
      }
    };

    verifySession();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tf-charcoal">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-tf-forge-orange mx-auto mb-4" />
          <p className="text-tf-smoked-gray">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tf-charcoal">
        <div className="bg-tf-deep-charcoal p-8 rounded-lg shadow-md max-w-md w-full text-center border border-tf-steel-gray">
          <div className="text-red-500 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Payment Error</h2>
          <p className="text-tf-smoked-gray mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block w-full bg-tf-forge-orange text-white py-2 px-4 rounded-md hover:bg-tf-ember-glow transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-tf-charcoal">
      <div className="bg-tf-deep-charcoal p-8 rounded-lg shadow-md max-w-md w-full text-center border border-tf-steel-gray">
        <div className="text-tf-success-glow mb-4">
          <CheckCircle2 className="h-16 w-16 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
        <p className="text-tf-smoked-gray mb-6">
          Thank you for your purchase. Your credits have been added to your account.
        </p>

        {credits && (
          <div className="bg-tf-charcoal rounded-lg p-4 mb-6 border border-tf-steel-gray">
            <h3 className="text-lg font-semibold text-white mb-3">Your Credits</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-tf-forge-orange">{credits.evaluations}</p>
                <p className="text-tf-muted-steel text-sm">Evaluations</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-tf-copper-sheen">{credits.blueprints}</p>
                <p className="text-tf-muted-steel text-sm">Blueprints</p>
              </div>
            </div>
          </div>
        )}

        <Link
          href="/evaluate"
          className="inline-flex items-center justify-center gap-2 w-full bg-tf-forge-orange text-white py-3 px-4 rounded-md hover:bg-tf-ember-glow transition-colors font-semibold"
        >
          Start Evaluating
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
