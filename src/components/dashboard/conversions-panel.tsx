import type { KpiMetric, DataSource } from "@/types/dashboard";
import { PanelCard } from "./panel-card";

interface ConversionsPanelProps {
  title: string;
  metrics: KpiMetric[];
  source: DataSource;
}

export function ConversionsPanel({
  title,
  metrics,
  source,
}: ConversionsPanelProps) {
  return (
    <PanelCard title={title} source={source}>
      <dl className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex flex-col justify-center border border-[rgba(103,92,83,0.08)] bg-background px-4 py-5"
          >
            <dt className="font-sans text-[11px] tracking-[0.12em] uppercase text-[#888888]">
              {metric.label}
            </dt>
            <dd className="mt-2 font-sans text-2xl font-extralight tracking-[-0.02em] text-heading md:text-3xl">
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>
    </PanelCard>
  );
}
