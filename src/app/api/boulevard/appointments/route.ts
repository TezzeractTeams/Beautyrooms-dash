import { NextResponse } from "next/server";
import { getBoulevardCredentials } from "@/lib/boulevard/auth";
import { fetchBoulevardAppointments } from "@/lib/boulevard/appointments";

function getDateRange(searchParams: URLSearchParams): {
  since: string;
  until: string;
} {
  const today = new Date();
  const until = today.toISOString().slice(0, 10);

  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  const since = thirtyDaysAgo.toISOString().slice(0, 10);

  return {
    since: searchParams.get("since") ?? since,
    until: searchParams.get("until") ?? until,
  };
}

export async function GET(request: Request) {
  if (!getBoulevardCredentials()) {
    return NextResponse.json(
      { error: "Boulevard is not configured" },
      { status: 500 },
    );
  }

  const { since, until } = getDateRange(new URL(request.url).searchParams);

  try {
    const result = await fetchBoulevardAppointments(since, until);

    return NextResponse.json({
      dateRange: { since, until },
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch Boulevard appointments";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
