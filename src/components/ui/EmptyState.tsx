"use client";

import Link from "next/link";
import { LucideIcon, Receipt, FileText, Users, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  variant?: "default" | "billing" | "payment" | "supplier";
}

const variantIcons = {
  default: FileText,
  billing: Receipt,
  payment: CreditCard,
  supplier: Users,
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "default",
}: EmptyStateProps) {
  const Icon = icon || variantIcons[variant];

  return (
    <div className="text-center py-8 px-4 bg-muted/50 rounded-xl border border-dashed border-border">
      <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-xl flex items-center justify-center">
        <Icon size={20} className="text-primary" aria-hidden="true" />
      </div>
      <h3 className="font-semibold text-foreground text-sm mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">
          {description}
        </p>
      )}
      {action && (
        action.href ? (
          <Button asChild size="sm">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : (
          <Button size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        )
      )}
    </div>
  );
}
