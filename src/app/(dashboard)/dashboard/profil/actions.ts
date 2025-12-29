"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const PROFILE_COMPLETE_COOKIE = "peygo_profile_complete";

import { profileSchema } from "./schema";

export async function updateProfile(
  prevState: { error: string; success?: boolean } | null, 
  formData: FormData
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    company_name: formData.get("company_name") || null,
    company_address: formData.get("company_address") || null,
    logo_url: formData.get("logo_url") || null,
  };

  const parsed = profileSchema.safeParse(rawData);
  
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      ...parsed.data,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { error: "Gagal menyimpan profil. Silakan periksa koneksi Anda dan coba lagi." };
  }

  // Set profile complete cookie for middleware caching
  const cookieStore = await cookies();
  cookieStore.set(PROFILE_COMPLETE_COOKIE, "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  revalidatePath("/dashboard");
  return { error: "", success: true };
}

export async function completeOnboarding(
  prevState: { error: string; success?: boolean } | null, 
  formData: FormData
) {
  const result = await updateProfile(prevState, formData);
  // Return result with success flag - client handles redirect to avoid Next.js 15+ issues
  return result;
}

