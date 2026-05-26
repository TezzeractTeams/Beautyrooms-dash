import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { fetchMetaAdsOverview } from "@/lib/meta/ads";
import { resolveMetaAdAccountId } from "@/lib/meta/resolve-ad-account";

function getDateRange(searchParams: URLSearchParams) {
  const since =
    searchParams.get("since") ??
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const until = searchParams.get("until") ?? new Date().toISOString().slice(0, 10);
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
      { error: "Select a Meta ad account to view ads data." },
      { status: 400 },
    );
  }

  const accessToken = session.meta.accessToken;
  const { since, until } = getDateRange(new URL(request.url).searchParams);

  try {
    const metrics = await fetchMetaAdsOverview(accessToken, adAccountId, since, until);

    return NextResponse.json({
      adAccountId,
      dateRange: { since, until },
      metrics,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch Meta Ads overview";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
