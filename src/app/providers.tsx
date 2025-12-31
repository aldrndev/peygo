"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createQueryClient } from "@/lib/query-client";
import { LoadingOverlayProvider } from "@/components/ui/LoadingOverlay";
import { SettingsProvider } from "@/contexts/SettingsContext";
import type { SettingsMap } from "@/types/database";

interface ProvidersProps {
  children: ReactNode;
  settings?: SettingsMap;
}

export function Providers({ children, settings }: ProvidersProps) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider settings={settings}>
        <LoadingOverlayProvider>
          {children}
        </LoadingOverlayProvider>
      </SettingsProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

