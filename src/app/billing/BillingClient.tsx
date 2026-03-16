'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    images: '1,000',
    imageCount: 1000,
    features: [
      '1,000 images per month',
      'White, transparent & custom color',
      'ZIP download',
      'Job history (30 days)',
    ],
    recommended: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 39,
    images: '5,000',
    imageCount: 5000,
    features: [
      '5,000 images per month',
      'White, transparent & custom color',
      'ZIP download',
      'Job history (30 days)',
      'Priority processing',
    ],
    recommended: true,
  },
  {
    id: 'max',
    name: 'Max',
    price: 79,
    images: '50,000',
    imageCount: 50000,
    features: [
      '50,000 images per month',
      'White, transparent & custom color',
      'ZIP download',
      'Job history (30 days)',
      'Priority processing',
      'Dedicated support',
    ],
    recommended: false,
  },
];

interface Props {
  planId: string;
  planName: string;
  imageLimit: number;
  imagesUsed: number;
  status: string;
  currentPeriodEnd: string | null;
  upgraded: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    canceling: 'bg-yellow-100 text-yellow-700',
    past_due: 'bg-red-100 text-red-700',
  };
  const labels: Record<string, string> = {
    active: 'Active',
    canceling: 'Cancels at period end',
    past_due: 'Past due',
  };
  const cls = styles[status] ?? 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {labels[status] ?? status}
    </span>
  );
}

export default function BillingClient({
  planId,
  planName,
  imageLimit,
  imagesUsed,
  status,
  currentPeriodEnd,
  upgraded,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const isFreeTrial = planId === 'free_trial';
  const isPaid = !isFreeTrial;
  const usagePct = Math.min(100, Math.round((imagesUsed / imageLimit) * 100));

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }

  async function handleChangePlan(targetPlanId: string) {
    setLoading(targetPlanId);
    try {
      const res = await fetch('/api/billing/change-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: targetPlanId }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to change plan');
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else if (data.success) {
        showToast('Plan updated successfully!');
        router.refresh();
      }
    } catch {
      showToast('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  async function handleCancel() {
    setCanceling(true);
    try {
      const res = await fetch('/api/billing/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ immediate: false }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to cancel subscription');
        return;
      }
      showToast('Subscription canceled. You\'ll retain access until the end of your billing period.');
      setShowCancelConfirm(false);
      router.refresh();
    } catch {
      showToast('Something went wrong. Please try again.');
    } finally {
      setCanceling(false);
    }
  }

  const renewalLabel = status === 'canceling' ? 'Cancels' : 'Renews';

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-card border border-border px-5 py-3 shadow-lg text-sm text-card-foreground">
          {toast}
        </div>
      )}

      {/* Upgrade success */}
      {upgraded && (
        <div className="rounded-xl border border-border bg-card px-5 py-4 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold text-card-foreground">You&apos;re now on the {planName} plan!</p>
            <p className="text-sm text-muted-foreground">You can now process up to {imageLimit.toLocaleString()} images per month.</p>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing &amp; Subscription</h1>
        <p className="text-muted-foreground mt-1">Manage your plan and usage.</p>
      </div>

      {/* Current plan card */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Current plan</p>
            <p className="text-xl font-semibold text-card-foreground mt-0.5">{planName}</p>
          </div>
          <StatusBadge status={status} />
        </div>

        {currentPeriodEnd && isPaid && (
          <p className="text-sm text-muted-foreground">
            {renewalLabel} {formatDate(currentPeriodEnd)}
          </p>
        )}

        {/* Usage bar */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Images used this month</span>
            <span className="font-medium text-card-foreground">
              {imagesUsed.toLocaleString()} / {imageLimit.toLocaleString()}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${usagePct >= 90 ? 'bg-red-500' : usagePct >= 70 ? 'bg-yellow-500' : 'bg-primary'}`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Plan selector */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {isFreeTrial ? 'Choose a plan' : 'Switch plan'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isCurrent = planId === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-6 flex flex-col bg-card ${
                  isCurrent
                    ? 'border-primary shadow-md'
                    : plan.recommended
                    ? 'border-blue-400'
                    : 'border-border'
                }`}
              >
                {plan.recommended && !isCurrent && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Current plan
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-card-foreground">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-card-foreground">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{plan.images} images included</p>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-lg text-sm font-semibold bg-muted text-muted-foreground cursor-default"
                  >
                    Current plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleChangePlan(plan.id)}
                    disabled={loading !== null}
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                      plan.recommended
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-foreground text-background hover:bg-foreground/90'
                    }`}
                  >
                    {loading === plan.id ? 'Loading...' : `Switch to ${plan.name}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger zone — only for paid, non-canceling users */}
      {isPaid && status !== 'canceling' && status !== 'canceled' && (
        <div className="rounded-xl border border-destructive/30 bg-card p-6">
          <h2 className="text-base font-semibold text-foreground mb-1">Danger zone</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Cancel your subscription. You&apos;ll retain access until the end of your billing period.
          </p>

          {!showCancelConfirm ? (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="rounded-lg border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
            >
              Cancel subscription
            </button>
          ) : (
            <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-4 space-y-3">
              <p className="text-sm text-foreground">
                {currentPeriodEnd
                  ? `Your plan stays active until ${formatDate(currentPeriodEnd)}. After that you'll be on the free tier.`
                  : "Are you sure you want to cancel? You'll be moved to the free tier at the end of your billing period."}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  disabled={canceling}
                  className="rounded-lg bg-destructive text-destructive-foreground px-4 py-2 text-sm font-medium hover:bg-destructive/90 disabled:opacity-60 transition-colors"
                >
                  {canceling ? 'Canceling...' : 'Yes, cancel'}
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={canceling}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Keep subscription
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
