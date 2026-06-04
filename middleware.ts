import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

/**
 * Protect checkout routes.
 * If the user is not logged in, send them to login and remember where they wanted to go.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout"],
};
