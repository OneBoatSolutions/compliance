import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use the direct (non-pooled) URL for Prisma CLI commands (migrate, studio, etc.)
    // Neon's PgBouncer pooler does NOT support the advisory locks Prisma Migrate needs.
    // The pooled DATABASE_URL is used by PrismaClient at runtime in the application.
    url: env("DATABASE_URL_UNPOOLED"),
  },
});
