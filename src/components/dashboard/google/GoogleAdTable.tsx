"use client";

import type { GoogleAdUnitRow } from "@/types/dashboard";
import { SortableTable } from "../shared/SortableTable";
import { googleAdUnitColumns } from "./google-table-columns";

/** Ad unit / creative rows */
export function GoogleAdTable({ rows }: { rows: GoogleAdUnitRow[] }) {
  return (
    <SortableTable
      rows={rows}
      columns={googleAdUnitColumns}
      getRowKey={(r) => r.id}
    />
  );
}
