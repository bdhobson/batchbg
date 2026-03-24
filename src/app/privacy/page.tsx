import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Backdrop',
  description:
    'Privacy Policy for Backdrop. Learn how we collect, use, and protect your data.',
  alternates: {
    canonical: 'https://backdropimage.com/privacy',
  },
};

export default function PrivacyPage() {
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
            <Link
              href="/#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: March 24, 2025
        </p>

        <div className="prose prose-neutral max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Who we are</h2>
            <p className="text-muted-foreground leading-relaxed">
              Backdrop (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) provides a bulk AI background-removal service
              at <a href="https://backdropimage.com" className="underline hover:text-foreground">backdropimage.com</a>.
              This Privacy Policy explains what data we collect, why we collect it, and how we handle it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Data we collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Account information</h3>
                <p className="text-muted-foreground leading-relaxed">
                  When you create an account we collect your email address and name via our authentication
                  provider (Clerk). We do not store passwords — authentication is handled entirely by Clerk.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Images you upload</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Images you submit for background removal are sent to our AI provider (Replicate) for
                  processing and stored in private cloud storage (Vercel Blob) until you download them or
                  your job history expires. We do not use your images to train models or share them with
                  third parties beyond what is necessary to process your job.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Usage data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We store a count of images processed per billing period per user to enforce plan limits.
                  We also keep basic job metadata (job ID, timestamps, status) for your job history view.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Payment information</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Payments are handled by Stripe. We never see or store your card number. Stripe provides
                  us with a customer ID and subscription status only.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. How we use your data</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
              <li>To process your images and make the results available for download</li>
              <li>To enforce your plan&apos;s monthly image limit</li>
              <li>To send transactional emails (account creation, billing receipts) via Clerk and Stripe</li>
              <li>To diagnose errors and improve the service</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We do not sell your data, use it for advertising, or share it with third parties
              except as described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Data retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              Processed images and job records are retained for 30 days after the job is created.
              After 30 days, job images are deleted from cloud storage. Account information is retained
              as long as your account is active. You may request deletion of your account and associated
              data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Third-party services</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
              <li>
                <strong className="text-foreground">Clerk</strong> — authentication and user management.{' '}
                <a href="https://clerk.com/privacy" className="underline hover:text-foreground" target="_blank" rel="noopener noreferrer">
                  clerk.com/privacy
                </a>
              </li>
              <li>
                <strong className="text-foreground">Stripe</strong> — payment processing.{' '}
                <a href="https://stripe.com/privacy" className="underline hover:text-foreground" target="_blank" rel="noopener noreferrer">
                  stripe.com/privacy
                </a>
              </li>
              <li>
                <strong className="text-foreground">Replicate</strong> — AI model inference.{' '}
                <a href="https://replicate.com/privacy" className="underline hover:text-foreground" target="_blank" rel="noopener noreferrer">
                  replicate.com/privacy
                </a>
              </li>
              <li>
                <strong className="text-foreground">Vercel</strong> — hosting and blob storage.{' '}
                <a href="https://vercel.com/legal/privacy-policy" className="underline hover:text-foreground" target="_blank" rel="noopener noreferrer">
                  vercel.com/legal/privacy-policy
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies strictly for authentication (set by Clerk) and session management. We do not
              use tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Your rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              Depending on your location, you may have the right to access, correct, or delete your personal
              data. To exercise these rights, contact us at the address below. We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions about this policy? Reach us at{' '}
              <a href="mailto:support@backdropimage.com" className="underline hover:text-foreground">
                support@backdropimage.com
              </a>
              .
            </p>
          </section>
        </div>
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
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
