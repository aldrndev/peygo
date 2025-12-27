"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  ScrollText, 
  CreditCard, 
  User,
  Truck,
  ChevronLeft,
  LogOut
} from "lucide-react";
import { Avatar, Button } from "@heroui/react";
import { logout } from "@/app/(auth)/actions";

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
  { href: "/dashboard/penagihan", icon: <ScrollText size={20} />, label: "Penagihan" },
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

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside 
      className={`hidden md:flex fixed inset-y-0 left-0 z-40 flex-col bg-white border-r border-gray-100 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
            P
          </div>
          {!collapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-gray-900"
            >
              PeyGo
            </motion.span>
          )}
        </Link>
        
        {/* Collapse Toggle */}
        {onToggle && (
          <Button
            isIconOnly
            variant="light"
            size="sm"
            className="ml-auto"
            onPress={onToggle}
          >
            <ChevronLeft 
              size={18} 
              className={`text-gray-400 transition-transform ${collapsed ? "rotate-180" : ""}`} 
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  active 
                    ? "bg-orange-50 text-orange-600" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className={`shrink-0 ${active ? "text-orange-600" : "text-gray-400"}`}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-100">
        {collapsed ? (
          <div className="flex justify-center">
            <Avatar name={userName} size="sm" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar name={userName} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            </div>
            <form action={logout}>
              <Button
                type="submit"
                isIconOnly
                variant="light"
                size="sm"
                className="text-gray-400 hover:text-red-500"
              >
                <LogOut size={18} />
              </Button>
            </form>
          </div>
        )}
      </div>
    </aside>
  );
}
