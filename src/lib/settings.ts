import "server-only";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Setting, SettingsMap } from "@/types/database";

const SETTINGS_CACHE_TAG = "settings";

// Default settings fallback (used if DB fetch fails)
export const DEFAULT_SETTINGS: SettingsMap = {
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

// In-memory cache for settings (persists across requests in serverless)
let settingsCache: SettingsMap | null = null;
let rawSettingsCache: Setting[] | null = null;

/**
 * Parse raw settings from DB into typed SettingsMap
 */
function parseSettings(rawSettings: Setting[]): SettingsMap {
  const result = { ...DEFAULT_SETTINGS };
  
  for (const setting of rawSettings) {
    const key = setting.key as keyof SettingsMap;
    
    if (key in result) {
      switch (setting.type) {
        case "number":
          (result as Record<string, unknown>)[key] = parseFloat(setting.value);
          break;
        case "boolean":
          (result as Record<string, unknown>)[key] = setting.value === "true";
          break;
        default:
          (result as Record<string, unknown>)[key] = setting.value;
      }
    }
  }
  
  return result;
}

/**
 * Fetch raw settings from database (internal)
 */
async function fetchSettingsFromDB(): Promise<Setting[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .order("category");
    
    if (error) {
      return [];
    }
    
    return data || [];
  } catch {
    return [];
  }
}

/**
 * Get all settings with in-memory cache
 * Cache persists until invalidateSettingsCache() is called
 */
export async function getSettings(): Promise<SettingsMap> {
  // Return cached if available
  if (settingsCache) {
    return settingsCache;
  }
  
  // Fetch from DB
  const rawSettings = await fetchSettingsFromDB();
  
  // If no settings in DB, return defaults
  if (rawSettings.length === 0) {
    return DEFAULT_SETTINGS;
  }
  
  // Parse and cache
  settingsCache = parseSettings(rawSettings);
  rawSettingsCache = rawSettings;
  
  return settingsCache;
}

/**
 * Get raw settings (for admin settings page)
 */
export async function getRawSettings(): Promise<Setting[]> {
  // Return cached if available
  if (rawSettingsCache) {
    return rawSettingsCache;
  }
  
  // Fetch from DB
  rawSettingsCache = await fetchSettingsFromDB();
  return rawSettingsCache;
}

/**
 * Get a single setting value
 */
export async function getSetting<K extends keyof SettingsMap>(key: K): Promise<SettingsMap[K]> {
  const settings = await getSettings();
  return settings[key];
}

/**
 * Invalidate settings cache (call after update)
 */
export function invalidateSettingsCache(): void {
  // Clear in-memory cache
  settingsCache = null;
  rawSettingsCache = null;
  
  // Also revalidate Next.js cache tag
  revalidateTag(SETTINGS_CACHE_TAG, "max");
}
