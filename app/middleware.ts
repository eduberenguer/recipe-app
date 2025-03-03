import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";

export async function middleware(req: NextRequest) {
  const supabase = createSupabaseServer();
  const { data } = await supabase.auth.getUser();

  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register");

  // Si el usuario NO está autenticado y quiere acceder a una página protegida -> Redirigir a login
  if (!data.user && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Si el usuario está autenticado y quiere ir a login/register -> Redirigir al perfil
  if (data.user && isAuthRoute) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/login", "/register"],
};
