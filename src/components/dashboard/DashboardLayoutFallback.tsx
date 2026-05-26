/** Placeholder while dashboard chrome loads (client-only to avoid extension hydration noise). */
export function DashboardLayoutFallback() {
  return (
    <div
      className="min-h-screen bg-background"
      aria-busy="true"
      aria-label="Loading dashboard"
    />
  );
}
