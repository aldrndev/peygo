"use client";

import { Shield, Lock, CheckCircle2, Building } from "lucide-react";
import { motion } from "framer-motion";

const badges = [
  {
    icon: Lock,
    title: "Enkripsi SSL 256-bit",
    description: "Data terlindungi",
    color: "emerald"
  },
  {
    icon: Building,
    title: "Bank Terpercaya",
    description: "BCA, Mandiri, BNI, BRI",
    color: "blue"
  },
  {
    icon: Shield,
    title: "Invoice Sah Hukum",
    description: "Dokumen legal",
    color: "orange"
  },
  {
    icon: CheckCircle2,
    title: "Data di Indonesia",
    description: "Server lokal aman",
    color: "slate"
  }
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100" },
  slate: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" }
};

export default function TrustBadges() {
  return (
    <section className="py-16 relative z-10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest mb-6">
            <Shield className="w-4 h-4" />
            <span>Keamanan & Kepercayaan</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
            Bisnis Anda Terlindungi
          </h3>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {badges.map((badge, index) => {
            const colors = colorMap[badge.color];
            const Icon = badge.icon;
            
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 text-center shadow-lg shadow-slate-200/30 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center border ${colors.border}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm tracking-tight mb-1">
                  {badge.title}
                </h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {badge.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
