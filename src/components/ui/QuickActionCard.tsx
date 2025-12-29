import Link from "next/link";
import { LucideIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  href: string;
  icon: LucideIcon;
  label: string;
  description?: string;
  color?: "orange" | "blue" | "green" | "purple";
}

const colorStyles = {
  orange: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  blue: {
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  green: {
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  purple: {
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
    <Link href={href} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl">
      <div
        className="bg-card border border-border rounded-xl p-4 hover:bg-accent/50 transition-colors"
        tabIndex={-1}
      >
        <div className="flex items-center gap-4">
          <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0", styles.iconBg)}>
            <Icon size={20} className={styles.iconColor} aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground text-sm md:text-base">{label}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>
            )}
          </div>
          <ChevronRight size={16} className="text-muted-foreground/50 shrink-0" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
