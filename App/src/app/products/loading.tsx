import Skeleton from "@/components/ui/Skeleton";
import Navbar from "@/components/layout/Navbar";

export default function ProductsLoading() {
  return (
    <>
      <Navbar active="/" />
      <main className="min-h-screen bg-background px-4 py-10 md:px-6 md:py-12">
        <div className="mx-auto w-full max-w-[1280px]">
          <Skeleton className="h-[36px] w-48 md:h-[40px] md:w-64" />

          <div className="pt-4">
            <div className="flex items-center justify-between border-t border-ink/10 pt-4">
              <Skeleton className="h-3 w-24" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-10">
            <div className="hidden w-[220px] shrink-0 lg:block">
              <div className="space-y-4">
                <Skeleton className="h-4 w-16" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col">
                    <Skeleton className="aspect-[3/4] w-full" />
                    <div className="pt-3">
                      <Skeleton className="h-2.5 w-16" />
                      <Skeleton className="mt-1 h-3.5 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
