import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  // If trying to access dashboard without token, redirect to login
  if (!token && request.nextUrl.pathname.startsWith("/(dashboard)")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
