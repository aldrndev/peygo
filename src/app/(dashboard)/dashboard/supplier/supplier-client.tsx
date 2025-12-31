"use client";

import { useSuppliersPaginated } from "@/hooks/queries/use-suppliers";
import SupplierList from "@/components/supplier/SupplierList";

interface SupplierClientProps {
  currentPage: number;
}

export default function SupplierClient({ currentPage }: SupplierClientProps) {
  const { data } = useSuppliersPaginated(currentPage);

  // Data comes from SSR hydration, no loading state needed
  const suppliers = data?.suppliers || [];
  const pagination = data ? {
    currentPage: data.currentPage,
    totalPages: data.totalPages,
    totalCount: data.totalCount,
    pageSize: data.pageSize,
  } : undefined;

  return (
    <SupplierList 
      suppliers={suppliers} 
      pagination={pagination}
    />
  );
}
