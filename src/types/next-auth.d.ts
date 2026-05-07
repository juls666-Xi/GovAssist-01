import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `auth`, etc.
   */
  interface Session {
    user: {
      id: string;
      role: string;
      username: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    username: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    id: string;
    role: string;
    username: string;
  }
}