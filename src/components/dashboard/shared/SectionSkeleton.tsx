import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SectionSkeletonProps {
  variant?: "stats" | "funnel" | "chart" | "table";
  className?: string;
}

export function SectionSkeleton({
  variant = "chart",
  className,
}: SectionSkeletonProps) {
  if (variant === "stats") {
    return (
      <div
        className={cn(
          "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4",
          className,
        )}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3 border border-[rgba(103,92,83,0.06)] bg-surface p-5">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "funnel") {
    return (
      <div
        className={cn(
          "border border-[rgba(103,92,83,0.08)] bg-surface p-6 md:p-8",
          className,
        )}
      >
        <Skeleton className="mb-6 h-3 w-40" />
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-3">
          <Skeleton className="h-24 w-full md:h-20 md:flex-1" />
          <Skeleton className="h-24 w-full md:h-20 md:flex-[0.65]" />
          <Skeleton className="h-24 w-full md:h-20 md:flex-[0.4]" />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-2 w-16" />
              <Skeleton className="h-4 w-10" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div
        className={cn(
          "border border-[rgba(103,92,83,0.08)] bg-surface",
          className,
        )}
      >
        <div className="flex gap-2 border-b border-border px-4 py-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20" />
          ))}
          <Skeleton className="ml-auto h-6 w-14" />
        </div>
        <Skeleton className="h-10 w-full rounded-none" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 border-b border-border px-4 py-3 last:border-0"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="ml-auto h-4 w-12" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border border-[rgba(103,92,83,0.08)] bg-surface p-4 md:p-5",
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-16" />
        ))}
      </div>
      <Skeleton className="h-[220px] w-full md:h-[260px]" />
    </div>
  );
}
