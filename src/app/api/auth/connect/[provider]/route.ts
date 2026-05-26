import { NextResponse } from "next/server";
import { signIn } from "@/auth";
import { getAuthUrlMismatch } from "@/lib/auth/auth-base-url";
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

  const mismatch = getAuthUrlMismatch(request);
  if (mismatch) {
    return NextResponse.json(
      {
        error:
          `OAuth is misconfigured: AUTH_URL is set to ${mismatch.configured} but this site is ${mismatch.request}. ` +
          "In your hosting dashboard, set AUTH_URL to your production URL (e.g. https://dashboard.beautyroomsclinic.com), " +
          "or remove AUTH_URL in production and rely on trustHost. Also update Google and Meta redirect URIs to match.",
      },
      { status: 500 },
    );
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
