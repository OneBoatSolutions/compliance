/* eslint-disable no-console */
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AIType,
  AssessmentStatus,
  FrameworkStatus,
  ItemStatus,
  PrismaClient,
  Role,
  Severity,
} from "@prisma/client";

interface FrameworkSeed {
  code: string;
  name: string;
  description: string;
  region: string;
  category: string;
  version: string;
  effectiveDate: Date;
  sourceLink: string;
}

interface ControlSeed {
  code: string;
  title: string;
  category: string;
  severity: Severity;
  weight: number;
  description: string;
}

interface AssessmentItemSeed {
  status: ItemStatus;
  comments: string;
}

const datasourceUrl = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!datasourceUrl) {
  throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL must be set before running seed");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: datasourceUrl }),
});

const pdfSourceOfTruth = "Task 0.6 Seed Data Content Pack.pdf";

const userSeeds = {
  admin: {
    email: "admin@cipherion.com",
    name: "Cipherion Admin",
    role: Role.ADMIN,
    password: "Admin@123",
  },
  test: {
    email: "user@test.com",
    name: "Sarah Chen",
    role: Role.USER,
    password: "User@1234",
  },
} as const;

const organizationSeed = {
  productName: "HealthTrack App",
  description: "Mobile app for tracking fitness and nutrition.",
  services: "Data analytics, personalized recommendations.",
  targetCustomers: "Individual consumers, fitness enthusiasts.",
  problemSolved: "Difficulty tracking health metrics consistently.",
  dataHandled: ["PII", "ePHI", "PAYMENT_CARD_DATA"],
  regions: ["US-EAST", "EU"],
} as const;

const frameworkSeeds: FrameworkSeed[] = [
  {
    code: "GDPR",
    name: "General Data Protection Regulation (GDPR)",
    description:
      "EU privacy regulation governing processing of personal data. Applies from 25 May 2018. Core obligations include lawful basis, transparency, data subject rights, accountability, vendor controls, security of processing, and breach notification.",
    region: "EU",
    category: "Privacy",
    version: "1.0.0",
    effectiveDate: new Date("2018-05-25T00:00:00.000Z"),
    sourceLink: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
  },
  {
    code: "HIPAA",
    name: "HIPAA Security Rule",
    description:
      "US HIPAA Security Rule establishes standards to protect electronic protected health information (ePHI) with administrative, physical, and technical safeguards under 45 CFR Part 164 Subpart C.",
    region: "US",
    category: "Healthcare",
    version: "1.0.0",
    effectiveDate: new Date("2005-04-21T00:00:00.000Z"),
    sourceLink: "https://www.hhs.gov/hipaa/for-professionals/security/index.html",
  },
  {
    code: "PCI-DSS",
    name: "Payment Card Industry Data Security Standard (PCI DSS)",
    description:
      "PCI DSS is a global baseline of technical and operational requirements to protect payment account data for entities that store, process, transmit cardholder data or can impact the cardholder data environment.",
    region: "Global",
    category: "Financial",
    version: "4.0.1",
    effectiveDate: new Date("2024-06-11T00:00:00.000Z"),
    sourceLink: "https://www.pcisecuritystandards.org/document_library",
  },
];

