"use client";

import { Ga4OverviewSection } from "@/components/dashboard/analytics/Ga4OverviewSection";
import { BoulevardSection } from "@/components/dashboard/boulevard/BoulevardSection";
import { PaidMediaDashboardSection } from "@/components/dashboard/paid-media/PaidMediaDashboardSection";
import { OverallStatsSection } from "@/components/dashboard/overall-stats/OverallStatsSection";
import { AnimatedEnter } from "@/components/dashboard/shared/AnimatedEnter";

export function DashboardPageContent() {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 sm:gap-10 lg:gap-14">
      <AnimatedEnter delay={0}>
        <BoulevardSection />
      </AnimatedEnter>
      <AnimatedEnter delay={35}>
        <OverallStatsSection />
      </AnimatedEnter>
      <AnimatedEnter delay={70}>
        <PaidMediaDashboardSection />
      </AnimatedEnter>
      <AnimatedEnter delay={105}>
        <Ga4OverviewSection />
      </AnimatedEnter>
    </div>
  );
}
