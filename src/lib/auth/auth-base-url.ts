/** Origin from AUTH_URL / NEXTAUTH_URL (no path). NextAuth uses this for OAuth redirect URIs. */
export function getConfiguredAuthOrigin(): string | null {
  const raw = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

export function getRequestOrigin(request: Request): string {
  return new URL(request.url).origin;
}

/**
 * When AUTH_URL is set, Auth.js replaces the request host with that origin for OAuth.
 * If production still has a dev ngrok AUTH_URL, users are sent to the wrong callback.
 */
export function getAuthUrlMismatch(
  request: Request,
): { configured: string; request: string } | null {
  const configured = getConfiguredAuthOrigin();
  if (!configured) return null;

  const requestOrigin = getRequestOrigin(request);
  if (configured === requestOrigin) return null;

  return { configured, request: requestOrigin };
}