const gdprControls: ControlSeed[] = [
  {
    code: "GDPR-ART6",
    title: "Lawful basis and purpose mapping",
    category: "Lawfulness",
    severity: Severity.HIGH,
    weight: 1.5,
    description:
      "Maintain a register mapping each processing activity to a lawful basis and documented purpose.",
  },
  {
    code: "GDPR-ART7",
    title: "Consent management (where consent is used)",
    category: "Consent",
    severity: Severity.HIGH,
    weight: 1.2,
    description:
      "If relying on consent, ensure consent is freely given, specific, informed, unambiguous, and withdrawable.",
  },
  {
    code: "GDPR-ART12",
    title: "Data subject request process and timelines",
    category: "Data Subject Rights",
    severity: Severity.MEDIUM,
    weight: 1,
    description:
      "Provide transparent communication and operational DSAR handling with tracking and timeline controls.",
  },
  {
    code: "GDPR-ART13-14",
    title: "Privacy notice disclosures",
    category: "Transparency",
    severity: Severity.MEDIUM,
    weight: 1,
    description:
      "Provide required disclosures at collection and ensure notices are aligned with actual data flows.",
  },
  {
    code: "GDPR-ART15",
    title: "Right of access fulfillment",
    category: "Data Subject Rights",
    severity: Severity.MEDIUM,
    weight: 1,
    description: "Enable secure and consistent fulfillment of right-of-access requests.",
  },
  {
    code: "GDPR-ART17",
    title: "Right to erasure workflow",
    category: "Data Subject Rights",
    severity: Severity.MEDIUM,
    weight: 1,
    description: "Support deletion requests with documented exception handling across systems.",
  },
  {
    code: "GDPR-ART20",
    title: "Data portability delivery",
    category: "Data Subject Rights",
    severity: Severity.LOW,
    weight: 0.8,
    description:
      "Provide portable personal data in a structured, commonly used, machine-readable format where applicable.",
  },
  {
    code: "GDPR-ART25",
    title: "Privacy by design and by default",
    category: "Governance & Design",
    severity: Severity.HIGH,
    weight: 1.2,
    description:
      "Implement privacy-by-design/default via minimization, default protections, and SDLC review gates.",
  },
  {
    code: "GDPR-ART30",
    title: "Records of processing activities",
    category: "Accountability",
    severity: Severity.HIGH,
    weight: 1.3,
    description:
      "Maintain an up-to-date record of processing activities (RoPA) with ownership and update cadence.",
  },
  {
    code: "GDPR-ART28",
    title: "Processor due diligence and contracts",
    category: "Vendor Management",
    severity: Severity.HIGH,
    weight: 1.1,
    description:
      "Use processors with sufficient guarantees and maintain required contractual protections.",
  },
  {
    code: "GDPR-ART32",
    title: "Security of processing",
    category: "Security",
    severity: Severity.HIGH,
    weight: 1.5,
    description:
      "Implement appropriate technical and organizational measures for confidentiality, integrity, and availability.",
  },
  {
    code: "GDPR-ART33",
    title: "Supervisory authority breach notification",
    category: "Incident Response",
    severity: Severity.CRITICAL,
    weight: 1.5,
    description:
      "Maintain workflow to assess and notify supervisory authority within required timelines, including 72-hour expectation.",
  },
  {
    code: "GDPR-ART34",
    title: "Data subject breach notification",
    category: "Incident Response",
    severity: Severity.HIGH,
    weight: 1.2,
    description:
      "Maintain process and templates to notify affected individuals when high risk is identified.",
  },
  {
    code: "GDPR-ART35",
    title: "DPIA process for high-risk processing",
    category: "Risk Assessment",
    severity: Severity.MEDIUM,
    weight: 1,
    description: "Perform and document DPIAs for high-risk processing activities.",
  },
  {
    code: "GDPR-ART37-39",
    title: "Data Protection Officer responsibilities (if applicable)",
    category: "Governance",
    severity: Severity.MEDIUM,
    weight: 0.9,
    description:
      "Determine DPO requirement and maintain documented responsibilities and contact channel if applicable.",
  },
];

