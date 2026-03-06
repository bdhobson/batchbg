'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    images: '1,000',
    features: [
      '1,000 images per month',
      'White, transparent & custom color',
      'ZIP download',
      'Job history (30 days)',
    ],
    recommended: false,
    cta: 'Get Starter',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 39,
    images: '5,000',
    features: [
      '5,000 images per month',
      'White, transparent & custom color',
      'ZIP download',
      'Job history (30 days)',
      'Priority processing',
    ],
    recommended: true,
    cta: 'Get Pro',
  },
  {
    id: 'max',
    name: 'Max',
    price: 79,
    images: '50,000',
    features: [
      '50,000 images per month',
      'White, transparent & custom color',
      'ZIP download',
      'Job history (30 days)',
      'Priority processing',
      'Dedicated support',
    ],
    recommended: false,
    cta: 'Get Max',
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe(planId: string) {
    setLoading(planId);
    setError(null);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/sign-in?redirect=/pricing');
          return;
        }
        setError(data.error || 'Failed to start checkout');
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Backdrop
        </Link>
        <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
          Dashboard →
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, flat-rate pricing</h1>
          <p className="text-lg text-gray-500">No credits, no surprises. Pay once, process all month.</p>
        </div>

        {error && (
          <div className="mb-8 max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 p-8 flex flex-col ${
                plan.recommended ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-gray-200'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{plan.images} images included</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading !== null}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-sm transition-colors ${
                  plan.recommended
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? 'Redirecting...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Want to try first? <Link href="/upload" className="text-blue-600 hover:underline">Process 5 images free</Link> — no credit card required.</p>
        </div>
      </main>
    </div>
  );
}
