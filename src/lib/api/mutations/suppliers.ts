import { createClient } from "@/lib/supabase/client";
import { z } from "zod";

// Validation schema - matches the form schema
export const supplierSchema = z.object({
  name: z.string().min(1, "Nama supplier wajib diisi"),
  email: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  bank_name: z.string().min(2, "Nama bank wajib diisi"),
  bank_account_number: z.string().min(5, "Nomor rekening wajib diisi"),
  bank_account_name: z.string().min(2, "Atas nama rekening wajib diisi"),
});

export type SupplierInput = z.infer<typeof supplierSchema>;

export interface MutationResult {
  success: boolean;
  error?: string;
}

/**
 * Create a new supplier
 */
export async function createSupplierMutation(data: SupplierInput): Promise<MutationResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Tidak terautentikasi" };
  }

  const parsed = supplierSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("suppliers")
    .insert({
      user_id: user.id,
      ...parsed.data,
    });

  if (error) {
    return { success: false, error: "Gagal menyimpan supplier" };
  }

  return { success: true };
}

/**
 * Update an existing supplier
 */
export async function updateSupplierMutation(id: string, data: SupplierInput): Promise<MutationResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Tidak terautentikasi" };
  }

  const parsed = supplierSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("suppliers")
    .update({
      ...parsed.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: "Gagal mengupdate supplier" };
  }

  return { success: true };
}

/**
 * Delete a supplier
 */
export async function deleteSupplierMutation(id: string): Promise<MutationResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Tidak terautentikasi" };
  }

  const { error } = await supabase
    .from("suppliers")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