const hipaaControls: ControlSeed[] = [
  {
    code: "HIPAA-164.308(a)(1)(ii)(A)",
    title: "Risk analysis",
    category: "Administrative Safeguards",
    severity: Severity.CRITICAL,
    weight: 2,
    description:
      "Perform and document an accurate and thorough risk analysis of ePHI confidentiality, integrity, and availability.",
  },
  {
    code: "HIPAA-164.308(a)(1)(ii)(B)",
    title: "Risk management plan",
    category: "Administrative Safeguards",
    severity: Severity.HIGH,
    weight: 1.8,
    description:
      "Implement and track risk treatment measures to reduce risk to a reasonable and appropriate level.",
  },
  {
    code: "HIPAA-164.308(a)(2)",
    title: "Assigned security responsibility",
    category: "Administrative Safeguards",
    severity: Severity.MEDIUM,
    weight: 1,
    description:
      "Assign a security official responsible for implementing HIPAA security policies and procedures.",
  },
  {
    code: "HIPAA-164.308(a)(3)",
    title: "Workforce security",
    category: "Administrative Safeguards",
    severity: Severity.MEDIUM,
    weight: 1,
    description:
      "Ensure workforce members have appropriate access and prevent unauthorized workforce access.",
  },
  {
    code: "HIPAA-164.308(a)(4)",
    title: "Information access management",
    category: "Administrative Safeguards",
    severity: Severity.HIGH,
    weight: 1.2,
    description: "Implement policies and procedures for role-based access authorization to ePHI.",
  },
  {
    code: "HIPAA-164.308(a)(5)",
    title: "Security awareness and training",
    category: "Administrative Safeguards",
    severity: Severity.MEDIUM,
    weight: 1,
    description: "Implement and track security awareness and training activities.",
  },
  {
    code: "HIPAA-164.308(a)(6)",
    title: "Security incident procedures",
    category: "Administrative Safeguards",
    severity: Severity.HIGH,
    weight: 1.2,
    description:
      "Identify and respond to incidents, mitigate harmful effects, and document outcomes.",
  },
  {
    code: "HIPAA-164.308(a)(7)",
    title: "Contingency plan",
    category: "Administrative Safeguards",
    severity: Severity.HIGH,
    weight: 1.5,
    description:
      "Maintain backup, disaster recovery, emergency operations, and contingency testing.",
  },
  {
    code: "HIPAA-164.308(a)(8)",
    title: "Security evaluation",
    category: "Administrative Safeguards",
    severity: Severity.MEDIUM,
    weight: 1,
    description: "Perform periodic technical and nontechnical security evaluations.",
  },
  {
    code: "HIPAA-164.310(a)(1)",
    title: "Facility access controls",
    category: "Physical Safeguards",
    severity: Severity.MEDIUM,
    weight: 1,
    description:
      "Limit physical access to facilities and systems containing ePHI while enabling authorized access.",
  },
  {
    code: "HIPAA-164.310(d)(1)",
    title: "Device and media controls",
    category: "Physical Safeguards",
    severity: Severity.MEDIUM,
    weight: 1,
    description:
      "Govern disposal, media reuse, accountability, and backup/storage for devices and media with ePHI.",
  },
  {
    code: "HIPAA-164.312(a)(2)(i)",
    title: "Unique user identification",
    category: "Technical Safeguards",
    severity: Severity.MEDIUM,
    weight: 1,
    description: "Assign unique identifiers for userSeeds accessing systems containing ePHI.",
  },
  {
    code: "HIPAA-164.312(a)(2)(iv)",
    title: "Encryption and decryption",
    category: "Technical Safeguards",
    severity: Severity.CRITICAL,
    weight: 2,
    description: "Protect ePHI with appropriate encryption at rest and key management.",
  },
  {
    code: "HIPAA-164.312(b)",
    title: "Audit controls",
    category: "Technical Safeguards",
    severity: Severity.HIGH,
    weight: 1.5,
    description: "Implement mechanisms to record and examine activity on systems affecting ePHI.",
  },
  {
    code: "HIPAA-164.312(c)(1)",
    title: "Integrity controls",
    category: "Technical Safeguards",
    severity: Severity.HIGH,
    weight: 1.2,
    description: "Protect ePHI from improper alteration or destruction with integrity controls.",
  },
  {
    code: "HIPAA-164.312(d)",
    title: "Person or entity authentication",
    category: "Technical Safeguards",
    severity: Severity.HIGH,
    weight: 1.2,
    description: "Verify persons or entities seeking access to ePHI are who they claim to be.",
  },
  {
    code: "HIPAA-164.312(e)(1)",
    title: "Transmission security",
    category: "Technical Safeguards",
    severity: Severity.HIGH,
    weight: 1.5,
    description: "Protect ePHI transmitted over networks using secure transport and encryption.",
  },
  {
    code: "HIPAA-164.316(b)(1)",
    title: "Documentation requirements",
    category: "Policies & Documentation",
    severity: Severity.MEDIUM,
    weight: 1,
    description: "Maintain required security documentation with retention and version controls.",
  },
];

