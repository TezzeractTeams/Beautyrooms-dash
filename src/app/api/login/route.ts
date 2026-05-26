import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  APP_SESSION_COOKIE,
  createAppSessionToken,
  getAppSessionCookieOptions,
  matchesAdminCredentials,
} from "@/lib/auth/app-session";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const username =
    typeof body === "object" &&
    body !== null &&
    "username" in body &&
    typeof body.username === "string"
      ? body.username
      : "";
  const password =
    typeof body === "object" &&
    body !== null &&
    "password" in body &&
    typeof body.password === "string"
      ? body.password
      : "";

  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Login is not configured" },
      { status: 500 },
    );
  }

  if (!matchesAdminCredentials(username, password)) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(
    APP_SESSION_COOKIE,
    await createAppSessionToken(),
    getAppSessionCookieOptions(),
  );

  return NextResponse.json({ ok: true });
}
