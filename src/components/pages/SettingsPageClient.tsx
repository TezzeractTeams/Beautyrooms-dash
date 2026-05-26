"use client";

import dynamic from "next/dynamic";
import { DashboardLayoutFallback } from "@/components/dashboard/DashboardLayoutFallback";

const SettingsPageContent = dynamic(
  () =>
    import("@/components/settings/SettingsPageContent").then((m) => ({
      default: m.SettingsPageContent,
    })),
  {
    ssr: false,
    loading: () => <DashboardLayoutFallback />,
  },
);

export function SettingsPageClient() {
  return <SettingsPageContent />;
}
