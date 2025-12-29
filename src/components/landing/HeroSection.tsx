import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, CreditCard, MessageCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-12 sm:pt-32 md:pt-48 md:pb-32 overflow-hidden z-10">
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-card border border-border text-primary px-4 py-2 rounded-2xl text-xs font-medium uppercase tracking-wide mb-6 sm:mb-10 shadow-lg">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Platform Invoice untuk UMKM</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-foreground mb-6 sm:mb-8 leading-[1.1] sm:leading-[0.9] tracking-tighter">
              Kirim Invoice, 
              <br className="hidden sm:block" />
              <span className="text-primary"> Terima Pembayaran</span>
              <br className="hidden sm:block" />
              {" "}Lebih Cepat.
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Platform invoice yang membuat proses penjualan dan pembayaran bisnis Anda semudah mengirim pesan. <span className="text-foreground font-semibold">Mulai gratis hari ini.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center lg:justify-start mb-8 sm:mb-12">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/daftar">
                  Mulai Gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                <Link href="https://wa.me/628123456789">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Hubungi Sales
                </Link>
              </Button>
            </div>

            {/* Social proof badge */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-8">
              <div className="flex -space-x-3">
                {[
                  '/avatars/user-1.jpg',
                  '/avatars/user-5.jpg',
                  '/avatars/user-8.jpg',
                  '/avatars/user-12.jpg',
                  '/avatars/user-15.jpg',
                ].map((url, i) => (
                  <Image 
                    key={i}
                    src={url}
                    alt={`User ${i + 1}`}
                    width={40}
                    height={40}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-card shadow-md object-cover"
                    loading={i < 2 ? "eager" : "lazy"}
                  />
                ))}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold text-foreground">1.000+ UMKM Indonesia</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sudah Mempercayai PeyGo</p>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Setup 2 Menit</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="hidden xs:inline">Bekerjasama dengan</span> <span>Mitra Berizin</span>
              </div>
              <div className="h-6 w-px bg-border hidden md:block" />
              <div className="flex items-center gap-3 sm:gap-4">
                <Image src="/logos/regulatory/ojk.png" alt="Mitra berizin OJK" width={60} height={24} className="h-5 sm:h-6 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity" loading="eager" />
                <Image src="/logos/regulatory/bi.png" alt="Mitra terdaftar BI" width={50} height={20} className="h-4 sm:h-5 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity" style={{ width: 'auto', height: 'auto' }} loading="eager" />
              </div>
            </div>
          </div>

          {/* Right content - 3D Mockup (hidden on small mobile, simplified on medium) */}
          <div className="lg:col-span-5 relative hidden sm:block">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative group">
      <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl opacity-50" />
      
      <div className="relative">
        {/* Layer 1: Mini Dashboard */}
        <div className="relative bg-card/80 backdrop-blur-xl border border-border shadow-2xl rounded-3xl p-8 pb-32 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total Pendapatan</p>
              <h4 className="text-3xl font-bold text-foreground tracking-tighter">Rp 128.5M</h4>
            </div>
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success">
              <ArrowUpRight size={16} />
            </div>
          </div>
          
          <div className="flex items-end gap-2 h-24 mb-6">
            {[40, 70, 45, 90, 65, 80, 55].map((height, i) => (
              <div
                key={i}
                style={{ height: `${height}%` }}
                className="flex-1 bg-gradient-to-t from-primary/20 to-primary/40 rounded-t-lg"
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card/50 p-4 rounded-2xl border border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Invoice</p>
              <p className="text-lg font-bold text-foreground">42</p>
            </div>
            <div className="bg-card/50 p-4 rounded-2xl border border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Klien</p>
              <p className="text-lg font-bold text-foreground">12</p>
            </div>
          </div>
        </div>

        {/* Layer 2: Payment Success */}
        <div className="absolute top-1/2 -right-4 md:-right-6 -translate-y-1/2 bg-card border border-border shadow-2xl rounded-2xl p-5 md:p-6 w-60 md:w-72 z-10 scale-90 md:scale-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center text-success-foreground mb-4 shadow-lg shadow-success/20">
              <Check size={32} strokeWidth={3} />
            </div>
            <h5 className="text-lg font-bold text-foreground mb-1 tracking-tight">Pembayaran Berhasil!</h5>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">Invoice #PEY-2891</p>
            
            <div className="w-full bg-muted rounded-2xl p-4 flex justify-between items-center mb-4">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total</span>
              <span className="text-sm font-bold text-foreground tabular-nums">Rp 12.500.000</span>
            </div>
            
            <Button className="w-full">Lihat Detail</Button>
          </div>
        </div>

        {/* Layer 3: Recent Activity */}
        <div className="absolute -bottom-6 md:-bottom-8 -left-4 md:-left-8 bg-foreground text-background p-4 md:p-5 rounded-2xl shadow-2xl z-20 flex items-center gap-4 w-56 md:w-64 scale-90 md:scale-100">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
            <CreditCard size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-tight">Tagihan Dibayar</p>
            <p className="text-xs opacity-60 font-medium uppercase tracking-wide mt-0.5">Baru saja • Rp 4.2M</p>
          </div>
        </div>
      </div>
    </div>
  );
}
