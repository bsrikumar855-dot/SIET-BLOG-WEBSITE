import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Store current pathname in request headers to allow Server Components (like root layout) to read it
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Match all paths except static files, api routes, and Next.js internals
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
