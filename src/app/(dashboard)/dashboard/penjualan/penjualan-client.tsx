"use client";

import { usePenjualanInvoices } from "@/hooks/queries/use-invoices";
import InvoiceList from "@/components/invoice/InvoiceList";

interface PenjualanClientProps {
  currentPage: number;
}

export default function PenjualanClient({ currentPage }: PenjualanClientProps) {
  const { data } = usePenjualanInvoices(currentPage);

  // Data comes from SSR hydration, no loading state needed
  const invoices = data?.invoices || [];
  const pagination = data ? {
    currentPage: data.currentPage,
    totalPages: data.totalPages,
    totalCount: data.totalCount,
    pageSize: data.pageSize,
  } : undefined;

  return (
    <InvoiceList 
      invoices={invoices} 
      type="BILLING" 
      pagination={pagination}
    />
  );
}
