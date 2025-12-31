import { createClient } from "@/lib/supabase/client";
import type { Supplier } from "@/types/database";

export type { Supplier };

export interface PaginatedSuppliers {
  suppliers: Supplier[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

const PAGE_SIZE = 20;

/**
 * Fetch all suppliers for the current user
 */
export async function fetchSuppliers(): Promise<Supplier[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data } = await supabase
    .from("suppliers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data || []) as Supplier[];
}

/**
 * Fetch paginated suppliers
 */
export async function fetchSuppliersPaginated(page = 1): Promise<PaginatedSuppliers> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { suppliers: [], totalCount: 0, totalPages: 0, currentPage: 1, pageSize: PAGE_SIZE };
  }

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

  return {
    suppliers: data || [],
    totalCount,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
    currentPage: page,
    pageSize: PAGE_SIZE,
  };
}
