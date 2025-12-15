'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function SignUp() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      // Create account via API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Auto sign-in after successful signup
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push('/dashboard');
      } else {
        router.push('/auth/signin?created=true');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
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
          <h2 className="mt-6 text-3xl font-bold text-white">Create your account</h2>
          <p className="mt-2 text-sm text-[var(--tf-smoked-gray)]">
            Already have an account?{' '}
            <Link
              href="/auth/signin"
              className="font-medium text-[var(--tf-forge-orange)] hover:text-[var(--tf-ember-glow)]"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Error Messages */}
        {errorMessage && (
          <div className="bg-[var(--tf-error)]/10 border border-[var(--tf-error)] text-[var(--tf-error)] px-4 py-3 rounded-lg">
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Sign Up Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--tf-smoked-gray)] mb-2">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-[var(--tf-steel-gray)] bg-[var(--tf-deep-charcoal)] text-white placeholder-[var(--tf-muted-steel)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--tf-forge-orange)] focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

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
                value={formData.email}
                onChange={handleChange}
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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-[var(--tf-steel-gray)] bg-[var(--tf-deep-charcoal)] text-white placeholder-[var(--tf-muted-steel)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--tf-forge-orange)] focus:border-transparent"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-[var(--tf-muted-steel)]">At least 8 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--tf-smoked-gray)] mb-2">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-[var(--tf-steel-gray)] bg-[var(--tf-deep-charcoal)] text-white placeholder-[var(--tf-muted-steel)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--tf-forge-orange)] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-[var(--tf-forge-orange)] focus:ring-[var(--tf-forge-orange)] border-[var(--tf-steel-gray)] rounded bg-[var(--tf-deep-charcoal)]"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-[var(--tf-smoked-gray)]">
              I agree to the{' '}
              <Link href="/terms" className="text-[var(--tf-forge-orange)] hover:text-[var(--tf-ember-glow)]">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[var(--tf-forge-orange)] hover:text-[var(--tf-ember-glow)]">
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[var(--tf-forge-orange)] to-[var(--tf-ember-glow)] hover:from-[var(--tf-ember-glow)] hover:to-[var(--tf-forge-orange)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--tf-forge-orange)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
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
                Not ready to sign up?
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
