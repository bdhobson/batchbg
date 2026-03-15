import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://backdropimage.com"),
  title: "Backdrop — Bulk Background Removal for Product Photos",
  description: "Remove backgrounds from hundreds of product photos at once. Built for e-commerce sellers on Amazon, Etsy, and Shopify. Flat monthly pricing, no per-image fees.",
  alternates: {
    canonical: "https://backdropimage.com",
  },
  openGraph: {
    title: "Backdrop — Bulk Background Removal for Product Photos",
    description: "Upload 500 product photos, get clean white-background images back in minutes. Built for e-commerce sellers. Flat monthly pricing.",
    url: "https://backdropimage.com",
    siteName: "Backdrop",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Backdrop — Bulk Background Removal for Product Photos",
    description: "Upload 500 product photos, get clean white-background images back in minutes. No per-image fees.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Backdrop",
  url: "https://backdropimage.com",
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  description: "Bulk background removal tool for e-commerce product photos. Upload hundreds of images and get clean white or transparent backgrounds in minutes. Flat monthly pricing with no per-image fees.",
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "USD",
      description: "5 images/month",
    },
    {
      "@type": "Offer",
      name: "Starter",
      price: "19",
      priceCurrency: "USD",
      description: "1,000 images/month",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "39",
      priceCurrency: "USD",
      description: "5,000 images/month",
    },
    {
      "@type": "Offer",
      name: "Max",
      price: "79",
      priceCurrency: "USD",
      description: "50,000 images/month",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
