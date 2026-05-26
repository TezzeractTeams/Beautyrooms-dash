export const APP_SESSION_COOKIE = "brc_app_session";
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }
  return secret;
}

async function getHmacKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

function toBase64Url(bytes: ArrayBuffer): string {
  const binary = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function sign(value: string): Promise<string> {
  const key = await getHmacKey();
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toBase64Url(signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return mismatch === 0;
}

export async function createAppSessionToken(): Promise<string> {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC;
  const payload = `v1:${expiresAt}`;
  return `${payload}.${await sign(payload)}`;
}

export async function verifyAppSessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;

  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;

  const payload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);
  const expected = await sign(payload);

  if (!timingSafeEqual(signature, expected)) return false;

  const expiresAt = Number(payload.split(":")[1]);
  if (!Number.isFinite(expiresAt)) return false;

  return Math.floor(Date.now() / 1000) < expiresAt;
}

export function getAppSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  };
}

export function matchesAdminCredentials(
  username: string,
  password: string,
): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) return false;

  return username === expectedUsername && password === expectedPassword;
}
