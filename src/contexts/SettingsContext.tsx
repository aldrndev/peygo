"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SettingsMap } from "@/types/database";

// Default settings (must match lib/settings.ts)
const DEFAULT_SETTINGS: SettingsMap = {
  platform_name: "PeyGo",
  platform_tagline: "Platform Invoice & Billing untuk UMKM Indonesia",
  support_email: "support@peygo.id",
  whatsapp_center: "+6281234567890",
  platform_fee: 2.5,
  mdr_fee: 1.5,
  ppn_rate: 11,
  email_transaction: true,
  alert_registration: true,
  wa_reminder: false,
  require_2fa: false,
  auto_logout_mins: 30,
  smtp_host: "smtp.gmail.com",
  smtp_port: 587,
  smtp_user: "noreply@peygo.id",
};

const SettingsContext = createContext<SettingsMap>(DEFAULT_SETTINGS);

interface SettingsProviderProps {
  children: ReactNode;
  settings?: SettingsMap;
}

/**
 * Provider component for settings context
 * Settings are fetched server-side and passed as props
 */
export function SettingsProvider({ children, settings }: SettingsProviderProps) {
  // Use provided settings or fallback to defaults
  const value = settings || DEFAULT_SETTINGS;
  
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

/**
 * Hook to access all settings
 */
export function useSettings(): SettingsMap {
  return useContext(SettingsContext);
}

/**
 * Hook to access a single setting
 */
export function useSetting<K extends keyof SettingsMap>(key: K): SettingsMap[K] {
  const settings = useContext(SettingsContext);
  return settings[key];
}

/**
 * Export defaults for reference
 */
export { DEFAULT_SETTINGS };
