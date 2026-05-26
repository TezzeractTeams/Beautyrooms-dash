import { NextResponse, type NextRequest } from "next/server";
import {
  APP_SESSION_COOKIE,
  verifyAppSessionToken,
} from "@/lib/auth/app-session";

function isPublicPath(pathname: string): boolean {
  if (pathname === "/login") return true;
  if (pathname === "/api/login") return true;
  if (pathname.startsWith("/api/auth")) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(APP_SESSION_COOKIE)?.value;
  const isLoggedIn = await verifyAppSessionToken(token);

  if (!isLoggedIn && !isPublicPath(pathname)) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    if (pathname !== "/") {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
