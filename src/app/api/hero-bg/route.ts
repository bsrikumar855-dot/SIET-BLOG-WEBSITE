import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  url.pathname = "/api/logo";
  url.searchParams.set("bg", "true");
  return NextResponse.redirect(url);
}
