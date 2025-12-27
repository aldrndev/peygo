"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";

interface QuickActionCardProps {
  href: string;
  icon: LucideIcon;
  label: string;
  description?: string;
  color?: "orange" | "blue" | "green" | "purple";
}

const colorStyles = {
  orange: {
    bg: "bg-orange-50/50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  blue: {
    bg: "bg-blue-50/50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  green: {
    bg: "bg-green-50/50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  purple: {
    bg: "bg-purple-50/50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
};

export default function QuickActionCard({
  href,
  icon: Icon,
  label,
  description,
  color = "orange",
}: QuickActionCardProps) {
  const styles = colorStyles[color];

  return (
    <Link href={href}>
      <motion.div
        className="bg-white/60 backdrop-blur-xl border-white/50 border rounded-[32px] p-6 transition-all duration-500 group relative overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-6 relative z-10">
          <div className={`w-14 h-14 rounded-2xl ${styles.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
            <Icon size={28} className={styles.iconColor} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-900 text-lg tracking-tight leading-tight">{label}</p>
            {description && (
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-widest">{description}</p>
            )}
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
             <ArrowRight size={18} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
