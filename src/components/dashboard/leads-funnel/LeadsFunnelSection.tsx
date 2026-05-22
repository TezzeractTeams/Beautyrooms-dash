"use client";

import { useMemo } from "react";
import { getLeadsFunnelData } from "@/lib/mock-data/leads-funnel";
import { FilterableSection } from "../shared/FilterableSection";
import { SectionHeader } from "../shared/SectionHeader";
import { LeadsFunnel } from "./LeadsFunnel";

export function LeadsFunnelSection() {
  const data = useMemo(() => getLeadsFunnelData(), []);

  return (
    <section>
      <SectionHeader
        title="Leads Funnel"
        subtitle="MQL → SQL → Booked"
      />
      <FilterableSection skeletonVariant="funnel">
        <LeadsFunnel data={data} />
      </FilterableSection>
    </section>
  );
}
