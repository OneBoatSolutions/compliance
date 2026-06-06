import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { isLocked, recordFailedAttempt, resetAttempts } from "@/lib/rate-limits";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing credentials");
          }

          // Build rate-limit identifier from email + IP
          const forwardedFor =
            req?.headers?.["x-forwarded-for"] ?? req?.headers?.["X-Forwarded-For"] ?? "";
          const ip =
            typeof forwardedFor === "string"
              ? forwardedFor.split(",")[0].trim() || "unknown-ip"
              : "unknown-ip";
          const identifier = `${credentials.email}:${ip}`;

          // Check lockout
          if (isLocked(identifier)) {
            throw new Error("Too many failed login attempts. Please try again later.");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            recordFailedAttempt(identifier);
            throw new Error("Invalid email or password");
          }

          if (!user.isActive) {
            recordFailedAttempt(identifier);
            throw new Error("Invalid email or password");
          }

          const valid = await bcrypt.compare(credentials.password, user.password);

          if (!valid) {
            recordFailedAttempt(identifier);
            throw new Error("Invalid email or password");
          }

          // Successful login — reset attempts and update lastLoginAt
          resetAttempts(identifier);

          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (err) {
          const error = err as Error;
          console.error("Authorize Error:", error.message, error.stack);
          throw err;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
