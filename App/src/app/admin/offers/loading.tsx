import Skeleton from "@/components/ui/Skeleton";

export default function AdminOffersLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="relative flex w-full items-center justify-between border-b border-ink/10 bg-background px-4 py-4 md:px-6">
        <div className="min-w-[96px]">
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex min-w-[96px] items-center justify-end">
          <Skeleton className="h-7 w-16" />
        </div>
      </header>
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-[672px]">
          <Skeleton className="h-4 w-16" />

          <div className="pt-8">
            <div className="border border-ink/10 bg-background">
              <Skeleton className="h-12 w-full" />
            </div>
          </div>

          <div className="pt-8">
            <div className="flex items-center gap-2">
              <Skeleton className="size-1.5 rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex flex-col gap-3 pt-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="border border-ink/10 bg-background px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-12" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="size-6" />
                      <Skeleton className="size-6" />
                      <Skeleton className="size-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
