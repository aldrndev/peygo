"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavItem } from "./sidebar-nav";

interface MobileNavProps {
  items: NavItem[];
  pathname: string;
}

export function MobileNav({ items, pathname }: MobileNavProps) {
  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav 
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-foreground/95 backdrop-blur-xl border-t border-border/20 shadow-lg" 
      style={{ paddingBottom: "var(--safe-area-inset-bottom, 0px)" }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch h-16 px-1">
        {items.map((item) => (
          <MobileTabItem 
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={isActive(item.href, item.exact)}
          />
        ))}
      </div>
    </nav>
  );
}

function MobileTabItem({ 
  href, 
  icon, 
  label, 
  active 
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  active: boolean;
}) {
  return (
    <Link 
      href={href}
      aria-current={active ? "page" : undefined}
      className="flex-1 flex flex-col items-center justify-center py-2 relative group"
    >
      {/* Active indicator */}
      {active && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full" />
      )}
      
      <div className={cn(
        "p-1.5 rounded-xl transition-all duration-200",
        active 
          ? "text-primary bg-primary/20 scale-105" 
          : "text-background/70 group-active:scale-95"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-[10px] font-medium mt-0.5 transition-colors",
        active ? "text-primary" : "text-background/70"
      )}>
        {label}
      </span>
    </Link>
  );
}
