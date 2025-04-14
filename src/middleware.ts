import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "./server/auth/verifyAuth";
import { JWT_COOKIE_NAME } from "./server/auth/constants";
import { getJWTUser } from "./server/auth/getJWTUser";
import { Role } from "@prisma/client";

const routeToRole: Record<string, Role[]> = {
  "/staff/manage/admin": [Role.ADMIN],
  "/staff/manage/ticket-scan": [
    Role.ADMIN,
    Role.TICKET_SCANNER,
    Role.EVENT_MANAGER,
  ],
  "/staff/manage/events": [Role.ADMIN, Role.TICKET_SCANNER, Role.EVENT_MANAGER],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for a path under /staff/manage
  if (pathname.startsWith("/staff/manage")) {
    const token = request.cookies.get(JWT_COOKIE_NAME)?.value;

    if (!token) {
      // Redirect to the login page if no token is present
      return NextResponse.redirect(new URL("/staff/login", request.url));
    }

    try {
      // Verify the token
      const isValid = await verifyAuth(token);

      if (!isValid) {
        // Redirect to the login page if the token is invalid
        return NextResponse.redirect(new URL("/staff/login", request.url));
      }

      // Get the user from the JWT
      const staffUser = await getJWTUser();

      if (!staffUser) {
        // Redirect to login if user information can't be retrieved
        return NextResponse.redirect(new URL("/staff/login", request.url));
      }

      // im god
      if (staffUser.role === Role.KOKO) return NextResponse.next();

      // Check if the user has permission to access the route
      const allowedRoles = Object.entries(routeToRole).find(([route]) =>
        pathname.startsWith(route),
      )?.[1];

      if (allowedRoles && !allowedRoles.includes(staffUser.role)) {
        // Redirect to a forbidden page or show an error
        return NextResponse.redirect(new URL("/staff/manage", request.url));
      }
    } catch (error) {
      // If there's an error verifying the token, redirect to login
      return NextResponse.redirect(new URL("/staff/login", request.url));
    }
  }

  // If authenticated and authorized, or not a protected route, continue to the next middleware or to the page
  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

// Specify the paths to apply the middleware
export const config = {
  matcher: ["/staff/manage/:path*"],
};
