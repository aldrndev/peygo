"use client";

import { useAdminInvoices } from "@/hooks/queries/use-admin";
import AdminInvoicesClient from "@/components/dashboard/AdminInvoicesClient";

export default function AdminInvoicesHydrated() {
  const { data } = useAdminInvoices();

  // Data comes from SSR hydration
  if (!data) return null;

  // Map to ensure required fields are never null/undefined
  const invoices = data.map(inv => ({
    ...inv,
    invoice_number: inv.invoice_number || "-",
    userName: inv.userName || "-",
  }));

  return <AdminInvoicesClient invoices={invoices} />;
}
