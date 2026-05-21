import type { DataSource, LeadStage } from "@/types/dashboard";
import { DonutStat } from "./donut-stat";
import { PanelCard } from "./panel-card";

interface LeadsKpiPanelProps {
  title: string;
  stages: LeadStage[];
  source: DataSource;
}

export function LeadsKpiPanel({ title, stages, source }: LeadsKpiPanelProps) {
  const max = Math.max(...stages.map((s) => s.value), 1);

  return (
    <PanelCard title={title} source={source}>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-4">
        <div className="flex w-full flex-wrap items-end justify-center gap-8 md:gap-12">
          {stages.map((stage) => (
            <DonutStat
              key={stage.label}
              value={stage.value}
              percentage={stage.percentage}
              label={stage.label}
              size={120}
            />
          ))}
        </div>
        <div className="hidden w-full gap-3 md:grid md:grid-cols-3">
          {stages.map((stage) => (
            <div key={stage.label} className="space-y-1">
              <div className="h-2.5 overflow-hidden bg-border">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(stage.value / max) * 100}%` }}
                />
              </div>
              <p className="font-sans text-xs font-light text-[#2D2926]/65">
                {stage.percentage}% of funnel
              </p>
            </div>
          ))}
        </div>
      </div>
    </PanelCard>
  );
}