const pciControls: ControlSeed[] = [
  {
    code: "PCI-1.2",
    title: "Network security controls",
    category: "Network Security",
    severity: Severity.HIGH,
    weight: 1.5,
    description:
      "Maintain network controls restricting traffic to required cardholder data environment flows.",
  },
  {
    code: "PCI-2.2",
    title: "Secure configurations",
    category: "Hardening",
    severity: Severity.MEDIUM,
    weight: 1.2,
    description: "Apply secure configurations and remove insecure defaults on in-scope systems.",
  },
  {
    code: "PCI-3.4",
    title: "Render PAN unreadable at rest",
    category: "Data Protection",
    severity: Severity.CRITICAL,
    weight: 2,
    description: "Render PAN unreadable via tokenization or strong cryptography in stored data.",
  },
  {
    code: "PCI-3.6",
    title: "Cryptographic key management",
    category: "Data Protection",
    severity: Severity.HIGH,
    weight: 1.5,
    description:
      "Manage key lifecycle securely including generation, storage, rotation, and retirement.",
  },
  {
    code: "PCI-4.2",
    title: "Encrypt transmission of account data",
    category: "Data Protection",
    severity: Severity.HIGH,
    weight: 1.5,
    description:
      "Use strong cryptography and secure protocols for account data over open/public networks.",
  },
  {
    code: "PCI-5.1",
    title: "Malware defenses",
    category: "Endpoint Security",
    severity: Severity.MEDIUM,
    weight: 1.2,
    description: "Deploy and maintain anti-malware or EDR defenses with monitoring.",
  },
  {
    code: "PCI-6.3",
    title: "Secure development and patching",
    category: "Secure SDLC",
    severity: Severity.HIGH,
    weight: 1.5,
    description:
      "Enforce secure development practices, change management, and vulnerability remediation timelines.",
  },
  {
    code: "PCI-7.2",
    title: "Least privilege / need-to-know",
    category: "Access Control",
    severity: Severity.MEDIUM,
    weight: 1,
    description: "Restrict access based on business need-to-know and least privilege.",
  },
  {
    code: "PCI-8.4",
    title: "Multi-factor authentication",
    category: "Access Control",
    severity: Severity.HIGH,
    weight: 1.5,
    description: "Require and govern MFA for in-scope access paths.",
  },
  {
    code: "PCI-10.2",
    title: "Audit logging and monitoring",
    category: "Monitoring",
    severity: Severity.HIGH,
    weight: 1.2,
    description:
      "Implement centralized audit logging, review, and alerting for suspicious activity.",
  },
  {
    code: "PCI-11.3",
    title: "Security testing",
    category: "Testing",
    severity: Severity.HIGH,
    weight: 1.5,
    description: "Perform vulnerability scans and penetration testing with remediation tracking.",
  },
  {
    code: "PCI-12.1",
    title: "Security policy and program",
    category: "Governance",
    severity: Severity.MEDIUM,
    weight: 1,
    description:
      "Maintain an information security policy and operating program for sustained compliance.",
  },
];

const controlsByFramework: Record<string, ControlSeed[]> = {
  GDPR: gdprControls,
  HIPAA: hipaaControls,
  "PCI-DSS": pciControls,
};

