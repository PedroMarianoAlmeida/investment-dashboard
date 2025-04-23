import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  // helpful for debugging—will log all NextAuth internals to your server log
  debug: true,

  callbacks: {
    async jwt({ token, account, profile, user }) {
      // fire on **first sign-in** or when `user` exists
      console.log("→ jwt callback", { account, profile, user });
      if (account?.provider === "google" && profile) {
        // profile.sub is Google’s unique user ID (a “UUID”-style string)
        token.id = profile.sub;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("→ session callback", { session, token });
      // now stash it on session.user.id
      session.user.id = token.id as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
