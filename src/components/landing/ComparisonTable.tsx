"use client";

import { X, Check } from "lucide-react";

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
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-foreground px-5 py-2 rounded-2xl text-xs font-medium uppercase tracking-wide mb-6">
            <span>Sebelum vs Sesudah</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold text-foreground tracking-tighter mb-4">
            Transformasi Bisnis Anda
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Lihat perbedaan nyata sebelum dan sesudah menggunakan PeyGo
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-card/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-xl">
          {/* Header */}
          <div className="grid grid-cols-3 bg-muted/50 p-6 border-b border-border">
            <div className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
              Aktivitas
            </div>
            <div className="text-center font-bold text-xs uppercase tracking-wide text-destructive">
              Tanpa PeyGo
            </div>
            <div className="text-center font-bold text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-500">
              Dengan PeyGo
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {comparisons.map((item) => (
              <div
                key={item.task}
                className="grid grid-cols-3 p-6 hover:bg-accent/50 transition-colors"
              >
                <div className="font-semibold text-foreground text-sm tracking-tight">
                  {item.task}
                </div>
                <div className="text-center flex items-center justify-center gap-2 text-destructive">
                  <X className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.without}</span>
                </div>
                <div className="text-center flex items-center justify-center gap-2 text-success">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.with}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
