import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { APP_SESSION_COOKIE } from "@/lib/auth/app-session";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(APP_SESSION_COOKIE);

  return NextResponse.json({ ok: true });
}
