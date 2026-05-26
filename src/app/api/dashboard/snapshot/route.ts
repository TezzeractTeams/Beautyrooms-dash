import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { APP_SESSION_COOKIE, verifyAppSessionToken } from "@/lib/auth/app-session";
import { getDb } from "@/lib/db/mongodb";
import type { DashboardSnapshot } from "@/lib/db/snapshot-types";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(APP_SESSION_COOKIE)?.value;

  if (!(await verifyAppSessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const doc = await db
      .collection<DashboardSnapshot>("snapshots")
      .findOne({ key: "latest" });

    if (!doc) {
      return NextResponse.json({ snapshot: null });
    }

    // Strip MongoDB _id before sending to client
    const { _id: _, ...snapshot } = doc as DashboardSnapshot & { _id: unknown };

    return NextResponse.json({ snapshot });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load snapshot";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
