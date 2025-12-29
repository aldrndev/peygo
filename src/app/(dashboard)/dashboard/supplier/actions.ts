"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import { supplierSchema } from "./schema";

const PAGE_SIZE = 20;

export async function getSuppliers() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data } = await supabase
    .from("suppliers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getSuppliersPaginated(page: number = 1) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { suppliers: [], totalCount: 0, totalPages: 0, currentPage: 1 };

  const offset = (page - 1) * PAGE_SIZE;

  // Get total count
  const { count } = await supabase
    .from("suppliers")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Get paginated data
  const { data } = await supabase
    .from("suppliers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return {
    suppliers: data || [],
    totalCount,
    totalPages,
    currentPage: page,
    pageSize: PAGE_SIZE,
  };
}

export async function createSupplier(
  prevState: { error: string; success?: boolean } | null,
  formData: FormData
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tidak terautentikasi" };
  }

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email") || "",
    phone: formData.get("phone") || "",
    address: formData.get("address") || "",
    bank_name: formData.get("bank_name") || null,
    bank_account_number: formData.get("bank_account_number") || null,
    bank_account_name: formData.get("bank_account_name") || null,
  };

  const parsed = supplierSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("suppliers")
    .insert({
      user_id: user.id,
      ...parsed.data,
    });

  if (error) {
    return { error: "Gagal menyimpan supplier" };
  }

  revalidatePath("/dashboard/supplier");
  return { error: "", success: true };
}

export async function updateSupplier(
  id: string,
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
    email: formData.get("email") || "",
    phone: formData.get("phone") || "",
    address: formData.get("address") || "",
    bank_name: formData.get("bank_name") || null,
    bank_account_number: formData.get("bank_account_number") || null,
    bank_account_name: formData.get("bank_account_name") || null,
  };

  const parsed = supplierSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
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
    return { error: "Gagal mengupdate supplier" };
  }

  revalidatePath("/dashboard/supplier");
  return { error: "", success: true };
}

export async function deleteSupplier(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Tidak terautentikasi" };
  }
  
  const { error } = await supabase
    .from("suppliers")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // SECURITY: Ensure user owns this supplier
    
  if (error) return { error: error.message };
  
  revalidatePath("/dashboard/supplier");
  return { success: true };
}
