"use client";

import { useProfile } from "@/hooks/queries/use-profile";
import ProfilePage from "@/components/dashboard/ProfilePage";

export default function ProfileClientHydrated() {
  const { data, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!data) return null;

  // Create a user-like object for ProfilePage
  const userObject = {
    id: data.profile.id,
    email: data.email,
  };

  // Map profile to convert null values to undefined for ProfilePage interface
  const mappedProfile = {
    name: data.profile.name,
    phone: data.profile.phone ?? undefined,
    company_name: data.profile.company_name ?? undefined,
    company_address: data.profile.company_address ?? undefined,
    logo_url: data.profile.logo_url ?? undefined,
    bank_name: data.profile.bank_name ?? undefined,
    bank_account_number: data.profile.bank_account_number ?? undefined,
    bank_account_name: data.profile.bank_account_name ?? undefined,
    role: data.profile.role,
  };

  return <ProfilePage user={userObject} profile={mappedProfile} />;
}
