"use client";

import {
  Button,
  Card,
  CardBody,
  Link,
  Accordion,
  AccordionItem,
} from "@heroui/react";
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
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import WhatsAppFloatingButton from "@/components/ui/WhatsAppFloatingButton";
import TrustBadges from "@/components/landing/TrustBadges";
import ComparisonTable from "@/components/landing/ComparisonTable";
import PaymentPartners from "@/components/landing/PaymentPartners";
import TargetAudience from "@/components/landing/TargetAudience";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden relative">
      {/* Aurora Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-orange-300/20 blur-[120px]"
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-300/10 blur-[120px]"
        />
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 20, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-emerald-300/10 blur-[120px]"
        />
      </div>

      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-white/40 backdrop-blur-2xl border-b border-white/20 shadow-xl shadow-slate-200/20" 
            : "bg-transparent border-transparent py-2"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="group">
              <span className="text-3xl font-bold tracking-tighter">
                <span className="text-orange-500">Pey</span><span className="text-black">Go</span>
              </span>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#fitur" className="text-slate-500 hover:text-orange-600 transition-colors font-bold text-xs uppercase tracking-widest">
                Fitur
              </Link>
              <Link href="#testimoni" className="text-slate-500 hover:text-orange-600 transition-colors font-bold text-xs uppercase tracking-widest">
                Testimoni
              </Link>
              <Link href="#faq" className="text-slate-500 hover:text-orange-600 transition-colors font-bold text-xs uppercase tracking-widest">
                FAQ
              </Link>
              <div className="h-6 w-px bg-slate-200 mx-2" />
              <Link href="/masuk" className="text-slate-900 hover:text-orange-600 transition-colors font-bold text-xs uppercase tracking-widest">
                Masuk
              </Link>
              <Button 
                as={Link} 
                href="/daftar" 
                color="primary"
                className="font-bold text-xs uppercase tracking-widest px-8 h-12 rounded-2xl hover:scale-105 transition-all"
              >
                Daftar Gratis
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              isIconOnly 
              variant="light" 
              className="md:hidden bg-white/50 backdrop-blur-xl rounded-xl border border-white/50"
              onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </Button>
          </nav>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                id="mobile-menu"
                initial={{ height: 0, opacity: 0, y: -20 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -20 }}
                transition={{ duration: 0.2, ease: "circOut" }}
                className="md:hidden overflow-hidden bg-white/60 backdrop-blur-3xl border-t border-white/20 shadow-2xl mt-4 rounded-3xl"
              >
                <div className="py-6 px-6 flex flex-col gap-4">
                  <Link href="#fitur" className="text-slate-900 font-bold text-xs uppercase tracking-widest py-2" onPress={() => setMobileMenuOpen(false)}>
                    Fitur
                  </Link>
                  <Link href="#testimoni" className="text-slate-900 font-bold text-xs uppercase tracking-widest py-2" onPress={() => setMobileMenuOpen(false)}>
                    Testimoni
                  </Link>
                  <Link href="#faq" className="text-slate-900 font-bold text-xs uppercase tracking-widest py-2" onPress={() => setMobileMenuOpen(false)}>
                    FAQ
                  </Link>
                  <div className="h-px bg-slate-200/50" />
                  <Link href="/masuk" className="text-slate-900 font-bold text-xs uppercase tracking-widest py-2" onPress={() => setMobileMenuOpen(false)}>
                    Masuk
                  </Link>
                  <Button as={Link} href="/daftar" color="primary" fullWidth size="lg" className="rounded-2xl font-bold text-xs uppercase tracking-widest h-14" onPress={() => setMobileMenuOpen(false)}>
                    Daftar Gratis
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden z-10">
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Left content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInLeft}
              className="lg:col-span-7 text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl border border-white/50 text-orange-600 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest mb-10 shadow-lg shadow-slate-200/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Zap className="w-4 h-4" />
                <span>Solusi Invoice Pintar untuk UMKM</span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-semibold text-slate-900 mb-8 leading-[0.9] tracking-tighter">
                Kirim Invoice, 
                <br />
                <span className="text-orange-500">Terima Cuan</span>
                <br />
                Lebih Kilat.
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Platform invoice tercanggih yang membuat proses penagihan bisnis Anda semudah mengirim pesan instan. <span className="text-slate-900 font-bold">Cobalah masa depan invoicing hari ini.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-12">
                <Button 
                  as={Link} 
                  href="/daftar" 
                  color="primary" 
                  size="lg"
                  className="font-bold text-sm uppercase tracking-widest px-10 h-16 rounded-[24px] shadow-xl shadow-slate-200/30 hover:scale-105 transition-all"
                  endContent={<ArrowRight className="w-5 h-5" />}
                >
                  Mulai Gratis
                </Button>
                <Button 
                  as={Link}
                  href="https://wa.me/628123456789"
                  variant="bordered" 
                  size="lg"
                  className="bg-white/50 backdrop-blur-xl border-white font-bold text-sm uppercase tracking-widest px-10 h-16 rounded-[24px] hover:bg-white hover:scale-105 transition-all shadow-lg"
                  startContent={<MessageCircle className="w-5 h-5" />}
                >
                  Hubungi Sales
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
                      className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover"
                    />
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900">1.000+ UMKM Indonesia</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sudah Mempercayai PeyGo</p>
                </div>
              </div>

              {/* Trust indicators with regulatory logos */}
              <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span>Setup 2 Menit</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span>Bekerjasama dengan Mitra Berizin</span>
                </div>
                <div className="h-6 w-px bg-slate-200 hidden md:block" />
                <div className="flex items-center gap-4">
                  <Image src="/logos/regulatory/ojk.png" alt="Mitra berizin OJK" width={60} height={24} className="h-6 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity" title="Bekerjasama dengan mitra berizin dan diawasi OJK" />
                  <Image src="/logos/regulatory/bi.png" alt="Mitra terdaftar BI" width={50} height={20} className="h-5 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity" title="Bekerjasama dengan mitra terdaftar Bank Indonesia" />
                </div>
              </div>
            </motion.div>

            {/* Right content - 3D Mockup */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInRight}
              className="lg:col-span-5 relative"
            >
              <div className="relative group perspective-1000">
                {/* Outer Glow */}
                <div className="absolute -inset-4 bg-orange-500/5 rounded-[60px] blur-[40px] opacity-50" />
                
                {/* 3D Container */}
                <div className="relative transform-gpu transition-all duration-700">
                  {/* Layer 1: Mini Dashboard (Bottom Layer) */}
                  <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative bg-white/40 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-[40px] p-8 pb-32 overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pendapatan</p>
                        <h4 className="text-3xl font-bold text-slate-900 tracking-tighter">Rp 128.5M</h4>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <ArrowUpRight size={16} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Simulated Mini Chart */}
                    <div className="flex items-end gap-2 h-24 mb-6">
                      {[40, 70, 45, 90, 65, 80, 55].map((height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                          className="flex-1 bg-gradient-to-t from-orange-500/20 to-orange-500/40 rounded-t-lg"
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/40 p-4 rounded-2xl border border-white/60">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Invoice</p>
                        <p className="text-lg font-bold text-slate-900">42</p>
                      </div>
                      <div className="bg-white/40 p-4 rounded-2xl border border-white/60">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Klien</p>
                        <p className="text-lg font-bold text-slate-900">12</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Layer 2: Payment Success (Middle Overlay) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 40, y: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="absolute top-1/2 -right-4 md:-right-6 -translate-y-1/2 bg-white border border-white shadow-[0_32px_80px_rgba(0,0,0,0.15)] rounded-3xl p-5 md:p-6 w-60 md:w-72 z-10 scale-90 md:scale-100"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/20">
                        <Check size={32} strokeWidth={3} />
                      </div>
                      <h5 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">Pembayaran Berhasil!</h5>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Invoice #PEY-2891</p>
                      
                      <div className="w-full bg-slate-50 rounded-2xl p-4 flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
                        <span className="text-sm font-bold text-slate-900">Rp 12.500.000</span>
                      </div>
                      
                      <Button className="w-full bg-slate-900 text-white font-bold text-xs uppercase tracking-widest h-12 rounded-xl">
                        Lihat Detail
                      </Button>
                    </div>
                  </motion.div>

                  {/* Layer 3: Recent Activity (Floating Detail) */}
                  <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.1 }}
                    className="absolute -bottom-6 md:-bottom-8 -left-4 md:-left-8 bg-slate-900 text-white p-4 md:p-5 rounded-[24px] shadow-2xl z-20 flex items-center gap-4 w-56 md:w-64 border border-slate-800 scale-90 md:scale-100"
                  >
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-tight">Tagihan Dibayar</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Baru saja • Rp 4.2M</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Payment Partners */}
      <PaymentPartners />

      {/* Stats Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12 bg-white/40 backdrop-blur-2xl border border-white/40 p-12 rounded-[48px] shadow-2xl shadow-slate-200/50"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            onViewportEnter={() => {
              invoiceCount.start();
              transactionCount.start();
              userCount.start();
            }}
          >
            <motion.div variants={fadeInUp} className="text-center md:border-r border-slate-100 last:border-0">
              <div className="text-5xl md:text-7xl font-bold text-slate-900 mb-3 tracking-tighter">
                {invoiceCount.count.toLocaleString()}+
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Invoice Terkirim</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center md:border-r border-slate-100 last:border-0">
              <div className="text-5xl md:text-7xl font-bold text-orange-500 mb-3 tracking-tighter">
                Rp {transactionCount.count}M+
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Total Transaksi</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center">
              <div className="text-5xl md:text-7xl font-bold text-slate-900 mb-3 tracking-tighter">
                {userCount.count.toLocaleString()}+
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Pengguna Aktif</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <TrustBadges />

      {/* Features Section */}
      <section id="fitur" className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
             <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest mb-6">
                <span>Powerful Capabilities</span>
              </div>
            <h2 className="text-4xl md:text-6xl font-semibold text-slate-900 mb-6 tracking-tighter">
              Didesain untuk Skala Bisnis Anda
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
              Platform lengkap untuk mengelola invoice dan pembayaran bisnis Anda dengan standar keamanan internasional.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
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
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <ComparisonTable />

      <TargetAudience />

      {/* How it Works */}
      <section className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
             <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest mb-6">
                <span>Alur Kerja Mudah</span>
              </div>
            <h2 className="text-4xl md:text-6xl font-semibold text-slate-900 mb-6 tracking-tighter">
              Mulai dalam Hitungan Detik
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg font-medium">
              Proses yang sangat simpel untuk hasil bisnis yang maksimal.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-16 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-px bg-slate-200" />
            
            <StepCard
              step="1"
              title="Daftar"
              description="Buat akun dalam 30 detik tanpa verifikasi rumit."
            />
            <StepCard
              step="2"
              title="Tagih"
              description="Masukkan detail transaksi dan kirim ke pelanggan."
            />
            <StepCard
              step="3"
              title="Terima"
              description="Dana langsung masuk ke rekening Anda otomatis."
            />
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimoni" className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-5 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest mb-6">
                <span>Testimonials</span>
              </div>
            <h2 className="text-3xl md:text-5xl font-semibold text-slate-900 mb-6 tracking-tighter">
              Dipercaya Ribuan Bisnis
            </h2>
            <p className="text-slate-500 text-lg font-medium">
              Bergabunglah dengan komunitas pengusaha sukses di PeyGo.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
            >
              <Card className="bg-slate-900 border-0 shadow-[0_40px_100px_rgba(0,0,0,0.2)] rounded-[40px] overflow-hidden">
                <CardBody className="p-10 md:p-16 relative">
                   {/* Decoration */}
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />

                  <div className="flex justify-center mb-10">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-6 h-6 text-orange-500 fill-orange-500 mx-1" />
                    ))}
                  </div>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTestimonial}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <p className="text-xl md:text-2xl text-white font-bold leading-tight tracking-tight mb-12">
                        &ldquo;{testimonials[currentTestimonial].content}&rdquo;
                      </p>
                      <div className="flex items-center justify-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center text-white font-bold text-2xl">
                          {testimonials[currentTestimonial].avatar}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-white text-xl uppercase tracking-tight">
                            {testimonials[currentTestimonial].name}
                          </p>
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                            {testimonials[currentTestimonial].role}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

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
                        className={`transition-all duration-200 rounded-full focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                          index === currentTestimonial 
                            ? "bg-orange-500 w-12 h-2" 
                            : "bg-slate-700 w-2 h-2 hover:bg-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
             <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-5 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest mb-6">
                <span>Support</span>
              </div>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tighter">
              Pertanyaan Umum
            </h2>
            <p className="text-slate-500 text-lg font-medium">
              Semua yang perlu Anda ketahui tentang PeyGo.
            </p>
          </motion.div>

          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Accordion variant="splitted" className="gap-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  aria-label={faq.question}
                  title={<span className="font-bold text-slate-900 text-sm uppercase tracking-tight">{faq.question}</span>}
                  className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-slate-500 font-medium px-2 pb-4 leading-relaxed">{faq.answer}</p>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            className="max-w-5xl mx-auto"
          >
            <Card className="bg-slate-950 border-0 overflow-hidden relative rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.3)]">
              {/* Animated Background Gradients */}
              <div className="absolute inset-0 opacity-40">
                <motion.div 
                   animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
                   transition={{ duration: 20, repeat: Infinity }}
                   className="absolute -bottom-[20%] -left-[20%] w-[80%] h-[80%] bg-blue-500/20 rounded-full blur-[120px]" 
                />
              </div>
              
              <CardBody className="p-10 md:p-16 relative z-10">
                <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6 tracking-tighter text-center">
                  Siap Memulai <br/> Masa Depan?
                </h2>
                <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto text-center">
                  Bergabung dengan ribuan bisnis yang telah mengefisiensi arus kas mereka dengan PeyGo. <span className="text-white font-bold">Daftar sekarang, gratis.</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Button 
                    as={Link} 
                    href="/daftar"
                    size="lg"
                    className="bg-orange-500 text-white font-bold text-xs uppercase tracking-widest px-10 h-14 rounded-xl shadow-xl hover:scale-105 transition-all w-full sm:w-auto"
                    endContent={<ArrowRight className="w-6 h-6" />}
                  >
                    Daftar Sekarang
                  </Button>
                  <Button 
                    as={Link}
                    href="https://wa.me/628123456789"
                    size="lg"
                    variant="bordered"
                    className="border-white/20 text-white font-bold text-xs uppercase tracking-widest px-10 h-14 rounded-xl hover:bg-white/10 hover:scale-105 transition-all w-full sm:w-auto"
                    startContent={<MessageCircle className="w-6 h-6" />}
                  >
                    Tanya Ahli Kami
                  </Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-24 border-t border-slate-100 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 mb-20">
            {/* Brand */}
            <div className="md:col-span-6">
              <Link href="/" className="mb-8 group">
                <span className="text-4xl font-bold tracking-tighter transition-colors">
                  <span className="text-orange-500 group-hover:text-orange-600">Pey</span><span className="text-black group-hover:text-slate-700">Go</span>
                </span>
              </Link>
              <p className="text-slate-500 text-lg font-medium max-w-md leading-relaxed mb-8">
                Memberdayakan bisnis Indonesia dengan invoice pintar dan solusi pembayaran yang seamless. Berkembang lebih cepat bersama PeyGo.
              </p>
              <div className="space-y-2">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bekerjasama dengan Mitra Berizin dan Diawasi oleh</p>
                 <div className="flex items-center gap-4">
                   <Image src="/logos/regulatory/ojk.png" alt="OJK" width={80} height={32} className="h-8 w-auto object-contain" />
                   <Image src="/logos/regulatory/bi.png" alt="Bank Indonesia" width={100} height={24} className="h-6 w-auto object-contain" />
                 </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-widest mb-8">Produk</h4>
              <ul className="space-y-4">
                <li><Link href="#fitur" className="text-slate-500 hover:text-orange-600 transition-colors font-bold text-sm">Penagihan Invoice</Link></li>
                <li><Link href="#fitur" className="text-slate-500 hover:text-orange-600 transition-colors font-bold text-sm">Pembayaran</Link></li>
                <li><Link href="#" className="text-slate-500 hover:text-orange-600 transition-colors font-bold text-sm">Laporan Keuangan</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-widest mb-8">Bantuan</h4>
              <ul className="space-y-4">
                <li><Link href="#faq" className="text-slate-500 hover:text-orange-600 transition-colors font-bold text-sm">FAQ</Link></li>
                <li><Link href="#" className="text-slate-500 hover:text-orange-600 transition-colors font-bold text-sm">Panduan</Link></li>
                <li><Link href="https://wa.me/628123456789" className="text-slate-500 hover:text-orange-600 transition-colors font-bold text-sm">Hubungi Kami</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-widest mb-8">Perusahaan</h4>
              <ul className="space-y-4 text-slate-500 font-bold text-sm">
                <li>Jakarta, Indonesia</li>
                <li><Link href="mailto:hello@peygo.id" className="hover:text-orange-600 transition-colors">hello@peygo.id</Link></li>
                <li><Link href="#" className="hover:text-orange-600 transition-colors">Karir (Lowongan!)</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} PeyGo. Dibuat dengan <span className="text-orange-500">🔥</span> untuk Indonesia.
            </p>
            <div className="flex items-center gap-8">
              <Link href="#" className="text-slate-400 hover:text-slate-900 text-xs font-bold uppercase tracking-widest transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="#" className="text-slate-400 hover:text-slate-900 text-xs font-bold uppercase tracking-widest transition-colors">
                Syarat & Ketentuan
              </Link>
              <Link href="https://wa.me/628123456789" className="text-emerald-500 hover:text-emerald-600 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" /> WhatsApp
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const colorClasses = {
    primary: "bg-orange-500/10 text-orange-500",
    secondary: "bg-blue-500/10 text-blue-500",
    success: "bg-emerald-500/10 text-emerald-500",
    warning: "bg-amber-500/10 text-amber-500",
    danger: "bg-rose-500/10 text-rose-500",
  };

  return (
    <motion.div 
      variants={fadeInUp}
      onMouseMove={handleMouseMove}
      className="relative group"
    >
      <Card className="h-full bg-white/40 backdrop-blur-2xl border border-white/40 overflow-hidden rounded-[32px] transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] group-hover:-translate-y-2">
        {/* Spotlight Effect */}
        <div 
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(249, 115, 22, 0.08), transparent 40%)`,
          }}
        />
        
        <CardBody className="p-10 relative z-10">
          <div className={`w-16 h-16 ${colorClasses[color]} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500`}>
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight uppercase">{title}</h3>
          <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
        </CardBody>
      </Card>
    </motion.div>
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
    <motion.div className="text-center relative group" variants={fadeInUp}>
      <div className="w-20 h-20 bg-white border border-slate-100 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200/50 group-hover:scale-110 group-hover:bg-slate-950 transition-all duration-500">
        <span className="text-3xl font-bold text-slate-900 group-hover:text-white transition-colors tracking-tighter">{step}</span>
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight uppercase">{title}</h3>
      <p className="text-slate-500 font-medium max-w-[200px] mx-auto leading-relaxed">{description}</p>
    </motion.div>
  );
}
