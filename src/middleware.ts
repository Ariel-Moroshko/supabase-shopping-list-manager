import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseMiddlewareClient } from "./lib/supabase/middlewareClient";

export async function middleware(request: NextRequest) {
  request.headers.set("x-pathname", new URL(request.url).pathname);
  const { supabase, response } = getSupabaseMiddlewareClient(request);

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  const publicPaths = ["/login", "/auth/callback"];
  const currentUrl = new URL(request.url);
  const currentPath = currentUrl.pathname;
  const searchParams = currentUrl.search;
  const currentOrigin = currentUrl.origin;

  const isOnPublicPath = publicPaths.includes(currentPath);
  if (!session && !isOnPublicPath) {
    return NextResponse.redirect(
      `${currentOrigin}/login?redirectedFrom=${currentPath}${searchParams}`,
    );
  }
  if (error) {
    console.error(error);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|sw|manifest|icons|cron-wake-up-supabase|favicon.ico).*)",
  ],
};
