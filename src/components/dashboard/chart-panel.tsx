import type { ChartPoint, DataSource } from "@/types/dashboard";
import { MockLineChart } from "./mock-line-chart";
import { PanelCard } from "./panel-card";

interface ChartPanelProps {
  title: string;
  subtitle?: string;
  points: ChartPoint[];
  source: DataSource;
}

export function ChartPanel({ title, subtitle, points, source }: ChartPanelProps) {
  return (
    <PanelCard title={title} subtitle={subtitle} source={source}>
      <MockLineChart points={points} />
    </PanelCard>
  );
}
