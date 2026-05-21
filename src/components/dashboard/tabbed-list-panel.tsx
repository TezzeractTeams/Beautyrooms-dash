"use client";

import { useState } from "react";
import type { TabbedListData, TabKey } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { PanelCard } from "./panel-card";

const TAB_LABELS: { key: TabKey; label: string }[] = [
  { key: "campaigns", label: "Campaign" },
  { key: "ads", label: "Ads" },
  { key: "adGroups", label: "Ad Groups" },
];

interface TabbedListPanelProps {
  title?: string;
  data: TabbedListData;
  defaultTab?: TabKey;
}

export function TabbedListPanel({
  title = "Performance",
  data,
  defaultTab = "campaigns",
}: TabbedListPanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab);
  const items = data[activeTab];

  return (
    <PanelCard title={title}>
      <div className="flex flex-1 flex-col gap-4">
        <div
          className="flex border-b border-border"
          role="tablist"
          aria-label={title}
        >
          {TAB_LABELS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-4 py-2.5 font-sans text-sm tracking-[0.05em] transition-colors",
                activeTab === tab.key
                  ? "border-b-2 border-warm-brown text-warm-brown"
                  : "text-warm-brown/70 hover:bg-muted hover:text-warm-brown",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <ul className="flex flex-1 flex-col gap-2" role="tabpanel">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 border border-[rgba(103,92,83,0.08)] bg-background px-4 py-3"
            >
              <span className="font-sans text-sm font-light text-[#2D2926]">
                {item.name}
              </span>
              <div className="flex shrink-0 gap-4 text-right">
                <span className="font-sans text-xs font-light text-[#2D2926]/65">
                  {item.spend}
                </span>
                <span className="font-sans text-xs tracking-wide text-warm-brown">
                  {item.performance}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </PanelCard>
  );
}
