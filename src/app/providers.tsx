"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { LoadingOverlayProvider } from "@/components/ui/LoadingOverlay";
import { SettingsProvider } from "@/contexts/SettingsContext";
import type { SettingsMap } from "@/types/database";

interface ProvidersProps {
  children: ReactNode;
  settings?: SettingsMap;
}

export function Providers({ children, settings }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider settings={settings}>
        <LoadingOverlayProvider>
          {children}
        </LoadingOverlayProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}
