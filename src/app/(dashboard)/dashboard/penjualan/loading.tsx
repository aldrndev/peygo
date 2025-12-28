export default function PenagihanLoading() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="h-7 w-32 bg-default-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-default-100 rounded mt-2 animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-default-200 rounded animate-pulse" />
      </div>
      
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-default-100 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
