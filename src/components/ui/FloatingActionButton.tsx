"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Receipt, CreditCard, Truck } from "lucide-react";

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
  { href: "/dashboard/penagihan/baru", icon: <Receipt size={20} />, label: "Buat Tagihan", color: "bg-orange-500" },
  { href: "/dashboard/pembayaran/baru", icon: <CreditCard size={20} />, label: "Kirim Pembayaran", color: "bg-blue-500" },
  { href: "/dashboard/supplier/baru", icon: <Truck size={20} />, label: "Tambah Supplier", color: "bg-green-500" },
];

export default function FloatingActionButton({
  primaryHref,
  onPrimaryPress,
  primaryLabel = "Buat",
  actions = defaultActions,
  expanded: initialExpanded = false
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(initialExpanded);

  // If only one action, go directly to that link or trigger action
  if (primaryHref || onPrimaryPress || (actions && actions.length === 1)) {
    const href = primaryHref || (actions && actions.length === 1 ? actions[0].href : undefined);
    
    const content = (
      <motion.div
        className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 ring-4 ring-white"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus size={24} className="text-white" strokeWidth={2.5} />
      </motion.div>
    );

    if (href) {
      return (
        <Link 
          href={href} 
          className="fixed bottom-20 right-4 z-40 md:bottom-6"
          aria-label={primaryLabel}
        >
          {content}
        </Link>
      );
    }

    return (
      <button 
        onClick={onPrimaryPress} 
        className="fixed bottom-20 right-4 z-40 md:bottom-6"
        aria-label={primaryLabel}
      >
        {content}
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 md:bottom-6">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Action Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-16 right-0 space-y-3"
            >
              {actions.map((action, index) => (
                <motion.div
                  key={action.href}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={action.href}
                    className="flex items-center gap-3 whitespace-nowrap"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-sm font-medium text-white bg-gray-900/80 backdrop-blur px-3 py-1.5 rounded-lg shadow">
                      {action.label}
                    </span>
                    <div className={`w-12 h-12 rounded-full ${action.color || 'bg-orange-500'} flex items-center justify-center shadow-lg text-white`}>
                      {action.icon}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
          isOpen 
            ? "bg-gray-800" 
            : "bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-500/30"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X size={24} className="text-white" strokeWidth={2} />
          ) : (
            <Plus size={24} className="text-white" strokeWidth={2.5} />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}
