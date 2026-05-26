"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Settings } from "lucide-react";
import { formatLastUpdated, useDashboardFilters } from "@/contexts/dashboard-filters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeaderActions({ className }: { className?: string }) {
  const { lastUpdated } = useDashboardFilters();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExport = () => {
    window.print();
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3",
        className,
      )}
    >
      <span className="font-sans text-[10px] tracking-[0.08em] uppercase text-[#888888] sm:text-xs">
        Last updated:{" "}
        {mounted ? formatLastUpdated(lastUpdated) : "—"}
      </span>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 print:hidden">
        <Button
          variant="secondary"
          size="sm"
          className="w-full gap-2 sm:w-auto"
          onClick={handleExport}
        >
          <Download className="size-3.5" strokeWidth={1.5} />
          Export PDF
        </Button>
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="w-full gap-2 sm:w-auto"
        >
          <Link href="/settings">
            <Settings className="size-3.5" strokeWidth={1.5} />
            Settings
          </Link>
        </Button>
      </div>
    </div>
  );
}
