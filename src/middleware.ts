import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // 1. Define Routes
  const authRoutes = ["/login", "/register", "/reset-password"];

  // Define protected routes per role
  const partnerRoutes = ["/dashboard", "/profile"];

  // 2. Get the User's Token (Session)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;
  const userRole = token?.role as string | undefined | null;

  // --- SCENARIO 0: OAuth User Needs to Complete Registration (No Role) ---
  if (isAuth && !userRole) {
    // If they have no role, they ONLY have access to the completion page and API routes.
    if (
      !pathname.startsWith("/complete-registration") &&
      !pathname.startsWith("/api")
    ) {
      return NextResponse.redirect(new URL("/complete-registration", req.url));
    }
    return NextResponse.next();
  }

  // --- SCENARIO 1: User is Logged In WITH a Role but tries to access Login/Register/Complete-Registration ---
  if (
    isAuth &&
    userRole &&
    (authRoutes.some((route) => pathname.startsWith(route)) ||
      pathname.startsWith("/complete-registration"))
  ) {
    if (userRole === "partner") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Fallback for unknown roles
    return NextResponse.redirect(new URL("/", req.url));
  }

  // --- SCENARIO 2: User is NOT Logged In but tries to access Protected Routes ---
  // Notice we explicitly exclude public performer profiles (!isPublicPerformerProfile)
  const isProtectedRoute = partnerRoutes.some((r) => pathname.startsWith(r));

  if (!isAuth && isProtectedRoute) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // CRITICAL FIX: Removed auth routes (login, register) from the exclusion list
    // so the middleware can actually intercept them!
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons|public|sounds|firebase-messaging-sw.js|manifest.json|documents|$).*)",
  ],
};
