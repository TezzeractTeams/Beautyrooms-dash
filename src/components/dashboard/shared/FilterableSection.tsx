"use client";

import { useDashboardFilters } from "@/contexts/dashboard-filters";
import { AnimatedEnter } from "./AnimatedEnter";
import { SectionSkeleton } from "./SectionSkeleton";

interface FilterableSectionProps {
  children: React.ReactNode;
  skeletonVariant?: "stats" | "funnel" | "chart" | "table";
  skeletonClassName?: string;
}

export function FilterableSection({
  children,
  skeletonVariant = "chart",
  skeletonClassName,
}: FilterableSectionProps) {
  const { isLoading, contentKey } = useDashboardFilters();

  if (isLoading) {
    return (
      <SectionSkeleton
        variant={skeletonVariant}
        className={skeletonClassName}
      />
    );
  }

  if (contentKey === 0) {
    return <>{children}</>;
  }

  return <AnimatedEnter key={contentKey}>{children}</AnimatedEnter>;
}
