"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

interface LoadingOverlayContextType {
  show: (message?: string) => void;
  hide: () => void;
  isLoading: boolean;
}

const LoadingOverlayContext = createContext<LoadingOverlayContextType | null>(null);

export function useLoadingOverlay() {
  const context = useContext(LoadingOverlayContext);
  if (!context) {
    throw new Error("useLoadingOverlay must be used within LoadingOverlayProvider");
  }
  return context;
}

interface LoadingOverlayProviderProps {
  children: ReactNode;
}

export function LoadingOverlayProvider({ children }: LoadingOverlayProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const pathname = usePathname();

  const show = useCallback((msg?: string) => {
    setMessage(msg || "Memproses...");
    setIsLoading(true);
  }, []);

  const hide = useCallback(() => {
    setIsLoading(false);
    setMessage("");
  }, []);

  // Auto-hide when route changes (e.g., after redirect)
  useEffect(() => {
    if (isLoading) {
      hide();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <LoadingOverlayContext.Provider value={{ show, hide, isLoading }}>
      {children}
      
      {/* Overlay */}
      {isLoading && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/90 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Loading"
        >
          <div className="flex flex-col items-center gap-5">
            {/* Premium SVG Spinner */}
            <svg 
              className="w-12 h-12" 
              viewBox="0 0 50 50"
              style={{ animation: 'spin 1s linear infinite' }}
            >
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-muted opacity-20"
              />
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                className="text-primary"
                strokeDasharray="80, 200"
                strokeDashoffset="0"
              />
            </svg>
            
            {/* Message */}
            <p className="text-sm font-medium text-foreground">{message}</p>
          </div>
        </div>
      )}
    </LoadingOverlayContext.Provider>
  );
}
