import { cn } from "@/lib/utils";

interface SectionPlaceholderProps {
  children?: React.ReactNode;
  className?: string;
  minHeight?: string;
}

export function SectionPlaceholder({
  children,
  className,
  minHeight = "min-h-[120px]",
}: SectionPlaceholderProps) {
  return (
    <div
      className={cn(
        "border border-[rgba(103,92,83,0.08)] bg-surface p-6",
        minHeight,
        className,
      )}
    >
      {children ?? (
        <p className="font-sans text-sm font-light text-[#2D2926]/50">
          Content coming in a later phase
        </p>
      )}
    </div>
  );
}