const assessmentStatusByControl: Record<string, AssessmentItemSeed> = {
  "GDPR-ART6": {
    status: ItemStatus.COMPLIANT,
    comments: "Lawful basis mapped per processing activity; reviewed in Q1.",
  },
  "GDPR-ART7": {
    status: ItemStatus.PARTIALLY_COMPLIANT,
    comments: "Consent capture exists, but withdrawal and audit trail are not fully standardized.",
  },
  "GDPR-ART12": {
    status: ItemStatus.COMPLIANT,
    comments: "DSAR SOP exists with tracked intake and response templates.",
  },
  "GDPR-ART13-14": {
    status: ItemStatus.COMPLIANT,
    comments: "Privacy notice published and mapped to inventory.",
  },
  "GDPR-ART15": {
    status: ItemStatus.COMPLIANT,
    comments: "Access exports supported via internal data export tool.",
  },
  "GDPR-ART17": {
    status: ItemStatus.COMPLIANT,
    comments: "Deletion workflow documented; manual steps for two legacy systems.",
  },
  "GDPR-ART20": {
    status: ItemStatus.NOT_STARTED,
    comments: "No standardized portability export (machine-readable) yet.",
  },
  "GDPR-ART25": {
    status: ItemStatus.COMPLIANT,
    comments: "Privacy review added to feature launch checklist.",
  },
  "GDPR-ART30": {
    status: ItemStatus.PARTIALLY_COMPLIANT,
    comments: "RoPA exists but is not consistently updated per release cycle.",
  },
  "GDPR-ART28": {
    status: ItemStatus.COMPLIANT,
    comments: "DPAs in place for key vendors; renewal tracker maintained.",
  },
  "GDPR-ART32": {
    status: ItemStatus.COMPLIANT,
    comments: "TLS enforced; access controls documented; testing scheduled.",
  },
  "GDPR-ART33": {
    status: ItemStatus.NOT_COMPLIANT,
    comments: "No tested 72-hour supervisory authority notification playbook.",
  },
  "GDPR-ART34": {
    status: ItemStatus.NOT_STARTED,
    comments: "No templated data-subject breach communication workflow.",
  },
  "GDPR-ART35": {
    status: ItemStatus.COMPLIANT,
    comments: "DPIA template exists; performed for EU feature rollout.",
  },
  "GDPR-ART37-39": {
    status: ItemStatus.NOT_APPLICABLE,
    comments: "DPO requirement evaluated as not applicable for current scale.",
  },
  "HIPAA-164.308(a)(1)(ii)(A)": {
    status: ItemStatus.COMPLIANT,
    comments: "Annual risk analysis performed; risks tracked in register.",
  },
  "HIPAA-164.308(a)(1)(ii)(B)": {
    status: ItemStatus.PARTIALLY_COMPLIANT,
    comments: "Risk treatment plan in progress; four risks pending mitigation.",
  },
  "HIPAA-164.308(a)(2)": {
    status: ItemStatus.COMPLIANT,
    comments: "Security Officer assigned and documented.",
  },
  "HIPAA-164.308(a)(3)": {
    status: ItemStatus.COMPLIANT,
    comments: "Joiner/mover/leaver checklist enforced through IT tickets.",
  },
  "HIPAA-164.308(a)(4)": {
    status: ItemStatus.COMPLIANT,
    comments: "RBAC matrix defined; access approvals required.",
  },
  "HIPAA-164.308(a)(5)": {
    status: ItemStatus.PARTIALLY_COMPLIANT,
    comments: "Training exists; phishing simulations not yet implemented.",
  },
  "HIPAA-164.308(a)(6)": {
    status: ItemStatus.COMPLIANT,
    comments: "Incident response SOP exists with reporting channel.",
  },
  "HIPAA-164.308(a)(7)": {
    status: ItemStatus.PARTIALLY_COMPLIANT,
    comments: "Backups configured; DR restore tests are irregular.",
  },
  "HIPAA-164.308(a)(8)": {
    status: ItemStatus.NOT_STARTED,
    comments: "No formal periodic security evaluation cadence yet.",
  },
  "HIPAA-164.310(a)(1)": {
    status: ItemStatus.COMPLIANT,
    comments: "Office access restricted; visitor logs maintained.",
  },
  "HIPAA-164.310(d)(1)": {
    status: ItemStatus.COMPLIANT,
    comments: "Device inventory maintained; secure wipe required on disposal.",
  },
  "HIPAA-164.312(a)(2)(i)": {
    status: ItemStatus.COMPLIANT,
    comments: "No shared accounts; unique IDs enforced in IdP.",
  },
  "HIPAA-164.312(a)(2)(iv)": {
    status: ItemStatus.NOT_COMPLIANT,
    comments: "Encryption at rest not implemented for one production datastore.",
  },
  "HIPAA-164.312(b)": {
    status: ItemStatus.PARTIALLY_COMPLIANT,
    comments: "Logging exists; alerts and review procedures are incomplete.",
  },
  "HIPAA-164.312(c)(1)": {
    status: ItemStatus.COMPLIANT,
    comments: "Change controls and integrity checks in place for ePHI records.",
  },
  "HIPAA-164.312(d)": {
    status: ItemStatus.COMPLIANT,
    comments: "MFA required for admin access; SSO enforced.",
  },
  "HIPAA-164.312(e)(1)": {
    status: ItemStatus.COMPLIANT,
    comments: "TLS enforced for API traffic; transmission encryption verified.",
  },
  "HIPAA-164.316(b)(1)": {
    status: ItemStatus.COMPLIANT,
    comments: "Policies versioned and retained in controlled repository.",
  },
  "PCI-1.2": {
    status: ItemStatus.COMPLIANT,
    comments: "Network security rules documented; quarterly review scheduled.",
  },
  "PCI-2.2": {
    status: ItemStatus.COMPLIANT,
    comments: "Hardened baselines applied through configuration management.",
  },
  "PCI-3.4": {
    status: ItemStatus.NOT_COMPLIANT,
    comments: "PAN encryption/tokenization missing for legacy billing export.",
  },
  "PCI-3.6": {
    status: ItemStatus.PARTIALLY_COMPLIANT,
    comments: "Key storage centralized; rotation evidence incomplete.",
  },
  "PCI-4.2": {
    status: ItemStatus.COMPLIANT,
    comments: "TLS enforced and weak cipher suites disabled.",
  },
  "PCI-5.1": {
    status: ItemStatus.COMPLIANT,
    comments: "EDR deployed on endpoints and alerts are monitored.",
  },
  "PCI-6.3": {
    status: ItemStatus.PARTIALLY_COMPLIANT,
    comments: "Secure coding standards exist; SAST and DAST coverage incomplete.",
  },
  "PCI-7.2": {
    status: ItemStatus.COMPLIANT,
    comments: "Least privilege enforced with quarterly access reviews.",
  },
  "PCI-8.4": {
    status: ItemStatus.PARTIALLY_COMPLIANT,
    comments: "MFA enabled for admins; not fully enforced for all in-scope paths.",
  },
  "PCI-10.2": {
    status: ItemStatus.COMPLIANT,
    comments: "Centralized logging configured with policy-aligned retention.",
  },
  "PCI-11.3": {
    status: ItemStatus.NOT_STARTED,
    comments: "Penetration testing vendor not selected; scans not scheduled.",
  },
  "PCI-12.1": {
    status: ItemStatus.COMPLIANT,
    comments: "Information security policy approved and reviewed annually.",
  },
};

