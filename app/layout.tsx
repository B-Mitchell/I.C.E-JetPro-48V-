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

export const metadata: Metadata = {
  title: "I.C.E JetPro 48V™ — Cordless High-Pressure Cleaning Gun",
  description:
    "Full pressure. No plug in sight. The I.C.E JetPro 48V™ cordless high-pressure cleaning gun kit with dual lithium-ion batteries, foam cannon, and rugged molded carry case.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#101114] text-[#F3F1EC] antialiased selection:bg-[#17B4C9] selection:text-[#101114]">
        {children}
      </body>
    </html>
  );
}
