"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSetting } from "@/contexts/SettingsContext";

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
  userRole: string;
}

export function SidebarHeader({ collapsed, onToggle, userRole }: SidebarHeaderProps) {
  const platformName = useSetting("platform_name");
  
  return (
    <div className={cn(
      "flex items-center h-20 px-4 border-b border-border transition-all duration-200",
      collapsed && "justify-center"
    )}>
      <Link href="/dashboard" className={cn(
        "flex flex-col px-2",
        collapsed ? "items-center" : "items-start"
      )}>
        {collapsed ? (
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
            {platformName.charAt(0)}
          </div>
        ) : (
          <>
            <span className="text-3xl font-bold tracking-tighter leading-none">
              <span className="text-primary">{platformName.slice(0, 3)}</span><span className="text-foreground">{platformName.slice(3)}</span>
            </span>
            {userRole === "admin" && (
              <span className="text-[10px] uppercase tracking-wide text-primary font-semibold bg-primary/10 px-1.5 py-0.5 rounded-md w-fit mt-1">
                Admin
              </span>
            )}
          </>
        )}
      </Link>
      
      {!collapsed && (
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hidden lg:flex text-muted-foreground hover:text-foreground"
          onClick={onToggle}
          aria-label="Collapse sidebar"
        >
          <ChevronLeft size={18} />
        </Button>
      )}
      {collapsed && (
        <Button
          variant="outline"
          size="icon"
          className="hidden lg:flex absolute -right-4 top-8 h-7 w-7 rounded-lg z-50"
          onClick={onToggle}
          aria-label="Expand sidebar"
        >
          <ChevronRight size={16} />
        </Button>
      )}
    </div>
  );
}
