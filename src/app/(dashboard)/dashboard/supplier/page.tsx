import { getSuppliers } from "./actions";
import SupplierList from "@/components/supplier/SupplierList";

export default async function SupplierPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <SupplierList suppliers={suppliers} />
    </div>
  );
}
