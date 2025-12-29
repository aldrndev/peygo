import { getSuppliersPaginated } from "./actions";
import SupplierList from "@/components/supplier/SupplierList";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function SupplierPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1"));
  
  const result = await getSuppliersPaginated(currentPage);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <SupplierList 
        suppliers={result.suppliers} 
        pagination={{
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          totalCount: result.totalCount,
          pageSize: result.pageSize ?? 20,
        }}
      />
    </div>
  );
}
