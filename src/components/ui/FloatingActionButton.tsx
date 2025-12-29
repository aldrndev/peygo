"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, X, Receipt, CreditCard, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface FABAction {
  href: string;
  icon: React.ReactNode;
  label: string;
  color?: string;
}

interface FloatingActionButtonProps {
  primaryHref?: string;
  onPrimaryPress?: () => void;
  primaryLabel?: string;
  actions?: FABAction[];
  expanded?: boolean;
}

const defaultActions: FABAction[] = [
  { href: "/dashboard/penjualan/baru", icon: <Receipt size={20} />, label: "Buat Penjualan", color: "bg-primary" },
  { href: "/dashboard/pembayaran/baru", icon: <CreditCard size={20} />, label: "Kirim Pembayaran", color: "bg-blue-500" },
  { href: "/dashboard/supplier/baru", icon: <Truck size={20} />, label: "Tambah Supplier", color: "bg-success" },
];

export default function FloatingActionButton({
  primaryHref,
  onPrimaryPress,
  primaryLabel = "Buat",
  actions = defaultActions,
  expanded: initialExpanded = false
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(initialExpanded);

  const fabContent = (
    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-background hover:scale-105 active:scale-95 transition-transform">
      <Plus size={24} className="text-primary-foreground" strokeWidth={2.5} />
    </div>
  );

  // If only one action, go directly to that link or trigger action
  if (primaryHref || onPrimaryPress || (actions && actions.length === 1)) {
    const href = primaryHref || (actions && actions.length === 1 ? actions[0].href : undefined);
    
    if (href) {
      return (
        <Link 
          href={href} 
          className="fixed bottom-28 right-4 z-40 md:bottom-6 md:right-6 no-print"
          aria-label={primaryLabel}
        >
          {fabContent}
        </Link>
      );
    }

    return (
      <button 
        onClick={onPrimaryPress} 
        className="fixed bottom-28 right-4 z-40 md:bottom-6 md:right-6 no-print"
        aria-label={primaryLabel}
      >
        {fabContent}
      </button>
    );
  }

  return (
    <div className="fixed bottom-28 right-4 z-40 md:bottom-6 md:right-6 no-print">
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Action Items */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 whitespace-nowrap"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-sm font-medium text-background bg-foreground/90 backdrop-blur px-3 py-1.5 rounded-lg shadow">
                {action.label}
              </span>
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white",
                action.color || "bg-primary"
              )}>
                {action.icon}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95",
          isOpen 
            ? "bg-foreground" 
            : "bg-primary shadow-primary/30"
        )}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <div className={cn("transition-transform duration-200", isOpen && "rotate-45")}>
          {isOpen ? (
            <X size={24} className="text-background" strokeWidth={2} />
          ) : (
            <Plus size={24} className="text-primary-foreground" strokeWidth={2.5} />
          )}
        </div>
      </button>
    </div>
  );
}
