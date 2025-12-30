"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams(); // Add searchParams detection
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const isNavigatingRef = useRef(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevPathnameRef = useRef(pathname);
  const prevSearchParamsRef = useRef(searchParams?.toString());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeoutRef = useRef<NodeJS.Timeout | null>(null); // New ref for start delay
  const startTimeRef = useRef<number>(0);

  const completeProgress = useCallback(() => {
    // Clear interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    // Clear start timeout to prevent overwriting 100% with 30%
    if (startTimeoutRef.current) {
      clearTimeout(startTimeoutRef.current);
      startTimeoutRef.current = null;
    }
    
    isNavigatingRef.current = false;
    setProgress(100);
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setProgress(0), 300);
    }, 300);
  }, []);

  // Handle route change complete
  useEffect(() => {
    const searchParamsString = searchParams?.toString();
    if (prevPathnameRef.current !== pathname || prevSearchParamsRef.current !== searchParamsString) {
      // Route actually changed
      if (isNavigatingRef.current) {
         completeProgress();
      }
      prevPathnameRef.current = pathname;
      prevSearchParamsRef.current = searchParamsString;
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname, searchParams, completeProgress]);

  // Timeout fallback - if navigation takes too long, complete after 3s
  useEffect(() => {
    if (isNavigatingRef.current && startTimeRef.current > 0) {
      const fallbackTimeout = setTimeout(() => {
        if (isNavigatingRef.current) {
           completeProgress();
        }
      }, 3000);
      
      return () => clearTimeout(fallbackTimeout);
    }
  }, [progress, completeProgress]);

  const handleStart = useCallback((targetHref: string) => {
    // Check if navigating to same page
    const currentPath = window.location.pathname;
    const targetPath = targetHref.split("?")[0].split("#")[0];
    
    if (currentPath === targetPath) {
      // Same page - but check if we have query params that differ? 
      // Simplified: Just return for now to match original logic
      return;
    }
    
    // Skip progress bar for dashboard routes (they have skeleton loading)
    if (targetPath.startsWith("/dashboard")) {
      return;
    }
    
    if (isNavigatingRef.current) return;
    
    isNavigatingRef.current = true;
    startTimeRef.current = Date.now();
    setIsVisible(true);
    setProgress(0);
    
    // Clear any existing start timeout
    if (startTimeoutRef.current) {
      clearTimeout(startTimeoutRef.current);
    }

    // Small delay then start progress
    startTimeoutRef.current = setTimeout(() => {
      setProgress(30);
    }, 50);
    
    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    // Smooth incremental progress with decreasing speed
    let currentProgress = 30;
    progressIntervalRef.current = setInterval(() => {
      const increment = Math.max(1, (90 - currentProgress) / 10);
      currentProgress = Math.min(90, currentProgress + increment);
      setProgress(currentProgress);
      
      if (currentProgress >= 90) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      }
    }, 200);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href && href.startsWith("/") && !href.startsWith("/#") && !anchor.hasAttribute("target")) {
          handleStart(href);
        }
      }
    };

    document.addEventListener("click", handleClick, true);
    
    return () => {
      document.removeEventListener("click", handleClick, true);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (startTimeoutRef.current) {
        clearTimeout(startTimeoutRef.current);
      }
    };
  }, [handleStart]);

  if (!isVisible && progress === 0) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none"
      style={{ 
        opacity: isVisible ? 1 : 0,
        transition: "opacity 300ms ease-out"
      }}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 bg-primary/30 blur-sm"
        style={{ 
          width: `${progress}%`,
          transition: "width 400ms cubic-bezier(0.4, 0, 0.2, 1)"
        }}
      />
      {/* Main bar */}
      <div 
        className="h-full bg-primary relative"
        style={{ 
          width: `${progress}%`,
          transition: "width 400ms cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 0 10px var(--primary), 0 0 5px var(--primary)"
        }}
      >
        {/* Shimmer effect */}
        <div 
          className="absolute right-0 top-0 h-full w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{
            animation: progress < 100 ? "shimmer 1.5s infinite" : "none"
          }}
        />
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export function NavigationProgress() {
  return <NavigationProgressInner />;
}
