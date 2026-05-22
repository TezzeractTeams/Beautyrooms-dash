"use client";

import { Download } from "lucide-react";
import { formatLastUpdated, useDashboardFilters } from "@/contexts/dashboard-filters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeaderActions({ className }: { className?: string }) {
  const { lastUpdated } = useDashboardFilters();

  const handleExport = () => {
    /* no-op until PDF export is wired */
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3",
        className,
      )}
    >
      <span className="font-sans text-[10px] tracking-[0.08em] uppercase text-[#888888] sm:text-xs">
        Last updated: {formatLastUpdated(lastUpdated)}
      </span>
      <Button
        variant="secondary"
        size="sm"
        className="w-full gap-2 sm:w-auto"
        onClick={handleExport}
      >
        <Download className="size-3.5" strokeWidth={1.5} />
        Export PDF
      </Button>
    </div>
  );
}
