"use client";

import type { MetaCampaignRow } from "@/types/dashboard";
import { SortableTable } from "../shared/SortableTable";
import { metaCampaignColumns } from "./meta-table-columns";

interface MetaCampaignTableProps {
  rows: MetaCampaignRow[];
}

export function MetaCampaignTable({ rows }: MetaCampaignTableProps) {
  return (
    <SortableTable
      rows={rows}
      columns={metaCampaignColumns}
      getRowKey={(r) => r.id}
    />
  );
}
