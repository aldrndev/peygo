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
  title: "PeyGo - Platform Invoice & Billing",
  description: "Platform invoice dan billing untuk freelancer, UMKM, dan startup di Indonesia. Semua pemrosesan pembayaran ditangani oleh mitra pembayaran berlisensi.",
  keywords: ["invoice", "billing", "pembayaran", "UMKM", "freelancer", "Indonesia"],
  authors: [{ name: "PeyGo" }],
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "PeyGo - Platform Invoice & Billing",
    description: "Platform invoice dan billing untuk freelancer, UMKM, dan startup di Indonesia.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="light" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background text-foreground font-sans`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
