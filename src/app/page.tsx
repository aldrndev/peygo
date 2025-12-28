"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  ArrowUpRight,
  Check,
  CreditCard, 
  Shield, 
  ArrowRight,
  Menu,
  X,
  Zap,
  BarChart3,
  Clock,
  Star,
  MessageCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import WhatsAppFloatingButton from "@/components/ui/WhatsAppFloatingButton";
import TrustBadges from "@/components/landing/TrustBadges";
import ComparisonTable from "@/components/landing/ComparisonTable";
import PaymentPartners from "@/components/landing/PaymentPartners";
import TargetAudience from "@/components/landing/TargetAudience";
import { cn } from "@/lib/utils";

// Animated counter hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, hasStarted]);

  return { count, start: () => setHasStarted(true) };
}

// Testimonials data
const testimonials = [
  {
    name: "Ahmad Fauzi",
    role: "Business Owner",
    content: "PeyGo sangat membantu bisnis kami. Proses invoice jadi lebih cepat dan profesional. Pelanggan juga lebih mudah melakukan pembayaran.",
    avatar: "AF"
  },
  {
    name: "Sri Wahyuni",
    role: "Finance Manager",
    content: "Dengan PeyGo, rekonsiliasi pembayaran jadi otomatis. Tim finance kami bisa fokus ke hal yang lebih strategis.",
    avatar: "SW"
  },
  {
    name: "Budi Santoso",
    role: "Freelance Designer",
    content: "Platform yang sangat user-friendly! Saya bisa kirim invoice ke klien dalam hitungan detik dan terima pembayaran lebih cepat.",
    avatar: "BS"
  },
  {
    name: "Maya Putri",
    role: "CEO Startup",
    content: "Metode pembayaran yang lengkap. Pelanggan bisa bayar pakai QRIS, transfer bank, atau e-wallet. Sangat fleksibel!",
    avatar: "MP"
  }
];

