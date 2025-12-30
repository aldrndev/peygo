"use client";


import { type ReactNode } from "react";
import { LoadingOverlayProvider } from "@/components/ui/LoadingOverlay";
import { SettingsProvider } from "@/contexts/SettingsContext";
import type { SettingsMap } from "@/types/database";

interface ProvidersProps {
  children: ReactNode;
  settings?: SettingsMap;
}

export function Providers({ children, settings }: ProvidersProps) {
  return (
    <SettingsProvider settings={settings}>
      <LoadingOverlayProvider>
        {children}
      </LoadingOverlayProvider>
    </SettingsProvider>
  );
}
