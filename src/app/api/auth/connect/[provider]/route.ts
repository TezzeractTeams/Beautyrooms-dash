import { NextResponse } from "next/server";
import { signIn } from "@/auth";
import { stashProviderTokensForMerge } from "@/lib/auth/provider-merge-stash";
import { readSessionToken } from "@/lib/auth/session-token";

const PROVIDERS = {
  google: "google",
  facebook: "facebook",
} as const;

type ConnectProvider = keyof typeof PROVIDERS;

function isConnectProvider(value: string): value is ConnectProvider {
  return value in PROVIDERS;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;

  if (!isConnectProvider(provider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  const requestUrl = new URL(request.url);
  const callbackUrl =
    requestUrl.searchParams.get("callbackUrl") ??
    `${requestUrl.origin}/settings`;

  const existing = await readSessionToken();
  if (existing) {
    await stashProviderTokensForMerge(existing);
  }

  await signIn(PROVIDERS[provider], { redirectTo: callbackUrl });
}
