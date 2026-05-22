"use client";

import type { GoogleAdRow } from "@/types/dashboard";
import { SortableTable } from "../shared/SortableTable";
import { googleAdColumns } from "./google-table-columns";

export function GoogleAdsTable({ rows }: { rows: GoogleAdRow[] }) {
  return (
    <SortableTable
      rows={rows}
      columns={googleAdColumns}
      getRowKey={(r) => r.id}
    />
  );
}
