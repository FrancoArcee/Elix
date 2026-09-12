import Skeleton from "@/components/admin/Skeleton";

export default function AdminInformationLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="relative flex w-full items-center justify-between border-b border-ink/10 bg-background px-4 py-4 md:px-6">
        <div className="min-w-[96px]">
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex min-w-[96px] items-center justify-end">
          <Skeleton className="h-7 w-16" />
        </div>
      </header>
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-[672px] space-y-10">
          <section>
            <Skeleton className="mb-3 h-3 w-16" />
            <Skeleton className="aspect-[21/9] w-full" />
          </section>

          <section>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="space-y-3 pt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border border-ink/10 bg-background px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-2 w-8" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="flex gap-3">
                      <Skeleton className="size-4" />
                      <Skeleton className="size-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <Skeleton className="mb-3 h-3 w-20" />
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="border border-ink/10 bg-background px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-2 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex gap-3">
                      <Skeleton className="size-4" />
                      <Skeleton className="size-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <Skeleton className="mb-3 h-3 w-28" />
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="border border-ink/10 bg-background px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-2 w-24" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                    <div className="flex gap-3">
                      <Skeleton className="size-4" />
                      <Skeleton className="size-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
