import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** This is the field we'll populate below */
      id: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    /** If you persist users in a DB, their PK (UUID) will go here */
    id: string;
  }
}
