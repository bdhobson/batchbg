import Link from 'next/link';
import { auth } from '@/lib/auth';
import { ArrowRight, Upload, Zap, Download, CheckCircle, Star, Package } from 'lucide-react';

const STATS = [
  { value: '2s', label: 'avg per image' },
  { value: '500+', label: 'images per batch' },
  { value: '99%', label: 'clean edges' },
];

const FEATURES = [
  {
    icon: Upload,
    title: 'Bulk upload',
    desc: 'Drop an entire catalog at once, up to 500 images per batch. JPG, PNG, or WEBP.',
  },
  {
    icon: Zap,
    title: 'AI-powered removal',
    desc: 'Background removed in ~2 seconds per image. Powered by BRIA RMBG-2.0.',
  },
  {
    icon: Download,
    title: 'Download as ZIP',
    desc: 'All processed images bundled and ready. Original filenames preserved.',
  },
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    images: '5 images/month',
    features: ['White & transparent bg', 'ZIP download'],
    cta: 'Start for free',
    highlight: false,
    badge: null,
    href: '/sign-up',
  },
  {
    name: 'Starter',
    price: '$19',
    period: '/mo',
    images: '1,000 images/month',
    features: ['White & transparent bg', 'ZIP download', 'Job history (30 days)'],
    cta: 'Get started',
    highlight: false,
    href: '/sign-up?plan=starter',
  },
  {
    name: 'Pro',
    price: '$39',
    period: '/mo',
    images: '5,000 images/month',
    features: ['White & transparent bg', 'ZIP download', 'Job history (30 days)', 'Priority processing'],
    cta: 'Get started',
    highlight: true,
    badge: 'Most popular',
    href: '/sign-up?plan=pro',
  },
  {
    name: 'Max',
    price: '$79',
    period: '/mo',
    images: '50,000 images/month',
    features: ['White & transparent bg', 'ZIP download', 'Job history (30 days)', 'Priority processing', 'Dedicated support'],
    cta: 'Get started',
    highlight: false,
    href: '/sign-up?plan=max',
  },
];

const TESTIMONIALS = [
  {
    quote: "I was spending 20 minutes per photo in Photoshop. Now I do 200 images in the time it used to take me to do one.",
    author: "eBay seller · 1,200+ listings",
  },
  {
    quote: "The flat pricing is the killer feature. I know exactly what I'm spending each month no matter how busy I get.",
    author: "Amazon FBA seller · apparel niche",
  },
];

export default async function LandingPage() {
  const { userId } = await auth();
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">B</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">Backdrop</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            {userId ? (
              <Link href="/dashboard" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Try free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 pt-36 pb-20 text-center">
          <h1 className="text-5xl font-bold tracking-tight leading-tight sm:text-6xl md:text-7xl mb-6">
            Remove backgrounds from<br />
            <span className="text-muted-foreground">hundreds of product photos.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Built for e-commerce sellers. Upload 500 photos, get clean white-background images back in minutes. Flat monthly pricing with no per-image fees.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Start for free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Before / After */}
        <section className="border-t border-border py-20 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">See the difference</h2>
              <p className="text-muted-foreground text-lg">Upload. Process. Download. That&apos;s it.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Before */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-3 border-b border-border">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Before</span>
                </div>
                <div className="p-8 flex items-center justify-center min-h-64 bg-secondary/30">
                  <div className="relative w-52 h-52 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary via-accent to-muted" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-lg bg-card/60 border border-border flex items-center justify-center">
                        <Package className="h-16 w-16 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-0 right-0 text-center">
                      <span className="text-xs text-muted-foreground bg-background/80 px-2 py-0.5 rounded">Cluttered background</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="rounded-2xl border border-primary/40 bg-card overflow-hidden">
                <div className="px-5 py-3 border-b border-border">
                  <span className="text-xs font-semibold text-primary uppercase tracking-widest">After</span>
                </div>
                <div className="p-8 flex items-center justify-center min-h-64">
                  <div className="relative w-52 h-52 rounded-xl overflow-hidden bg-white border border-border/30">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-lg flex items-center justify-center">
                        <Package className="h-16 w-16 text-zinc-700" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-0 right-0 text-center">
                      <span className="text-xs text-zinc-400 bg-white/80 px-2 py-0.5 rounded">Clean white background</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border py-20 px-6 bg-secondary/10">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">How it works</h2>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {FEATURES.map((f, i) => (
                <div key={f.title} className="rounded-xl border border-border bg-card p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground mb-4">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-t border-border py-20 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Simple, flat pricing</h2>
              <p className="text-muted-foreground text-lg">No credits. No per-image fees. 5 free images/month on every account.</p>
            </div>

            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl border p-5 flex flex-col relative ${
                    plan.highlight
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-block rounded-full bg-foreground text-background text-xs font-semibold px-3 py-1">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  <div className="mb-6">
                    <div className={`text-sm font-semibold uppercase tracking-widest mb-3 ${plan.highlight ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {plan.name}
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                      <span className={`mb-1 text-sm ${plan.highlight ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{plan.period}</span>
                    </div>
                    <div className={`text-sm mt-1 ${plan.highlight ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{plan.images}</div>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle className={`h-4 w-4 shrink-0 ${plan.highlight ? 'text-primary-foreground' : 'text-foreground'}`} />
                        <span className={plan.highlight ? 'text-primary-foreground' : 'text-muted-foreground'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className={`block rounded-xl px-4 py-3 text-sm font-semibold text-center transition-colors ${
                      plan.highlight
                        ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                  {plan.name === 'Free'
                    ? <p className="text-xs text-center mt-3">&nbsp;</p>
                    : <p className={`text-xs text-center mt-3 ${plan.highlight ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>cancel anytime</p>
                  }
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Not ready to commit? Sign up free — you get 5 images/month at no charge, no credit card needed.
            </p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-t border-border py-20 px-6 bg-secondary/10">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Sellers love Backdrop</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {TESTIMONIALS.map((t) => (
                <div key={t.author} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <p className="text-sm text-muted-foreground">{t.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border py-24 px-6 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Start removing backgrounds today
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              5 free images every month. No credit card required. Upgrade anytime.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-10 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Try Backdrop free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <span className="text-xs font-bold text-primary-foreground">B</span>
            </div>
            <span className="font-medium text-foreground">Backdrop</span>
          </div>
          <span>© {new Date().getFullYear()} Backdrop. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/sign-in" className="hover:text-foreground transition-colors">Sign in</Link>
            <Link href="/sign-up" className="hover:text-foreground transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
