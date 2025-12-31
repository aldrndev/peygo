"use client";

import { useAdminDashboard } from "@/hooks/queries/use-admin";
import AdminDashboardClient from "@/components/dashboard/AdminDashboardClient";

export default function AdminDashboardHydrated() {
  const { data } = useAdminDashboard();

  // Data comes from SSR hydration
  if (!data) return null;

  return (
    <AdminDashboardClient
      stats={data.stats}
      recentInvoices={data.recentInvoices}
      revenueGrowth={data.revenueGrowth}
    />
  );
}
