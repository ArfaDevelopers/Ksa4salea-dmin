import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next(); // Allow public pages
  }

  if (!token) {
    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.png).*)"], // Protect all except assets
};
