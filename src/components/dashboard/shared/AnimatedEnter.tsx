"use client";

import { cn } from "@/lib/utils";

interface AnimatedEnterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stagger delay in ms */
  delay?: number;
  /** Override animation duration in ms */
  durationMs?: number;
}

export function AnimatedEnter({
  children,
  className,
  delay = 0,
  durationMs,
  style,
  ...props
}: AnimatedEnterProps) {
  return (
    <div
      className={cn("dashboard-fade-up", className)}
      style={{
        ...style,
        ["--enter-delay" as string]: `${delay}ms`,
        ...(durationMs != null
          ? { animationDuration: `${durationMs}ms` }
          : undefined),
      }}
      {...props}
    >
      {children}
    </div>
  );
}
