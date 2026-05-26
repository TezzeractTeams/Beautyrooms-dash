import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { APP_SESSION_COOKIE, verifyAppSessionToken } from "@/lib/auth/app-session";
import { auth } from "@/auth";
import { fetchGa4Overview } from "@/lib/google/ga4";
import { fetchMetaAdsOverview, fetchMetaAdsData } from "@/lib/meta/ads";
import { resolveMetaAdAccountId } from "@/lib/meta/resolve-ad-account";
import { fetchBoulevardAppointments } from "@/lib/boulevard/appointments";
import { getBoulevardCredentials } from "@/lib/boulevard/auth";
import { getDb } from "@/lib/db/mongodb";
import type { DashboardSnapshot, SyncResult } from "@/lib/db/snapshot-types";

function getDefaultDateRange() {
  const until = new Date().toISOString().slice(0, 10);
  const since = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  return { since, until };
}

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(APP_SESSION_COOKIE)?.value;

  if (!(await verifyAppSessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await auth();
  const { since, until } = getDefaultDateRange();

  const syncResult: SyncResult = {
    ga4: "skipped",
    meta: "skipped",
    boulevard: "skipped",
  };

  const snapshot: Omit<DashboardSnapshot, "key"> = {
    syncedAt: new Date().toISOString(),
    dateRange: { since, until },
    ga4: null,
    meta: null,
    boulevard: null,
    syncResult,
  };

  // ── GA4 ──────────────────────────────────────────────────────────────────
  const googleAccessToken = session?.google?.accessToken;
  const propertyId = process.env.GA4_PROPERTY_ID;

  if (googleAccessToken && propertyId) {
    try {
      const metrics = await fetchGa4Overview(
        googleAccessToken,
        propertyId,
        since,
        until,
      );
      snapshot.ga4 = metrics;
      syncResult.ga4 = "ok";
    } catch (err) {
      syncResult.ga4 = "error";
      syncResult.ga4Error =
        err instanceof Error ? err.message : "Failed to fetch GA4 data";
    }
  } else {
    syncResult.ga4 = "skipped";
    syncResult.ga4Error = googleAccessToken
      ? "GA4_PROPERTY_ID not configured"
      : "Google not connected";
  }

  // ── Meta ──────────────────────────────────────────────────────────────────
  const metaAccessToken = session?.meta?.accessToken;
  const adAccountId = resolveMetaAdAccountId(session?.meta);

  if (
    metaAccessToken &&
    adAccountId &&
    !session?.meta?.error
  ) {
    try {
      const [overview, adsData] = await Promise.all([
        fetchMetaAdsOverview(metaAccessToken, adAccountId, since, until),
        fetchMetaAdsData(metaAccessToken, adAccountId, since, until),
      ]);

      snapshot.meta = {
        overview,
        chart: adsData.chart,
        campaigns: adsData.campaigns,
        adSets: adsData.adSets,
        ads: adsData.ads,
      };
      syncResult.meta = "ok";
    } catch (err) {
      syncResult.meta = "error";
      syncResult.metaError =
        err instanceof Error ? err.message : "Failed to fetch Meta data";
    }
  } else {
    syncResult.meta = "skipped";
    syncResult.metaError = metaAccessToken
      ? adAccountId
        ? "Meta session error"
        : "No Meta ad account selected"
      : "Meta not connected";
  }

  // ── Boulevard ─────────────────────────────────────────────────────────────
  if (getBoulevardCredentials()) {
    try {
      const result = await fetchBoulevardAppointments(since, until);
      snapshot.boulevard = {
        appointments: result.rows,
        kpis: result.kpis,
      };
      syncResult.boulevard = "ok";
    } catch (err) {
      syncResult.boulevard = "error";
      syncResult.boulevardError =
        err instanceof Error ? err.message : "Failed to fetch Boulevard data";
    }
  } else {
    syncResult.boulevard = "skipped";
    syncResult.boulevardError = "Boulevard credentials not configured";
  }

  // ── Save to MongoDB ────────────────────────────────────────────────────────
  try {
    const db = await getDb();
    await db.collection("snapshots").updateOne(
      { key: "latest" },
      { $set: { key: "latest", ...snapshot } },
      { upsert: true },
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save to database";
    return NextResponse.json(
      { error: `Sync completed but failed to save: ${message}`, syncResult },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    syncedAt: snapshot.syncedAt,
    dateRange: snapshot.dateRange,
    syncResult,
  });
}
