import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
            role: true,
            status: true,
            passwordHash: true,
            image: true,
          },
        });

        if (!user || !user.passwordHash) return null;
        if (user.status === "SUSPENDED" || user.status === "INACTIVE") return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
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
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
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
          const role = auth?.user?.role;
          const path = nextUrl.pathname;

          // Role-based access control
          if (path.startsWith("/admin") && role !== "ADMIN") {
            return Response.redirect(new URL("/unauthorized", nextUrl));
          }
          if (path.startsWith("/staff") && role !== "STAFF" && role !== "ADMIN") {
            return Response.redirect(new URL("/unauthorized", nextUrl));
          }
          if (path.startsWith("/citizen") && role !== "CITIZEN" && role !== "STAFF" && role !== "ADMIN") {
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
});
