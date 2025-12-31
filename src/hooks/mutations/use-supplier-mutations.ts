import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  createSupplierMutation, 
  updateSupplierMutation, 
  deleteSupplierMutation,
  type SupplierInput 
} from "@/lib/api/mutations/suppliers";
import { SUPPLIERS_QUERY_KEY } from "@/hooks/queries/use-suppliers";

/**
 * Hook to create a new supplier
 */
export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SupplierInput) => createSupplierMutation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY });
    },
  });
}

/**
 * Hook to update an existing supplier
 */
export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SupplierInput }) => 
      updateSupplierMutation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY });
    },
  });
}

/**
 * Hook to delete a supplier
 */
export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSupplierMutation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY });
    },
  });
}
