import type { CampaignStatus } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const STYLES: Record<CampaignStatus, string> = {
  active: "bg-status-positive/15 text-status-positive border-status-positive/30",
  paused: "bg-status-warning/15 text-status-warning border-status-warning/30",
  ended: "bg-muted text-muted-foreground border-border",
};

const LABELS: Record<CampaignStatus, string> = {
  active: "Active",
  paused: "Paused",
  ended: "Ended",
};

interface StatusBadgeProps {
  status: CampaignStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex px-2 py-0.5 font-sans text-xs tracking-wide capitalize",
        "border",
        STYLES[status],
        className,
      )}
    >
      {LABELS[status]}
    </span>
  );
}
