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
    <div className="text-center py-12 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
      <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-2xl flex items-center justify-center">
        <Icon size={28} className="text-orange-500" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-4 max-w-xs mx-auto">
          {description}
        </p>
      )}
      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 cursor-pointer"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
