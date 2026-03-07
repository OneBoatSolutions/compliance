/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function run() {
  const p = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL_UNPOOLED }),
  });
  const keys = Object.keys(p).filter((k) => !k.startsWith("$") && !k.startsWith("_"));
  console.log("Prisma client model accessors:", keys);
  await p.$disconnect();
}

run();
