"use client";

import { X, Check } from "lucide-react";
import { motion } from "framer-motion";

const comparisons = [
  {
    task: "Buat Invoice",
    without: "15 menit",
    with: "2 menit"
  },
  {
    task: "Kirim ke Klien",
    without: "Manual WhatsApp",
    with: "Otomatis + Link Bayar"
  },
  {
    task: "Status Pembayaran",
    without: "Cek manual rekening",
    with: "Real-time tracking"
  },
  {
    task: "Laporan Keuangan",
    without: "Spreadsheet manual",
    with: "Dashboard otomatis"
  },
  {
    task: "Reminder Tagihan",
    without: "Telepon manual",
    with: "Auto-reminder"
  }
];

export default function ComparisonTable() {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-5 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest mb-6">
            <span>Sebelum vs Sesudah</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold text-slate-900 tracking-tighter mb-4">
            Transformasi Bisnis Anda
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Lihat perbedaan nyata sebelum dan sesudah menggunakan PeyGo
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[40px] overflow-hidden shadow-xl shadow-slate-200/40"
        >
          {/* Header */}
          <div className="grid grid-cols-3 bg-slate-900 text-white p-6">
            <div className="font-bold text-xs uppercase tracking-widest text-slate-400">
              Aktivitas
            </div>
            <div className="text-center font-bold text-xs uppercase tracking-widest text-rose-400">
              Tanpa PeyGo
            </div>
            <div className="text-center font-bold text-xs uppercase tracking-widest text-emerald-400">
              Dengan PeyGo
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {comparisons.map((item, index) => (
              <motion.div
                key={item.task}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="grid grid-cols-3 p-6 hover:bg-slate-50/50 transition-colors"
              >
                <div className="font-semibold text-slate-900 text-sm tracking-tight">
                  {item.task}
                </div>
                <div className="text-center flex items-center justify-center gap-2 text-rose-500">
                  <X className="w-4 h-4" />
                  <span className="text-sm font-bold">{item.without}</span>
                </div>
                <div className="text-center flex items-center justify-center gap-2 text-emerald-600">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-bold">{item.with}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
