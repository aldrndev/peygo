"use client";

import { useAdminSettings } from "@/hooks/queries/use-admin-extended";
import AdminSettingsClient from "@/components/dashboard/AdminSettingsClient";

export default function AdminSettingsHydrated() {
  const { data, isLoading } = useAdminSettings();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return <AdminSettingsClient settings={data || []} />;
}
