import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const userRole = req.auth?.user?.role;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/", "/about", "/contact", "/login", "/register"].includes(nextUrl.pathname);
  const isDashboardRoute = nextUrl.pathname.startsWith("/citizen") || 
                           nextUrl.pathname.startsWith("/staff") || 
                           nextUrl.pathname.startsWith("/admin");

  if (isApiAuthRoute) return;

  if (!isLoggedIn && isDashboardRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && isDashboardRoute) {
    if (nextUrl.pathname.startsWith("/admin") && userRole !== "ADMIN") {
      return Response.redirect(new URL("/unauthorized", nextUrl));
    }
    if (nextUrl.pathname.startsWith("/staff") && userRole !== "STAFF" && userRole !== "ADMIN") {
      return Response.redirect(new URL("/unauthorized", nextUrl));
    }
  }

  if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
    return Response.redirect(new URL("/citizen/dashboard", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)", "/api/:path*"],
};
