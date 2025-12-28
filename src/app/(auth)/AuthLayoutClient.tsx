"use client";

import Link from "next/link";
import { FileText, Shield, Zap, CheckCircle2 } from "lucide-react";

interface AuthLayoutClientProps {
  children: React.ReactNode;
}

export default function AuthLayoutClient({ children }: AuthLayoutClientProps) {
  return (
    <div className="min-h-screen flex bg-background relative">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-success/5 blur-[120px]" />
      </div>

      {/* Left Side - Branding (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden z-10">
        <div className="relative z-10 flex flex-col justify-start p-16 w-full">
          {/* Logo */}
          <Link href="/" className="flex flex-col w-fit group mb-20">
            <span className="text-4xl font-bold tracking-tighter">
              <span className="text-primary">Pey</span><span className="text-foreground">Go</span>
            </span>
          </Link>
 
          {/* Main Content */}
          <div className="space-y-12">
            <div>
              <h1 className="text-5xl font-bold leading-[0.95] tracking-tight mb-8 text-foreground">
                Kirim Invoice,
                <br />
                <span className="text-primary">Terima Pembayaran</span>
                <br />
                Lebih Cepat.
              </h1>
              <p className="text-muted-foreground text-xl max-w-md leading-relaxed">
                Platform invoice yang memudahkan penjualan dan pembayaran bisnis Anda.
              </p>
            </div>
 
            {/* Features */}
            <div className="space-y-5">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-card border border-border rounded-xl flex items-center justify-center text-foreground shadow-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                  <FileText className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-foreground font-semibold text-sm">Invoice Profesional</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-card border border-border rounded-xl flex items-center justify-center text-foreground shadow-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                  <Zap className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-foreground font-semibold text-sm">Berbagai Metode Pembayaran</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-card border border-border rounded-xl flex items-center justify-center text-foreground shadow-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                  <Shield className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-foreground font-semibold text-sm">Keamanan Standar Perbankan</span>
              </div>
            </div>
          </div>
 
          {/* Bottom */}
          <div className="mt-auto flex items-center gap-8 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" aria-hidden="true" />
              <span>Mitra Berizin OJK</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" aria-hidden="true" />
              <span>Dukungan 24/7</span>
            </div>
          </div>
        </div>
      </div>
 
      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        {/* Mobile Header */}
        <header className="lg:hidden py-8 px-8">
          <Link href="/" className="flex flex-col w-fit">
            <span className="text-3xl font-bold tracking-tighter">
              <span className="text-primary">Pey</span><span className="text-foreground">Go</span>
            </span>
          </Link>
        </header>
 
        {/* Form Container */}
        <main className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-lg">
            {children}
          </div>
        </main>
 
        {/* Footer */}
        <footer className="py-6 px-8 text-center text-muted-foreground">
          <p className="text-xs font-medium leading-relaxed">
            © {new Date().getFullYear()} PeyGo. Semua Hak Dilindungi.<br/>
            Platform Invoice untuk UMKM Indonesia.
          </p>
        </footer>
      </div>
    </div>
  );
}
