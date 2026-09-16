import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ice-jetpro-48v.iceautoglobal.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "I.C.E JetPro 48V™ — Cordless High-Pressure Cleaning & Farm Spray Gun",
    template: "%s | I.C.E JetPro 48V™",
  },
  description:
    "Full pressure. No plug in sight. The I.C.E JetPro 48V™ cordless high-pressure washer kit features dual 48V lithium-ion batteries, soap can foam bottle, 8m draw hose with filter, 2 spray nozzles, and rugged case. Multi-purpose for car detailing, farm crop pest spraying, compound interlocking stones, and AC servicing. Free doorstep delivery & pay on delivery in Nigeria, Ghana, and Kenya.",
  keywords: [
    "I.C.E JetPro 48V",
    "iceautoglobal",
    "cordless pressure washer",
    "cordless cleaning gun",
    "farm crop sprayer cordless",
    "agricultural pesticide spray gun",
    "car wash machine Nigeria",
    "pressure washer Ghana",
    "portable car washer Kenya",
    "48V car wash gun",
    "wireless pressure washer",
    "rechargeable car washer",
    "interlocking stone cleaning Lagos",
    "pay on delivery car washer",
    "portable pressure washer Lagos",
    "pressure washer Nairobi",
    "car washer Accra",
  ],
  authors: [{ name: "I.C.E Power Technologies" }],
  creator: "I.C.E Power",
  publisher: "I.C.E Power",
  formatDetection: {
    telephone: true,
    address: true,
  },
  icons: {
    icon: "/favicon.ico?v=4",
    shortcut: "/favicon.ico?v=4",
    apple: "/favicon.ico?v=4",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    alternateLocale: ["en_GH", "en_KE", "en_US"],
    url: siteUrl,
    siteName: "I.C.E JetPro 48V™",
    title: "I.C.E JetPro 48V™ — Cordless High-Pressure Cleaning Gun",
    description:
      "Full pressure. No plug in sight. Dual 48V lithium-ion batteries, foam cannon bottle, and rugged impact case. Pay on delivery available across Nigeria, Ghana, and Kenya.",
    images: [
      {
        url: `${siteUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "I.C.E JetPro 48V Cordless Cleaning Gun",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "I.C.E JetPro 48V™ — Cordless High-Pressure Cleaning Gun",
    description:
      "Dual 48V lithium-ion batteries, high-torque pump, foam cannon bottle, and rugged hard case. Fast doorstep dispatch & pay on delivery.",
    images: [`${siteUrl}/images/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Structured Data for Google Rich Snippets (Product + FAQ)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "I.C.E JetPro 48V™ Cordless High-Pressure Cleaning Gun Kit",
    image: [
      `${siteUrl}/images/og-image.jpg`,
      `${siteUrl}/images/gun_isolated_real.png`,
      `${siteUrl}/images/hero.jpg`,
      `${siteUrl}/images/flatlay.jpg`,
    ],
    description:
      "Professional 48V cordless pressure washer gun kit with dual lithium-ion batteries, foam cannon, 5m hose, brass quick connectors, and rugged molded case.",
    brand: {
      "@type": "Brand",
      name: "I.C.E Power",
    },
    offers: [
      {
        "@type": "Offer",
        priceCurrency: "NGN",
        price: "45000",
        itemCondition: "https://schema.org/NewCondition",
        availability: "https://schema.org/InStock",
        priceValidUntil: "2027-12-31",
        url: siteUrl,
      },
      {
        "@type": "Offer",
        priceCurrency: "GHS",
        price: "400",
        itemCondition: "https://schema.org/NewCondition",
        availability: "https://schema.org/InStock",
        priceValidUntil: "2027-12-31",
        url: siteUrl,
      },
      {
        "@type": "Offer",
        priceCurrency: "KES",
        price: "4500",
        itemCondition: "https://schema.org/NewCondition",
        availability: "https://schema.org/InStock",
        priceValidUntil: "2027-12-31",
        url: siteUrl,
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "348",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can farmers use the I.C.E JetPro 48V for crop spraying and pest control?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Farmers across Nigeria, Ghana, and Kenya use the 48V cordless gun to spray crops, vegetables, and orchard trees with liquid fertilizers, pesticides, and insect repellents. It draws directly from a chemical bucket or drum with the 8m suction line — eliminating heavy knapsack hand-pump backpack fatigue.",
        },
      },
      {
        "@type": "Question",
        name: "How long does one battery last on the I.C.E JetPro 48V?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Each 48V pack delivers 35 to 45 minutes of continuous high-pressure performance. Because the kit includes dual (2×) 48V packs and a rapid wall charger, you can keep one pack charging while using the other for zero downtime.",
        },
      },
      {
        "@type": "Question",
        name: "Does the I.C.E JetPro 48V need running tap water or can it draw from a bucket?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It does not need running tap water! The self-priming 8m heavy-duty hose with fine filter basket draws water straight from any bucket, drum, well, or stream. It also connects to standard outdoor taps.",
        },
      },
      {
        "@type": "Question",
        name: "What is included in the complete I.C.E JetPro 48V box?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The complete kit includes: 48V power gun body, two (2×) 48V lithium-ion battery packs, rapid wall charger, 8m draw hose with filter, two spray nozzles (0° blast & 40° fan), soap can foam bottle, brass quick-connect fittings, and the custom molded impact case.",
        },
      },
    ],
  };

  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.ico?v=4" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico?v=4" />
        {/* Google Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="min-h-screen bg-[#101114] text-[#F3F1EC] antialiased selection:bg-[#17B4C9] selection:text-[#101114]">
        {children}
      </body>
    </html>
  );
}
