import { cookies } from "next/headers";
import { decode, encode } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";
import type { MetaTokenBundle, ProviderTokenBundle } from "@/lib/auth/provider-tokens";
import { usesSecureSessionCookies } from "@/lib/auth/session-token";

const STASH_COOKIE = "auth-provider-merge-pending";
const STASH_MAX_AGE_SEC = 600;

interface StashedProviders {
  google?: ProviderTokenBundle;
  meta?: MetaTokenBundle;
}

/** Save provider tokens before OAuth redirect (session cookie may be replaced). */
export async function stashProviderTokensForMerge(token: JWT): Promise<void> {
  if (!token.google?.accessToken && !token.meta?.accessToken) return;

  const secret = process.env.AUTH_SECRET;
  if (!secret) return;

  const payload: StashedProviders = {};
  if (token.google?.accessToken) payload.google = token.google;
  if (token.meta?.accessToken) payload.meta = token.meta;

  const encoded = await encode({
    token: payload,
    secret,
    salt: STASH_COOKIE,
  });

  const cookieStore = await cookies();
  cookieStore.set(STASH_COOKIE, encoded, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: usesSecureSessionCookies(),
    maxAge: STASH_MAX_AGE_SEC,
  });
}

/** Restore stashed tokens after OAuth callback; clears the stash cookie. */
export async function consumeStashedProviderTokens(): Promise<StashedProviders | null> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;

  const cookieStore = await cookies();
  const raw = cookieStore.get(STASH_COOKIE)?.value;
  if (!raw) return null;

  cookieStore.delete(STASH_COOKIE);

  return (await decode({
    token: raw,
    secret,
    salt: STASH_COOKIE,
  })) as StashedProviders | null;
}
