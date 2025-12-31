"use client";

import { useInvoiceDetail } from "@/hooks/queries/use-invoice-detail";
import InvoiceDetail from "@/components/invoice/InvoiceDetail";

interface Props {
  invoiceId: string;
}

export default function InvoiceDetailHydrated({ invoiceId }: Props) {
  const { data, isLoading } = useInvoiceDetail(invoiceId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!data) return null;

  return <InvoiceDetail invoice={data} />;
}
