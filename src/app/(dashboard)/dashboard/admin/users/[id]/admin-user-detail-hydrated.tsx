"use client";

import { useAdminUserDetail } from "@/hooks/queries/use-admin-user-detail";
import AdminUserDetailClient from "@/components/dashboard/AdminUserDetailClient";

interface Props {
  userId: string;
}

export default function AdminUserDetailHydrated({ userId }: Props) {
  const { data, isLoading } = useAdminUserDetail(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!data) return null;

  // Map to the expected UserProfile format
  const mappedProfile = {
    id: data.profile.id,
    name: data.profile.name,
    phone: data.profile.phone,
    role: data.profile.role,
    company_name: data.profile.company_name ?? null,
    company_address: data.profile.company_address ?? null,
    logo_url: data.profile.logo_url ?? null,
    created_at: data.profile.created_at,
  };

  // Map invoices to expected format
  const mappedInvoices = data.invoices.map(inv => ({
    id: inv.id,
    type: inv.type,
    status: inv.status,
    total_amount: inv.total_amount,
    created_at: inv.created_at,
  }));

  return <AdminUserDetailClient profile={mappedProfile} invoices={mappedInvoices} />;
}
