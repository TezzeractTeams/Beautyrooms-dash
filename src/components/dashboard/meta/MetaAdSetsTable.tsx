"use client";

import type { MetaAdSetRow } from "@/types/dashboard";
import { SortableTable } from "../shared/SortableTable";
import { metaAdSetColumns } from "./meta-table-columns";

interface MetaAdSetsTableProps {
  rows: MetaAdSetRow[];
}

export function MetaAdSetsTable({ rows }: MetaAdSetsTableProps) {
  return (
    <SortableTable
      rows={rows}
      columns={metaAdSetColumns}
      getRowKey={(r) => r.id}
    />
  );
}
