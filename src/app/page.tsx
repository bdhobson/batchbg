import Link from 'next/link';
import { ArrowRight, Upload, Zap, Download } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">B</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">Backdrop</span>
          </Link>
          <Link
            href="/sign-in"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pt-36 pb-20 text-center">
          <h1 className="text-5xl font-bold tracking-tight leading-tight sm:text-6xl md:text-7xl">
            Remove backgrounds from<br />hundreds of product photos at once
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for e-commerce sellers who need clean, white-background product images — fast. Upload 500 photos, get them back in minutes.
          </p>
          <div className="mt-10">
            <Link
              href="/new"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Try free — 5 images
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Before/after visual */}
        <section className="mx-auto max-w-4xl px-6 pb-20">
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Before</p>
              <div className="aspect-square rounded-xl bg-secondary flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Original photo</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">After</p>
              <div className="aspect-square rounded-xl bg-secondary flex items-center justify-center border-2 border-dashed border-border">
                <span className="text-muted-foreground text-sm">Clean background</span>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-4xl px-6 pb-20">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">How it works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Upload, step: '1', title: 'Upload', desc: 'Drop up to 500 product photos at once. JPG, PNG, or WEBP.' },
              { icon: Zap, step: '2', title: 'Process', desc: 'Our AI removes backgrounds in parallel. Done in minutes, not hours.' },
              { icon: Download, step: '3', title: 'Download', desc: 'Get a ZIP of all your clean images — white background, transparent, or custom color.' },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-border bg-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-4">Simple, flat pricing</h2>
          <p className="text-center text-muted-foreground mb-12">No credits. No per-image fees. Just a flat monthly plan.</p>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { name: 'Starter', price: '$19', images: '1,000', desc: 'Perfect for small shops' },
              { name: 'Pro', price: '$39', images: '5,000', desc: 'For growing stores', highlight: true },
              { name: 'Max', price: '$79', images: '50,000', desc: 'High-volume sellers' },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-6 flex flex-col ${plan.highlight ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card'}`}
              >
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg ${plan.highlight ? 'text-primary-foreground' : 'text-card-foreground'}`}>{plan.name}</h3>
                  <p className={`text-4xl font-bold tracking-tight mt-3 ${plan.highlight ? 'text-primary-foreground' : 'text-card-foreground'}`}>{plan.price}<span className="text-sm font-normal">/mo</span></p>
                  <p className={`text-sm mt-2 ${plan.highlight ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{plan.images} images/month</p>
                  <p className={`text-sm mt-1 ${plan.highlight ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{plan.desc}</p>
                </div>
                <Link
                  href="/pricing"
                  className={`mt-6 block rounded-lg px-4 py-2.5 text-sm font-semibold text-center transition-colors ${plan.highlight ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-8 flex items-center justify-between text-sm text-muted-foreground">
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
