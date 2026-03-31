import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: "Background Remover for WooCommerce Stores — Bulk Product Image Tool",
  description: "WooCommerce product photos with clean white or transparent backgrounds improve conversions and look professional. Backdrop removes backgrounds from your catalog in minutes — flat pricing.",
  alternates: {
    canonical: "https://backdropimage.com/woocommerce",
  },
  openGraph: {
    title: "Background Remover for WooCommerce Stores — Bulk Product Image Tool",
    description: "WooCommerce product photos with clean white or transparent backgrounds improve conversions. Bulk background removal — flat pricing, no per-image fees.",
    url: "https://backdropimage.com/woocommerce",
    siteName: "Backdrop",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Background Remover for WooCommerce Stores — Bulk Product Image Tool",
    description: "WooCommerce product photos with clean backgrounds improve conversions. Bulk AI background removal — flat pricing.",
  },
};

const BULLETS = [
  "White or transparent backgrounds — your choice",
  "Process 500+ WooCommerce product images per batch",
  "~2 seconds per image with AI",
  "Download ZIP — drop into WordPress Media Library",
  "Flat monthly pricing — no per-image fees, ever",
];

const FAQS = [
  {
    q: "What background format works best for WooCommerce?",
    a: "Transparent PNG backgrounds give you the most flexibility in WooCommerce — they work with any theme color or layout. Pure white (#FFFFFF) JPEGs are slightly smaller files and work great on white-background themes like Storefront and Flatsome.",
  },
  {
    q: "How do I get processed images into my WooCommerce store?",
    a: "Download the ZIP from Backdrop, then drag all images into your WordPress Media Library at once. Go to each product, swap the product image — your original filenames are preserved so it's easy to match images to products.",
  },
  {
    q: "Can Backdrop handle variable products with many images?",
    a: "Yes. Upload all variant images in one batch. Backdrop processes them all and returns a ZIP with original filenames intact. If you have 400 color/size variants, that's one upload and one download.",
  },
  {
    q: "Is there a WooCommerce plugin?",
    a: "Not yet — Backdrop is a standalone web tool. Download your processed images and upload them to WooCommerce via the standard media library workflow. This actually gives you more control over exactly which images get updated.",
  },
];

export default function WooCommercePage() {
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
            <span>🔌</span>
            <span>Built for WooCommerce store owners</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight leading-tight sm:text-5xl md:text-6xl mb-6">
            WooCommerce Product Photos —<br />
            <span className="text-muted-foreground">Clean Backgrounds, Bulk Speed</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Inconsistent product photos kill WooCommerce conversions. Backdrop gives your entire catalog a professional, uniform look — white or transparent backgrounds, processed in bulk at flat-rate pricing.
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
              Everything WooCommerce sellers need for professional product images
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
                &ldquo;I had 600 WooCommerce products with photos from 3 different photographers — all inconsistent. Backdrop made them look like one cohesive catalog in an afternoon.&rdquo;
              </p>
              <p className="text-sm text-muted-foreground">— WooCommerce store owner, outdoor equipment</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border py-20 px-6 bg-secondary/10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-10">How it works for WooCommerce sellers</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Export your product images", desc: "Export photos from your WordPress Media Library. Drop up to 500 at once into Backdrop." },
                { step: "2", title: "AI removes backgrounds in bulk", desc: "White, transparent, or any custom color. Clean edges on all product types in ~2 seconds each." },
                { step: "3", title: "Re-upload to WordPress", desc: "Download the ZIP — original filenames preserved. Drag into Media Library and swap product images." },
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
              Give your WooCommerce catalog a consistent, professional look
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
            <Link href="/shopify-sellers" className="hover:text-foreground transition-colors">Shopify</Link>
            <Link href="/amazon-fba" className="hover:text-foreground transition-colors">Amazon FBA</Link>
            <Link href="/#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
