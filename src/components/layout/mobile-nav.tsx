"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavItem } from "./sidebar-nav";

interface MobileNavProps {
  items: NavItem[];
  pathname: string;
  profileIcon: React.ReactNode;
}

export function MobileNav({ items, pathname, profileIcon }: MobileNavProps) {
  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav 
      className="md:hidden fixed inset-x-6 z-50 bg-foreground/95 backdrop-blur-sm border border-border shadow-xl rounded-2xl" 
      style={{ bottom: "calc(1.5rem + var(--safe-area-inset-bottom, 0px))" }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-between h-16 w-full px-6">
        {/* Left items */}
        {items.slice(0, 2).map((item) => (
          <MobileTabItem 
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={isActive(item.href, item.exact)}
          />
        ))}

        {/* Center Profile Button */}
        <Link 
          href="/dashboard/profil"
          className="relative -mt-8"
          aria-label="Go to profile"
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl bg-primary ring-4 ring-foreground">
            {profileIcon}
          </div>
        </Link>

        {/* Right items */}
        {items.slice(2, 4).map((item) => (
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
      className="flex flex-col items-center justify-center min-w-[56px] py-1"
    >
      <div className={cn(
        "p-1.5 rounded-lg transition-colors",
        active ? "text-primary bg-primary/10" : "text-background/60"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-xs mt-0.5 font-medium",
        active ? "text-primary" : "text-background/60"
      )}>
        {label}
      </span>
    </Link>
  );
}