const evidencePayloads = [
  {
    controlCode: "HIPAA-164.312(a)(2)(iv)",
    filename: "seed/hipaa/encryption-at-rest-gap-analysis.pdf",
    originalName: "Encryption-at-Rest-Gap-Analysis.pdf",
    fileUrl: "https://minio.local/seed-bucket/seed/hipaa/encryption-at-rest-gap-analysis.pdf",
    fileSize: 482193,
    mimeType: "application/pdf",
    description: "Gap analysis for ePHI encryption at rest; legacy datastore identified.",
  },
  {
    controlCode: "GDPR-ART30",
    filename: "seed/gdpr/ropa-inventory.xlsx",
    originalName: "RoPA-Inventory-HealthTrack.xlsx",
    fileUrl: "https://minio.local/seed-bucket/seed/gdpr/ropa-inventory.xlsx",
    fileSize: 913284,
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    description: "Draft records of processing activities; needs quarterly refresh cadence.",
  },
  {
    controlCode: "PCI-10.2",
    filename: "seed/pci/siem-log-retention-policy.pdf",
    originalName: "SIEM-Log-Retention-Policy.pdf",
    fileUrl: "https://minio.local/seed-bucket/seed/pci/siem-log-retention-policy.pdf",
    fileSize: 268044,
    mimeType: "application/pdf",
    description: "SIEM logging and retention policy excerpt for PCI audit logging control.",
  },
] as const;

const preAssessmentInput = {
  productName: organizationSeed.productName,
  description: organizationSeed.description,
  services: organizationSeed.services,
  targetCustomers: organizationSeed.targetCustomers,
  problemSolved: organizationSeed.problemSolved,
  dataHandled: organizationSeed.dataHandled,
  regions: organizationSeed.regions,
  task: "Map this organizationSeed to applicable compliance frameworkSeeds. Return up to 8 frameworkSeeds with confidence (0-100), explanation (2-3 sentences), and tags.",
};

const preAssessmentOutput = {
  frameworkSeeds: [
    {
      code: "HIPAA",
      name: "HIPAA Security Rule",
      confidence: 95,
      explanation:
        "Your product processes electronic protected health information (ePHI) for U.S. userSeeds. HIPAA Security Rule safeguards apply to systems that store, process, or transmit ePHI.",
      tags: ["healthcare", "us", "ephi", "security"],
    },
    {
      code: "GDPR",
      name: "General Data Protection Regulation (GDPR)",
      confidence: 90,
      explanation:
        "You operate in the EU and process personally identifiable information. GDPR applies to EU personal data processing and requires rights handling and breach response.",
      tags: ["privacy", "eu", "pii", "data-protection"],
    },
    {
      code: "PCI-DSS",
      name: "Payment Card Industry Data Security Standard (PCI DSS)",
      confidence: 85,
      explanation:
        "You process payment card data for subscriptions. PCI DSS requires safeguards around encryption, access, logging, and testing.",
      tags: ["payments", "card-data", "security", "financial"],
    },
  ],
};

function statusToValue(status: ItemStatus): number | null {
  if (status === ItemStatus.COMPLIANT) {
    return 1;
  }
  if (status === ItemStatus.PARTIALLY_COMPLIANT) {
    return 0.5;
  }
  if (status === ItemStatus.NOT_COMPLIANT) {
    return 0;
  }
  if (status === ItemStatus.NOT_STARTED) {
    return 0;
  }
  if (status === ItemStatus.NOT_APPLICABLE) {
    return null;
  }
  return 0;
}

function calculateGlobalWeightedScore(
  itemRows: Array<{ status: ItemStatus; weight: number }>,
): number | null {
  let weightedSum = 0;
  let totalWeights = 0;

  for (const item of itemRows) {
    const scoreValue = statusToValue(item.status);
    if (scoreValue === null) {
      continue;
    }

    weightedSum += scoreValue * item.weight;
    totalWeights += item.weight;
  }

  if (totalWeights === 0) {
    return null;
  }

  const score = (weightedSum / totalWeights) * 100;
  return Number(score.toFixed(1));
}

