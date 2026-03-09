export type PlanId = 'free_trial' | 'starter' | 'pro' | 'max';

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // USD/month
  images: number; // per month
  stripePriceEnvKey?: string;
  features: string[];
  recommended?: boolean;
}

export const PLANS: Record<PlanId, Plan> = {
  free_trial: {
    id: 'free_trial',
    name: 'Free Trial',
    price: 0,
    images: 5,
    features: ['5 images/month', 'White & transparent output', 'ZIP download'],
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 19,
    images: 1000,
    stripePriceEnvKey: 'STRIPE_PRICE_STARTER',
    features: ['1,000 images/month', 'White, transparent & custom color', 'ZIP download', 'Job history (30 days)'],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 39,
    images: 5000,
    stripePriceEnvKey: 'STRIPE_PRICE_PRO',
    features: ['5,000 images/month', 'White, transparent & custom color', 'ZIP download', 'Job history (30 days)', 'Priority processing'],
    recommended: true,
  },
  max: {
    id: 'max',
    name: 'Max',
    price: 79,
    images: 50000,
    stripePriceEnvKey: 'STRIPE_PRICE_MAX',
    features: ['50,000 images/month', 'White, transparent & custom color', 'ZIP download', 'Job history (30 days)', 'Priority processing', 'Dedicated support'],
  },
};

export function getStripePriceId(planId: PlanId): string {
  const plan = PLANS[planId];
  if (!plan.stripePriceEnvKey) throw new Error(`No price key for plan ${planId}`);
  const priceId = process.env[plan.stripePriceEnvKey];
  if (!priceId) throw new Error(`Env var ${plan.stripePriceEnvKey} is not set`);
  return priceId;
}
