import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://peygo.id"),
  title: {
    default: "PeyGo - Platform Invoice & Billing untuk UMKM Indonesia",
    template: "%s | PeyGo",
  },
  description: "Platform invoice dan billing untuk freelancer, UMKM, dan startup di Indonesia. Buat invoice profesional, terima pembayaran via QRIS, VA Bank, E-Wallet. Gratis daftar!",
  keywords: ["invoice", "billing", "pembayaran", "UMKM", "freelancer", "Indonesia", "QRIS", "virtual account", "e-wallet", "tagihan online"],
  authors: [{ name: "PeyGo", url: "https://peygo.id" }],
  creator: "PeyGo",
  publisher: "PeyGo",
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://peygo.id",
    siteName: "PeyGo",
    title: "PeyGo - Platform Invoice & Billing untuk UMKM Indonesia",
    description: "Buat invoice profesional, terima pembayaran via QRIS, VA Bank, E-Wallet. Mulai gratis hari ini!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PeyGo - Platform Invoice & Billing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PeyGo - Platform Invoice & Billing untuk UMKM Indonesia",
    description: "Buat invoice profesional, terima pembayaran via QRIS, VA Bank, E-Wallet. Mulai gratis!",
    images: ["/og-image.png"],
    creator: "@peygo_id",
  },
  alternates: {
    canonical: "https://peygo.id",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { NavigationProgress } from "@/components/ui/NavigationProgress";
import { getSettings } from "@/lib/settings";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch settings server-side (cached)
  const settings = await getSettings();

  return (
    <html lang="id" className="light" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background text-foreground font-sans`}
      >
        <Providers settings={settings}>
          <NavigationProgress />
          <ScrollToTop />
          {children}
        </Providers>
      </body>
    </html>
  );
}
