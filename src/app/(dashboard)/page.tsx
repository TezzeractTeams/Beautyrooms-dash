import { DashboardView } from "@/components/dashboard/dashboard-view";
import { getDashboardData } from "@/data/mocks";

export default function DashboardPage() {
  const data = getDashboardData();

  return <DashboardView data={data} />;
}
