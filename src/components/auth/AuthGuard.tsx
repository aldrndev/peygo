"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/hooks/useSession";

interface AuthGuardProps {
  children: ReactNode;
}



export function AuthGuard({ children }: AuthGuardProps) {
  const { user, profile, isLoading, isProfileComplete } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [hasChecked, setHasChecked] = useState(false);
  const isRedirecting = useRef(false);

  // Use primitive values for deps
  const userId = user?.id ?? null;
  const userRole = profile?.role ?? "user";

  // CRITICAL FIX #1: Reset redirect lock on route change
  useEffect(() => {
    isRedirecting.current = false;
    setHasChecked(false);
  }, [pathname]);

  useEffect(() => {
    // Wait for auth to be ready
    if (isLoading) return;
    
    // Skip if already redirecting
    if (isRedirecting.current) return;



    // Not authenticated
    if (!userId) {
      if (pathname !== "/masuk") {
        isRedirecting.current = true;
        router.replace("/masuk");
        return;
      }
    }
    // Profile incomplete
    else if (!isProfileComplete) {
      if (pathname !== "/dashboard/onboarding") {
        isRedirecting.current = true;
        router.replace("/dashboard/onboarding");
        return;
      }
    }
    // Admin user
    else if (userRole === "admin") {
      const userOnlyPaths = ["/dashboard/penjualan", "/dashboard/pembayaran", "/dashboard/supplier", "/dashboard/invoice"];
      const isUserOnlyRoute = userOnlyPaths.some(p => pathname === p || pathname.startsWith(p + "/"));
      
      if (pathname === "/dashboard") {
        isRedirecting.current = true;
        router.replace("/dashboard/admin");
        return;
      } else if (isUserOnlyRoute) {
        isRedirecting.current = true;
        router.replace("/dashboard/admin");
        return;
      }
    }
    // Regular user
    else {
      if (pathname.startsWith("/dashboard/admin")) {
        isRedirecting.current = true;
        router.replace("/dashboard");
        return;
      }
    }

    // All checks passed - mark as checked
    setHasChecked(true);

  }, [isLoading, userId, userRole, isProfileComplete, pathname, router]);

  // CRITICAL FIX #2: Use hasChecked for render gate
  if (isLoading || !hasChecked) {
    return null;
  }

  return <>{children}</>;
}
