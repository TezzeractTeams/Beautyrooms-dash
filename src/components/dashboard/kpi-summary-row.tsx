import type { KpiColumn } from "@/types/dashboard";
import { SourceBadge } from "./source-badge";

interface KpiSummaryRowProps {
  columns: KpiColumn[];
}

export function KpiSummaryRow({ columns }: KpiSummaryRowProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
      {columns.map((column, index) => (
        <div
          key={index}
          className="border border-[rgba(103,92,83,0.08)] bg-surface px-4 py-3 md:px-5 md:py-4"
        >
          {column.source ? (
            <div className="mb-2">
              <SourceBadge source={column.source} />
            </div>
          ) : null}
          <dl className="space-y-2">
            {column.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="font-sans text-[11px] tracking-[0.12em] uppercase text-[#888888]">
                  {metric.label}
                </dt>
                <dd className="font-sans text-xl font-extralight tracking-[-0.02em] text-heading md:text-2xl">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
