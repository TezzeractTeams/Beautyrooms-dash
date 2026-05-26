import NextAuth from "next-auth";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";
import type {
  MetaTokenBundle,
  ProviderTokenBundle,
} from "@/lib/auth/provider-tokens";
import {
  consumeStashedProviderTokens,
} from "@/lib/auth/provider-merge-stash";
import { readSessionToken } from "@/lib/auth/session-token";
import { refreshGoogleAccessToken } from "@/lib/google/refresh-access-token";
import {
  fetchMetaAdAccounts,
  pickDefaultMetaAdAccount,
} from "@/lib/meta/ad-accounts";
import {
  exchangeMetaShortLivedToken,
  refreshMetaAccessToken,
} from "@/lib/meta/refresh-access-token";

/** Keep the other provider's tokens when linking Google + Meta on the same session. */
async function preserveOtherProviderTokens(
  token: JWT,
  signingInProvider: "google" | "facebook",
): Promise<void> {
  const existing = await readSessionToken();
  if (signingInProvider !== "google" && existing?.google?.accessToken) {
    token.google = existing.google;
  }
  if (signingInProvider !== "facebook" && existing?.meta?.accessToken) {
    token.meta = existing.meta;
  }

  const stashed = await consumeStashedProviderTokens();
  if (!stashed) return;

  if (
    signingInProvider !== "google" &&
    !token.google?.accessToken &&
    stashed.google?.accessToken
  ) {
    token.google = stashed.google;
  }
  if (
    signingInProvider !== "facebook" &&
    !token.meta?.accessToken &&
    stashed.meta?.accessToken
  ) {
    token.meta = stashed.meta;
  }
}

const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/analytics.readonly",
].join(" ");

/** ads_read covers Ads Insights API; read_insights is for Pages only and breaks OAuth */
const META_SCOPES = "ads_read";

function metaExpiresAtFromAccount(expiresAt: number | undefined): number {
  if (expiresAt) return expiresAt;
  return Math.floor(Date.now() / 1000) + 3600;
}

async function buildMetaTokenBundle(
  accessToken: string,
  expiresAt: number | undefined,
): Promise<MetaTokenBundle> {
  try {
    const longLived = await exchangeMetaShortLivedToken(accessToken);
    const meta: MetaTokenBundle = {
      accessToken: longLived.accessToken,
      expiresAt: longLived.expiresAt,
    };

    try {
      const accounts = await fetchMetaAdAccounts(longLived.accessToken);
      const defaultAccount = pickDefaultMetaAdAccount(
        accounts,
        process.env.META_AD_ACCOUNT_ID,
      );
      if (defaultAccount) {
        meta.adAccountId = defaultAccount.id;
        meta.adAccountName = defaultAccount.name;
      }
    } catch {
      // User can pick an ad account manually
    }

    return meta;
  } catch {
    // Long-lived exchange is optional; OAuth token still works for Marketing API
    const meta: MetaTokenBundle = {
      accessToken,
      expiresAt: metaExpiresAtFromAccount(expiresAt),
    };

    try {
      const accounts = await fetchMetaAdAccounts(accessToken);
      const defaultAccount = pickDefaultMetaAdAccount(
        accounts,
        process.env.META_AD_ACCOUNT_ID,
      );
      if (defaultAccount) {
        meta.adAccountId = defaultAccount.id;
        meta.adAccountName = defaultAccount.name;
      }
    } catch {
      // User can pick an ad account manually
    }

    return meta;
  }
}

async function refreshGoogleBundle(
  bundle: ProviderTokenBundle,
): Promise<ProviderTokenBundle> {
  if (!bundle.refreshToken) {
    return { ...bundle, error: "RefreshAccessTokenError" };
  }

  const refreshed = await refreshGoogleAccessToken(bundle.refreshToken);
  return {
    accessToken: refreshed.accessToken,
    refreshToken: bundle.refreshToken,
    expiresAt: refreshed.expiresAt,
    error: undefined,
  };
}

async function refreshMetaBundle(
  bundle: ProviderTokenBundle,
): Promise<ProviderTokenBundle> {
  if (!bundle.accessToken) {
    return { ...bundle, error: "RefreshAccessTokenError" };
  }

  const expiresAt = bundle.expiresAt ?? 0;
  const now = Math.floor(Date.now() / 1000);

  if (now < expiresAt - 60) {
    return { ...bundle, error: undefined };
  }

  try {
    const refreshed = await refreshMetaAccessToken(bundle.accessToken);
    return {
      accessToken: refreshed.accessToken,
      expiresAt: refreshed.expiresAt,
      error: undefined,
    };
  } catch {
    if (now < expiresAt) {
      return { ...bundle, error: undefined };
    }
    return { ...bundle, error: "RefreshAccessTokenError" };
  }
}

async function refreshProviderBundle(
  key: "google" | "meta",
  bundle: ProviderTokenBundle | undefined,
): Promise<ProviderTokenBundle | undefined> {
  if (!bundle?.accessToken) return bundle;

  const expiresAt = bundle.expiresAt ?? 0;
  if (Date.now() / 1000 < expiresAt - 60) {
    return { ...bundle, error: undefined };
  }

  try {
    return key === "google"
      ? await refreshGoogleBundle(bundle)
      : await refreshMetaBundle(bundle);
  } catch {
    if (Date.now() / 1000 < expiresAt) {
      return { ...bundle, error: undefined };
    }
    return { ...bundle, error: "RefreshAccessTokenError" };
  }
}

export async function getValidGoogleAccessToken(token: JWT) {
  const bundle = await refreshProviderBundle("google", token.google);
  if (bundle) token.google = bundle;
  return bundle?.accessToken ?? null;
}

export async function getValidMetaAccessToken(token: JWT) {
  const bundle = await refreshProviderBundle("meta", token.meta);
  if (bundle) token.meta = bundle;
  return bundle?.accessToken ?? null;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: GOOGLE_SCOPES,
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: META_SCOPES,
        },
      },
    }),
  ],
  pages: {
    error: "/settings",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "google") {
        await preserveOtherProviderTokens(token, "google");
        token.google = {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at ?? undefined,
        };
        return token;
      }

      if (account?.provider === "facebook" && account.access_token) {
        await preserveOtherProviderTokens(token, "facebook");
        token.meta = await buildMetaTokenBundle(
          account.access_token,
          account.expires_at ?? undefined,
        );
        return token;
      }

      if (token.google) {
        token.google = await refreshProviderBundle("google", token.google);
      }

      if (token.meta) {
        token.meta = await refreshProviderBundle("meta", token.meta);
      }

      return token;
    },
    async session({ session, token }) {
      session.google = token.google;
      session.meta = token.meta;

      // Back-compat for existing GA4 code paths
      session.accessToken = token.google?.accessToken;
      session.error = token.google?.error;

      return session;
    },
  },
});
