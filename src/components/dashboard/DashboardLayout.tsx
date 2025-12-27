"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Avatar, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { logout } from "@/app/(auth)/actions";
import { useForm } from "react-hook-form";
import { 
  User, 
  LogOut, 
  ScrollText, 
  CreditCard, 
  Truck, 
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  BarChart3,
  Bell,
  ChevronLeft,
  Search,
  ChevronRight
} from "lucide-react";
import { UserRole } from "@/types/database";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: UserRole;
  userName?: string;
}

export default function DashboardLayout({
  children,
  userRole = "user",
  userName = "User"
}: DashboardLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      search: "",
    }
  });

  const onSearchSubmit = (data: { search: string }) => {
    if (!data.search) return;
    // Simple redirect to penagihan for now as a fallback search
    router.push(`/dashboard/penagihan?search=${encodeURIComponent(data.search)}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Navigation items based on role
  const userNavItems = [
    { href: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard", exact: true },
    { href: "/dashboard/penagihan", icon: <ScrollText size={20} />, label: "Penagihan" },
    { href: "/dashboard/pembayaran", icon: <CreditCard size={20} />, label: "Pembayaran" },
    { href: "/dashboard/supplier", icon: <Truck size={20} />, label: "Supplier" },
    { href: "/dashboard/profil", icon: <User size={20} />, label: "Profil" },
  ];

  const adminNavItems = [
    { href: "/dashboard/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard", exact: true },
    { href: "/dashboard/admin/users", icon: <Users size={20} />, label: "Pengguna" },
    { href: "/dashboard/admin/invoices", icon: <FileText size={20} />, label: "Semua Invoice" },
    { href: "/dashboard/admin/reports", icon: <BarChart3 size={20} />, label: "Laporan" },
    { href: "/dashboard/admin/settings", icon: <Settings size={20} />, label: "Pengaturan" },
  ];

  const navItems = userRole === "admin" ? adminNavItems : userNavItems;
  // Mobile nav: Dashboard, Tagihan, Pembayaran, Supplier
  const mobileNavItems = userRole === "admin" 
    ? navItems.slice(0, 4)
    : [
        userNavItems[0], // Dashboard
        userNavItems[1], // Penagihan
        userNavItems[2], // Pembayaran
        userNavItems[3], // Supplier
      ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const getPageTitle = (path: string): string => {
    const titles: Record<string, string> = {
      "/dashboard": "Dashboard",
      "/dashboard/penagihan": "Penagihan",
      "/dashboard/pembayaran": "Pembayaran",
      "/dashboard/supplier": "Supplier",
      "/dashboard/profil": "Profil",
      "/dashboard/admin": "Admin Dashboard",
      "/dashboard/admin/users": "Pengguna",
      "/dashboard/admin/invoices": "Semua Invoice",
      "/dashboard/admin/reports": "Laporan",
      "/dashboard/admin/settings": "Pengaturan",
    };

    // Check for exact match first
    if (titles[path]) return titles[path];

    // Check for parent path match
    for (const [key, value] of Object.entries(titles)) {
      if (path.startsWith(key + "/")) return value;
    }

    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden relative">
      {/* Subtle Aurora Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-orange-200/20 blur-[100px]"
        />
        <motion.div 
          animate={{
            scale: [1.1, 1, 1.1],
            x: [0, -20, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-200/10 blur-[100px]"
        />
      </div>

      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex fixed inset-y-0 left-0 z-40 flex-col bg-white border-r border-slate-200 transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo Section */}
        <div className={`flex items-center h-20 px-4 border-b border-slate-100 transition-all duration-300 ${sidebarCollapsed ? "justify-center" : ""}`}>
          <Link href="/dashboard" className={`flex flex-col ${sidebarCollapsed ? "items-center" : "items-start"} justify-center px-2`}>
            {sidebarCollapsed ? (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/20">
                P
              </div>
            ) : (
              <>
                <span className="text-3xl font-bold tracking-tighter leading-none">
                  <span className="text-orange-500">Pey</span><span className="text-black">Go</span>
                </span>
                {userRole === "admin" && (
                  <span className="text-[10px] uppercase tracking-widest text-orange-600 font-bold bg-orange-100/50 px-1.5 py-0.5 rounded-md w-fit mt-1">
                    Admin
                  </span>
                )}
              </>
            )}
          </Link>
          
          {!sidebarCollapsed && (
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="ml-auto hidden lg:flex text-slate-400 hover:text-slate-900 hover:bg-slate-100/50 rounded-xl"
              onPress={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <ChevronLeft 
                size={18} 
                className={`transition-transform duration-300 ${sidebarCollapsed ? "rotate-180" : ""}`} 
              />
            </Button>
          )}
          {sidebarCollapsed && (
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="hidden lg:flex text-slate-400 hover:text-slate-900 absolute -right-4 top-8 bg-white border border-slate-200 rounded-lg shadow-sm z-50 h-7 w-7 transition-all hover:scale-110"
              onPress={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <ChevronRight size={16} />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <div className="space-y-1.5 px-3">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <div key={item.href} className="px-1">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative ${
                      active 
                        ? "bg-orange-50 text-orange-600" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                    }`}
                  >
                    <span className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${active ? "text-orange-600" : "text-slate-400 group-hover:text-slate-900"}`}>
                      {item.icon}
                    </span>
                    {!sidebarCollapsed && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`font-semibold text-xs uppercase tracking-widest ${active ? "text-orange-600" : "text-slate-500 group-hover:text-slate-900"}`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                    {active && (
                       <motion.div 
                         layoutId="active-nav-indicator"
                         className="absolute left-0 w-1 h-6 rounded-r-full bg-orange-600"
                       />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className={`transition-all duration-300 ${
            sidebarCollapsed ? "flex justify-center" : ""
          }`}>
            {sidebarCollapsed ? (
              <Avatar 
                name={userName} 
                size="sm" 
                className="bg-orange-100 text-orange-600 shadow-inner rounded-xl" 
              />
            ) : isMounted ? (
              <Dropdown placement="top-start" className="min-w-[200px] bg-white border border-slate-200 shadow-2xl rounded-2xl">
                <DropdownTrigger>
                  <Button variant="light" className="w-full justify-start h-auto py-2 px-2 hover:bg-transparent">
                    <div className="flex items-center gap-3 w-full">
                      <div className="relative">
                        <Avatar name={userName} size="sm" className="bg-orange-100 text-orange-600 ring-2 ring-white shadow-sm rounded-xl" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate tracking-tight">{userName}</p>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest leading-none mt-1">{userRole}</p>
                      </div>
                    </div>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="User menu" variant="flat" className="p-2">
                  <DropdownItem 
                    key="profile" 
                    href="/dashboard/profil" 
                    startContent={<User size={16} className="text-orange-500" />}
                    className="rounded-xl py-3"
                  >
                    <span className="font-bold text-xs">Profil Saya</span>
                  </DropdownItem>
                  <DropdownItem 
                    key="logout" 
                    color="danger" 
                    className="rounded-xl py-3 text-rose-600"
                    startContent={<LogOut size={16} />}
                    onPress={async () => await logout()}
                  >
                    <span className="font-bold text-xs text-rose-600">Keluar Sekarang</span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <div className="flex items-center gap-3 p-2">
                <Avatar name={userName} size="sm" className="bg-orange-100 text-orange-600 rounded-xl" />
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{userRole}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 inset-x-0 z-50 h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <span className="text-2xl font-bold tracking-tighter leading-none">
            <span className="text-orange-500">Pey</span><span className="text-black">Go</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Button isIconOnly variant="light" size="sm" className="text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all">
            <Bell size={20} />
          </Button>
          
          {isMounted ? (
            <Dropdown placement="bottom-end" className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl">
              <DropdownTrigger>
                <Button isIconOnly variant="light" size="sm" className="hover:bg-orange-50 transition-colors rounded-xl">
                  <Avatar name={userName} size="sm" className="bg-orange-100 text-orange-600 w-8 h-8 ring-2 ring-white rounded-lg shadow-sm" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu" variant="flat" className="p-2">
                <DropdownItem key="name" isReadOnly className="opacity-100 py-3 border-b border-slate-100/50">
                  <p className="font-bold text-slate-900 text-xs">{userName}</p>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest leading-none mt-1">{userRole}</p>
                </DropdownItem>
                <DropdownItem key="profile" href="/dashboard/profil" startContent={<User size={16} className="text-orange-500" />} className="rounded-xl py-3">
                  <span className="font-bold text-xs">Profil Saya</span>
                </DropdownItem>
                <DropdownItem 
                  key="logout" 
                  color="danger" 
                  className="rounded-xl py-3 text-rose-600"
                  startContent={<LogOut size={16} />}
                  onPress={async () => await logout()}
                >
                  <span className="font-bold text-xs text-rose-600">Keluar</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Avatar name={userName} size="sm" className="bg-orange-100 text-orange-600 w-8 h-8 rounded-lg" />
          )}
        </div>
      </header>

      {/* Desktop Header */}
      <header 
        className={`hidden md:flex fixed top-0 right-0 z-30 h-20 bg-white border-b border-slate-100 items-center justify-between px-8 transition-all duration-300 ${
          sidebarCollapsed ? "left-20" : "left-64"
        }`}
      >
        {/* Breadcrumb / Page Title */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-[0.2em]">Workspace</span>
          <ChevronRight size={12} className="text-slate-300" />
          <h2 className="text-xl font-bold text-slate-900 tracking-tighter">
            {getPageTitle(pathname)}
          </h2>
        </div>

        {/* Global Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-12">
          <form onSubmit={handleSubmit(onSearchSubmit)} className="relative w-full group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
              <Search size={18} />
            </div>
            <input 
              {...register("search")}
              type="text"
              placeholder="Cari transaksi..."
              className="w-full bg-white border border-slate-200 text-sm font-semibold rounded-2xl py-3.5 pl-12 pr-16 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium"
            />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-lg shadow-sm pointer-events-none uppercase tracking-widest">
              ⌘ K
            </kbd>
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-5">
          {/* Notification */}
          <Button isIconOnly variant="flat" size="lg" className="bg-white/40 border border-white/60 text-slate-400 hover:text-orange-500 hover:bg-white rounded-2xl transition-all h-12 w-12 shadow-sm">
            <div className="relative">
              <Bell size={20} />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 border-2 border-white rounded-full shadow-sm" />
            </div>
          </Button>

          {/* User Section */}
          <div className="h-8 w-px bg-slate-200/50 mx-1" />
          
          {isMounted ? (
            <Dropdown placement="bottom-end" className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl">
              <DropdownTrigger>
                <div className="group cursor-pointer">
                  <Avatar 
                    name={userName} 
                    size="sm" 
                    className="bg-orange-100 text-orange-600 ring-2 ring-transparent group-hover:ring-orange-200 transition-all shadow-sm rounded-xl w-10 h-10" 
                  />
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu" variant="flat" className="p-2">
                <DropdownItem key="name" isReadOnly className="opacity-100 py-3 border-b border-slate-100/50">
                  <p className="font-bold text-slate-900 text-xs">{userName}</p>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest leading-none mt-1">{userRole}</p>
                </DropdownItem>
                <DropdownItem 
                  key="profile" 
                  href="/dashboard/profil" 
                  startContent={<User size={16} className="text-orange-500" />}
                  className="rounded-xl py-3"
                >
                  <span className="font-bold text-xs">Profil Saya</span>
                </DropdownItem>
                <DropdownItem 
                  key="logout" 
                  color="danger" 
                  className="rounded-xl py-3 text-rose-600"
                  startContent={<LogOut size={16} />}
                  onPress={async () => await logout()}
                >
                  <span className="font-bold text-xs text-rose-600">Keluar</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Avatar name={userName} size="sm" className="bg-orange-100 text-orange-600 rounded-xl w-10 h-10" />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main 
        className={`min-h-screen pt-20 pb-40 md:pt-20 md:pb-0 transition-all duration-300 relative z-10 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "circOut" }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-6 inset-x-6 z-50 bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[24px]">
        <div className="flex items-center justify-between h-16 w-full px-6">
          {/* Left items */}
          {mobileNavItems.slice(0, 2).map((item) => (
            <MobileTabItem 
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={isActive(item.href, item.exact)}
            />
          ))}

          {/* Center Profile Button (Replaces FAB) */}
          <Link 
            href="/dashboard/profil"
            className="relative -mt-8"
          >
            <motion.div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl bg-gradient-to-br from-orange-500 to-orange-600 ring-4 ring-slate-900"
              whileTap={{ scale: 0.95 }}
            >
              <User 
                size={28} 
                className="text-white"
              />
            </motion.div>
          </Link>

          {/* Right items */}
          {mobileNavItems.slice(2, 4).map((item) => (
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
    </div>
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
      className="flex flex-col items-center justify-center min-w-[56px] py-1"
    >
      <motion.div
        className={`p-1.5 rounded-lg transition-colors ${
          active ? "text-orange-600 bg-orange-50" : "text-gray-400"
        }`}
        whileTap={{ scale: 0.9 }}
      >
        {icon}
      </motion.div>
      <span className={`text-xs mt-0.5 font-bold ${
        active ? "text-orange-600" : "text-gray-400"
      }`}>
        {label}
      </span>
    </Link>
  );
}
