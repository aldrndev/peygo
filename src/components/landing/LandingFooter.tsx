"use client";

import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/contexts/SettingsContext";

export function LandingFooter() {
  const settings = useSettings();
  
  // Format WhatsApp number (remove + for URL)
  const waNumber = settings.whatsapp_center.replace(/\+/g, "");
  
  return (
    <footer className="bg-background py-24 border-t border-border relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 mb-20">
          {/* Brand */}
          <div className="md:col-span-6">
            <Link href="/" className="mb-8 group block">
              <span className="text-4xl font-bold tracking-tighter transition-colors">
                <span className="text-primary group-hover:text-primary/80">{settings.platform_name.slice(0, 3)}</span><span className="text-foreground group-hover:text-muted-foreground">{settings.platform_name.slice(3)}</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-lg font-medium max-w-md leading-relaxed mb-8">
              Memberdayakan bisnis Indonesia dengan invoice pintar dan solusi pembayaran yang seamless. Berkembang lebih cepat bersama {settings.platform_name}.
            </p>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bekerjasama dengan Mitra Berizin dan Diawasi oleh</p>
              <div className="flex items-center gap-4">
                <Image src="/logos/regulatory/ojk.png" alt="OJK" width={80} height={32} className="h-8 w-auto object-contain" loading="lazy" />
                <Image src="/logos/regulatory/bi.png" alt="Bank Indonesia" width={100} height={24} className="h-6 w-auto object-contain" style={{ width: 'auto', height: 'auto' }} loading="lazy" />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wide mb-8">Produk</h4>
            <ul className="space-y-4">
              <li><Link href="#fitur" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">Penjualan Invoice</Link></li>
              <li><Link href="#fitur" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">Pembayaran Invoice</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">Laporan Keuangan</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wide mb-8">Bantuan</h4>
            <ul className="space-y-4">
              <li><Link href="#faq" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">FAQ</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">Blog</Link></li>
              <li><Link href={`https://wa.me/${waNumber}`} className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">Hubungi Kami</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wide mb-8">Perusahaan</h4>
            <ul className="space-y-4 text-muted-foreground font-medium text-sm">
              <li>Jakarta, Indonesia</li>
              <li><Link href={`mailto:${settings.support_email}`} className="hover:text-primary transition-colors">{settings.support_email}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Karir (Lowongan!)</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            © {new Date().getFullYear()} {settings.platform_name}. Dibuat dengan <span className="text-primary">🔥</span> untuk Indonesia.
          </p>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-muted-foreground hover:text-foreground text-xs font-medium uppercase tracking-wide transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground text-xs font-medium uppercase tracking-wide transition-colors">
              Syarat & Ketentuan
            </Link>
            <Link href={`https://wa.me/${waNumber}`} className="text-success hover:text-success/80 text-xs font-medium uppercase tracking-wide transition-colors flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full" /> WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
