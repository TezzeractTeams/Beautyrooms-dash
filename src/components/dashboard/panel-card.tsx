import { cn } from "@/lib/utils";
import { SourceBadge } from "./source-badge";
import type { DataSource } from "@/types/dashboard";

interface PanelCardProps {
  title: string;
  subtitle?: string;
  source?: DataSource;
  children: React.ReactNode;
  className?: string;
}

export function PanelCard({
  title,
  subtitle,
  source,
  children,
  className,
}: PanelCardProps) {
  return (
    <section
      className={cn(
        "flex min-h-0 flex-col border border-[rgba(103,92,83,0.08)] bg-surface p-4 md:p-5",
        className,
      )}
    >
      <header className="mb-4 flex items-start justify-between gap-2 border-b border-border pb-3">
        <div>
          <h2 className="font-sans text-xl font-extralight tracking-[-0.02em] text-heading">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-0.5 font-sans text-sm font-light text-[#2D2926]/65">
              {subtitle}
            </p>
          ) : null}
        </div>
        {source ? <SourceBadge source={source} /> : null}
      </header>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </section>
  );
}
