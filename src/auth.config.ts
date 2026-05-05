import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // Providers are added in the main auth.ts
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard =
        nextUrl.pathname.startsWith("/citizen") ||
        nextUrl.pathname.startsWith("/staff") ||
        nextUrl.pathname.startsWith("/admin");
      const isOnAuth =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");

      if (isOnDashboard) {
        if (isLoggedIn) {
          const role = auth?.user?.role;
          const path = nextUrl.pathname;

          // Role-based access control
          if (path.startsWith("/admin") && role !== "ADMIN") {
            return Response.redirect(new URL("/unauthorized", nextUrl));
          }
          if (
            path.startsWith("/staff") &&
            role !== "STAFF" &&
            role !== "ADMIN"
          ) {
            return Response.redirect(new URL("/unauthorized", nextUrl));
          }
          if (
            path.startsWith("/citizen") &&
            role !== "CITIZEN" &&
            role !== "STAFF" &&
            role !== "ADMIN"
          ) {
            return Response.redirect(new URL("/unauthorized", nextUrl));
          }
          return true;
        }
        return false;
      }

      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL("/citizen/dashboard", nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;