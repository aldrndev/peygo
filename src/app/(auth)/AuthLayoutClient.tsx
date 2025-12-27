"use client";

import { Link } from "@heroui/react";
import { motion } from "framer-motion";
import { FileText, Shield, Zap, CheckCircle2 } from "lucide-react";

interface AuthLayoutClientProps {
  children: React.ReactNode;
}

export default function AuthLayoutClient({ children }: AuthLayoutClientProps) {
  return (
    <div className="min-h-screen flex bg-slate-50 overflow-hidden relative">
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

      {/* Left Side - Branding (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden z-10">
        <div className="relative z-10 flex flex-col justify-start p-16 w-full">
          {/* Logo */}
          <Link href="/" className="flex flex-col w-fit group mb-20">
            <span className="text-4xl font-bold tracking-tighter">
              <span className="text-orange-500">Pey</span><span className="text-black">Go</span>
            </span>
          </Link>
 
          {/* Main Content */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "circOut" }}
            >
              <h1 className="text-6xl font-bold leading-[0.9] tracking-tighter mb-8 text-slate-900">
                Pindah Gerak,
                <br />
                <span className="text-orange-500">Kirim Tagihan</span>
                <br />
                Makin Kilat.
              </h1>
              <p className="text-slate-500 text-xl max-w-md font-medium leading-relaxed">
                Kelola bisnis Anda dengan platform invoice <span className="text-slate-900 font-bold underline decoration-orange-300 decoration-4">tercanggih</span> di Indonesia.
              </p>
            </motion.div>
 
            {/* Features */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 shadow-xl shadow-slate-200/50 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-slate-900 font-bold text-sm uppercase tracking-tight">Invoice Profesional Kilat</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 shadow-xl shadow-slate-200/50 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="text-slate-900 font-bold text-sm uppercase tracking-tight">Otomasi Pembayaran Global</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 shadow-xl shadow-slate-200/50 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="text-slate-900 font-bold text-sm uppercase tracking-tight">Keamanan Standar Perbankan</span>
              </div>
            </motion.div>
          </div>
 
          {/* Bottom */}
          <motion.div 
            className="flex items-center gap-8 text-xs font-bold uppercase tracking-[0.2em] text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Mitra Berizin OJK</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Dukungan 24/7</span>
            </div>
          </motion.div>
        </div>
      </div>
 
      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        {/* Mobile Header */}
        <header className="lg:hidden py-8 px-8">
          <Link href="/" className="flex flex-col w-fit">
            <span className="text-3xl font-bold tracking-tighter">
              <span className="text-orange-500">Pey</span><span className="text-black">Go</span>
            </span>
          </Link>
        </header>
 
        {/* Form Container */}
        <main className="flex-1 flex items-center justify-center px-6 py-8">
          <motion.div 
            className="w-full max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "circOut" }}
          >
            {children}
          </motion.div>
        </main>
 
        {/* Footer */}
        <footer className="py-6 px-8 text-center text-slate-400">
          <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">
            © {new Date().getFullYear()} PeyGo. Semua Hak Dilindungi.<br/>
            Platform Invoice untuk UMKM Indonesia.
          </p>
        </footer>
      </div>
    </div>
  );
}
