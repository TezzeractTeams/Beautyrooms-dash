import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { fetchGa4Overview } from "@/lib/google/ga4";

function getDateRange(searchParams: URLSearchParams) {
  const startDate = searchParams.get("startDate") ?? "30daysAgo";
  const endDate = searchParams.get("endDate") ?? "today";
  return { startDate, endDate };
}

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.google?.accessToken) {
    return NextResponse.json(
      { error: "Connect Google to view analytics." },
      { status: 401 },
    );
  }

  if (session.google.error === "RefreshAccessTokenError") {
    return NextResponse.json(
      { error: "Google session expired. Please sign in again." },
      { status: 401 },
    );
  }

  const propertyId = process.env.GA4_PROPERTY_ID;

  if (!propertyId) {
    return NextResponse.json(
      { error: "GA4_PROPERTY_ID is not configured" },
      { status: 500 },
    );
  }

  const accessToken = session.google.accessToken;

  const { startDate, endDate } = getDateRange(new URL(request.url).searchParams);

  try {
    const metrics = await fetchGa4Overview(
      accessToken,
      propertyId,
      startDate,
      endDate,
    );

    return NextResponse.json({
      propertyId,
      dateRange: { startDate, endDate },
      metrics,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch GA4 overview";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
