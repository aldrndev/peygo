"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: number;
  color: "emerald" | "blue" | "violet" | "orange";
  onClick?: () => void;
}

const colorClasses = {
  emerald: "bg-emerald-500/10 text-emerald-600",
  blue: "bg-blue-500/10 text-blue-600",
  violet: "bg-violet-500/10 text-violet-600",
  orange: "bg-orange-500/10 text-orange-600",
};

export function StatCard({ icon, label, value, change, color, onClick }: StatCardProps) {
  return (
    <Card 
      className={cn(
        onClick && "cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className={cn("p-2.5 rounded-xl", colorClasses[color])}>
            {icon}
          </div>
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              change >= 0 
                ? "bg-emerald-500/10 text-emerald-600" 
                : "bg-red-500/10 text-red-600"
            )}>
              {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(change).toFixed(1)}%
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface BreakdownBarProps {
  label: string;
  value: number;
  total: number;
  color: "blue" | "orange" | "emerald" | "red" | "gray";
}

const barColorClasses = {
  blue: "bg-blue-500",
  orange: "bg-orange-500",
  emerald: "bg-emerald-500",
  red: "bg-red-500",
  gray: "bg-gray-400",
};

export function BreakdownBar({ label, value, total, color }: BreakdownBarProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value} ({percentage.toFixed(0)}%)</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all", barColorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-gray-100 text-gray-600" },
  SENT: { label: "Terkirim", className: "bg-amber-100 text-amber-700" },
  PAID: { label: "Lunas", className: "bg-emerald-100 text-emerald-700" },
  DISBURSED: { label: "Dicairkan", className: "bg-blue-100 text-blue-700" },
  FAILED: { label: "Gagal", className: "bg-red-100 text-red-700" },
  EXPIRED: { label: "Kedaluwarsa", className: "bg-gray-100 text-gray-500" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-600" };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
      config.className
    )}>
      {config.label}
    </span>
  );
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: "Draft",
    SENT: "Terkirim",
    PAID: "Lunas",
    DISBURSED: "Dicairkan",
    FAILED: "Gagal",
    EXPIRED: "Kedaluwarsa",
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): "blue" | "orange" | "emerald" | "red" | "gray" {
  const colors: Record<string, "blue" | "orange" | "emerald" | "red" | "gray"> = {
    DRAFT: "gray",
    SENT: "orange",
    PAID: "emerald",
    DISBURSED: "blue",
    FAILED: "red",
    EXPIRED: "gray",
  };
  return colors[status] || "gray";
}
