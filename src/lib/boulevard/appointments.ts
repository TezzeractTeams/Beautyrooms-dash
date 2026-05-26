import { boulevardGraphql } from "@/lib/boulevard/client";
import type { BoulevardAppointmentRow, BoulevardKpis } from "@/types/dashboard";

const PAGE_SIZE = 100;
const MAX_PAGES = 5; // cap at 500 records total

const APPOINTMENTS_QUERY = `
  query ListAppointments($locationId: ID!, $first: Int!, $after: String, $filter: String!) {
    appointments(
      locationId: $locationId
      first: $first
      after: $after
      query: $filter
    ) {
      edges {
        node {
          id
          client {
            firstName
            lastName
          }
          appointmentServices {
            id
            startAt
            price
            duration
            service {
              name
              category {
                name
              }
            }
            staff {
              firstName
              lastName
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

interface RawService {
  name: string;
  category: { name: string } | null;
}

interface RawStaff {
  firstName: string;
  lastName: string;
}

interface RawAppointmentService {
  id: string;
  startAt: string;
  /** Price in cents */
  price: number;
  /** Duration in seconds */
  duration: number;
  service: RawService | null;
  staff: RawStaff | null;
}

interface RawAppointmentNode {
  id: string;
  client: { firstName: string; lastName: string } | null;
  appointmentServices: RawAppointmentService[];
}

interface AppointmentsQueryResponse {
  appointments: {
    edges: Array<{ node: RawAppointmentNode }>;
    pageInfo: {
      endCursor: string | null;
      hasNextPage: boolean;
    };
  };
}

function mapNodeToRow(node: RawAppointmentNode): BoulevardAppointmentRow {
  const services = node.appointmentServices ?? [];

  const sorted = [...services].sort((a, b) =>
    (a.startAt ?? "").localeCompare(b.startAt ?? ""),
  );

  const date = sorted[0]?.startAt?.slice(0, 10) ?? "";

  const serviceNames = services
    .map((s) => s.service?.name ?? "")
    .filter(Boolean)
    .join(", ");

  const categoryNames = [
    ...new Set(
      services.map((s) => s.service?.category?.name ?? "").filter(Boolean),
    ),
  ].join(", ");

  // price is in cents → convert to dollars
  const totalRevenue =
    services.reduce((sum, s) => sum + (s.price ?? 0), 0) / 100;

  // duration is already in minutes
  const totalDurationMin = services.reduce(
    (sum, s) => sum + (s.duration ?? 0),
    0,
  );

  const staffNames = [
    ...new Set(
      services
        .map((s) =>
          s.staff
            ? `${s.staff.firstName} ${s.staff.lastName}`.trim()
            : "",
        )
        .filter(Boolean),
    ),
  ];

  const staffName =
    staffNames.length === 0
      ? "Unassigned"
      : staffNames.length === 1
        ? (staffNames[0] ?? "Unassigned")
        : "Multiple";

  const clientName = node.client
    ? `${node.client.firstName} ${node.client.lastName}`.trim() ||
      "Unknown Client"
    : "Unknown Client";

  return {
    id: node.id,
    clientName,
    date,
    serviceNames: serviceNames || "—",
    categoryNames: categoryNames || "—",
    totalRevenue,
    totalDurationMin,
    staffName,
  };
}

export interface FetchBoulevardAppointmentsResult {
  rows: BoulevardAppointmentRow[];
  kpis: BoulevardKpis;
}

export async function fetchBoulevardAppointments(
  since: string,
  until: string,
): Promise<FetchBoulevardAppointmentsResult> {
  const locationId = process.env.BLVD_LOCATION_ID;

  if (!locationId) {
    throw new Error("BLVD_LOCATION_ID is not configured");
  }

  // Use exclusive end date so all times on `until` day are included
  const untilDate = new Date(until);
  untilDate.setDate(untilDate.getDate() + 1);
  const untilExclusive = untilDate.toISOString().slice(0, 10);

  const filter = `cancelled = false AND startAt >= '${since}' AND startAt < '${untilExclusive}'`;

  const allNodes: RawAppointmentNode[] = [];
  let cursor: string | null = null;
  let hasMore = true;
  let pages = 0;

  while (hasMore && pages < MAX_PAGES) {
    const data = await boulevardGraphql<AppointmentsQueryResponse>(
      APPOINTMENTS_QUERY,
      {
        locationId,
        first: PAGE_SIZE,
        after: cursor ?? undefined,
        filter,
      },
    );

    const { edges, pageInfo } = data.appointments;
    allNodes.push(...edges.map((e) => e.node));
    hasMore = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
    pages++;
  }

  const rows = allNodes.map(mapNodeToRow);

  const totalRevenue = rows.reduce((sum, r) => sum + r.totalRevenue, 0);
  const totalAppointments = rows.length;
  const totalServices = allNodes.reduce(
    (sum, n) => sum + n.appointmentServices.length,
    0,
  );

  const kpis: BoulevardKpis = {
    totalRevenue,
    totalAppointments,
    avgRevenue: totalAppointments > 0 ? totalRevenue / totalAppointments : 0,
    totalServices,
  };

  return { rows, kpis };
}
