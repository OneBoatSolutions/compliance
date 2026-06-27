import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import {
  rateLimitByKey,
  isRateLimited,
  incrementFailureCount,
  resetAttempts,
  RATE_LIMIT_CONFIGS,
} from "@/lib/rate-limiter";
import { headers } from "next/headers";

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

          // Build rate-limit identifier from email + native Next.js 15 client IP extraction
          const headerList = await headers();
          const rawIp =
            headerList.get("x-forwarded-for")?.split(",")[0] ||
            headerList.get("x-real-ip") ||
            "127.0.0.1";
          const ip = rawIp.trim();

          const volumetricKey = `rl:login:ip:volumetric:${ip}`;
          const isVolumetricLimited = await rateLimitByKey(
            volumetricKey,
            RATE_LIMIT_CONFIGS.loginIpVolumetric,
          );
          if (isVolumetricLimited) {
            throw new Error("Too many login attempts. Please try again later.");
          }

          const identifier = `rl:auth:login:${credentials.email}:${ip}`;

          // Check lockout (read-only lookup)
          const isLocked = await isRateLimited(identifier, RATE_LIMIT_CONFIGS.auth);
          if (isLocked) {
            throw new Error("Too many failed login attempts. Please try again later.");
          }

          let user;
          try {
            user = await prisma.user.findUnique({
              where: { email: credentials.email },
            });
          } catch (dbError) {
            console.error("Database error during authorize user query:", dbError);
            throw new Error("Internal server error");
          }

          if (!user) {
            await incrementFailureCount(identifier, RATE_LIMIT_CONFIGS.auth.windowSeconds);
            throw new Error("Invalid email or password");
          }

          if (!user.isActive) {
            await incrementFailureCount(identifier, RATE_LIMIT_CONFIGS.auth.windowSeconds);
            throw new Error("Invalid email or password");
          }

          let valid = false;
          try {
            valid = await bcrypt.compare(credentials.password, user.password);
          } catch (hashError) {
            console.error("Hashing verification error during authorize:", hashError);
            throw new Error("Internal server error");
          }

          if (!valid) {
            await incrementFailureCount(identifier, RATE_LIMIT_CONFIGS.auth.windowSeconds);
            throw new Error("Invalid email or password");
          }

          await resetAttempts(identifier);

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
