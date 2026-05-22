"use client";

import { LeadsFunnelSection } from "@/components/dashboard/leads-funnel/LeadsFunnelSection";
import { PaidMediaDashboardSection } from "@/components/dashboard/paid-media/PaidMediaDashboardSection";
import { OverallStatsSection } from "@/components/dashboard/overall-stats/OverallStatsSection";
import { AnimatedEnter } from "@/components/dashboard/shared/AnimatedEnter";

export function DashboardPageContent() {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 sm:gap-10 lg:gap-14">
      <AnimatedEnter delay={0}>
        <OverallStatsSection />
      </AnimatedEnter>
      <AnimatedEnter delay={70}>
        <LeadsFunnelSection />
      </AnimatedEnter>
      <AnimatedEnter delay={140}>
        <PaidMediaDashboardSection />
      </AnimatedEnter>
    </div>
  );
}
