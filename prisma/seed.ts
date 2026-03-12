import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { gdprControls } from "./seed-data/gdpr";
import { hipaaControls } from "./seed-data/hipaa";
import { pciControls } from "./seed-data/pci";

/* eslint-disable no-console */

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL must be set");
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Framework definitions
// ---------------------------------------------------------------------------

const frameworks = [
  {
    code: "GDPR",
    name: "General Data Protection Regulation",
    description:
      "EU regulation on data protection and privacy for individuals within the European Union and the European Economic Area.",
    region: "EU",
    category: "Data Privacy",
    version: "2016/679",
    effectiveDate: new Date("2016-05-24"),
    publishedAt: new Date("2016-05-24"),
    status: "PUBLISHED" as const,
    controls: gdprControls,
  },
  {
    code: "HIPAA",
    name: "Health Insurance Portability and Accountability Act",
    description:
      "US federal law establishing national standards to protect sensitive patient health information from being disclosed without patient consent.",
    region: "US",
    category: "Healthcare",
    version: "2013 Omnibus Rule",
    effectiveDate: new Date("2013-03-26"),
    publishedAt: new Date("2013-03-26"),
    status: "PUBLISHED" as const,
    controls: hipaaControls,
  },
  {
    code: "PCI-DSS",
    name: "Payment Card Industry Data Security Standard",
    description:
      "Global information security standard designed to protect cardholder data and reduce payment card fraud.",
    region: "Global",
    category: "Financial",
    version: "4.0",
    effectiveDate: new Date("2022-03-31"),
    publishedAt: new Date("2022-03-31"),
    status: "PUBLISHED" as const,
    controls: pciControls,
  },
] as const;

const gatewayDependencyGroups = [
  { parent: "GDPR-GW-CH", children: ["GDPR-M1.6", "GDPR-M1.7", "GDPR-M1.8"] },
  { parent: "GDPR-GW-SC", children: ["GDPR-M1.9", "GDPR-M1.10"] },
  {
    parent: "GDPR-GW-ADM",
    children: ["GDPR-M10.0", "GDPR-M10.1", "GDPR-M10.2", "GDPR-M10.3", "GDPR-M10.4"],
  },
  {
    parent: "GDPR-GW-DPO",
    children: [
      "GDPR-M11.0",
      "GDPR-M11.1",
      "GDPR-M11.2",
      "GDPR-M11.3",
      "GDPR-M11.4",
      "GDPR-M11.5",
      "GDPR-M11.6",
    ],
  },
  {
    parent: "GDPR-GW-ENC",
    children: ["GDPR-P2.0", "GDPR-P2.1", "GDPR-P2.2", "GDPR-P2.3", "GDPR-P2.4"],
  },
  {
    parent: "GDPR-GW-INT",
    children: ["GDPR-R2.0", "GDPR-R2.1", "GDPR-R2.2", "GDPR-R2.3", "GDPR-R2.4", "GDPR-R2.5"],
  },
  {
    parent: "GDPR-GW-3P",
    children: ["GDPR-R3.0", "GDPR-R3.1", "GDPR-R3.2", "GDPR-R3.3", "GDPR-R3.4", "GDPR-R3.5"],
  },
  {
    parent: "GDPR-GW-DPIA",
    children: [
      "GDPR-R4.0",
      "GDPR-R4.1",
      "GDPR-R4.2",
      "GDPR-R4.3",
      "GDPR-R4.4",
      "GDPR-R4.5",
      "GDPR-R4.6",
    ],
  },
] as const;

