"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const authSchema = z.object({
  email: z.email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

const passwordSchema = z.object({
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export async function login(_prevState: { error: string; success?: boolean } | null, formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validated = authSchema.safeParse(data);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Map common Supabase error messages to Indonesian
    // SECURITY: Use generic message for "User not found" and "Invalid login credentials" to prevent enumeration
    const errorMap: Record<string, string> = {
      "Email not confirmed": "Email belum dikonfirmasi. Cek inbox Anda.",
      "Too many requests": "Terlalu banyak percobaan. Coba lagi nanti.",
    };
    
    // Default generic error for auth failures
    return { error: errorMap[error.message] || "Email atau password salah." };
  }

  revalidatePath("/", "layout");
  // Return success flag - let client handle redirect after cookies are set
  return { error: "", success: true };
}

export async function signup(_prevState: { error: string; success?: boolean; emailSent?: boolean } | null, formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    name: formData.get("name") as string,
  };

  const validated = authSchema.safeParse({ email: data.email, password: data.password });

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  if (!data.name || data.name.length < 2) {
      return { error: "Nama wajib diisi (minimal 2 karakter)" };
  }

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
        data: {
            name: data.name,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    }
  });

  if (error) {
    // Map common Supabase error messages to Indonesian
    const errorMap: Record<string, string> = {
      "User already registered": "Email sudah terdaftar",
      "Password should be at least 6 characters": "Password minimal 6 karakter",
      "Unable to validate email address: invalid format": "Format email tidak valid",
      "Database error saving new user": "Terjadi kesalahan database. Silakan coba lagi.",
      "Signup requires a valid password": "Password wajib diisi",
    };
    return { error: errorMap[error.message] || "Gagal mendaftar. Silakan coba lagi." };
  }

  // Return emailSent flag - user must verify email before login
  return { error: "", emailSent: true };
}

/**
 * Request password reset email
 * SECURITY: Always return generic success to prevent user enumeration
 */
export async function forgotPassword(_prevState: { error: string; emailSent?: boolean } | null, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  // Basic validation
  const emailSchema = z.email("Format email tidak valid");
  const validated = emailSchema.safeParse(email);
  
  if (!validated.success) {
    return { error: "Format email tidak valid" };
  }

  // SECURITY: Always succeed regardless of whether email exists
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?type=recovery`,
  });

  // Always return success to prevent user enumeration
  return { error: "", emailSent: true };
}

/**
 * Update password (called from reset password page after recovery)
 */
export async function updatePassword(_prevState: { error: string; success?: boolean } | null, formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;

  const validated = passwordSchema.safeParse({ password });
  
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    // Handle expired/invalid recovery link
    if (error.message.includes("expired") || error.message.includes("invalid")) {
      return { error: "Link sudah kadaluarsa. Silakan request ulang." };
    }
    return { error: "Gagal mengubah password. Silakan coba lagi." };
  }

  revalidatePath("/", "layout");
  return { error: "", success: true };
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    // Return success - let client handle redirect with loading animation
    return { success: true };
}

/**
 * Resend confirmation email
 * SECURITY: Always return generic success to prevent user enumeration
 */
export async function resendConfirmation(_prevState: { error: string; emailSent?: boolean } | null, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  // Basic validation
  const emailSchema = z.email("Format email tidak valid");
  const validated = emailSchema.safeParse(email);
  
  if (!validated.success) {
    return { error: "Format email tidak valid" };
  }

  // SECURITY: Always succeed regardless of whether email exists
  await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  // Always return success to prevent user enumeration
  return { error: "", emailSent: true };
}
