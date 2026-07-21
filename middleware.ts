import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authUser = request.cookies.get("authUser");

  const protectedRoutes = [
    "/chat",
    "/profile",
    "/main",
    "/favourites",
    "/dashboard",
  ];

  if (
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    if (!authUser) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // "/recipes" is a public preview for visitors only; logged-in users
  // already have the full catalog (with filters and favourites) at "/main".
  if (request.nextUrl.pathname.startsWith("/recipes") && authUser) {
    return NextResponse.redirect(new URL("/main", request.url));
  }

  return NextResponse.next();
}