const gatewayDependencies = gatewayDependencyGroups.flatMap(({ parent, children }) =>
  children.map((child) => ({ parent, child })),
);

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("🌱  Starting seed...");

  // --- Step 1: Hash passwords ---
  const [adminHash, userHash] = await Promise.all([
    bcrypt.hash("Admin@123", 12),
    bcrypt.hash("User@1234", 12),
  ]);

  // --- Step 2: Upsert users ---
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@cipherion.com" },
    create: {
      email: "admin@cipherion.com",
      name: "Cipherion Admin",
      password: adminHash,
      role: "ADMIN",
    },
    update: {},
  });

  const testUser = await prisma.user.upsert({
    where: { email: "user@test.com" },
    create: {
      email: "user@test.com",
      name: "HealthTrack User",
      password: userHash,
      role: "USER",
    },
    update: {},
  });

  console.log(`✅  Users: admin=${adminUser.id}, user=${testUser.id}`);

  // --- Step 3: Find-or-create organization ---
  let org = await prisma.organization.findFirst({
    where: { userId: testUser.id },
  });

  if (!org) {
    org = await prisma.organization.create({
      data: {
        userId: testUser.id,
        productName: "HealthTrack App",
        description:
          "A digital health platform offering telehealth, EHR access, and subscription billing for US and EU patients.",
        services:
          "Telehealth consultations, patient portal (EHR), subscription billing, wellness tracking",
        targetCustomers: "US and EU consumers, primary care clinics, specialist practices",
        problemSolved:
          "Connecting patients with providers remotely while securely managing health records and payments",
        dataHandled: ["PII", "PHI", "Payment Card Data"],
        regions: ["US", "EU"],
      },
    });
    console.log(`✅  Organization created: ${org.id}`);
  } else {
    console.log(`✅  Organization exists: ${org.id} (skipped)`);
  }

  // --- Step 4–6: Upsert frameworks + controls ---
  const seededControls: Array<{ id: string; code: string }> = [];
  const frameworkIds: Record<string, string> = {};

  for (const fw of frameworks) {
    const { controls, ...fwData } = fw;

    const framework = await prisma.framework.upsert({
      where: { code: fwData.code },
      create: fwData,
      update: {},
    });

    frameworkIds[framework.code] = framework.id;

    console.log(`✅  Framework: ${framework.code} (${framework.id}) — ${controls.length} controls`);

    for (const ctrl of controls) {
      const metadataValue = ctrl.metadata
        ? (ctrl.metadata as Prisma.InputJsonValue)
        : Prisma.DbNull;
      const control = await prisma.control.upsert({
        where: {
          frameworkId_code: { frameworkId: framework.id, code: ctrl.code },
        },
        create: {
          frameworkId: framework.id,
          code: ctrl.code,
          title: ctrl.title,
          description: ctrl.description,
          category: ctrl.category,
          severity: ctrl.severity,
          weight: ctrl.weight,
          isGateway: ctrl.isGateway ?? false,
          metadata: metadataValue,
        },
        update: {
          title: ctrl.title,
          description: ctrl.description,
          category: ctrl.category,
          severity: ctrl.severity,
          weight: ctrl.weight,
          isGateway: ctrl.isGateway ?? false,
          metadata: metadataValue,
        },
      });

      seededControls.push({ id: control.id, code: control.code });
    }
  }

  console.log(`✅  Controls seeded: ${seededControls.length} total`);

  const gdprFrameworkId = frameworkIds.GDPR;
  if (!gdprFrameworkId) {
    throw new Error("GDPR framework was not seeded.");
  }

  const v2GdprCodeSet = new Set(gdprControls.map((control) => control.code));
  const staleControls = await prisma.control.findMany({
    where: {
      frameworkId: gdprFrameworkId,
      code: { notIn: Array.from(v2GdprCodeSet) },
    },
    select: { id: true, code: true },
  });

  if (staleControls.length > 0) {
    console.log(
      `🧹  Removing ${staleControls.length} stale GDPR control(s): ${staleControls
        .map((control) => control.code)
        .join(", ")}`,
    );

    const staleControlIds = staleControls.map((control) => control.id);
    await prisma.assessmentItem.deleteMany({
      where: { controlId: { in: staleControlIds } },
    });
    await prisma.control.deleteMany({
      where: { id: { in: staleControlIds } },
    });
  } else {
    console.log("✅  No stale GDPR controls found.");
  }

  const gdprControlRows = await prisma.control.findMany({
    where: {
      frameworkId: gdprFrameworkId,
      code: { in: Array.from(v2GdprCodeSet) },
    },
    select: { id: true, code: true },
  });
  const gdprCodeToId = Object.fromEntries(
    gdprControlRows.map((control) => [control.code, control.id]),
  ) as Record<string, string>;

  for (const dependency of gatewayDependencies) {
    const parentId = gdprCodeToId[dependency.parent];
    const childId = gdprCodeToId[dependency.child];

    if (!parentId || !childId) {
      console.warn(
        `⚠️  Dependency skipped — code not found: ${dependency.parent} -> ${dependency.child}`,
      );
      continue;
    }

    await prisma.controlDependency.upsert({
      where: {
        parentControlId_childControlId: {
          parentControlId: parentId,
          childControlId: childId,
        },
      },
      create: {
        parentControlId: parentId,
        childControlId: childId,
        triggerValue: "NO",
        effect: "NOT_APPLICABLE",
      },
      update: {},
    });
  }

  console.log(`✅  ControlDependency rows seeded: ${gatewayDependencies.length}`);

  // --- Step 7: Find-or-create assessment ---
  let assessment = await prisma.assessment.findFirst({
    where: { userId: testUser.id, organizationId: org.id },
  });

  if (!assessment) {
    assessment = await prisma.assessment.create({
      data: {
        userId: testUser.id,
        organizationId: org.id,
        status: "IN_PROGRESS",
        score: null,
      },
    });
    console.log(`✅  Assessment created: ${assessment.id}`);
  } else {
    console.log(`✅  Assessment exists: ${assessment.id} (skipped)`);
  }

  // --- Step 8: Upsert assessment items ---
  type ItemStatus =
    | "COMPLIANT"
    | "PARTIALLY_COMPLIANT"
    | "NOT_COMPLIANT"
    | "NOT_STARTED"
    | "NOT_APPLICABLE";

  const statusMap: Record<string, ItemStatus> = {
    // GDPR gateways
    "GDPR-GW-CH": "NOT_APPLICABLE",
    "GDPR-GW-SC": "COMPLIANT",
    "GDPR-GW-ADM": "NOT_APPLICABLE",
    "GDPR-GW-DPO": "COMPLIANT",
    "GDPR-GW-ENC": "COMPLIANT",
    "GDPR-GW-INT": "COMPLIANT",
    "GDPR-GW-3P": "COMPLIANT",
    "GDPR-GW-DPIA": "COMPLIANT",
    // Gateway-driven N/A
    "GDPR-M1.6": "NOT_APPLICABLE",
    "GDPR-M1.7": "NOT_APPLICABLE",
    "GDPR-M1.8": "NOT_APPLICABLE",
    "GDPR-M10.0": "NOT_APPLICABLE",
    "GDPR-M10.1": "NOT_APPLICABLE",
    "GDPR-M10.2": "NOT_APPLICABLE",
    "GDPR-M10.3": "NOT_APPLICABLE",
    "GDPR-M10.4": "NOT_APPLICABLE",
    // NOT_COMPLIANT — 7 visible gaps
    "GDPR-P2.0": "NOT_COMPLIANT",
    "GDPR-M11.0": "NOT_COMPLIANT",
    "GDPR-P4.0": "NOT_COMPLIANT",
    "GDPR-R1.0": "NOT_COMPLIANT",
    "GDPR-M9.1": "NOT_COMPLIANT",
    "HIPAA-308-A7": "NOT_COMPLIANT",
    "HIPAA-312-C": "NOT_COMPLIANT",
    "PCI-3.5.1": "NOT_COMPLIANT",
    "PCI-8.4.2": "NOT_COMPLIANT",
    "PCI-6.4.1": "NOT_COMPLIANT",
    // PARTIALLY_COMPLIANT — 12 in-progress items
    "GDPR-D3.1": "PARTIALLY_COMPLIANT",
    "GDPR-M1.0": "PARTIALLY_COMPLIANT",
    "GDPR-M4.0": "PARTIALLY_COMPLIANT",
    "GDPR-M5.0": "PARTIALLY_COMPLIANT",
    "GDPR-M12.0": "PARTIALLY_COMPLIANT",
    "GDPR-M12.2": "PARTIALLY_COMPLIANT",
    "GDPR-P1.2": "PARTIALLY_COMPLIANT",
    "GDPR-P1.7": "PARTIALLY_COMPLIANT",
    "GDPR-P3.0": "PARTIALLY_COMPLIANT",
    "GDPR-P3.1": "PARTIALLY_COMPLIANT",
    "GDPR-P3.6": "PARTIALLY_COMPLIANT",
    "GDPR-M6.0": "PARTIALLY_COMPLIANT",
    "GDPR-R2.0": "PARTIALLY_COMPLIANT",
    "GDPR-R2.1": "PARTIALLY_COMPLIANT",
    "GDPR-R3.1": "PARTIALLY_COMPLIANT",
    "GDPR-R4.0": "PARTIALLY_COMPLIANT",
    "GDPR-R4.1": "PARTIALLY_COMPLIANT",
    "GDPR-R4.3": "PARTIALLY_COMPLIANT",
    "GDPR-P5.0": "PARTIALLY_COMPLIANT",
    "HIPAA-308-A1": "PARTIALLY_COMPLIANT",
    "HIPAA-308-A9": "PARTIALLY_COMPLIANT",
    "HIPAA-310-D1": "PARTIALLY_COMPLIANT",
    "HIPAA-312-B": "PARTIALLY_COMPLIANT",
    "PCI-1.3.1": "PARTIALLY_COMPLIANT",
    "PCI-2.2.2": "PARTIALLY_COMPLIANT",
    "PCI-7.2.1": "PARTIALLY_COMPLIANT",
    "PCI-10.2.1": "PARTIALLY_COMPLIANT",
    // NOT_STARTED — 5 lower-priority items
    "GDPR-D2.1": "NOT_STARTED",
    "GDPR-M3.5": "NOT_STARTED",
    "GDPR-M4.3": "NOT_STARTED",
    "GDPR-M5.8": "NOT_STARTED",
    "GDPR-M5.6": "NOT_STARTED",
    "GDPR-M8.2": "NOT_STARTED",
    "GDPR-M8.3": "NOT_STARTED",
    "GDPR-M6.4": "NOT_STARTED",
    "GDPR-M6.5": "NOT_STARTED",
    "GDPR-M7.6": "NOT_STARTED",
    "GDPR-M7.7": "NOT_STARTED",
    "GDPR-M9.3": "NOT_STARTED",
    "GDPR-M9.5": "NOT_STARTED",
    "GDPR-P5.2": "NOT_STARTED",
    "GDPR-P5.3": "NOT_STARTED",
    "GDPR-P2.4": "NOT_STARTED",
    "GDPR-P5.1": "NOT_STARTED",
    "GDPR-P5.4": "NOT_STARTED",
    "GDPR-R1.5": "NOT_STARTED",
    "GDPR-R1.3": "NOT_STARTED",
    "GDPR-R2.2": "NOT_STARTED",
    "GDPR-R2.3": "NOT_STARTED",
    "GDPR-R2.4": "NOT_STARTED",
    "GDPR-R2.5": "NOT_STARTED",
    "GDPR-R3.4": "NOT_STARTED",
    "GDPR-R3.5": "NOT_STARTED",
    "GDPR-R4.2": "NOT_STARTED",
    "GDPR-R4.4": "NOT_STARTED",
    "GDPR-R4.5": "NOT_STARTED",
    "GDPR-R4.6": "NOT_STARTED",
    "HIPAA-308-A6": "NOT_STARTED",
    "PCI-10.5.1": "NOT_STARTED",
    "PCI-8.3.6": "NOT_STARTED",
    // NOT_APPLICABLE — 1 item
    "PCI-1.2.5": "NOT_APPLICABLE",
    // all remaining 25 controls default to COMPLIANT via ?? fallback
  };

  const commentMap: Record<string, string | null> = {
    // NOT_COMPLIANT
    "GDPR-P2.0": "Encryption at rest not yet implemented on production databases",
    "GDPR-M11.0": "DPO role approved in org chart but position unfilled",
    "GDPR-P4.0": "Incident response plan draft exists but has not been approved or tested",
    "GDPR-R1.0":
      "RoPA template exists, but production systems and processing purposes are not populated",
    "GDPR-M9.1":
      "No application-level processing freeze flag exists for subject restriction requests",
    "HIPAA-308-A7": "Security awareness training program not yet established",
    "HIPAA-312-C":
      "ePHI encryption in transit not enforced on all internal service-to-service calls",
    "PCI-3.5.1":
      "PAN stored in plaintext in legacy reporting database; remediation scheduled Q2 2026",
    "PCI-8.4.2": "MFA rollout scheduled for Q2 2026 — pending vendor licensing",
    "PCI-6.4.1":
      "No WAF deployed; last web application security assessment conducted over 18 months ago",
    // PARTIALLY_COMPLIANT
    "GDPR-D3.1": "Data inventory partially populated; cloud storage assets not yet fully cataloged",
    "GDPR-M1.0":
      "Governance program partially formalized; charter drafted but not ratified by leadership",
    "GDPR-M4.0": "Consent banner deployed on web; mobile app consent flow not yet updated",
    "GDPR-M5.0": "DSAR portal exists; backend request tracking and SLA enforcement missing",
    "GDPR-M12.0":
      "Privacy risks are tracked informally, but they are not yet fully integrated into enterprise risk governance",
    "GDPR-M12.2":
      "Risk reviews occur during major projects, but there is no consistent privacy threat modeling framework",
    "GDPR-P1.2":
      "Product teams review new collection points, but minimization is not enforced in every release",
    "GDPR-P1.7":
      "Privacy checks exist in Jira workflows, but release gates are not yet enforced across every engineering team",
    "GDPR-P3.0":
      "Security roadmap identifies CIA workstreams, but the program is not yet formally governed",
    "GDPR-P3.1":
      "Security requirements are documented in places, but there is no single approved standard for personal data CIA controls",
    "GDPR-P3.6":
      "Backups are in place, but recovery time objectives have not been validated against production recovery tests",
    "GDPR-M6.0":
      "Correction workflow exists in support tooling, but fulfillment is not consistent across systems",
    "GDPR-R2.0":
      "Cross-border transfer diagrams exist for core systems, but they do not yet cover all vendors and support workflows",
    "GDPR-R2.1": "Ad hoc transfers are not consistently entered into a single registry",
    "GDPR-R3.1":
      "Major vendors complete risk reviews; smaller processors are not yet assessed on a fixed cadence",
    "GDPR-R4.0":
      "A threshold checklist exists, but teams do not consistently use it before launching high-risk processing changes",
    "GDPR-R4.1":
      "DPIAs are completed for the largest projects, but smaller high-risk workflows still launch without a formal assessment",
    "GDPR-R4.3":
      "Risk treatment actions are tracked in spreadsheets, but they are not yet linked to a controlled remediation workflow",
    "GDPR-P5.0":
      "A one-time penetration test was completed, but there is no recurring security testing cadence",
    "HIPAA-308-A1": "Risk analysis conducted in 2024 — not updated after infrastructure migration",
    "HIPAA-308-A9":
      "Backup plan documented; primary DB backup tested; DR failover not yet tested end-to-end",
    "HIPAA-310-D1":
      "Device inventory and remote-wipe policy in place; media disposal SOP incomplete",
    "HIPAA-312-B":
      "Audit logging enabled on primary systems; logging gaps remain on legacy components",
    "PCI-1.3.1":
      "CDE inbound rules partially configured; a few legacy firewall rules remain overly permissive",
    "PCI-2.2.2":
      "Default credentials changed on most systems; two legacy network appliances not yet remediated",
    "PCI-7.2.1":
      "RBAC model defined in policy; enforcement gaps identified in three internal services",
    "PCI-10.2.1":
      "Audit logs enabled on most systems; three payment microservices not yet configured",
    // COMPLIANT — realistic comments for notable controls
    "GDPR-D1.0": "Data map maintained in Confluence; reviewed and updated quarterly",
    "GDPR-M1.3": "Privacy policy published and reviewed by legal counsel in Q4 2025",
    "GDPR-M2.0": "Privacy notices published at all data collection points across web and mobile",
    "GDPR-M4.1": "Consent logs timestamped and retained for 3 years per retention policy",
    "GDPR-M7.0": "Erasure SOP documented; all requests processed within 30-day statutory window",
    "HIPAA-308-A2": "Risk management plan reviewed annually by CISO and updated as needed",
    "HIPAA-308-A3": "Sanction policy documented in employee handbook; HR applies consistently",
    "HIPAA-308-A10": "BAAs executed with all 12 business associates; reviewed and renewed annually",
    "HIPAA-312-A1":
      "Unique user IDs enforced across all system components; shared accounts prohibited",
    "PCI-4.2.1":
      "TLS 1.2+ enforced on all payment data transmission channels; TLS 1.0/1.1 deprecated",
    "PCI-8.2.1": "Unique IDs provisioned via centralized IAM; shared accounts prohibited by policy",
    // NOT_STARTED — intentionally null
    "GDPR-D2.1": null,
    "GDPR-M3.5": null,
    "GDPR-M5.8": null,
    "GDPR-M8.2": null,
    "GDPR-M8.3": null,
    "GDPR-P5.2": null,
    "GDPR-P5.3": null,
    "GDPR-R1.5": null,
    "GDPR-R2.4": null,
    "GDPR-R4.4": null,
    "GDPR-R4.5": null,
    "HIPAA-308-A6": null,
    "PCI-10.5.1": null,
    "PCI-8.3.6": null,
    // NOT_APPLICABLE
    "PCI-1.2.5": "Digital-only platform; no on-premise network rulesets requiring documentation",
  };

  const evidenceNotesMap: Record<string, string> = {
    "GDPR-M1.3":
      "Privacy Policy v3.2 published at /privacy-policy - last reviewed by legal Q4 2025",
    "GDPR-M4.1": "Consent logs retained in OneTrust - timestamped, 3-year retention policy applied",
    "GDPR-P2.0": "Encryption at rest not yet implemented - remediation tracked in Jira PRIV-441",
    "GDPR-R1.0": "RoPA template drafted but not populated - owner: Data Steward, due Q2 2026",
    "GDPR-P4.0": "Incident Response Plan v0.1 exists but not formally approved or tested",
  };

  for (const ctrl of seededControls) {
    const status = statusMap[ctrl.code] ?? "COMPLIANT";
    const comments = commentMap[ctrl.code] ?? null;
    const evidenceNotes = evidenceNotesMap[ctrl.code] ?? null;
    await prisma.assessmentItem.upsert({
      where: {
        assessmentId_controlId: {
          assessmentId: assessment.id,
          controlId: ctrl.id,
        },
      },
      create: {
        assessmentId: assessment.id,
        controlId: ctrl.id,
        status,
        comments,
        evidenceNotes,
      },
      update: { status, comments, evidenceNotes },
    });
  }

  console.log(`✅  Assessment items seeded: ${seededControls.length} items`);

  // --- Step 9: Calculate score + update assessment ---
  const itemsWithWeight = await prisma.assessmentItem.findMany({
    where: { assessmentId: assessment.id },
    include: { control: { select: { weight: true, isGateway: true } } },
  });

  let numerator = 0;
  let denominator = 0;
  for (const item of itemsWithWeight) {
    const w = item.control.weight;
    if (item.status === "NOT_APPLICABLE") {
      continue;
    }
    if (item.control.isGateway) {
      continue;
    }
    denominator += w;
    if (item.status === "COMPLIANT") {
      numerator += w * 1.0;
    } else if (item.status === "PARTIALLY_COMPLIANT") {
      numerator += w * 0.5;
    }
    // NOT_COMPLIANT / NOT_STARTED → numerator += 0
  }
  const score = denominator > 0 ? (numerator / denominator) * 100 : 0;

  await prisma.assessment.update({
    where: { id: assessment.id },
    data: { score },
  });
  console.log(`✅  Assessment score calculated: ${score.toFixed(2)}%`);

  // --- Step 13a: Evidence (1 non-GDPR row for HIPAA-308-A1) ---
  const hipaaRiskItem = await prisma.assessmentItem.findFirst({
    where: {
      assessmentId: assessment.id,
      control: { code: "HIPAA-308-A1" },
    },
  });

  if (hipaaRiskItem) {
    const evidenceExists = await prisma.evidence.findFirst({
      where: { assessmentItemId: hipaaRiskItem.id },
    });
    if (!evidenceExists) {
      await prisma.evidence.create({
        data: {
          assessmentItemId: hipaaRiskItem.id,
          userId: testUser.id,
          filename: "risk-analysis-2024.pdf",
          originalName: "Risk Analysis Report 2024.pdf",
          fileUrl: "https://s3.example.com/evidence/risk-analysis-2024.pdf",
          mimeType: "application/pdf",
          fileSize: 204800,
          description: "Annual risk analysis report covering ePHI systems.",
        },
      });
      console.log("✅  Evidence row seeded (HIPAA-308-A1)");
    } else {
      console.log("✅  Evidence exists (skipped)");
    }
  }

  // --- Step 13b: Report ---
  const reportExists = await prisma.report.findFirst({
    where: { assessmentId: assessment.id },
  });
  if (!reportExists) {
    await prisma.report.create({
      data: {
        assessmentId: assessment.id,
        type: "COMPLIANCE_READINESS",
        format: "WEB",
        fileUrl: null,
      },
    });
    console.log("✅  Report row seeded");
  } else {
    console.log("✅  Report exists (skipped)");
  }

  // --- Step 13c: AIInteraction ---
  const aiExists = await prisma.aIInteraction.findFirst({
    where: { assessmentId: assessment.id },
  });
  if (!aiExists) {
    await prisma.aIInteraction.create({
      data: {
        assessmentId: assessment.id,
        type: "COMPLIANCE_MAPPING",
        model: "gpt-4o",
        input: JSON.stringify({
          organizationId: org.id,
          frameworks: ["GDPR", "HIPAA", "PCI-DSS"],
        }),
        output: JSON.stringify({
          recommended: ["GDPR", "HIPAA", "PCI-DSS"],
        }),
        tokensUsed: 312,
        durationMs: 1840,
      },
    });
    console.log("✅  AIInteraction row seeded");
  } else {
    console.log("✅  AIInteraction exists (skipped)");
  }

  console.log("🎉  Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
