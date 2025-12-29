"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Only scroll to top if pathname actually changed (not just params)
    // Skip for dashboard routes to avoid issues
    if (prevPathname.current !== pathname && !pathname.startsWith("/dashboard")) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    prevPathname.current = pathname;
  }, [pathname]);

  return null;
}
