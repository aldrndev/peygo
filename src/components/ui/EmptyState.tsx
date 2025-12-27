"use client";

import Link from "next/link";
import { LucideIcon, Receipt, FileText, Users, CreditCard } from "lucide-react";

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
    <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
      <div className="w-12 h-12 mx-auto mb-3 bg-orange-50 rounded-xl flex items-center justify-center">
        <Icon size={20} className="text-orange-500" aria-hidden="true" />
      </div>
      <h3 className="font-semibold text-slate-900 text-sm mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">
          {description}
        </p>
      )}
      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-medium text-xs rounded-lg hover:bg-orange-600 transition-colors"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-medium text-xs rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
