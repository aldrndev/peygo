import { useQuery } from "@tanstack/react-query";
import { fetchInvoiceById, type InvoiceWithItems } from "@/lib/api/invoice-detail";

export const INVOICE_DETAIL_KEY = ["invoice-detail"] as const;

/**
 * Hook to fetch single invoice with items
 */
export function useInvoiceDetail(id: string) {
  return useQuery<InvoiceWithItems | null>({
    queryKey: [...INVOICE_DETAIL_KEY, id],
    queryFn: () => fetchInvoiceById(id),
    enabled: !!id,
  });
}
