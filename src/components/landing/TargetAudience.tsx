"use client";

import { Briefcase, Store, Rocket, Users } from "lucide-react";
import { cn } from "@/lib/utils";

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
  orange: "bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
  blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
  emerald: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
  violet: "bg-violet-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white",
};

export default function TargetAudience() {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Untuk Siapa
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold text-foreground tracking-tight mb-4">
            PeyGo untuk Semua
            <br />
            <span className="text-primary">Pelaku Bisnis</span>
          </h2>
          <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto">
            Dari freelancer hingga perusahaan, PeyGo membantu semua skala bisnis mengelola invoice dengan lebih efisien.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((audience) => (
            <div
              key={audience.title}
              className="group p-8 bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:text-white",
                  colorClasses[audience.color as keyof typeof colorClasses]
                )}
              >
                <audience.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 tracking-tight">
                {audience.title}
              </h3>
              <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
