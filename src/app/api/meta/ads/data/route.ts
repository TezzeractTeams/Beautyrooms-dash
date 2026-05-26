import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { fetchMetaAdsData } from "@/lib/meta/ads";
import { resolveMetaAdAccountId } from "@/lib/meta/resolve-ad-account";

function getDateRange(searchParams: URLSearchParams) {
  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const since = searchParams.get("since") ?? thirtyDaysAgo;
  const until = searchParams.get("until") ?? today;
  return { since, until };
}

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.meta?.accessToken) {
    return NextResponse.json(
      { error: "Connect Meta to view ads data." },
      { status: 401 },
    );
  }

  if (session.meta.error === "RefreshAccessTokenError") {
    return NextResponse.json(
      { error: "Meta session expired. Please connect again." },
      { status: 401 },
    );
  }

  const adAccountId = resolveMetaAdAccountId(session.meta);

  if (!adAccountId) {
    return NextResponse.json(
      { error: "Select a Meta ad account first." },
      { status: 400 },
    );
  }

  const { since, until } = getDateRange(new URL(request.url).searchParams);

  try {
    const data = await fetchMetaAdsData(
      session.meta.accessToken,
      adAccountId,
      since,
      until,
    );

    return NextResponse.json({
      adAccountId,
      dateRange: { since, until },
      ...data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch Meta Ads data";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
