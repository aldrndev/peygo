"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/(auth)/actions";
import { useForm } from "react-hook-form";
import { 
  User, 
  ScrollText, 
  CreditCard, 
  Truck, 
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  BarChart3,
  Bell,
  Search,
  ChevronRight,
  Shield
} from "lucide-react";
import { UserRole } from "@/types/database";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { SidebarHeader } from "@/components/layout/sidebar-header";
import { SidebarNav, type NavItem } from "@/components/layout/sidebar-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { useLoadingOverlay } from "@/components/ui/LoadingOverlay";
import { MobileNav } from "@/components/layout/mobile-nav";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: UserRole;
  userName?: string;
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/penjualan": "Penjualan",
  "/dashboard/pembayaran": "Pembayaran",
  "/dashboard/supplier": "Supplier",
  "/dashboard/profil": "Profil",
  "/dashboard/admin": "Admin Dashboard",
  "/dashboard/admin/users": "Pengguna",
  "/dashboard/admin/invoices": "Semua Invoice",
  "/dashboard/admin/reports": "Laporan",
  "/dashboard/admin/audit-logs": "Audit Logs",
  "/dashboard/admin/settings": "Pengaturan",
};

export default function DashboardLayout({
  children,
  userRole = "user",
  userName = "User"
}: DashboardLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { register, handleSubmit } = useForm({ defaultValues: { search: "" } });

  const onSearchSubmit = (data: { search: string }) => {
    if (!data.search) return;
    router.push(`/dashboard/penjualan?search=${encodeURIComponent(data.search)}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const loadingOverlay = useLoadingOverlay();

  const handleLogout = async () => {
    loadingOverlay.show("Keluar...");
    const result = await logout();
    if (result?.success) {
      // Hard redirect - router.push may not work after session cleared
      window.location.href = "/masuk";
    }
  };

  const getPageTitle = (path: string): string => {
    if (PAGE_TITLES[path]) return PAGE_TITLES[path];
    for (const [key, value] of Object.entries(PAGE_TITLES)) {
      if (path.startsWith(key + "/")) return value;
    }
    return "Dashboard";
  };

  // Navigation items
  const userNavItems: NavItem[] = [
    { href: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard", exact: true },
    { href: "/dashboard/penjualan", icon: <ScrollText size={20} />, label: "Penjualan" },
    { href: "/dashboard/pembayaran", icon: <CreditCard size={20} />, label: "Pembayaran" },
    { href: "/dashboard/supplier", icon: <Truck size={20} />, label: "Supplier" },
    { href: "/dashboard/profil", icon: <User size={20} />, label: "Profil" },
  ];

  const adminNavItems: NavItem[] = [
    { href: "/dashboard/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard", exact: true },
    { href: "/dashboard/admin/users", icon: <Users size={20} />, label: "Pengguna" },
    { href: "/dashboard/admin/invoices", icon: <FileText size={20} />, label: "Semua Invoice" },
    { href: "/dashboard/admin/reports", icon: <BarChart3 size={20} />, label: "Laporan" },
    { href: "/dashboard/admin/audit-logs", icon: <Shield size={20} />, label: "Audit Logs" },
    { href: "/dashboard/admin/settings", icon: <Settings size={20} />, label: "Pengaturan" },
  ];

  const navItems = userRole === "admin" ? adminNavItems : userNavItems;
  const mobileNavItems = navItems;

  return (
    <div className="min-h-screen bg-background relative">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[10%] -right-[10%] w-[30%] h-[30%] rounded-full bg-secondary blur-3xl" />
      </div>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex fixed inset-y-0 left-0 z-40 flex-col bg-card border-r border-border transition-[width] duration-200",
        sidebarCollapsed ? "w-20" : "w-64"
      )} aria-label="Main navigation">
        <SidebarHeader 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          userRole={userRole} 
        />
        <SidebarNav items={navItems} pathname={pathname} collapsed={sidebarCollapsed} />
        <div className="p-4 border-t border-border">
          <div className={cn("transition-all duration-200", sidebarCollapsed && "flex justify-center")}>
            <UserMenu 
              userName={userName} 
              userRole={userRole} 
              collapsed={sidebarCollapsed}
              isMounted={isMounted}
              onLogout={handleLogout}
              variant="sidebar"
            />
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 inset-x-0 z-50 h-16 bg-card border-b border-border px-6 flex items-center justify-between">
        <Link href="/dashboard">
          <span className="text-2xl font-bold tracking-tighter">
            <span className="text-primary">Pey</span><span className="text-foreground">Go</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-muted-foreground" aria-label="Notifications">
            <Bell size={20} />
          </Button>
          <UserMenu userName={userName} userRole={userRole} isMounted={isMounted} onLogout={handleLogout} variant="mobile" />
        </div>
      </header>

      {/* Desktop Header */}
      <header className={cn(
        "hidden md:flex fixed top-0 right-0 z-30 h-20 bg-card border-b border-border items-center justify-between px-8 transition-[left] duration-200",
        sidebarCollapsed ? "left-20" : "left-64"
      )}>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Workspace</span>
          <ChevronRight size={12} className="text-muted-foreground/50" />
          <h2 className="text-xl font-semibold text-foreground">{getPageTitle(pathname)}</h2>
        </div>

        <div className="hidden lg:flex items-center flex-1 max-w-md mx-12">
          <form onSubmit={handleSubmit(onSearchSubmit)} className="relative w-full" role="search">
            <label htmlFor="search-input" className="sr-only">Cari transaksi</label>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground">
              <Search size={18} />
            </div>
            <Input {...register("search")} id="search-input" placeholder="Cari transaksi..." className="pl-12 pr-16 h-11" />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-medium text-muted-foreground bg-muted border border-border rounded pointer-events-none">⌘ K</kbd>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="relative" aria-label="Notifications">
            <Bell size={20} />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary border-2 border-card rounded-full" />
          </Button>
          <div className="h-8 w-px bg-border mx-1" />
          <UserMenu userName={userName} userRole={userRole} isMounted={isMounted} onLogout={handleLogout} variant="header" />
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className={cn(
        "min-h-screen pt-20 pb-32 md:pt-20 md:pb-0 transition-[margin-left] duration-200 relative z-10",
        sidebarCollapsed ? "md:ml-20" : "md:ml-64"
      )}>
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto">{children}</div>
      </main>

      {/* Mobile Nav */}
      <MobileNav 
        items={mobileNavItems} 
        pathname={pathname} 
      />
    </div>
  );
}
