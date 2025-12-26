import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get("session");

  // ⛔ API JANGAN PERNAH DIPROTECT
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // ⛔ LOGIN PAGE BOLEH TANPA SESSION
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // 🔐 PAGE LAIN WAJIB LOGIN
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// 🔴 WAJIB ADA
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
