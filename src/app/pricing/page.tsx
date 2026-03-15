import type { Metadata } from 'next'
import PricingClient from './PricingClient'

export const metadata: Metadata = {
  title: "Pricing — Backdrop Bulk Background Removal",
  description: "Simple flat-rate pricing for bulk background removal. From 1,000 to 50,000 images/month. No per-image fees, no credits. Start free.",
  alternates: { canonical: "https://backdropimage.com/pricing" },
  openGraph: {
    title: "Backdrop Pricing — Flat Monthly Plans for Bulk Background Removal",
    description: "From 1,000 to 50,000 images/month. No credits, no per-image fees. Start with 5 free images.",
    url: "https://backdropimage.com/pricing",
  },
}

export default function PricingPage() {
  return <PricingClient />
}
