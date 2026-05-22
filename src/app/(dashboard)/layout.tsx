import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardFiltersProvider } from "@/contexts/dashboard-filters";

export default function DashboardLayout({
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
