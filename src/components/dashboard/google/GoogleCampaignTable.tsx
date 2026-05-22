"use client";

import type { GoogleCampaignRow } from "@/types/dashboard";
import { SortableTable } from "../shared/SortableTable";
import { googleCampaignColumns } from "./google-table-columns";

export function GoogleCampaignTable({ rows }: { rows: GoogleCampaignRow[] }) {
  return (
    <SortableTable
      rows={rows}
      columns={googleCampaignColumns}
      getRowKey={(r) => r.id}
    />
  );
}
