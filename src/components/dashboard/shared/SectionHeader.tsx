import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-5 sm:mb-6", className)}>
      <h2 className="font-sans text-2xl font-extralight tracking-[-0.02em] text-heading sm:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-1.5 font-sans text-sm font-light text-[#2D2926]/65 sm:mt-2 sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
