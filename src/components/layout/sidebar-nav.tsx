"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
}

interface SidebarNavProps {
  items: NavItem[];
  pathname: string;
  collapsed: boolean;
}

export function SidebarNav({ items, pathname, collapsed }: SidebarNavProps) {
  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav className="flex-1 py-6 overflow-y-auto" aria-label="Dashboard navigation">
      <div className="space-y-1 px-3">
        {items.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <div key={item.href} className="px-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors relative",
                  active 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <span className={cn(
                  "shrink-0",
                  active ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className={cn(
                    "font-medium text-sm",
                    active ? "text-primary" : "text-muted-foreground"
                  )}>
                    {item.label}
                  </span>
                )}
                {active && (
                  <div className="absolute left-0 w-1 h-6 rounded-r-full bg-primary" />
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
