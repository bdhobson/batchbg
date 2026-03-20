import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: "Amazon FBA Background Remover — Bulk White Background Tool",
  description: "Amazon requires pure white backgrounds on all product images. Backdrop removes backgrounds from your entire catalog in minutes — FBA compliant, flat monthly pricing.",
  alternates: {
    canonical: "https://backdropimage.com/amazon-fba",
  },
  openGraph: {
    title: "Amazon FBA Background Remover — Bulk White Background Tool",
    description: "Amazon requires pure white backgrounds on all product images. Backdrop removes backgrounds from your entire catalog in minutes — FBA compliant, flat monthly pricing.",
    url: "https://backdropimage.com/amazon-fba",
    siteName: "Backdrop",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amazon FBA Background Remover — Bulk White Background Tool",
    description: "Amazon requires pure white backgrounds on all product images. FBA compliant, flat monthly pricing.",
  },
};

const BULLETS = [
  "Amazon-compliant pure white backgrounds (#FFFFFF)",
  "Process 500+ images in one batch",
  "~2 seconds per image with AI",
  "Download as ZIP, original filenames preserved",
  "Flat monthly pricing — no per-image fees",
];

const FAQS = [
  {
    q: "Does Amazon require white backgrounds?",
    a: "Yes, Amazon's image requirements specify pure white (RGB 255, 255, 255) backgrounds for main product images. Listings that don't comply can be suppressed from search results.",
  },
  {
    q: "How many images can I process at once?",
    a: "Backdrop handles up to 500 images per batch, with plans supporting up to 50,000 images/month. Process your entire catalog in multiple batches in a single session.",
  },
  {
    q: "Is it really Amazon FBA compliant?",
    a: "Yes. Backdrop outputs pure white (#FFFFFF) backgrounds that meet Amazon's main image requirements. The output color matches Amazon's specified RGB 255, 255, 255.",
  },
];

export default function AmazonFBAPage() {
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
            <Link href="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Try free
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/30 px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <span>🛒</span>
            <span>Built for Amazon FBA sellers</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight leading-tight sm:text-5xl md:text-6xl mb-6">
            Amazon FBA Background Remover —<br />
            <span className="text-muted-foreground">Bulk White Backgrounds, Fast</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Amazon requires pure white (#FFFFFF) backgrounds on every product image. Stop spending hours in Photoshop. Upload your catalog, get compliant images back in minutes.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Start Free — 5 Images/Month, No Credit Card
            <ArrowRight className="h-5 w-5" />
          </Link>
        </section>

        {/* Features */}
        <section className="border-t border-border py-20 px-6 bg-secondary/10">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-center mb-10">
              Everything you need for FBA-compliant product photos
            </h2>
            <ul className="space-y-4 max-w-xl mx-auto">
              {BULLETS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-lg">
                  <CheckCircle className="h-6 w-6 shrink-0 text-foreground mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Social proof */}
        <section className="border-t border-border py-20 px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="flex gap-1 justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-foreground text-foreground" />
                ))}
              </div>
              <p className="text-xl text-foreground leading-relaxed mb-4">
                &ldquo;I was spending 20 minutes per photo in Photoshop. Now I do 200 images in the time it used to take me to do one.&rdquo;
              </p>
              <p className="text-sm text-muted-foreground">— Amazon FBA seller, apparel niche</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border py-20 px-6 bg-secondary/10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-10">Three steps to FBA-compliant photos</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Upload your catalog", desc: "Drop up to 500 JPG, PNG, or WEBP images in one batch." },
                { step: "2", title: "AI removes backgrounds", desc: "Pure white (#FFFFFF) backgrounds applied automatically in ~2 seconds per image." },
                { step: "3", title: "Download ZIP", desc: "All FBA-compliant images bundled and ready. Original filenames preserved." },
              ].map((item) => (
                <div key={item.step} className="rounded-xl border border-border bg-card p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground mb-4 mx-auto">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border py-20 px-6">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-center mb-10">Frequently asked questions</h2>
            <div className="space-y-6">
              {FAQS.map((faq) => (
                <div key={faq.q} className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border py-24 px-6 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Start processing your FBA catalog today
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              5 free images every month. No credit card required. Upgrade when you&apos;re ready.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-10 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Start Free — 5 Images/Month, No Credit Card
              <ArrowRight className="h-5 w-5" />
            </Link>
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
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/ebay-sellers" className="hover:text-foreground transition-colors">eBay Sellers</Link>
            <Link href="/poshmark" className="hover:text-foreground transition-colors">Poshmark</Link>
            <Link href="/#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
