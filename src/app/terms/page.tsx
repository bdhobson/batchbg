import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — Backdrop',
  description:
    'Terms of Service for Backdrop. Read the rules governing use of our bulk background-removal service.',
  alternates: {
    canonical: 'https://backdropimage.com/terms',
  },
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: March 24, 2025
        </p>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Backdrop (&ldquo;Service&rdquo;) at backdropimage.com, you agree to be bound
              by these Terms of Service. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Description of service</h2>
            <p className="text-muted-foreground leading-relaxed">
              Backdrop is an AI-powered tool that removes backgrounds from product images in bulk.
              The Service is provided &ldquo;as is&rdquo; and we make no guarantees about the quality of results
              for any specific image.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Accounts and billing</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                You are responsible for maintaining the security of your account credentials.
                Notify us immediately of any unauthorized access.
              </p>
              <p>
                Paid plans are billed monthly via Stripe. Your plan&apos;s image quota resets on your
                billing anniversary date each month. Unused images do not roll over.
              </p>
              <p>
                You may cancel your subscription at any time. Cancellation takes effect at the end
                of the current billing period. We do not provide prorated refunds for partial months,
                except where required by law.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Acceptable use</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
              <li>Upload images that you do not have the right to process</li>
              <li>Upload images containing illegal content, including CSAM</li>
              <li>Attempt to reverse-engineer, scrape, or overload the Service</li>
              <li>Use the Service to process images on behalf of others without their consent</li>
              <li>Circumvent plan limits through multiple free accounts or other means</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Your content</h2>
            <p className="text-muted-foreground leading-relaxed">
              You retain all ownership rights to images you upload. By uploading images, you grant us
              a limited, temporary license to process them solely for the purpose of delivering the
              Service to you. We do not claim ownership of your images and will not use them for
              purposes beyond processing your job and storing results for download.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Intellectual property</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Backdrop name, logo, and Service (excluding your content) are owned by us and
              protected by applicable intellectual property laws. You may not copy, modify, or
              distribute any part of the Service without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Disclaimer of warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
              INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, OR NON-INFRINGEMENT. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE
              UNINTERRUPTED, ERROR-FREE, OR THAT RESULTS WILL MEET YOUR REQUIREMENTS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Limitation of liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF
              OR INABILITY TO USE THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY
              OF SUCH DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN
              THE THREE MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to suspend or terminate your account at our discretion if you
              violate these Terms or engage in conduct that harms the Service or other users.
              You may delete your account at any time via your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Changes to these terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update these Terms from time to time. Material changes will be announced
              with reasonable notice (e.g., by email or in-app notice). Continued use of the
              Service after changes take effect constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Governing law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms are governed by the laws of the United States. Disputes shall be
              resolved in the applicable jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">12. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions about these Terms? Reach us at{' '}
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
