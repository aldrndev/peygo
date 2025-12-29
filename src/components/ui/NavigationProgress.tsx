"use client";

import { useEffect, useRef, useState, Suspense, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function useNavigationState() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return `${pathname}?${searchParams.toString()}`;
}

function NavigationProgressInner() {
  const routeKey = useNavigationState();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const isNavigatingRef = useRef(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevRouteKeyRef = useRef(routeKey);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const completeProgress = useCallback(() => {
    // Clear interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
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
    if (prevRouteKeyRef.current !== routeKey && isNavigatingRef.current) {
      prevRouteKeyRef.current = routeKey;
      queueMicrotask(() => {
        completeProgress();
      });
    } else {
      prevRouteKeyRef.current = routeKey;
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [routeKey, completeProgress]);

  // Timeout fallback - if navigation takes too long or same page, complete after 3s
  useEffect(() => {
    if (isNavigatingRef.current && startTimeRef.current > 0) {
      const fallbackTimeout = setTimeout(() => {
        if (isNavigatingRef.current) {
          queueMicrotask(() => {
            completeProgress();
          });
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
      // Same page - don't show progress or show briefly then hide
      return;
    }
    
    if (isNavigatingRef.current) return;
    
    isNavigatingRef.current = true;
    startTimeRef.current = Date.now();
    setIsVisible(true);
    setProgress(0);
    
    // Small delay then start progress
    setTimeout(() => {
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
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}
