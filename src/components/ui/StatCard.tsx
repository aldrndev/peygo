import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
    bg: "bg-card",
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
    valueColor: "text-foreground",
    border: "border-border",
  },
  primary: {
    bg: "bg-foreground",
    iconBg: "bg-primary",
    iconColor: "text-primary-foreground",
    valueColor: "text-background",
    border: "border-transparent",
  },
  success: {
    bg: "bg-card",
    iconBg: "bg-success/10",
    iconColor: "text-success",
    valueColor: "text-foreground",
    border: "border-border",
  },
  warning: {
    bg: "bg-card",
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    valueColor: "text-foreground",
    border: "border-border",
  },
  danger: {
    bg: "bg-card",
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    valueColor: "text-foreground",
    border: "border-border",
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
    <div
      className={cn(
        "rounded-xl p-5 min-w-[180px] border relative overflow-hidden",
        styles.bg,
        styles.border,
        className
      )}
      aria-label={`${title}: ${value}`}
    >
      <div className="relative z-10">
        {/* Icon */}
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", styles.iconBg)}>
          <Icon size={20} className={styles.iconColor} aria-hidden="true" />
        </div>

        {/* Title */}
        <p className={cn(
          "text-xs font-medium uppercase tracking-wide mb-2",
          isPrimary ? "text-background/50" : "text-muted-foreground"
        )}>
          {title}
        </p>

        {/* Value */}
        <p className={cn("text-2xl md:text-3xl font-semibold tracking-tight tabular-nums", styles.valueColor)}>
          {value}
        </p>

        {/* Trend */}
        {trend && (
          <div className={cn(
            "mt-3 flex items-center gap-2 text-xs font-medium",
            trend.value >= 0 ? "text-success" : "text-destructive"
          )}>
            <span className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full",
              trend.value >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            )}>
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
