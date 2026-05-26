interface MetaTokenResponse {
  access_token?: string;
  expires_in?: number;
  error?: { message?: string };
}

export async function exchangeMetaShortLivedToken(shortLivedToken: string) {
  const params = new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: process.env.FACEBOOK_CLIENT_ID!,
    client_secret: process.env.FACEBOOK_CLIENT_SECRET!,
    fb_exchange_token: shortLivedToken,
  });

  const response = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?${params}`,
  );
  const data = (await response.json()) as MetaTokenResponse;

  if (!response.ok || !data.access_token) {
    throw new Error(data.error?.message ?? "Failed to exchange Meta access token");
  }

  return {
    accessToken: data.access_token,
    expiresAt: data.expires_in
      ? Math.floor(Date.now() / 1000) + data.expires_in
      : Math.floor(Date.now() / 1000) + 60 * 24 * 60,
  };
}

/** Re-exchange a long-lived Meta token before it expires. */
export async function refreshMetaAccessToken(accessToken: string) {
  return exchangeMetaShortLivedToken(accessToken);
}
