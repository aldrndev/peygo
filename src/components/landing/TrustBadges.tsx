"use client";

import { Shield, Lock, CheckCircle2, Building } from "lucide-react";

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
  emerald: { bg: "bg-emerald-100 group-hover:bg-emerald-600", text: "text-emerald-600 group-hover:text-white", border: "border-emerald-200" },
  blue: { bg: "bg-blue-100 group-hover:bg-blue-600", text: "text-blue-600 group-hover:text-white", border: "border-blue-200" },
  orange: { bg: "bg-orange-100 group-hover:bg-orange-600", text: "text-orange-600 group-hover:text-white", border: "border-orange-200" },
  slate: { bg: "bg-gray-100 group-hover:bg-gray-600", text: "text-gray-600 group-hover:text-white", border: "border-gray-200" }
};

export default function TrustBadges() {
  return (
    <section className="py-16 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-success/20 text-foreground px-5 py-2 rounded-2xl text-xs font-medium uppercase tracking-wide mb-6">
            <Shield className="w-4 h-4" />
            <span>Keamanan & Kepercayaan</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            Bisnis Anda Terlindungi
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {badges.map((badge) => {
            const colors = colorMap[badge.color];
            const Icon = badge.icon;
            
            return (
              <div
                key={badge.title}
                className="group bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-6 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center border ${colors.border}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h4 className="font-semibold text-foreground text-sm tracking-tight mb-1">
                  {badge.title}
                </h4>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
