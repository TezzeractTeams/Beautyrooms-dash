"use client";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardFiltersProvider } from "@/contexts/dashboard-filters";

export function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardFiltersProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardFiltersProvider>
  );
}
