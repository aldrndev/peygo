"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Scroll to top on every route change
    if (prevPathname.current !== pathname) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    prevPathname.current = pathname;
  }, [pathname]);

  return null;
}
