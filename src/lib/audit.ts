import { createClient } from "@/lib/supabase/server";

/**
 * Audit action types - comprehensive coverage for security & compliance
 */
export const AuditAction = {
  // Authentication & Security
  LOGIN: "LOGIN",
  LOGIN_FAILED: "LOGIN_FAILED",
  LOGOUT: "LOGOUT",
  PASSWORD_RESET_REQUEST: "PASSWORD_RESET_REQUEST",
  PASSWORD_RESET_COMPLETE: "PASSWORD_RESET_COMPLETE",
  CHANGE_PASSWORD: "CHANGE_PASSWORD",
  
  // Invoice Lifecycle
  CREATE_INVOICE: "CREATE_INVOICE",
  SEND_INVOICE: "SEND_INVOICE",
  ARCHIVE_INVOICE: "ARCHIVE_INVOICE",
  
  // Supplier Management
  CREATE_SUPPLIER: "CREATE_SUPPLIER",
  UPDATE_SUPPLIER: "UPDATE_SUPPLIER",
  DELETE_SUPPLIER: "DELETE_SUPPLIER",
  
  // Profile & Settings
  UPDATE_PROFILE: "UPDATE_PROFILE",
  LOGO_UPLOAD: "LOGO_UPLOAD",
  
  // Payment Webhooks
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  DISBURSEMENT_COMPLETE: "DISBURSEMENT_COMPLETE",
  WEBHOOK_UPDATE: "WEBHOOK_UPDATE",
  
  // Admin Actions (Critical - Always Audited)
  ADMIN_VIEW_AUDIT_LOGS: "ADMIN_VIEW_AUDIT_LOGS",
  ADMIN_EXPORT_AUDIT_LOGS: "ADMIN_EXPORT_AUDIT_LOGS",
  ADMIN_CHANGE_USER_ROLE: "ADMIN_CHANGE_USER_ROLE",
  ADMIN_DELETE_USER: "ADMIN_DELETE_USER",
  ADMIN_VIEW_USER_DETAIL: "ADMIN_VIEW_USER_DETAIL",
  ADMIN_VIEW_REPORTS: "ADMIN_VIEW_REPORTS",
  ADMIN_ACCESS_DASHBOARD: "ADMIN_ACCESS_DASHBOARD",
} as const;

export type AuditActionType = typeof AuditAction[keyof typeof AuditAction];

interface AuditLogParams {
  action: AuditActionType;
  userId?: string | null;
  entity?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Extract client IP address with proper proxy handling
 * Priority: x-forwarded-for (first IP) > cf-connecting-ip > fallback
 * 
 * IMPORTANT: Only works in server context (Server Actions, API Routes)
 */
async function getClientIP(): Promise<string> {
  // Check if we're in server context
  if (typeof window !== "undefined") {
    return "client"; // Client-side, no IP available
  }

  try {
    // Dynamic import to avoid issues in client components
    const { headers } = await import("next/headers");
    const headersList = await headers();
    
    // 1. Try x-forwarded-for (take first IP in chain)
    const forwardedFor = headersList.get("x-forwarded-for");
    if (forwardedFor) {
      const firstIP = forwardedFor.split(",")[0].trim();
      if (firstIP) return firstIP;
    }
    
    // 2. Try Cloudflare's header
    const cfIP = headersList.get("cf-connecting-ip");
    if (cfIP) return cfIP;
    
    // 3. Try x-real-ip
    const realIP = headersList.get("x-real-ip");
    if (realIP) return realIP;
    
    return "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * Extract user agent (raw string, no parsing)
 * 
 * IMPORTANT: Only works in server context (Server Actions, API Routes)
 */
async function getUserAgent(): Promise<string> {
  // Check if we're in server context
  if (typeof window !== "undefined") {
    return navigator?.userAgent || "client";
  }

  try {
    const { headers } = await import("next/headers");
    const headersList = await headers();
    return headersList.get("user-agent") || "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * Centralized audit logging function
 * 
 * Security notes:
 * - IP extracted with proxy-awareness
 * - User-Agent stored as raw string
 * - Metadata should NEVER contain: passwords, tokens, auth codes, raw payloads, PII
 * - Unauthenticated actions logged with userId = null
 * 
 * Usage: Server Actions and API Routes only (uses headers())
 */
export async function createAuditLog({
  action,
  userId = null,
  entity,
  entityId,
  metadata = {},
}: AuditLogParams): Promise<void> {
  try {
    const supabase = await createClient();
    const ip = await getClientIP();
    const userAgent = await getUserAgent();
    
    await supabase.from("audit_logs").insert({
      user_id: userId,
      action,
      entity,
      entity_id: entityId,
      ip_address: ip,
      user_agent: userAgent,
      metadata,
    });
  } catch (error) {
    // Silent fail - audit logging should not break application flow
    // eslint-disable-next-line no-console
    console.error("Audit log failed:", error);
  }
}
