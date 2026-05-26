"use client";

import type { MetricSource } from "@/types/dashboard";
import { useColumnVisibility } from "@/hooks/useColumnVisibility";
import { SourceBadge } from "./SourceBadge";
import { MobileAccordion, type AccordionItem } from "./MobileAccordion";
import { TabGroup, type TabOption } from "./TabGroup";
import { TableColumnPicker } from "./TableColumnPicker";
import { SortableTable, type SortableColumn } from "./SortableTable";

export interface TablePanelConfig<T> {
  rows: T[];
  columns: SortableColumn<T>[];
  getRowKey: (row: T) => string;
  tableId: string;
  pinnedColumnIds?: string[];
  emptyMessage?: string;
}

interface ResponsiveTablePanelProps<T extends string> {
  tabs: TabOption<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  source: MetricSource;
  ariaLabel: string;
  /** Each tab may use a different row type */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tables: Record<T, TablePanelConfig<any>>;
}

export function ResponsiveTablePanel<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  source,
  ariaLabel,
  tables,
}: ResponsiveTablePanelProps<T>) {
  const activeConfig = tables[activeTab];
  const { visibleColumns, hiddenColumns, hideColumn, showColumn, canHide } =
    useColumnVisibility(
      activeConfig.columns,
      activeConfig.tableId,
      activeConfig.pinnedColumnIds ?? ["name"],
    );

  const activeTable = (
    <SortableTable
      rows={activeConfig.rows}
      columns={visibleColumns}
      getRowKey={activeConfig.getRowKey}
      onHideColumn={hideColumn}
      canHideColumn={canHide}
      emptyMessage={activeConfig.emptyMessage}
    />
  );

  const columnPicker = (
    <TableColumnPicker
      hiddenColumns={hiddenColumns as SortableColumn<any>[]}
      onShowColumn={showColumn}
    />
  );

  const accordionItems: AccordionItem[] = tabs.map((tab) => {
    const config = tables[tab.value];
    return {
      id: tab.value,
      title: tab.label,
      content: <TabTableContent config={config} />,
    };
  });

  return (
    <div className="border border-[rgba(103,92,83,0.08)] bg-surface">
      <div className="hidden flex-wrap items-center justify-between gap-4 border-b border-border px-5 pt-4 md:flex print:flex">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          <TabGroup
            tabs={tabs}
            value={activeTab}
            onChange={onTabChange}
            ariaLabel={ariaLabel}
          />
          {columnPicker}
        </div>
        <SourceBadge source={source} className="mb-2 shrink-0" />
      </div>
      <div className="hidden md:block print:block" role="tabpanel">
        {activeTable}
      </div>

      <div className="md:hidden print:hidden">
        <div className="flex flex-col gap-2 border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs tracking-[0.12em] uppercase text-[#888888]">
              {ariaLabel}
            </span>
            <SourceBadge source={source} />
          </div>
          {columnPicker}
        </div>
        <MobileAccordion
          items={accordionItems}
          openId={activeTab}
          onOpenChange={(id) => {
            if (id) onTabChange(id as T);
          }}
        />
      </div>
    </div>
  );
}

function TabTableContent<T>({ config }: { config: TablePanelConfig<T> }) {
  const { visibleColumns, hideColumn, canHide } = useColumnVisibility(
    config.columns,
    config.tableId,
    config.pinnedColumnIds ?? ["name"],
  );

  return (
    <SortableTable
      rows={config.rows}
      columns={visibleColumns}
      getRowKey={config.getRowKey}
      onHideColumn={hideColumn}
      canHideColumn={canHide}
      emptyMessage={config.emptyMessage}
    />
  );
}
