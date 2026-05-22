"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface MobileAccordionProps {
  items: AccordionItem[];
  /** Controlled open section */
  openId?: string;
  defaultOpenId?: string;
  onOpenChange?: (id: string) => void;
  className?: string;
}

export function MobileAccordion({
  items,
  openId: controlledOpenId,
  defaultOpenId,
  onOpenChange,
  className,
}: MobileAccordionProps) {
  const [internalOpenId, setInternalOpenId] = useState(
    defaultOpenId ?? items[0]?.id ?? "",
  );

  const isControlled = controlledOpenId !== undefined;
  const openId = isControlled ? controlledOpenId : internalOpenId;

  const handleToggle = (id: string) => {
    const next = openId === id ? "" : id;
    if (!isControlled) setInternalOpenId(next);
    onOpenChange?.(next);
  };

  return (
    <div className={cn("divide-y divide-border", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-3.5 text-left font-sans text-base tracking-[0.05em] text-warm-brown"
              aria-expanded={isOpen}
              onClick={() => handleToggle(item.id)}
            >
              {item.title}
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
                strokeWidth={1.5}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-200 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-x-auto overflow-y-hidden">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
