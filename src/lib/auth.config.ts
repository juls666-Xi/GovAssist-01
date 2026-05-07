import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/citizen") || 
                           nextUrl.pathname.startsWith("/staff") || 
                           nextUrl.pathname.startsWith("/admin");
      const isOnAuth = nextUrl.pathname.startsWith("/login") || 
                       nextUrl.pathname.startsWith("/register");

      if (isOnDashboard) {
        if (isLoggedIn) {
          const role = auth.user?.role;
          const { pathname } = nextUrl;

          // Role-based Access Control (RBAC)
          if (pathname.startsWith("/admin") && role !== "ADMIN") {
            return Response.redirect(new URL("/unauthorized", nextUrl));
          }
          if (pathname.startsWith("/staff") && role !== "STAFF" && role !== "ADMIN") {
            return Response.redirect(new URL("/unauthorized", nextUrl));
          }
          if (pathname.startsWith("/citizen") && !["CITIZEN", "STAFF", "ADMIN"].includes(role as string)) {
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
  },
  providers: [], // Add social providers here later
} satisfies NextAuthConfig;