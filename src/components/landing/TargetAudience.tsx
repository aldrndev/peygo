"use client";

import { motion } from "framer-motion";
import { Briefcase, Store, Rocket, Users } from "lucide-react";

const audiences = [
  {
    icon: Briefcase,
    title: "Freelancer",
    description: "Invoice profesional untuk klien lokal & internasional",
    color: "orange",
  },
  {
    icon: Store,
    title: "UMKM",
    description: "Kelola tagihan dan lacak pembayaran dengan mudah",
    color: "blue",
  },
  {
    icon: Rocket,
    title: "Startup",
    description: "Skalakan bisnis dengan sistem invoice yang efisien",
    color: "emerald",
  },
  {
    icon: Users,
    title: "Agensi & Konsultan",
    description: "Multi-klien management dan laporan otomatis",
    color: "violet",
  },
];

const colorClasses = {
  orange: "bg-orange-500/10 text-orange-500 group-hover:bg-orange-500",
  blue: "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500",
  emerald: "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500",
  violet: "bg-violet-500/10 text-violet-500 group-hover:bg-violet-500",
};

export default function TargetAudience() {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
            Untuk Siapa
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold text-slate-900 tracking-tight mb-4">
            PeyGo untuk Semua
            <br />
            <span className="text-orange-500">Pelaku Bisnis</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
            Dari freelancer hingga perusahaan, PeyGo membantu semua skala bisnis mengelola invoice dengan lebih efisien.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 bg-white/60 backdrop-blur-xl border border-white/40 rounded-[32px] shadow-lg shadow-slate-200/20 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 hover:-translate-y-2"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:text-white ${colorClasses[audience.color as keyof typeof colorClasses]}`}
              >
                <audience.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
                {audience.title}
              </h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                {audience.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
