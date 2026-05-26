"use client";

import dynamic from "next/dynamic";
import { DashboardLayoutFallback } from "@/components/dashboard/DashboardLayoutFallback";

const DashboardPageContent = dynamic(
  () =>
    import("@/components/dashboard/DashboardPageContent").then((m) => ({
      default: m.DashboardPageContent,
    })),
  {
    ssr: false,
    loading: () => <DashboardLayoutFallback />,
  },
);

export function DashboardPageClient() {
  return <DashboardPageContent />;
}
