import Skeleton from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="relative flex w-full items-center justify-between border-b border-ink/10 bg-background px-4 py-4 md:px-6">
        <div className="min-w-[96px]">
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex min-w-[96px] items-center justify-end">
          <Skeleton className="h-7 w-16" />
        </div>
      </header>
      <main className="flex-1 px-6 py-8 md:px-10 md:py-12">
        <div className="mx-auto grid w-full max-w-[672px] grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex w-full items-center justify-between gap-4 border border-ink/10 bg-background px-6 py-6 md:px-8"
            >
              <div className="flex min-w-0 flex-col items-start gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-44" />
              </div>
              <Skeleton className="size-3.5 shrink-0" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
