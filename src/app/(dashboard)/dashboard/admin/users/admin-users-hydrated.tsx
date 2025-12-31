"use client";

import { useAdminUsers } from "@/hooks/queries/use-admin";
import AdminUsersClient from "@/components/dashboard/AdminUsersClient";

export default function AdminUsersHydrated() {
  const { data } = useAdminUsers();

  // Data comes from SSR hydration
  if (!data) return null;

  return (
    <AdminUsersClient 
      users={data.users} 
      userInvoiceCounts={data.userInvoiceCounts} 
    />
  );
}
