import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  fetchUserInvoices, 
  fetchInvoicesByType, 
  calculateInvoiceStats, 
  type Invoice, 
  type InvoiceStats,
} from "@/lib/api/invoices";

export const INVOICES_QUERY_KEY = ["invoices"] as const;
export const BILLING_INVOICES_KEY = ["invoices", "BILLING"] as const;
export const PAYMENT_INVOICES_KEY = ["invoices", "PAYMENT_REQUEST"] as const;

/**
 * Hook to fetch and cache all user invoices
 */
export function useInvoices() {
  return useQuery({
    queryKey: INVOICES_QUERY_KEY,
    queryFn: fetchUserInvoices,
  });
}

/**
 * Hook to fetch paginated billing invoices (Penjualan)
 */
export const usePenjualanInvoices = (page = 1) => {
  return useQuery({
    queryKey: [...BILLING_INVOICES_KEY, page],
    queryFn: () => fetchInvoicesByType("BILLING", page),
  });
};

/**
 * Hook to fetch paginated payment invoices (Pembayaran)
 */
export const usePembayaranInvoices = (page = 1) => {
  return useQuery({
    queryKey: [...PAYMENT_INVOICES_KEY, page],
    queryFn: () => fetchInvoicesByType("PAYMENT_REQUEST", page),
  });
};

/**
 * Hook to get invoice stats derived from invoices
 */
export function useInvoiceStats(): { data: InvoiceStats | undefined; isLoading: boolean } {
  const { data: invoices, isLoading } = useInvoices();
  
  return {
    data: invoices ? calculateInvoiceStats(invoices) : undefined,
    isLoading,
  };
}

/**
 * Hook to get recent invoices (first N)
 */
export function useRecentInvoices(count = 5): { data: Invoice[] | undefined; isLoading: boolean } {
  const { data: invoices, isLoading } = useInvoices();
  
  return {
    data: invoices?.slice(0, count),
    isLoading,
  };
}

/**
 * Hook to invalidate invoice caches after mutations
 */
export function useInvalidateInvoices() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: BILLING_INVOICES_KEY });
    queryClient.invalidateQueries({ queryKey: PAYMENT_INVOICES_KEY });
  };
}