async function upsertUsers() {
  const adminHash = await bcrypt.hash(userSeeds.admin.password, 12);
  const testHash = await bcrypt.hash(userSeeds.test.password, 12);

  const admin = await prisma.user.upsert({
    where: { email: userSeeds.admin.email },
    update: {
      name: userSeeds.admin.name,
      role: userSeeds.admin.role,
      password: adminHash,
    },
    create: {
      email: userSeeds.admin.email,
      name: userSeeds.admin.name,
      role: userSeeds.admin.role,
      password: adminHash,
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: userSeeds.test.email },
    update: {
      name: userSeeds.test.name,
      role: userSeeds.test.role,
      password: testHash,
    },
    create: {
      email: userSeeds.test.email,
      name: userSeeds.test.name,
      role: userSeeds.test.role,
      password: testHash,
    },
  });

  return { admin, testUser };
}

async function upsertFrameworksAndControls() {
  const controlCodeToId = new Map<string, string>();
  const controlCodeToWeight = new Map<string, number>();

  for (const framework of frameworkSeeds) {
    const frameworkRow = await prisma.framework.upsert({
      where: { code: framework.code },
      update: {
        name: framework.name,
        description: framework.description,
        region: framework.region,
        category: framework.category,
        version: framework.version,
        effectiveDate: framework.effectiveDate,
        sourceLink: framework.sourceLink,
        status: FrameworkStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      create: {
        code: framework.code,
        name: framework.name,
        description: framework.description,
        region: framework.region,
        category: framework.category,
        version: framework.version,
        effectiveDate: framework.effectiveDate,
        sourceLink: framework.sourceLink,
        status: FrameworkStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });

    const controls = controlsByFramework[framework.code] ?? [];

    for (const control of controls) {
      const controlRow = await prisma.control.upsert({
        where: {
          frameworkId_code: {
            frameworkId: frameworkRow.id,
            code: control.code,
          },
        },
        update: {
          title: control.title,
          description: control.description,
          category: control.category,
          severity: control.severity,
          weight: control.weight,
        },
        create: {
          frameworkId: frameworkRow.id,
          code: control.code,
          title: control.title,
          description: control.description,
          category: control.category,
          severity: control.severity,
          weight: control.weight,
        },
      });

      controlCodeToId.set(control.code, controlRow.id);
      controlCodeToWeight.set(control.code, control.weight);
    }
  }

  return { controlCodeToId, controlCodeToWeight };
}

async function upsertOrganization(userId: string) {
  const existing = await prisma.organizationSeed.findFirst({
    where: {
      userId,
      productName: organizationSeed.productName,
    },
    select: { id: true },
  });

  if (existing) {
    return prisma.organizationSeed.update({
      where: { id: existing.id },
      data: {
        description: organizationSeed.description,
        services: organizationSeed.services,
        targetCustomers: organizationSeed.targetCustomers,
        problemSolved: organizationSeed.problemSolved,
        dataHandled: [...organizationSeed.dataHandled],
        regions: [...organizationSeed.regions],
      },
    });
  }

  return prisma.organizationSeed.create({
    data: {
      userId,
      productName: organizationSeed.productName,
      description: organizationSeed.description,
      services: organizationSeed.services,
      targetCustomers: organizationSeed.targetCustomers,
      problemSolved: organizationSeed.problemSolved,
      dataHandled: [...organizationSeed.dataHandled],
      regions: [...organizationSeed.regions],
    },
  });
}

async function replaceSeedAssessment(userId: string, organizationId: string) {
  const existingAssessments = await prisma.assessment.findMany({
    where: {
      userId,
      organizationId,
    },
    select: { id: true },
  });

  const existingIds = existingAssessments.map((row) => row.id);

  if (existingIds.length > 0) {
    await prisma.aIInteraction.deleteMany({
      where: {
        assessmentId: { in: existingIds },
      },
    });

    await prisma.assessment.deleteMany({
      where: {
        id: { in: existingIds },
      },
    });
  }

  return prisma.assessment.create({
    data: {
      userId,
      organizationId,
      status: AssessmentStatus.IN_PROGRESS,
      score: null,
    },
  });
}

async function seedAssessmentItems(assessmentId: string, controlCodeToId: Map<string, string>) {
  const controlCodeToAssessmentItemId = new Map<string, string>();

  for (const [controlCode, item] of Object.entries(assessmentStatusByControl)) {
    const controlId = controlCodeToId.get(controlCode);
    if (!controlId) {
      throw new Error(`Missing control ID for ${controlCode}`);
    }

    const assessmentItem = await prisma.assessmentItem.create({
      data: {
        assessmentId,
        controlId,
        status: item.status,
        comments: item.comments,
      },
    });

    controlCodeToAssessmentItemId.set(controlCode, assessmentItem.id);
  }

  return controlCodeToAssessmentItemId;
}

async function seedEvidence(
  uploaderUserId: string,
  controlCodeToAssessmentItemId: Map<string, string>,
) {
  for (const evidence of evidencePayloads) {
    const assessmentItemId = controlCodeToAssessmentItemId.get(evidence.controlCode);
    if (!assessmentItemId) {
      throw new Error(`Missing assessment item for evidence control ${evidence.controlCode}`);
    }

    await prisma.evidence.create({
      data: {
        assessmentItemId,
        userId: uploaderUserId,
        filename: evidence.filename,
        originalName: evidence.originalName,
        fileUrl: evidence.fileUrl,
        fileSize: evidence.fileSize,
        mimeType: evidence.mimeType,
        description: evidence.description,
      },
    });
  }
}

async function seedAiInteractions(assessmentId: string, organizationId: string) {
  const preInput = JSON.stringify(preAssessmentInput);
  const preOutput = JSON.stringify(preAssessmentOutput);

  await prisma.aIInteraction.deleteMany({
    where: {
      assessmentId: null,
      type: AIType.COMPLIANCE_MAPPING,
      model: "gpt-4o-mini",
      input: preInput,
      output: preOutput,
    },
  });

  await prisma.aIInteraction.create({
    data: {
      assessmentId: null,
      type: AIType.COMPLIANCE_MAPPING,
      input: preInput,
      output: preOutput,
      model: "gpt-4o-mini",
      tokensUsed: 1120,
      durationMs: 1840,
    },
  });

  const linkedInput = JSON.stringify({
    assessmentId,
    organizationId,
    regions: organizationSeed.regions,
    dataHandled: organizationSeed.dataHandled,
    task: "Confirm or refine applicable compliance frameworkSeeds for this assessment context.",
  });

  const linkedOutput = JSON.stringify({
    frameworkSeeds: [
      {
        code: "HIPAA",
        name: "HIPAA Security Rule",
        confidence: 96,
        explanation:
          "Primary driver is ePHI handling in the U.S.; Security Rule safeguards are core.",
        tags: ["healthcare", "us", "ephi"],
      },
      {
        code: "GDPR",
        name: "General Data Protection Regulation (GDPR)",
        confidence: 88,
        explanation:
          "EU operations with PII trigger GDPR obligations including rights handling and breach response.",
        tags: ["privacy", "eu", "pii"],
      },
      {
        code: "PCI-DSS",
        name: "Payment Card Industry Data Security Standard (PCI DSS)",
        confidence: 84,
        explanation:
          "Subscription billing with card data requires PCI DSS controls for storage, transmission, access, and monitoring.",
        tags: ["payments", "card-data"],
      },
    ],
    notes:
      "Confidence reflects typical applicability; confirm scope with payment processor and legal counsel.",
  });

  await prisma.aIInteraction.create({
    data: {
      assessmentId,
      type: AIType.COMPLIANCE_MAPPING,
      input: linkedInput,
      output: linkedOutput,
      model: "gpt-4o-mini",
      tokensUsed: 980,
      durationMs: 1520,
    },
  });
}

async function updateAssessmentScore(
  assessmentId: string,
  controlCodeToWeight: Map<string, number>,
) {
  const itemRows: Array<{ status: ItemStatus; weight: number }> = [];

  for (const [controlCode, seedItem] of Object.entries(assessmentStatusByControl)) {
    const weight = controlCodeToWeight.get(controlCode);
    if (weight === undefined) {
      throw new Error(`Missing weight for control ${controlCode}`);
    }

    itemRows.push({ status: seedItem.status, weight });
  }

  const score = calculateGlobalWeightedScore(itemRows);

  await prisma.assessment.update({
    where: { id: assessmentId },
    data: { score },
  });

  return score;
}

async function main() {
  console.log("Starting Task 0.6 seed...");
  console.log(`Source of truth: ${pdfSourceOfTruth}`);

  const { testUser } = await upsertUsers();
  const { controlCodeToId, controlCodeToWeight } = await upsertFrameworksAndControls();

  const organizationSeed = await upsertOrganization(testUser.id);
  const assessment = await replaceSeedAssessment(testUser.id, organizationSeed.id);

  const controlCodeToAssessmentItemId = await seedAssessmentItems(assessment.id, controlCodeToId);

  await seedEvidence(testUser.id, controlCodeToAssessmentItemId);
  await seedAiInteractions(assessment.id, organizationSeed.id);

  const score = await updateAssessmentScore(assessment.id, controlCodeToWeight);

  console.log("Task 0.6 seed complete.");
  console.log("userSeeds: 2 upserted, frameworkSeeds: 3 upserted");
  console.log(`Controls: ${controlCodeToId.size} upserted`);
  console.log(`Assessment score: ${score ?? "null"}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
