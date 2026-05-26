"use client";

import { useState } from "react";
import { useDashboardFilters } from "@/contexts/dashboard-filters";
import { FilterableSection } from "@/components/dashboard/shared/FilterableSection";
import { SectionHeader } from "@/components/dashboard/shared/SectionHeader";
import { ResponsiveTablePanel } from "@/components/dashboard/shared/ResponsiveTablePanel";
import type { BoulevardKpis } from "@/types/dashboard";
import { useBoulevardAppointments } from "./useBoulevardAppointments";
import { boulevardAppointmentColumns } from "./boulevard-table-columns";

type BlvdTab = "appointments";

const BLVD_TABS: Array<{ value: BlvdTab; label: string }> = [
  { value: "appointments", label: "Appointments" },
];

function formatRevenue(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function KpiCards({ kpis }: { kpis: BoulevardKpis }) {
  const cards = [
    { label: "Total Revenue", value: formatRevenue(kpis.totalRevenue) },
    {
      label: "Appointments",
      value: kpis.totalAppointments.toLocaleString(),
    },
    {
      label: "Avg. per Appointment",
      value: formatRevenue(kpis.avgRevenue),
    },
    { label: "Services Booked", value: kpis.totalServices.toLocaleString() },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value }) => (
        <article
          key={label}
          className="border border-[rgba(103,92,83,0.12)] bg-background px-4 py-5 sm:px-5"
        >
          <p className="font-sans text-[10px] tracking-widest uppercase text-[#888888]">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-medium text-heading">
            {value}
          </p>
        </article>
      ))}
    </div>
  );
}

export function BoulevardSection() {
  const { dateRange } = useDashboardFilters();
  const { rows, kpis, loading, error } = useBoulevardAppointments(dateRange);
  const [activeTab, setActiveTab] = useState<BlvdTab>("appointments");

  return (
    <section className="space-y-6">
      <SectionHeader
        title="Appointments"
        subtitle="Live clinic booking data from Boulevard"
      />

      <FilterableSection skeletonVariant="stats">
        {loading ? (
          <p className="font-sans text-sm text-[#888888]">
            Loading Boulevard data…
          </p>
        ) : error ? (
          <div className="border border-[rgba(103,92,83,0.15)] bg-surface px-4 py-3 font-sans text-sm text-[#888888]">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            {kpis ? <KpiCards kpis={kpis} /> : null}

            <ResponsiveTablePanel
              tabs={BLVD_TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              source="boulevard"
              ariaLabel="Boulevard Appointments"
              tables={{
                appointments: {
                  rows,
                  columns: boulevardAppointmentColumns,
                  getRowKey: (row) => row.id,
                  tableId: "boulevard-appointments",
                  pinnedColumnIds: ["clientName"],
                  emptyMessage: "No appointments found for this date range.",
                },
              }}
            />
          </div>
        )}
      </FilterableSection>
    </section>
  );
}
