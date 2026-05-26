"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useDashboardFilters } from "@/contexts/dashboard-filters";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetCloseButton,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { TLDRContent } from "@/types/dashboard";
import { TLDRBulletList } from "./TLDRBulletList";
import { useTLDRContent } from "./useTLDRContent";

/** Fixed below sticky header + global filter bar */
const PANEL_TOP = "15.75rem";
const PANEL_HEIGHT = `calc(100vh - ${PANEL_TOP} - 2rem)`;

function TLDRBody({
  content,
  fade,
  showPredictionPill,
}: {
  content: TLDRContent;
  fade: boolean;
  showPredictionPill?: boolean;
}) {
  return (
    <div
      className={cn(
        "transition-opacity duration-200",
        fade ? "opacity-0" : "opacity-100",
      )}
    >
      <div className="space-y-5">
        <div>
          <p className="mb-3 font-sans text-[11px] tracking-[0.12em] uppercase text-[#888888]">
            This period
          </p>
          <TLDRBulletList bullets={content.summary} />
        </div>

        {content.predictions.length > 0 ? (
          <div className="border-t border-border pt-4">
            <p className="mb-3 font-sans text-[11px] tracking-[0.12em] uppercase text-[#888888]">
              Predictions
            </p>
            <TLDRBulletList
              bullets={content.predictions}
              showPredictionPill={showPredictionPill}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function TLDRPanel() {
  const { platform, dateRange } = useDashboardFilters();
  const [refreshKey, setRefreshKey] = useState(0);
  const [fade, setFade] = useState(false);
  const { content, loading } = useTLDRContent(platform, dateRange, refreshKey);

  const handleRefresh = () => {
    setFade(true);
    window.setTimeout(() => {
      setRefreshKey((k) => k + 1);
      setFade(false);
    }, 180);
  };

  const refreshing = loading;

  return (
    <>
      <aside className="hidden w-[280px] shrink-0 xl:block" aria-hidden />

      <div
        className="fixed right-6 z-20 hidden w-[280px] flex-col border border-[rgba(103,92,83,0.08)] bg-surface lg:right-8 xl:flex"
        style={{
          top: PANEL_TOP,
          height: PANEL_HEIGHT,
          maxHeight: PANEL_HEIGHT,
        }}
        aria-label="TLDR summary"
      >
        <div className="shrink-0 border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-medium tracking-wide text-heading">
              TLDR
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
              aria-label="Refresh summary"
            >
              <RefreshCw
                className={cn(
                  "size-4 text-warm-brown",
                  refreshing && "animate-spin",
                )}
                strokeWidth={1.5}
              />
            </Button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
          {loading && content.summary.length === 0 ? (
            <div className="space-y-3 pt-1">
              {[100, 80, 90, 70, 85].map((w) => (
                <div
                  key={w}
                  className="h-3 animate-pulse rounded bg-[rgba(103,92,83,0.1)]"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          ) : (
            <TLDRBody content={content} fade={fade} showPredictionPill />
          )}
        </div>
      </div>

      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 sm:right-6 xl:hidden">
        <MobileTLDRSheet
          content={content}
          fade={fade}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </div>
    </>
  );
}

function MobileTLDRSheet({
  content,
  fade,
  refreshing,
  onRefresh,
}: {
  content: TLDRContent;
  fade: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="default"
          size="sm"
          className="shadow-md sm:shadow-sm"
        >
          TLDR
        </Button>
      </SheetTrigger>
      <SheetContent aria-label="TLDR summary">
        <SheetHeader>
          <SheetTitle>TLDR</SheetTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={refreshing}
              aria-label="Refresh summary"
            >
              <RefreshCw
                className={cn(
                  "size-4 text-warm-brown",
                  refreshing && "animate-spin",
                )}
                strokeWidth={1.5}
              />
            </Button>
            <SheetCloseButton />
          </div>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <TLDRBody content={content} fade={fade} showPredictionPill />
        </div>
      </SheetContent>
    </Sheet>
  );
}
