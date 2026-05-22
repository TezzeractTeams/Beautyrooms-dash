import Image from "next/image";
import { GlobalFilterBar } from "./GlobalFilterBar";
import { HeaderActions } from "./HeaderActions";
import { TLDRPanel } from "./tldr/TLDRPanel";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-[rgba(232,232,227,0.5)] bg-background">
        <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6 sm:py-5 lg:px-8">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <Image
              src="/images/Logo.svg"
              alt="Beauty Rooms Clinic"
              width={120}
              height={40}
              className="h-8 w-auto sm:h-10"
              priority
            />
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-medium tracking-wide text-heading sm:text-xl">
                Beauty Rooms Clinic
              </p>
              <p className="font-sans text-[10px] tracking-[0.12em] uppercase text-[#888888] sm:text-xs">
                Marketing Dashboard
              </p>
            </div>
          </div>
          <HeaderActions className="w-full sm:w-auto" />
        </div>
        <GlobalFilterBar />
      </header>

      <div className="flex items-start gap-0 px-4 py-6 sm:px-6 sm:py-8 lg:gap-8 lg:px-8 lg:py-10">
        <main className="min-w-0 flex-1 pb-20 sm:pb-24 xl:pb-0">{children}</main>
        <TLDRPanel />
      </div>
    </div>
  );
}
