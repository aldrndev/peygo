"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

const variantStyles = {
  default: {
    bg: "bg-white/60",
    iconBg: "bg-slate-100/50",
    iconColor: "text-slate-600",
    valueColor: "text-slate-900",
    border: "border-white/50",
  },
  primary: {
    bg: "bg-slate-900",
    iconBg: "bg-orange-500",
    iconColor: "text-white",
    valueColor: "text-white",
    border: "border-slate-800",
  },
  success: {
    bg: "bg-white/60",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    valueColor: "text-slate-900",
    border: "border-white/50",
  },
  warning: {
    bg: "bg-white/60",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    valueColor: "text-slate-900",
    border: "border-white/50",
  },
  danger: {
    bg: "bg-white/60",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    valueColor: "text-slate-900",
    border: "border-white/50",
  },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  variant = "default",
  trend,
  className = "",
}: StatCardProps) {
  const styles = variantStyles[variant];
  const isPrimary = variant === "primary";

  return (
    <motion.div
      className={`${styles.bg} backdrop-blur-xl rounded-[32px] p-6 min-w-[200px] border ${styles.border} relative overflow-hidden group outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 hover:border-orange-200 transition-all duration-500 ${className}`}
      tabIndex={0}
      role="article"
      aria-label={`Statistik ${title}: ${value}`}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background Decorative element */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-20 transition-all group-hover:scale-150 ${
        isPrimary ? "bg-orange-500" : "bg-orange-300"
      }`} />

      <div className="relative z-10">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-2xl ${styles.iconBg} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
          <Icon size={24} className={styles.iconColor} />
        </div>

        {/* Title */}
        <p className={`text-xs font-semibold uppercase tracking-[0.2em] mb-2 ${isPrimary ? "text-slate-400" : "text-slate-500"}`}>
          {title}
        </p>

        {/* Value */}
        <p className={`text-3xl font-semibold tracking-tighter ${styles.valueColor}`}>
          {value}
        </p>

        {/* Trend */}
        {trend && (
          <div className={`mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${
            trend.value >= 0 
              ? "text-emerald-500" 
              : "text-rose-500"
          }`}>
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${trend.value >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            <span className="text-slate-500">{trend.label}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
