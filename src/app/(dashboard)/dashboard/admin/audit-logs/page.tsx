import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AuditLogsClient from "./audit-logs-client";
import { createAuditLog, AuditAction } from "@/lib/audit";

export default async function AuditLogsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/masuk");
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // Audit: Admin accessed audit logs page
  await createAuditLog({
    action: AuditAction.ADMIN_VIEW_AUDIT_LOGS,
    userId: user.id,
  });

  return <AuditLogsClient />;
}
