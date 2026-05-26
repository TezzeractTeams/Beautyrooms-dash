import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateSessionToken } from "@/lib/auth/session-token";
import { fetchMetaAdAccounts } from "@/lib/meta/ad-accounts";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.meta?.accessToken) {
    return NextResponse.json({ error: "Connect Meta first." }, { status: 401 });
  }

  const body = (await request.json()) as {
    adAccountId?: string;
    adAccountName?: string;
  };

  if (!body.adAccountId) {
    return NextResponse.json({ error: "adAccountId is required" }, { status: 400 });
  }

  const adAccountId = body.adAccountId.startsWith("act_")
    ? body.adAccountId
    : `act_${body.adAccountId}`;

  let adAccountName = body.adAccountName;

  if (!adAccountName) {
    try {
      const accounts = await fetchMetaAdAccounts(session.meta.accessToken);
      adAccountName = accounts.find((a) => a.id === adAccountId)?.name;
    } catch {
      // name is optional
    }
  }

  const token = await updateSessionToken((jwt) => {
    if (!jwt.meta?.accessToken) return;
    jwt.meta.adAccountId = adAccountId;
    jwt.meta.adAccountName = adAccountName;
  });

  if (!token) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  return NextResponse.json({
    adAccountId,
    adAccountName: adAccountName ?? null,
  });
}
