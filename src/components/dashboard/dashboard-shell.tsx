interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-[rgba(232,232,227,0.5)] bg-background px-6 py-4 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center border border-[rgba(103,92,83,0.12)] bg-surface font-sans text-xs tracking-[0.08em] text-warm-brown"
              aria-hidden
            >
              BR
            </div>
            <div>
              <p className="font-[family-name:var(--font-cormorant)] text-lg font-medium tracking-wide text-heading">
                Beauty Rooms Clinic
              </p>
              <p className="font-sans text-[11px] tracking-[0.12em] uppercase text-[#888888]">
                Dashboard
              </p>
            </div>
          </div>
          <p className="hidden font-sans text-xs font-light tracking-[0.05em] text-[#2D2926]/65 sm:block">
            Mock data — APIs coming soon
          </p>
        </div>
      </header>
      <main className="flex-1 px-6 py-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
