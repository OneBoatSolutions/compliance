import type { SeedControl } from "./types";

export const pciControls: SeedControl[] = [
  // ── Section 1: Network Security Controls ──────────────────────────────────
  {
    code: "PCI-1.2.5",
    title: "Allowed services and protocols documented",
    description:
      "Are all allowed services, protocols, and ports identified, approved, and justified with a defined business need?",
    category: "Network Security Controls",
    severity: "MEDIUM",
    weight: 2.0,
    metadata: {
      pciReq: "1.2.5",
      testingProcedure: "Review documentation and examine system configuration settings.",
    },
  },
  {
    code: "PCI-1.3.1",
    title: "Restrict inbound CDE traffic by default-deny",
    description:
      "Is inbound traffic to the Cardholder Data Environment (CDE) restricted to only necessary traffic, with all other traffic denied by default?",
    category: "Network Security Controls",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      pciReq: "1.3.1",
      testingProcedure:
        "Examine NSC configuration standards and review NSC configuration settings.",
    },
  },

  // ── Section 2: Secure Configuration ───────────────────────────────────────
  {
    code: "PCI-2.2.2",
    title: "Remove all default vendor credentials",
    description:
      "Are vendor default accounts and passwords changed, disabled, or removed before systems are deployed?",
    category: "Secure Configuration",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      pciReq: "2.2.2",
      testingProcedure:
        "Examine configuration standards and vendor documentation, review configuration files, observe administrator login, and interview personnel.",
    },
  },

  // ── Section 3: Stored Account Data Protection ──────────────────────────────
  {
    code: "PCI-3.3.1",
    title: "No SAD stored after authorization",
    description:
      "Is sensitive authentication data (SAD) removed or rendered unrecoverable after the authorization process?",
    category: "Stored Account Data Protection",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      pciReq: "3.3.1",
      testingProcedure:
        "Examine policies and procedures, review system configurations, and observe secure data deletion processes.",
    },
  },
  {
    code: "PCI-3.5.1",
    title: "PAN rendered unreadable in storage",
    description:
      "Is PAN rendered unreadable wherever it is stored using approved methods such as hashing, truncation, tokenization, or strong encryption?",
    category: "Stored Account Data Protection",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      pciReq: "3.5.1",
      testingProcedure:
        "Examine documentation for methods used to render PAN unreadable, review data repositories, check audit logs including payment application logs, and verify controls preventing reconstruction of PAN.",
    },
  },

  // ── Section 4: Transmission Cryptography ──────────────────────────────────
  {
    code: "PCI-4.2.1",
    title: "Strong cryptography for PAN in transit",
    description:
      "Is strong cryptography used to protect PAN during transmission over open, public networks?",
    category: "Transmission Cryptography",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      pciReq: "4.2.1",
      testingProcedure:
        "Examine policies and procedures, interview personnel, review system configurations, inspect cardholder data transmissions, and examine encryption keys and certificates.",
    },
  },

  // ── Section 5: Malware Protection ─────────────────────────────────────────
  {
    code: "PCI-5.2.1",
    title: "Anti-malware on all at-risk components",
    description:
      "Is an anti-malware solution deployed on all system components at risk of malware?",
    category: "Malware Protection",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      pciReq: "5.2.1",
      testingProcedure: "Examine system components and review periodic risk evaluations.",
    },
  },

  // ── Section 6: Secure Development ─────────────────────────────────────────
  {
    code: "PCI-6.3.3",
    title: "Security patches applied within timeframes",
    description:
      "Are security patches applied to system components within defined timeframes based on risk level?",
    category: "Secure Development",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      pciReq: "6.3.3",
      testingProcedure:
        "Examine policies and procedures, review system components and installed patches, and compare with vendor patch releases.",
    },
  },
  {
    code: "PCI-6.4.1",
    title: "WAF or security assessment for public apps",
    description:
      "Are public-facing web applications protected through regular security assessments or automated protection mechanisms?",
    category: "Secure Development",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      pciReq: "6.4.1",
      testingProcedure:
        "Examine security assessment records, review documented processes, interview personnel, and review system configurations and logs.",
    },
  },

  // ── Section 7: Access Control ──────────────────────────────────────────────
  {
    code: "PCI-7.2.1",
    title: "Least-privilege access model by job role",
    description:
      "Is an access control model defined based on job roles and the principle of least privilege?",
    category: "Access Control",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      pciReq: "7.2.1",
      testingProcedure:
        "Examine policies and procedures, interview personnel, and review access control model settings.",
    },
  },

  // ── Section 8: Authentication ──────────────────────────────────────────────
  {
    code: "PCI-8.2.1",
    title: "Unique user ID for all users",
    description:
      "Are all users assigned a unique ID before accessing system components or cardholder data?",
    category: "Authentication",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      pciReq: "8.2.1",
      testingProcedure: "Interview responsible personnel and examine audit logs or other evidence.",
    },
  },
  {
    code: "PCI-8.3.6",
    title: "Password complexity requirements enforced",
    description: "Do passwords meet minimum complexity requirements (length and character types)?",
    category: "Authentication",
    severity: "MEDIUM",
    weight: 2.0,
    metadata: {
      pciReq: "8.3.6",
      testingProcedure: "Examine system configuration settings.",
    },
  },
  {
    code: "PCI-8.4.2",
    title: "MFA for all CDE access",
    description: "Is multi-factor authentication implemented for all access to the CDE?",
    category: "Authentication",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      pciReq: "8.4.2",
      testingProcedure:
        "Review configurations, observe user logins, and examine supporting evidence.",
    },
  },

  // ── Section 10: Logging and Monitoring ────────────────────────────────────
  {
    code: "PCI-10.2.1",
    title: "Audit logs for all cardholder data access",
    description: "Are audit logs enabled for all system components and cardholder data systems?",
    category: "Logging and Monitoring",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      pciReq: "10.2.1",
      testingProcedure: "Interview system administrator and examine system configurations.",
    },
  },
  {
    code: "PCI-10.5.1",
    title: "Audit logs retained for 12+ months",
    description:
      "Are audit logs retained for at least 12 months with at least three months immediately available for analysis?",
    category: "Logging and Monitoring",
    severity: "MEDIUM",
    weight: 2.0,
    metadata: {
      pciReq: "10.5.1",
      testingProcedure:
        "Examine retention policies, system configurations, audit logs, interview personnel, and observe processes.",
    },
  },
];
