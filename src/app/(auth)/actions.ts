"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const authSchema = z.object({
  email: z.email("Format email tidak valid"),
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

export async function signup(_prevState: { error: string; success?: boolean } | null, formData: FormData) {
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
        }
    }
  });

  if (error) {
    // Map common Supabase error messages to Indonesian
    const errorMap: Record<string, string> = {
      "User already registered": "Email sudah terdaftar",
      "Password should be at least 6 characters": "Password minimal 6 karakter",
      "Unable to validate email address: invalid format": "Format email tidak valid",
    };
    return { error: errorMap[error.message] || "Gagal mendaftar. Silakan coba lagi." };
  }

  revalidatePath("/", "layout");
  // Return success flag - let client handle redirect after cookies are set
  return { error: "", success: true };
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/masuk");
}
