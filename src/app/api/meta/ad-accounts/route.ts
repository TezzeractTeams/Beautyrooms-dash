import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { fetchMetaAdAccounts } from "@/lib/meta/ad-accounts";
import { resolveMetaAdAccountId } from "@/lib/meta/resolve-ad-account";

export async function GET() {
  const session = await auth();

  if (!session?.meta?.accessToken) {
    return NextResponse.json(
      { error: "Connect Meta to list ad accounts." },
      { status: 401 },
    );
  }

  if (session.meta.error === "RefreshAccessTokenError") {
    return NextResponse.json(
      { error: "Meta session expired. Please connect again." },
      { status: 401 },
    );
  }

  try {
    const accounts = await fetchMetaAdAccounts(session.meta.accessToken);

    return NextResponse.json({
      accounts,
      selectedAdAccountId: resolveMetaAdAccountId(session.meta),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch ad accounts";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
