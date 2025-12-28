"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ScrollText, 
  CreditCard, 
  User,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TabItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
}

interface BottomTabBarProps {
  items?: TabItem[];
  fabHref?: string;
  fabLabel?: string;
}

const defaultItems: TabItem[] = [
  { href: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Home", exact: true },
  { href: "/dashboard/penjualan", icon: <ScrollText size={20} />, label: "Penjualan" },
  { href: "/dashboard/pembayaran", icon: <CreditCard size={20} />, label: "Bayar" },
  { href: "/dashboard/profil", icon: <User size={20} />, label: "Profil" },
];

export default function BottomTabBar({ 
  items = defaultItems,
  fabHref = "/dashboard/penjualan/baru",
  fabLabel = "Buat"
}: BottomTabBarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Split items for left and right of FAB
  const leftItems = items.slice(0, 2);
  const rightItems = items.slice(2, 4);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden">
      {/* Background with blur */}
      <div className="absolute inset-0 bg-card/90 backdrop-blur-xl border-t border-border" />
      
      {/* Tab Items Container */}
      <div className="relative flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {/* Left Items */}
        {leftItems.map((item) => (
          <TabItem 
            key={item.href}
            {...item}
            active={isActive(item.href, item.exact)}
          />
        ))}

        {/* Center FAB */}
        <Link 
          href={fabHref}
          className="relative -mt-6"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform">
            <Plus size={24} className="text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium text-primary whitespace-nowrap">
            {fabLabel}
          </span>
        </Link>

        {/* Right Items */}
        {rightItems.map((item) => (
          <TabItem 
            key={item.href}
            {...item}
            active={isActive(item.href, item.exact)}
          />
        ))}
      </div>

      {/* Safe area padding for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-card/90" />
    </nav>
  );
}

function TabItem({ 
  href, 
  icon, 
  label, 
  active 
}: TabItem & { active: boolean }) {
  return (
    <Link 
      href={href}
      className="flex flex-col items-center justify-center min-w-[64px] h-full py-2"
    >
      <div
        className={cn(
          "p-1.5 rounded-xl transition-colors active:scale-90",
          active ? "text-primary bg-primary/10" : "text-muted-foreground"
        )}
      >
        {icon}
      </div>
      <span className={cn(
        "text-xs mt-0.5 font-medium",
        active ? "text-primary" : "text-muted-foreground"
      )}>
        {label}
      </span>
    </Link>
  );
}
