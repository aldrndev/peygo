"use client";

import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  userName: string;
  userRole: string;
  collapsed?: boolean;
  isMounted: boolean;
  onLogout: () => void;
  variant?: "sidebar" | "header" | "mobile";
}

export function UserMenu({ 
  userName, 
  userRole, 
  collapsed, 
  isMounted, 
  onLogout,
  variant = "sidebar" 
}: UserMenuProps) {
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const avatarSize = variant === "mobile" ? "h-8 w-8" : variant === "header" ? "h-10 w-10" : "h-9 w-9";
  const textSize = variant === "mobile" ? "text-xs" : "text-sm";

  if (collapsed && variant === "sidebar") {
    return (
      <Avatar className={cn(avatarSize, "bg-primary/10")}>
        <AvatarFallback className="text-primary font-medium text-sm">
          {getInitials(userName)}
        </AvatarFallback>
      </Avatar>
    );
  }

  if (!isMounted) {
    return (
      <div className={cn("flex items-center gap-3", variant === "sidebar" && "p-2")}>
        <Avatar className={cn(avatarSize, "bg-primary/10")}>
          <AvatarFallback className={cn("text-primary font-medium", textSize)}>
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
        {variant === "sidebar" && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{userName}</p>
            <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn(
          "rounded-full focus:outline-none",
          variant === "sidebar" && "w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors text-left",
          variant === "header" && "ring-2 ring-transparent hover:ring-primary/20 transition-all"
        )}>
          <div className={variant === "sidebar" ? "relative" : ""}>
            <Avatar className={cn(avatarSize, "bg-primary/10")}>
              <AvatarFallback className={cn("text-primary font-medium", textSize)}>
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            {variant === "sidebar" && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-card rounded-full" />
            )}
          </div>
          {variant === "sidebar" && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userName}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="font-medium">{userName}</p>
          <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profil" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profil Saya</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onLogout}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Keluar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
