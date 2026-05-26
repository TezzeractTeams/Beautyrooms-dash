import { cookies } from "next/headers";
import { decode, encode } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";

const CHUNK_SIZE = 3936; // 4096 - estimated cookie overhead (matches @auth/core)

export function usesSecureSessionCookies() {
  return (
    process.env.AUTH_URL?.startsWith("https://") ??
    process.env.NEXTAUTH_URL?.startsWith("https://") ??
    process.env.NODE_ENV === "production"
  );
}

export function getSessionCookieName() {
  return `${usesSecureSessionCookies() ? "__Secure-" : ""}authjs.session-token`;
}

function isSessionCookieName(name: string, prefix: string) {
  return name === prefix || name.startsWith(`${prefix}.`);
}

export function assembleSessionCookieValue(
  entries: Array<{ name: string; value: string }>,
  prefix: string,
): string | null {
  const sessionCookies = entries.filter((c) => isSessionCookieName(c.name, prefix));
  if (sessionCookies.length === 0) return null;

  const chunked = sessionCookies
    .filter((c) => c.name.startsWith(`${prefix}.`))
    .sort((a, b) => {
      const aIndex = Number.parseInt(a.name.split(".").pop() ?? "0", 10);
      const bIndex = Number.parseInt(b.name.split(".").pop() ?? "0", 10);
      return aIndex - bIndex;
    });

  if (chunked.length > 0) {
    return chunked.map((c) => c.value).join("");
  }

  return sessionCookies.find((c) => c.name === prefix)?.value ?? null;
}

export async function clearSessionCookies() {
  const prefix = getSessionCookieName();
  const cookieStore = await cookies();

  for (const cookie of cookieStore.getAll()) {
    if (isSessionCookieName(cookie.name, prefix)) {
      cookieStore.delete(cookie.name);
    }
  }
}

export async function writeSessionCookieValue(value: string) {
  const prefix = getSessionCookieName();
  const cookieStore = await cookies();

  await clearSessionCookies();

  const options = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: usesSecureSessionCookies(),
  };

  if (value.length <= CHUNK_SIZE) {
    cookieStore.set(prefix, value, options);
    return;
  }

  const chunkCount = Math.ceil(value.length / CHUNK_SIZE);
  for (let i = 0; i < chunkCount; i++) {
    cookieStore.set(
      `${prefix}.${i}`,
      value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
      options,
    );
  }
}

export async function readSessionToken(): Promise<JWT | null> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;

  const prefix = getSessionCookieName();
  const cookieStore = await cookies();
  const raw = assembleSessionCookieValue(cookieStore.getAll(), prefix);
  if (!raw) return null;

  return (await decode({
    token: raw,
    secret,
    salt: prefix,
  })) as JWT | null;
}

export async function writeSessionToken(token: JWT) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }

  const prefix = getSessionCookieName();
  const encoded = await encode({
    token,
    secret,
    salt: prefix,
  });

  await writeSessionCookieValue(encoded);
}

export async function updateSessionToken(
  updater: (token: JWT) => void,
): Promise<JWT | null> {
  const token = await readSessionToken();
  if (!token) return null;

  updater(token);
  await writeSessionToken(token);
  return token;
}
