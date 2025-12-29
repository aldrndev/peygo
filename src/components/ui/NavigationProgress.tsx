"use client";

import { useEffect, useRef, useState, Suspense, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

// Custom hook for navigation state that doesn't trigger lint errors
function useNavigationState() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Create a stable key for route changes
  const routeKey = `${pathname}?${searchParams.toString()}`;
  
  return routeKey;
}

function NavigationProgressInner() {
  const routeKey = useNavigationState();
  const [progress, setProgress] = useState(0);
  const isNavigatingRef = useRef(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevRouteKeyRef = useRef(routeKey);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle route change - schedule state update
  useEffect(() => {
    if (prevRouteKeyRef.current !== routeKey && isNavigatingRef.current) {
      prevRouteKeyRef.current = routeKey;
      isNavigatingRef.current = false;
      
      // Schedule the state update in a microtask to avoid sync setState in effect
      queueMicrotask(() => {
        setProgress(100);
        timeoutRef.current = setTimeout(() => {
          setProgress(0);
        }, 200);
      });
    } else {
      prevRouteKeyRef.current = routeKey;
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [routeKey]);

  const handleStart = useCallback(() => {
    if (isNavigatingRef.current) return;
    
    isNavigatingRef.current = true;
    setProgress(10);
    
    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    // Simulate progress
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          return 90;
        }
        return prev + 10;
      });
    }, 100);
  }, []);

  useEffect(() => {
    // Listen for link clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (anchor) {
        const href = anchor.getAttribute("href");
        // Only show for internal navigation (not hash links, not external)
        if (href && href.startsWith("/") && !href.startsWith("/#") && !anchor.hasAttribute("target")) {
          handleStart();
        }
      }
    };

    document.addEventListener("click", handleClick, true);
    
    return () => {
      document.removeEventListener("click", handleClick, true);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [handleStart]);

  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent pointer-events-none">
      <div
        className={cn(
          "h-full bg-primary transition-all duration-200 ease-out",
          progress === 100 && "opacity-0"
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}
