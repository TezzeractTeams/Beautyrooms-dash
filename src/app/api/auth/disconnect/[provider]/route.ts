import { NextResponse } from "next/server";
import type { JWT } from "next-auth/jwt";
import {
  clearSessionCookies,
  readSessionToken,
  writeSessionToken,
} from "@/lib/auth/session-token";

type DisconnectProvider = "google" | "meta";

function isDisconnectProvider(value: string): value is DisconnectProvider {
  return value === "google" || value === "meta";
}

async function disconnect(provider: DisconnectProvider) {
  const token = await readSessionToken();

  if (!token) {
    return { ok: false as const, status: 401, error: "Not signed in" };
  }

  delete token[provider];

  if (!token.google?.accessToken && !token.meta?.accessToken) {
    await clearSessionCookies();
    return { ok: true as const, signedOut: true };
  }

  await writeSessionToken(token as JWT);
  return { ok: true as const, signedOut: false };
}

export async function GET(
  request: Request,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;

  if (!isDisconnectProvider(provider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  const result = await disconnect(provider);

  const requestUrl = new URL(request.url);
  const callbackUrl =
    requestUrl.searchParams.get("callbackUrl") ?? "/settings";

  if (!result.ok) {
    const errorUrl = new URL(callbackUrl, request.url);
    errorUrl.searchParams.set("error", "disconnect");
    return NextResponse.redirect(errorUrl);
  }

  return NextResponse.redirect(new URL(callbackUrl, request.url));
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;

  if (!isDisconnectProvider(provider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  const result = await disconnect(provider);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ disconnected: provider, signedOut: result.signedOut });
}
