"use client";

import { useAdminReports } from "@/hooks/queries/use-admin-extended";
import AdminReportsClient from "@/components/dashboard/AdminReportsClient";

export default function AdminReportsHydrated() {
  const { data, isLoading } = useAdminReports();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <AdminReportsClient
      totalRevenue={data.totalRevenue}
      totalFees={data.totalFees}
      totalInvoices={data.totalInvoices}
      totalUsers={data.totalUsers}
      revenueGrowth={data.revenueGrowth}
      invoiceGrowth={data.invoiceGrowth}
      userGrowth={data.userGrowth}
      monthlyData={data.monthlyData}
      billingCount={data.billingCount}
      paymentCount={data.paymentCount}
      statusCounts={data.statusCounts}
    />
  );
}
