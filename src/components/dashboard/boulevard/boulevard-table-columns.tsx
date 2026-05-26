import type { BoulevardAppointmentRow } from "@/types/dashboard";
import type { SortableColumn } from "@/components/dashboard/shared/SortableTable";

function formatRevenue(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDuration(minutes: number): string {
  if (minutes <= 0) return "—";
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  return `${month}/${day}/${year}`;
}

export const boulevardAppointmentColumns: SortableColumn<BoulevardAppointmentRow>[] =
  [
    {
      id: "clientName",
      label: "Client",
      sortable: true,
      sortValue: (r) => r.clientName,
      cell: (r) => (
        <span className="font-normal text-heading">{r.clientName}</span>
      ),
    },
    {
      id: "date",
      label: "Date",
      sortable: true,
      sortValue: (r) => r.date,
      cell: (r) => formatDate(r.date),
    },
    {
      id: "serviceNames",
      label: "Services",
      sortable: true,
      sortValue: (r) => r.serviceNames,
      className: "max-w-[220px]",
      cell: (r) => (
        <span
          className="block max-w-[220px] truncate"
          title={r.serviceNames}
        >
          {r.serviceNames}
        </span>
      ),
    },
    {
      id: "categoryNames",
      label: "Category",
      sortable: true,
      sortValue: (r) => r.categoryNames,
      cell: (r) => r.categoryNames,
    },
    {
      id: "staffName",
      label: "Staff",
      sortable: true,
      sortValue: (r) => r.staffName,
      cell: (r) => r.staffName,
    },
    {
      id: "totalDurationMin",
      label: "Duration",
      sortable: true,
      sortValue: (r) => r.totalDurationMin,
      cell: (r) => formatDuration(r.totalDurationMin),
    },
    {
      id: "totalRevenue",
      label: "Revenue",
      sortable: true,
      sortValue: (r) => r.totalRevenue,
      cell: (r) => formatRevenue(r.totalRevenue),
    },
  ];
