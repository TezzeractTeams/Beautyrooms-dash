"use client";

import type { TLDRBullet, TLDRSentiment } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { highlightTLDRText } from "./highlight-tldr-text";

const SENTIMENT_STYLES: Record<
  TLDRSentiment,
  { dot: string; card: string }
> = {
  positive: {
    dot: "bg-status-positive",
    card: "border-l-status-positive/50 bg-status-positive/5",
  },
  negative: {
    dot: "bg-status-negative",
    card: "border-l-status-negative/50 bg-status-negative/5",
  },
  neutral: {
    dot: "bg-status-warning",
    card: "border-l-status-warning/40 bg-muted/60",
  },
};

interface TLDRBulletListProps {
  bullets: TLDRBullet[];
  showPredictionPill?: boolean;
}

export function TLDRBulletList({
  bullets,
  showPredictionPill = false,
}: TLDRBulletListProps) {
  return (
    <ul className="space-y-3">
      {bullets.map((bullet, index) => {
        const styles = SENTIMENT_STYLES[bullet.sentiment];
        return (
          <li
            key={bullet.id}
            className={cn(
              "dashboard-fade-up border-l-2 py-2.5 pl-3 pr-1",
              styles.card,
            )}
            style={{
              ["--enter-delay" as string]: `${Math.min(index, 8) * 45}ms`,
            }}
          >
            <div className="flex gap-2.5">
              <span
                className={cn("mt-2 size-2 shrink-0", styles.dot)}
                aria-hidden
              />
              <p className="font-sans text-base font-light leading-relaxed text-[#2D2926]/85">
                {showPredictionPill ? (
                  <span className="mb-1.5 mr-1.5 inline-flex border border-border bg-background px-1.5 py-0.5 font-sans text-[9px] tracking-[0.08em] uppercase text-warm-brown">
                    prediction
                  </span>
                ) : null}
                {highlightTLDRText(bullet.text)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
