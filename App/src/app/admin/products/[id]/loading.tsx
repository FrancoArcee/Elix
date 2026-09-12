import Skeleton from "@/components/admin/Skeleton";

export default function AdminProductIdLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="relative flex w-full items-center justify-between border-b border-ink/10 bg-background px-4 py-4 md:px-6">
        <div className="min-w-[96px]">
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex min-w-[96px] items-center justify-end">
          <Skeleton className="h-7 w-16" />
        </div>
      </header>
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-[672px] space-y-6">
          {[1, 2, 3, 4].map((section) => (
            <div key={section} className="border border-ink/10 bg-background p-5">
              <Skeleton className="mb-4 h-3 w-28" />
              <div className="space-y-4">
                <div>
                  <Skeleton className="mb-2 h-3 w-16" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div>
                  <Skeleton className="mb-2 h-3 w-20" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-end gap-3">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </main>
    </div>
  );
}
