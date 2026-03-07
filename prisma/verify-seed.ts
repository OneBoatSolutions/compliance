/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function verify() {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL,
    }),
  });

  const [users, frameworks, controls, orgs, assessments, items, evidence, aiInteractions] =
    await Promise.all([
      prisma.user.count(),
      prisma.framework.count(),
      prisma.control.count(),
      prisma.organization.count(),
      prisma.assessment.count(),
      prisma.assessmentItem.count(),
      prisma.evidence.count(),
      prisma.aIInteraction.count(),
    ]);

  const assessment = await prisma.assessment.findFirst({
    select: { score: true, status: true },
    orderBy: { createdAt: "desc" },
  });

  const gdprCount = await prisma.control.count({ where: { framework: { code: "GDPR" } } });
  const hipaaCount = await prisma.control.count({ where: { framework: { code: "HIPAA" } } });
  const pciCount = await prisma.control.count({ where: { framework: { code: "PCI-DSS" } } });

  console.log("\n=== Seed Verification ===");
  console.log(`Users:             ${users}  (target: 2)`);
  console.log(`Frameworks:        ${frameworks}  (target: 3)`);
  console.log(`Controls total:    ${controls} (target: 42+)`);
  console.log(`  GDPR controls:   ${gdprCount} (target: 15+)`);
  console.log(`  HIPAA controls:  ${hipaaCount} (target: 15+)`);
  console.log(`  PCI-DSS controls:${pciCount} (target: 10+)`);
  console.log(`Organizations:     ${orgs}  (target: 1)`);
  console.log(`Assessments:       ${assessments}  (target: 1)`);
  console.log(`Assessment items:  ${items} (target: 42+)`);
  console.log(`Evidence rows:     ${evidence}  (target: 3)`);
  console.log(`AI Interactions:   ${aiInteractions}  (target: 2)`);
  console.log(`Assessment score:  ${assessment?.score ?? "null"} (target: non-null float)`);
  console.log(`Assessment status: ${assessment?.status}`);
  console.log("=========================\n");

  await prisma.$disconnect();
}

verify().catch(console.error);
