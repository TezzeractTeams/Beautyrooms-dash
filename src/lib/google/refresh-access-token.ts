interface RefreshTokenResponse {
  access_token?: string;
  expires_in?: number;
  error?: string;
}

export async function refreshGoogleAccessToken(refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const data = (await response.json()) as RefreshTokenResponse;

  if (!response.ok || !data.access_token || !data.expires_in) {
    throw new Error(data.error ?? "Failed to refresh Google access token");
  }

  return {
    accessToken: data.access_token,
    expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
  };
}
