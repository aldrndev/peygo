"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ScrollText, 
  CreditCard, 
  User,
  Truck,
  ChevronLeft,
  LogOut
} from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useLoadingOverlay } from "@/components/ui/LoadingOverlay";
import { useSetting } from "@/contexts/SettingsContext";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
}

interface SidebarProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

const navItems: NavItem[] = [
  { href: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard", exact: true },
  { href: "/dashboard/penjualan", icon: <ScrollText size={20} />, label: "Penjualan" },
  { href: "/dashboard/pembayaran", icon: <CreditCard size={20} />, label: "Pembayaran" },
  { href: "/dashboard/supplier", icon: <Truck size={20} />, label: "Supplier" },
  { href: "/dashboard/profil", icon: <User size={20} />, label: "Profil" },
];

export default function Sidebar({ 
  userName = "User",
  userEmail = "",
  collapsed = false,
  onToggle
}: SidebarProps) {
  const pathname = usePathname();
  const loadingOverlay = useLoadingOverlay();
  const platformName = useSetting("platform_name");

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const initials = userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    loadingOverlay.show("Keluar...");
    const result = await logout();
    if (result?.success) {
      await new Promise(resolve => setTimeout(resolve, 100));
      window.location.href = "/masuk";
    }
  };

  return (
    <aside 
      className={cn(
        "hidden md:flex fixed inset-y-0 left-0 z-40 flex-col bg-card border-r border-border transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
            {platformName.charAt(0)}
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-foreground">
              {platformName}
            </span>
          )}
        </Link>
        
        {/* Collapse Toggle */}
        {onToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-8 w-8"
            onClick={onToggle}
          >
            <ChevronLeft 
              size={18} 
              className={cn("text-muted-foreground transition-transform", collapsed && "rotate-180")} 
            />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-1 px-3">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                  active 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                <span className={cn("shrink-0", active ? "text-primary" : "text-muted-foreground")}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="font-medium text-sm">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        {collapsed ? (
          <div className="flex justify-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-foreground text-background text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-foreground text-background text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive h-8 w-8"
              onClick={handleLogout}
            >
              <LogOut size={18} />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
