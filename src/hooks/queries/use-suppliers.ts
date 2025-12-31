import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  fetchSuppliers, 
  fetchSuppliersPaginated,
  type Supplier,
  type PaginatedSuppliers 
} from "@/lib/api/suppliers";

export const SUPPLIERS_QUERY_KEY = ["suppliers"] as const;

/**
 * Hook to fetch all suppliers
 */
export function useSuppliers() {
  return useQuery({
    queryKey: SUPPLIERS_QUERY_KEY,
    queryFn: fetchSuppliers,
  });
}

/**
 * Hook to fetch paginated suppliers
 */
export function useSuppliersPaginated(page = 1) {
  return useQuery({
    queryKey: [...SUPPLIERS_QUERY_KEY, "paginated", page],
    queryFn: () => fetchSuppliersPaginated(page),
  });
}

/**
 * Hook to invalidate supplier cache after mutations
 */
export function useInvalidateSuppliers() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY });
  };
}
