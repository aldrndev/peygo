"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/hooks/useSession";

interface AuthGuardProps {
  children: ReactNode;
}



export function AuthGuard({ children }: AuthGuardProps) {
  const { user, profile, isLoading, isProfileComplete } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isRedirectingRef = useRef(false);

  // Use primitive values for deps
  const userId = user?.id ?? null;
  const userRole = profile?.role ?? "user";

  useEffect(() => {
    // Reset redirect lock when path changes (navigation complete)
    isRedirectingRef.current = false;
  }, [pathname]);

  // Derived State Logic (Pure)
  let isAuthorized = true;
  let redirectTarget: string | null = null;

  if (isLoading) {
    isAuthorized = false;
  } else if (!userId) {
    // Not logged in
    if (pathname !== "/masuk") {
      redirectTarget = "/masuk";
      isAuthorized = false;
    }
  } else if (!isProfileComplete) {
     // Profile incomplete
     if (pathname !== "/dashboard/onboarding") {
       redirectTarget = "/dashboard/onboarding";
       isAuthorized = false;
     }
  } else if (userRole === "admin") {
     const userOnlyPaths = ["/dashboard/penjualan", "/dashboard/pembayaran", "/dashboard/supplier", "/dashboard/invoice"];
     const isUserOnlyRoute = userOnlyPaths.some(p => pathname === p || pathname.startsWith(p + "/"));
     
     if (pathname === "/dashboard") {
       redirectTarget = "/dashboard/admin";
       isAuthorized = false;
     } else if (isUserOnlyRoute) {
       redirectTarget = "/dashboard/admin";
       isAuthorized = false;
     }
  } else {
     // Regular user
     if (pathname.startsWith("/dashboard/admin")) {
       redirectTarget = "/dashboard";
       isAuthorized = false;
     }
  }

  // Handle Redirect Side Effect
  useEffect(() => {
    if (redirectTarget && !isRedirectingRef.current) {
      isRedirectingRef.current = true;
      router.replace(redirectTarget);
    }
  }, [redirectTarget, router]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
