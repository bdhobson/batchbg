import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: "Background Remover for Shopify Stores — Bulk Product Photo Editor",
  description: "Clean, professional product photos are the #1 conversion factor in Shopify stores. Backdrop removes backgrounds from your entire catalog in minutes — flat pricing, no subscriptions.",
  alternates: {
    canonical: "https://backdropimage.com/shopify-sellers",
  },
  openGraph: {
    title: "Background Remover for Shopify Stores — Bulk Product Photo Editor",
    description: "Clean product photos drive Shopify sales. Remove backgrounds from your entire catalog in minutes — flat pricing, no per-image fees.",
    url: "https://backdropimage.com/shopify-sellers",
    siteName: "Backdrop",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Background Remover for Shopify Stores — Bulk Product Photo Editor",
    description: "Clean product photos drive Shopify sales. Bulk background removal — flat pricing, no per-image fees.",
  },
};

const BULLETS = [
  "White, transparent, or custom color backgrounds",
  "Process 500+ product images in one batch",
  "~2 seconds per image with AI",
  "Download ZIP with original filenames — re-upload ready",
  "Flat monthly pricing — unlimited is actually unlimited",
];

const FAQS = [
  {
    q: "What background color should Shopify product photos have?",
    a: "It depends on your theme, but pure white (#FFFFFF) or transparent PNG backgrounds give you the most flexibility. White backgrounds make products pop on any page layout; transparent PNGs work perfectly when your theme has a colored or textured background.",
  },
  {
    q: "How many images can I process at once?",
    a: "Up to 500 images per batch. If your catalog has thousands of SKUs, just run multiple batches — Backdrop keeps your job history so you can track what's been processed.",
  },
  {
    q: "Will the edges look clean on clothing and complex products?",
    a: "Backdrop uses the same AI model trusted by Amazon and eBay sellers for apparel, accessories, electronics, and furniture. Soft edges on hair, fur, and fabric come out clean without manual masking.",
  },
  {
    q: "Do I need a Shopify subscription?",
    a: "No — Backdrop is a standalone tool. Download your processed images and upload them directly to your Shopify product listings via the Shopify admin. No app required.",
  },
];

export default function ShopifySellersPage() {
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
            <span>🛍️</span>
            <span>Built for Shopify store owners</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight leading-tight sm:text-5xl md:text-6xl mb-6">
            Shopify Product Photos —<br />
            <span className="text-muted-foreground">Professional Backgrounds at Scale</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Product photos with clean backgrounds convert 30% better than cluttered ones. Stop editing one image at a time. Backdrop processes your entire catalog in minutes, not days.
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
              Everything Shopify store owners need for great product photos
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
                &ldquo;I launched a new Shopify store with 300 SKUs. Getting professional-looking photos used to be the biggest bottleneck. Backdrop removed that problem completely.&rdquo;
              </p>
              <p className="text-sm text-muted-foreground">— Shopify store owner, home goods niche</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border py-20 px-6 bg-secondary/10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-10">Three steps to catalog-ready product photos</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Upload your product photos", desc: "Drop up to 500 JPG, PNG, or WEBP images in one batch. Mix sizes and orientations — Backdrop handles it." },
                { step: "2", title: "AI removes backgrounds", desc: "Choose white, transparent, or a custom color. Processed in ~2 seconds per image with clean edges on clothing, accessories, and more." },
                { step: "3", title: "Download & upload to Shopify", desc: "Get a single ZIP with original filenames. Upload directly to Shopify products — no renaming needed." },
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

        {/* Use cases */}
        <section className="border-t border-border py-20 px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-center mb-10">Works for every Shopify niche</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: "👗", title: "Fashion & Apparel", desc: "Clean white or transparent backgrounds for clothing and accessories. Soft edges on fabric come out crisp." },
                { icon: "🏠", title: "Home & Furniture", desc: "Lifestyle shots converted to catalog-ready white-background product images." },
                { icon: "💄", title: "Beauty & Cosmetics", desc: "Bottle and packaging shots with pure white backgrounds — meets beauty retailer standards." },
                { icon: "🎮", title: "Electronics & Gadgets", desc: "Precise cutouts around cables, ports, and complex shapes without manual masking." },
                { icon: "🐾", title: "Pet Products", desc: "Toys, beds, and accessories processed in bulk — great for high-SKU pet stores." },
                { icon: "🎨", title: "Art & Handmade", desc: "Etsy-to-Shopify sellers batch process handmade items without expensive photo retouching." },
              ].map((uc) => (
                <div key={uc.title} className="rounded-xl border border-border bg-card p-5 flex gap-4">
                  <span className="text-2xl shrink-0">{uc.icon}</span>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{uc.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{uc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border py-20 px-6 bg-secondary/10">
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
              Ready to level up your Shopify product photos?
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
            <Link href="/amazon-fba" className="hover:text-foreground transition-colors">Amazon FBA</Link>
            <Link href="/etsy-sellers" className="hover:text-foreground transition-colors">Etsy</Link>
            <Link href="/#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
