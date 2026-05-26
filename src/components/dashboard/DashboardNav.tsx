"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/settings", label: "Settings" },
] as const;

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="flex items-center gap-1 border-b border-[rgba(232,232,227,0.5)] bg-background px-4 sm:px-6 lg:px-8"
    >
      {NAV_ITEMS.map(({ href, label }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "px-3 py-3 font-sans text-sm tracking-[0.05em] transition-colors",
              isActive
                ? "border-b-2 border-warm-brown text-warm-brown"
                : "text-warm-brown/70 hover:bg-muted hover:text-warm-brown",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
