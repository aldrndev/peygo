import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Desktop Sidebar Skeleton */}
      <div className="hidden md:flex fixed inset-y-0 left-0 z-40 flex-col bg-card border-r border-border w-64 p-4">
        {/* Header Logo */}
        <div className="flex items-center gap-3 px-2 mb-10 mt-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-6 w-24" />
        </div>
        
        {/* Nav Items */}
        <div className="space-y-4">
          <div className="px-2 mb-2">
            <Skeleton className="h-4 w-20 mb-2" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-2">
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Header Skeleton */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 h-16 bg-card border-b border-border px-6 flex items-center justify-between">
        <Skeleton className="h-8 w-24" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Desktop Header Skeleton */}
      <div className="hidden md:flex fixed top-0 right-0 left-64 z-30 h-20 bg-card border-b border-border items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex items-center gap-4">
           <Skeleton className="h-10 w-10 rounded-full" />
           <Skeleton className="h-8 w-px" />
           <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="min-h-screen pt-20 pb-32 md:pt-20 md:pb-0 md:ml-64 p-6 md:p-10">
        <div className="max-w-[1600px] mx-auto space-y-8">
           {/* Page Header */}
           <div className="flex items-center justify-between mb-8">
             <div className="space-y-2">
               <Skeleton className="h-8 w-48" />
               <Skeleton className="h-4 w-64" />
             </div>
             <Skeleton className="h-10 w-32" />
           </div>

           {/* Stats Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[1, 2, 3, 4].map((i) => (
               <Skeleton key={i} className="h-32 rounded-xl" />
             ))}
           </div>

           {/* Chart Area */}
           <Skeleton className="h-[400px] rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}
