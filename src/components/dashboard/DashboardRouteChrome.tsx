"use client";

import { usePathname } from "next/navigation";
import { GlobalFilterBar } from "./GlobalFilterBar";
import { TLDRPanel } from "./tldr/TLDRPanel";

interface DashboardRouteChromeProps {
  children: React.ReactNode;
}

export function DashboardRouteChrome({ children }: DashboardRouteChromeProps) {
  const pathname = usePathname();
  const isDashboardHome = pathname === "/";

  return (
    <>
      {isDashboardHome ? (
        <div className="print:hidden">
          <GlobalFilterBar />
        </div>
      ) : null}

      <div className="flex items-start gap-0 px-4 py-6 sm:px-6 sm:py-8 lg:gap-8 lg:px-8 lg:py-10">
        <main className="min-w-0 flex-1 pb-20 sm:pb-24 xl:pb-0 print:w-full print:pb-0">{children}</main>
        {isDashboardHome ? (
          <div className="print:hidden">
            <TLDRPanel />
          </div>
        ) : null}
      </div>
    </>
  );
}
