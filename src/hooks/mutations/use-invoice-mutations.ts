import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  createInvoiceMutation, 
  sendInvoiceMutation, 
  deleteInvoiceMutation,
  type InvoiceInput,
} from "@/lib/api/mutations/invoices";
import { INVOICES_QUERY_KEY, BILLING_INVOICES_KEY, PAYMENT_INVOICES_KEY } from "@/hooks/queries/use-invoices";
import { ADMIN_INVOICES_KEY, ADMIN_DASHBOARD_KEY } from "@/hooks/queries/use-admin";

/**
 * Hook to invalidate all invoice-related caches
 */
export function useInvalidateInvoiceCache() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: BILLING_INVOICES_KEY });
    queryClient.invalidateQueries({ queryKey: PAYMENT_INVOICES_KEY });
    queryClient.invalidateQueries({ queryKey: ADMIN_INVOICES_KEY });
    queryClient.invalidateQueries({ queryKey: ADMIN_DASHBOARD_KEY });
  };
}

/**
 * Hook to create a new invoice
 */
export function useCreateInvoice() {
  const invalidateCache = useInvalidateInvoiceCache();

  return useMutation({
    mutationFn: (data: InvoiceInput) => createInvoiceMutation(data),
    onSuccess: (result) => {
      if (result.success) {
        invalidateCache();
      }
    },
  });
}

/**
 * Hook to send an invoice
 */
export function useSendInvoice() {
  const invalidateCache = useInvalidateInvoiceCache();

  return useMutation({
    mutationFn: (id: string) => sendInvoiceMutation(id),
    onSuccess: (result) => {
      if (result.success) {
        invalidateCache();
      }
    },
  });
}

/**
 * Hook to delete an invoice
 */
export function useDeleteInvoice() {
  const invalidateCache = useInvalidateInvoiceCache();

  return useMutation({
    mutationFn: (id: string) => deleteInvoiceMutation(id),
    onSuccess: (result) => {
      if (result.success) {
        invalidateCache();
      }
    },
  });
}
