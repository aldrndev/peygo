"use client";

import { usePembayaranInvoices } from "@/hooks/queries/use-invoices";
import InvoiceList from "@/components/invoice/InvoiceList";

interface PembayaranClientProps {
  currentPage: number;
}

export default function PembayaranClient({ currentPage }: PembayaranClientProps) {
  const { data } = usePembayaranInvoices(currentPage);

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
      type="PAYMENT_REQUEST" 
      pagination={pagination}
    />
  );
}
