import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200", className)}
      {...props}
    />
  )
}

function DashboardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Hero skeleton */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 py-16 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 xl:ml-24">
          <div className="max-w-6xl mx-auto text-center text-white">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-white/20 rounded-full w-64 mx-auto"></div>
              <div className="h-16 bg-white/20 rounded-3xl w-96 mx-auto"></div>
              <div className="h-6 bg-white/20 rounded-full w-80 mx-auto"></div>
              <div className="h-20 bg-white/10 rounded-2xl w-72 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats skeleton */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 xl:ml-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center p-6 animate-pulse">
                <div className="w-12 h-12 bg-slate-200 rounded-xl mx-auto mb-4"></div>
                <div className="h-8 bg-slate-200 rounded w-16 mx-auto mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-20 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content skeleton */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-6 xl:ml-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
              <div className="lg:col-span-2">
                <div className="h-96 bg-white rounded-3xl shadow-lg"></div>
              </div>
              <div className="space-y-8">
                <div className="h-96 bg-white rounded-3xl shadow-lg"></div>
                <div className="h-64 bg-white rounded-3xl shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export { Skeleton, DashboardSkeleton }