// FAQ data
const faqs = [
  {
    question: "Apakah PeyGo gratis digunakan?",
    answer: "Ya! PeyGo gratis untuk membuat dan mengirim invoice. Kami hanya mengenakan biaya transaksi yang sangat kompetitif saat pelanggan Anda melakukan pembayaran."
  },
  {
    question: "Metode pembayaran apa saja yang didukung?",
    answer: "PeyGo mendukung berbagai metode pembayaran populer di Indonesia: Virtual Account (BCA, Mandiri, BNI, BRI), QRIS, E-Wallet (GoPay, OVO, Dana), dan Kartu Kredit/Debit."
  },
  {
    question: "Berapa lama dana masuk ke rekening saya?",
    answer: "Dana akan masuk ke rekening Anda dalam 1x24 jam setelah pembayaran dikonfirmasi. Proses settlement dilakukan otomatis setiap hari kerja."
  },
  {
    question: "Apakah data saya aman?",
    answer: "Keamanan adalah prioritas kami. PeyGo menggunakan enkripsi SSL 256-bit dan bekerjasama dengan mitra pembayaran berizin yang diawasi OJK dan Bank Indonesia."
  },
  {
    question: "Bagaimana cara memulai?",
    answer: "Sangat mudah! Cukup daftar gratis, lengkapi profil bisnis Anda, dan mulai buat invoice pertama Anda. Tidak perlu verifikasi dokumen yang rumit untuk memulai."
  }
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const invoiceCount = useCounter(8500, 2000);
  const transactionCount = useCounter(25, 2000);
  const userCount = useCounter(1200, 2000);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (statsVisible) {
      invoiceCount.start();
      transactionCount.start();
      userCount.start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statsVisible]);

  // ESC key to close mobile menu
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [mobileMenuOpen]);

  // Intersection observer for stats section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    const statsSection = document.getElementById('stats-section');
    if (statsSection) observer.observe(statsSection);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Aurora Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-300/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-success/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled 
            ? "bg-card/80 backdrop-blur-xl border-b border-border shadow-lg" 
            : "bg-transparent border-transparent py-2"
        )}
      >
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="group">
              <span className="text-3xl font-bold tracking-tighter">
                <span className="text-primary">Pey</span><span className="text-foreground">Go</span>
              </span>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#fitur" className="text-muted-foreground hover:text-primary transition-colors font-medium text-xs uppercase tracking-wide">
                Fitur
              </Link>
              <Link href="#testimoni" className="text-muted-foreground hover:text-primary transition-colors font-medium text-xs uppercase tracking-wide">
                Testimoni
              </Link>
              <Link href="#faq" className="text-muted-foreground hover:text-primary transition-colors font-medium text-xs uppercase tracking-wide">
                FAQ
              </Link>
              <div className="h-6 w-px bg-border mx-2" />
              <Link href="/masuk" className="text-foreground hover:text-primary transition-colors font-medium text-xs uppercase tracking-wide">
                Masuk
              </Link>
              <Button asChild>
                <Link href="/daftar">Daftar Gratis</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </Button>
          </nav>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div
              id="mobile-menu"
              className="md:hidden overflow-hidden bg-card/90 backdrop-blur-xl border-t border-border shadow-2xl mt-4 rounded-2xl"
            >
              <div className="py-6 px-6 flex flex-col gap-4">
                <Link href="#fitur" className="text-foreground font-medium text-xs uppercase tracking-wide py-2" onClick={() => setMobileMenuOpen(false)}>
                  Fitur
                </Link>
                <Link href="#testimoni" className="text-foreground font-medium text-xs uppercase tracking-wide py-2" onClick={() => setMobileMenuOpen(false)}>
                  Testimoni
                </Link>
                <Link href="#faq" className="text-foreground font-medium text-xs uppercase tracking-wide py-2" onClick={() => setMobileMenuOpen(false)}>
                  FAQ
                </Link>
                <div className="h-px bg-border" />
                <Link href="/masuk" className="text-foreground font-medium text-xs uppercase tracking-wide py-2" onClick={() => setMobileMenuOpen(false)}>
                  Masuk
                </Link>
                <Button asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/daftar">Daftar Gratis</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden z-10">
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Left content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-card border border-border text-primary px-5 py-2.5 rounded-2xl text-xs font-medium uppercase tracking-wide mb-10 shadow-lg">
                <Zap className="w-4 h-4" />
                <span>Platform Invoice untuk UMKM</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-foreground mb-8 leading-[0.9] tracking-tighter">
                Kirim Invoice, 
                <br />
                <span className="text-primary">Terima Pembayaran</span>
                <br />
                Lebih Cepat.
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Platform invoice yang membuat proses penjualan dan pembayaran bisnis Anda semudah mengirim pesan. <span className="text-foreground font-semibold">Mulai gratis hari ini.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-12">
                <Button asChild size="lg">
                  <Link href="/daftar">
                    Mulai Gratis
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="https://wa.me/628123456789">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Hubungi Sales
                  </Link>
                </Button>
              </div>

              {/* Social proof badge */}
              <div className="flex items-center gap-4 justify-center lg:justify-start mb-8">
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
                      className="w-10 h-10 rounded-full border-2 border-card shadow-md object-cover"
                    />
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">1.000+ UMKM Indonesia</p>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sudah Mempercayai PeyGo</p>
                </div>
              </div>

              {/* Trust indicators with regulatory logos */}
              <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Setup 2 Menit</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Bekerjasama dengan Mitra Berizin</span>
                </div>
                <div className="h-6 w-px bg-border hidden md:block" />
                <div className="flex items-center gap-4">
                  <Image src="/logos/regulatory/ojk.png" alt="Mitra berizin OJK" width={60} height={24} className="h-6 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity" title="Bekerjasama dengan mitra berizin dan diawasi OJK" />
                  <Image src="/logos/regulatory/bi.png" alt="Mitra terdaftar BI" width={50} height={20} className="h-5 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity" title="Bekerjasama dengan mitra terdaftar Bank Indonesia" />
                </div>
              </div>
            </div>

            {/* Right content - 3D Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative group">
                {/* Outer Glow */}
                <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl opacity-50" />
                
                {/* 3D Container */}
                <div className="relative">
                  {/* Layer 1: Mini Dashboard (Bottom Layer) */}
                  <div className="relative bg-card/80 backdrop-blur-xl border border-border shadow-2xl rounded-3xl p-8 pb-32 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total Pendapatan</p>
                        <h4 className="text-3xl font-bold text-foreground tracking-tighter">Rp 128.5M</h4>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success">
                          <ArrowUpRight size={16} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Simulated Mini Chart */}
                    <div className="flex items-end gap-2 h-24 mb-6">
                      {[40, 70, 45, 90, 65, 80, 55].map((height, i) => (
                        <div
                          key={i}
                          style={{ height: `${height}%` }}
                          className="flex-1 bg-gradient-to-t from-primary/20 to-primary/40 rounded-t-lg transition-all duration-500"
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

                  {/* Layer 2: Payment Success (Middle Overlay) */}
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

                  {/* Layer 3: Recent Activity (Floating Detail) */}
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
            </div>
          </div>
        </div>
      </section>

      {/* Payment Partners */}
      <PaymentPartners />

      {/* Stats Section */}
      <section id="stats-section" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 bg-card/80 backdrop-blur-xl border border-border p-12 rounded-3xl shadow-2xl">
            <div className="text-center md:border-r border-border last:border-0">
              <div className="text-5xl md:text-7xl font-bold text-foreground mb-3 tracking-tighter tabular-nums">
                {invoiceCount.count.toLocaleString()}+
              </div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Invoice Terkirim</p>
            </div>
            <div className="text-center md:border-r border-border last:border-0">
              <div className="text-5xl md:text-7xl font-bold text-primary mb-3 tracking-tighter tabular-nums">
                Rp {transactionCount.count}M+
              </div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Transaksi</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-7xl font-bold text-foreground mb-3 tracking-tighter tabular-nums">
                {userCount.count.toLocaleString()}+
              </div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pengguna Aktif</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <TrustBadges />

      {/* Features Section */}
      <section id="fitur" className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
             <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2 rounded-2xl text-xs font-medium uppercase tracking-wide mb-6">
                <span>Powerful Capabilities</span>
              </div>
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6 tracking-tighter">
              Didesain untuk Skala Bisnis Anda
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium">
              Platform lengkap untuk mengelola invoice dan pembayaran bisnis Anda dengan standar keamanan internasional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText className="w-8 h-8" />}
              title="Invoice Premium"
              description="Buat invoice dengan tampilan profesional lengkap dengan logo dan kustomisasi branding."
              color="primary"
            />
            <FeatureCard
              icon={<CreditCard className="w-8 h-8" />}
              title="Global Gateway"
              description="Terima pembayaran via QRIS, VA Bank, E-Wallet, dan Kartu Kredit secara real-time."
              color="secondary"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Kilat Settlement"
              description="Dana masuk ke rekening Anda dalam hitungan jam. Tanpa ribet, tanpa pending lama."
              color="warning"
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Analytics Canggih"
              description="Pantau performa bisnis dengan dashboard finansial yang informatif dan tepat sasaran."
              color="success"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Enterprise Security"
              description="Sistem berlapis dengan enkripsi 256-bit dan diawasi oleh regulator resmi Indonesia."
              color="danger"
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8" />}
              title="Smart Automation"
              description="Pengingat tagihan otomatis untuk pelanggan, memastikan arus kas Anda selalu terjaga."
              color="primary"
            />
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <ComparisonTable />

      <TargetAudience />

      {/* How it Works */}
      <section className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
             <div className="inline-flex items-center gap-2 bg-success/10 text-success px-5 py-2 rounded-2xl text-xs font-medium uppercase tracking-wide mb-6">
                <span>Alur Kerja Mudah</span>
              </div>
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6 tracking-tighter">
              Mulai dalam Hitungan Detik
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg font-medium">
              Proses yang sangat simpel untuk hasil bisnis yang maksimal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-px bg-border" />
            
            <StepCard step="1" title="Daftar" description="Buat akun dalam 30 detik tanpa verifikasi rumit." />
            <StepCard step="2" title="Tagih" description="Masukkan detail transaksi dan kirim ke pelanggan." />
            <StepCard step="3" title="Terima" description="Dana langsung masuk ke rekening Anda otomatis." />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimoni" className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-2xl text-xs font-medium uppercase tracking-wide mb-6">
                <span>Testimonials</span>
              </div>
            <h2 className="text-3xl md:text-5xl font-semibold text-foreground mb-6 tracking-tighter">
              Dipercaya Ribuan Bisnis
            </h2>
            <p className="text-muted-foreground text-lg font-medium">
              Bergabunglah dengan komunitas pengusaha sukses di PeyGo.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Card className="bg-foreground text-background border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-10 md:p-16 relative">
                {/* Decoration */}
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />

                <div className="flex justify-center mb-10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-6 h-6 text-primary fill-primary mx-1" />
                  ))}
                </div>
                
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-semibold leading-tight tracking-tight mb-12">
                    &ldquo;{testimonials[currentTestimonial].content}&rdquo;
                  </p>
                  <div className="flex items-center justify-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-2xl">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-xl uppercase tracking-tight">
                        {testimonials[currentTestimonial].name}
                      </p>
                      <p className="opacity-60 text-xs font-medium uppercase tracking-wide mt-1">
                        {testimonials[currentTestimonial].role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dots indicator */}
                <div className="flex justify-center gap-3 mt-16" role="tablist" aria-label="Testimonial navigation">
                  {testimonials.map((testimonial, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      role="tab"
                      aria-selected={index === currentTestimonial}
                      aria-label={`Go to testimonial from ${testimonial.name}`}
                      type="button"
                      className={cn(
                        "transition-all duration-200 rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground",
                        index === currentTestimonial 
                          ? "bg-primary w-12 h-2" 
                          : "bg-background/30 w-2 h-2 hover:bg-background/50"
                      )}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
             <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-5 py-2 rounded-2xl text-xs font-medium uppercase tracking-wide mb-6">
                <span>Support</span>
              </div>
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6 tracking-tighter">
              Pertanyaan Umum
            </h2>
            <p className="text-muted-foreground text-lg font-medium">
              Semua yang perlu Anda ketahui tentang PeyGo.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl px-6"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <Card className="bg-foreground border-0 overflow-hidden relative rounded-3xl shadow-2xl">
              {/* Animated Background Gradients */}
              <div className="absolute inset-0 opacity-40">
                <div className="absolute -bottom-[20%] -left-[20%] w-[80%] h-[80%] bg-blue-500/20 rounded-full blur-[120px]" />
              </div>
              
              <CardContent className="p-10 md:p-16 relative z-10 text-background">
                <h2 className="text-3xl md:text-5xl font-semibold mb-6 tracking-tighter text-center">
                  Siap Memulai <br/> Masa Depan?
                </h2>
                <p className="opacity-60 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto text-center">
                  Bergabung dengan ribuan bisnis yang telah mengefisiensi arus kas mereka dengan PeyGo. <span className="opacity-100 font-semibold">Daftar sekarang, gratis.</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Button asChild size="lg">
                    <Link href="/daftar">
                      Daftar Sekarang
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="lg" className="border border-white/30 !bg-transparent text-white hover:!bg-white" asChild>
                    <Link href="https://wa.me/628123456789">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Tanya Ahli Kami
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-24 border-t border-border relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 mb-20">
            {/* Brand */}
            <div className="md:col-span-6">
              <Link href="/" className="mb-8 group block">
                <span className="text-4xl font-bold tracking-tighter transition-colors">
                  <span className="text-primary group-hover:text-primary/80">Pey</span><span className="text-foreground group-hover:text-muted-foreground">Go</span>
                </span>
              </Link>
              <p className="text-muted-foreground text-lg font-medium max-w-md leading-relaxed mb-8">
                Memberdayakan bisnis Indonesia dengan invoice pintar dan solusi pembayaran yang seamless. Berkembang lebih cepat bersama PeyGo.
              </p>
              <div className="space-y-2">
                 <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bekerjasama dengan Mitra Berizin dan Diawasi oleh</p>
                 <div className="flex items-center gap-4">
                   <Image src="/logos/regulatory/ojk.png" alt="OJK" width={80} height={32} className="h-8 w-auto object-contain" />
                   <Image src="/logos/regulatory/bi.png" alt="Bank Indonesia" width={100} height={24} className="h-6 w-auto object-contain" />
                 </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wide mb-8">Produk</h4>
              <ul className="space-y-4">
                <li><Link href="#fitur" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">Penagihan Invoice</Link></li>
                <li><Link href="#fitur" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">Pembayaran</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">Laporan Keuangan</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wide mb-8">Bantuan</h4>
              <ul className="space-y-4">
                <li><Link href="#faq" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">FAQ</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">Panduan</Link></li>
                <li><Link href="https://wa.me/628123456789" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">Hubungi Kami</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wide mb-8">Perusahaan</h4>
              <ul className="space-y-4 text-muted-foreground font-medium text-sm">
                <li>Jakarta, Indonesia</li>
                <li><Link href="mailto:hello@peygo.id" className="hover:text-primary transition-colors">hello@peygo.id</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Karir (Lowongan!)</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              © {new Date().getFullYear()} PeyGo. Dibuat dengan <span className="text-primary">🔥</span> untuk Indonesia.
            </p>
            <div className="flex items-center gap-8">
              <Link href="#" className="text-muted-foreground hover:text-foreground text-xs font-medium uppercase tracking-wide transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground text-xs font-medium uppercase tracking-wide transition-colors">
                Syarat & Ketentuan
              </Link>
              <Link href="https://wa.me/628123456789" className="text-success hover:text-success/80 text-xs font-medium uppercase tracking-wide transition-colors flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" /> WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <WhatsAppFloatingButton phoneNumber="628123456789" message="Halo, saya tertarik dengan PeyGo!" />
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description,
  color = "primary"
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-blue-500/10 text-blue-500",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-destructive/10 text-destructive",
  };

  return (
    <Card className="h-full hover:-translate-y-2 transition-transform duration-300 group">
      <CardContent className="p-10">
        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500", colorClasses[color])}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-4 tracking-tight">{title}</h3>
        <p className="text-muted-foreground font-medium leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function StepCard({ 
  step, 
  title, 
  description 
}: { 
  step: string; 
  title: string; 
  description: string 
}) {
  return (
    <div className="text-center relative group">
      <div className="w-20 h-20 bg-card border border-border rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 group-hover:bg-foreground transition-all duration-300">
        <span className="text-3xl font-bold text-foreground group-hover:text-background transition-colors tracking-tighter">{step}</span>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3 tracking-tight">{title}</h3>
      <p className="text-muted-foreground font-medium max-w-[200px] mx-auto leading-relaxed">{description}</p>
    </div>
  );
}
