import Skeleton from "@/components/admin/Skeleton";

export default function AdminProductsLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="relative flex w-full items-center justify-between border-b border-ink/10 bg-background px-4 py-4 md:px-6">
        <div className="min-w-[96px]">
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex min-w-[96px] items-center justify-end">
          <Skeleton className="h-7 w-16" />
        </div>
      </header>
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-[960px]">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-24" />
          </div>

          <div className="pt-6">
            <Skeleton className="h-9 w-full" />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-4">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-7 w-18" />
            <Skeleton className="h-7 w-24" />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Skeleton className="h-3 w-40" />
          </div>

          <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="aspect-[4/5] w-full" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
