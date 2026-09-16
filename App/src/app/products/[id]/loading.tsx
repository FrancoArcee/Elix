import Skeleton from "@/components/ui/Skeleton";
import Navbar from "@/components/layout/Navbar";

export default function ProductDetailLoading() {
  return (
    <>
      <Navbar active="/" />
      <main className="bg-background">
        <div className="mx-auto w-full max-w-[1280px] px-6 py-12">
          <div className="grid grid-cols-1 gap-10 pt-8 lg:grid-cols-2">
            <div className="flex flex-col">
              <Skeleton className="aspect-square w-full" />
              <div className="grid grid-cols-4 gap-2 pt-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square w-full" />
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 pb-3">
                <Skeleton className="h-2.5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-[42px] w-3/4 md:h-[60px]" />

              <div className="pt-10">
                <Skeleton className="h-3 w-32" />
                <div className="flex gap-2 pt-3">
                  <Skeleton className="h-10 w-16" />
                  <Skeleton className="h-10 w-16" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>

              <Skeleton className="mt-8 h-12 w-full" />
            </div>
          </div>

          <div className="pt-20">
            <div className="border-t border-ink/10">
              <div className="flex gap-8">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-28" />
                <Skeleton className="h-12 w-36" />
              </div>
              <div className="py-12">
                <div className="grid max-w-[672px] grid-cols-1 gap-10 sm:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-2.5 w-16" />
                      <div className="pt-5 space-y-2">
                        <Skeleton className="h-3.5 w-full" />
                        <Skeleton className="h-3.5 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-ink/10 pt-16">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-2 gap-3 pt-10 md:gap-6 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <div className="pt-3">
                    <Skeleton className="h-2.5 w-16" />
                    <Skeleton className="mt-1 h-3.5 w-28" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
