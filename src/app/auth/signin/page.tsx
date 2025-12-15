'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';
  const error = searchParams?.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setErrorMessage(result.error);
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--tf-charcoal)] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Zap className="text-[var(--tf-forge-orange)]" size={32} />
            <span className="text-2xl font-bold text-white">
              Profit <span className="text-[var(--tf-forge-orange)]">Pulse</span>
            </span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-white">Sign in to your account</h2>
          <p className="mt-2 text-sm text-[var(--tf-smoked-gray)]">
            Or{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-[var(--tf-forge-orange)] hover:text-[var(--tf-ember-glow)]"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Error Messages */}
        {(error || errorMessage) && (
          <div className="bg-[var(--tf-error)]/10 border border-[var(--tf-error)] text-[var(--tf-error)] px-4 py-3 rounded-lg">
            <p className="text-sm">
              {error === 'CredentialsSignin'
                ? 'Invalid email or password'
                : errorMessage || 'An error occurred during sign in'}
            </p>
          </div>
        )}

        {/* Sign In Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--tf-smoked-gray)] mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-[var(--tf-steel-gray)] bg-[var(--tf-deep-charcoal)] text-white placeholder-[var(--tf-muted-steel)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--tf-forge-orange)] focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--tf-smoked-gray)] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-[var(--tf-steel-gray)] bg-[var(--tf-deep-charcoal)] text-white placeholder-[var(--tf-muted-steel)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--tf-forge-orange)] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[var(--tf-forge-orange)] focus:ring-[var(--tf-forge-orange)] border-[var(--tf-steel-gray)] rounded bg-[var(--tf-deep-charcoal)]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--tf-smoked-gray)]">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/auth/forgot-password"
                className="font-medium text-[var(--tf-forge-orange)] hover:text-[var(--tf-ember-glow)]"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[var(--tf-forge-orange)] to-[var(--tf-ember-glow)] hover:from-[var(--tf-ember-glow)] hover:to-[var(--tf-forge-orange)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--tf-forge-orange)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--tf-steel-gray)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--tf-charcoal)] text-[var(--tf-muted-steel)]">
                New to Profit Pulse?
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/evaluate"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[var(--tf-steel-gray)] rounded-lg text-[var(--tf-smoked-gray)] bg-[var(--tf-deep-charcoal)] hover:bg-[var(--tf-steel-gray)] transition-colors"
            >
              <Zap size={16} />
              Try Free QPV Calculator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
