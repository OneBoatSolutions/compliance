import type { SeedControl } from "./types";

export const hipaaControls: SeedControl[] = [
  // ── Administrative Safeguards — §164.308 ──────────────────────────────────
  {
    code: "HIPAA-308-A1",
    title: "Risk Analysis",
    description:
      "Conduct an accurate and thorough assessment of the potential risks and vulnerabilities to the confidentiality, integrity, and availability of all ePHI the organization creates, receives, maintains, or transmits.",
    category: "Administrative Safeguards",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      cfr: "45 CFR §164.308(a)(1)(ii)(A)",
      specification: "Required",
      safeguard: "Administrative",
    },
  },
  {
    code: "HIPAA-308-A2",
    title: "Risk Management",
    description:
      "Implement security measures sufficient to reduce risks and vulnerabilities to ePHI to a reasonable and appropriate level, and maintain ongoing security measures to address risks identified in the risk analysis.",
    category: "Administrative Safeguards",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      cfr: "45 CFR §164.308(a)(1)(ii)(B)",
      specification: "Required",
      safeguard: "Administrative",
    },
  },
  {
    code: "HIPAA-308-A3",
    title: "Sanction Policy",
    description:
      "Apply appropriate sanctions against workforce members who fail to comply with the security policies and procedures of the covered entity or business associate.",
    category: "Administrative Safeguards",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      cfr: "45 CFR §164.308(a)(1)(ii)(C)",
      specification: "Required",
      safeguard: "Administrative",
    },
  },
  {
    code: "HIPAA-308-A4",
    title: "System Activity Review / Audit Log Policy",
    description:
      "Implement procedures to regularly review records of information system activity, such as audit logs, access reports, and security incident tracking reports.",
    category: "Administrative Safeguards",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      cfr: "45 CFR §164.308(a)(1)(ii)(D)",
      specification: "Required",
      safeguard: "Administrative",
    },
  },
  {
    code: "HIPAA-308-A5",
    title: "Workforce Access Authorization",
    description:
      "Implement procedures for the authorization and/or supervision of workforce members who work with ePHI or in locations where it might be accessed.",
    category: "Administrative Safeguards",
    severity: "MEDIUM",
    weight: 2.0,
    metadata: {
      cfr: "45 CFR §164.308(a)(3)(ii)(A)",
      specification: "Addressable",
      safeguard: "Administrative",
    },
  },
  {
    code: "HIPAA-308-A6",
    title: "Workforce Clearance Procedures",
    description:
      "Implement procedures to determine that the access of a workforce member to ePHI is appropriate, including background verification and access termination.",
    category: "Administrative Safeguards",
    severity: "MEDIUM",
    weight: 2.0,
    metadata: {
      cfr: "45 CFR §164.308(a)(3)(ii)(B)",
      specification: "Addressable",
      safeguard: "Administrative",
    },
  },
  {
    code: "HIPAA-308-A7",
    title: "Security Awareness and Training",
    description:
      "Implement a security awareness and training program for all members of the workforce, including management, covering topics such as malicious software protection, log-in monitoring, and password management.",
    category: "Administrative Safeguards",
    severity: "MEDIUM",
    weight: 2.0,
    metadata: {
      cfr: "45 CFR §164.308(a)(5)",
      specification: "Addressable",
      safeguard: "Administrative",
    },
  },
  {
    code: "HIPAA-308-A8",
    title: "Security Incident Procedures",
    description:
      "Implement policies and procedures to address security incidents, including procedures to identify and respond to suspected or known security incidents, mitigate harmful effects, and document incidents and their outcomes.",
    category: "Administrative Safeguards",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      cfr: "45 CFR §164.308(a)(6)",
      specification: "Required",
      safeguard: "Administrative",
    },
  },
  {
    code: "HIPAA-308-A9",
    title: "Contingency Plan and Data Backup",
    description:
      "Establish and implement procedures to create and maintain retrievable exact copies of ePHI, and implement a contingency plan for responding to emergencies or other occurrences that damage systems containing ePHI.",
    category: "Administrative Safeguards",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      cfr: "45 CFR §164.308(a)(7)",
      specification: "Required",
      safeguard: "Administrative",
    },
  },
  {
    code: "HIPAA-308-A10",
    title: "Business Associate Agreements",
    description:
      "A covered entity may permit a business associate to create, receive, maintain, or transmit ePHI on its behalf only if the covered entity obtains satisfactory assurances in the form of a written Business Associate Agreement.",
    category: "Administrative Safeguards",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      cfr: "45 CFR §164.308(b)(1)",
      specification: "Required",
      safeguard: "Administrative",
    },
  },

  // ── Physical Safeguards — §164.310 ────────────────────────────────────────
  {
    code: "HIPAA-310-A1",
    title: "Facility Access Controls",
    description:
      "Implement policies and procedures to limit physical access to electronic information systems and the facilities in which they are housed, while ensuring that properly authorized access is allowed.",
    category: "Physical Safeguards",
    severity: "MEDIUM",
    weight: 2.0,
    metadata: {
      cfr: "45 CFR §164.310(a)(1)",
      specification: "Addressable",
      safeguard: "Physical",
    },
  },
  {
    code: "HIPAA-310-B",
    title: "Workstation Use Policy",
    description:
      "Implement policies and procedures that specify the proper functions to be performed, the manner in which those functions are to be performed, and the physical attributes of the surroundings of a specific workstation or class of workstation that can access ePHI.",
    category: "Physical Safeguards",
    severity: "MEDIUM",
    weight: 2.0,
    metadata: {
      cfr: "45 CFR §164.310(b)",
      specification: "Required",
      safeguard: "Physical",
    },
  },
  {
    code: "HIPAA-310-C",
    title: "Workstation Physical Security",
    description:
      "Implement physical safeguards for all workstations that access ePHI, to restrict access to authorized users only.",
    category: "Physical Safeguards",
    severity: "MEDIUM",
    weight: 2.0,
    metadata: {
      cfr: "45 CFR §164.310(c)",
      specification: "Required",
      safeguard: "Physical",
    },
  },
  {
    code: "HIPAA-310-D1",
    title: "Device and Media Controls",
    description:
      "Implement policies and procedures that govern the receipt and removal of hardware and electronic media that contain ePHI into and out of a facility, and the movement of these items within the facility, including procedures for disposal and re-use.",
    category: "Physical Safeguards",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      cfr: "45 CFR §164.310(d)(1)",
      specification: "Required",
      safeguard: "Physical",
    },
  },

  // ── Technical Safeguards — §164.312 ───────────────────────────────────────
  {
    code: "HIPAA-312-A1",
    title: "Unique User Identification",
    description:
      "Assign a unique name and/or number for identifying and tracking user identity to ensure that all access to ePHI is attributable to a specific individual.",
    category: "Technical Safeguards",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      cfr: "45 CFR §164.312(a)(2)(i)",
      specification: "Required",
      safeguard: "Technical",
    },
  },
  {
    code: "HIPAA-312-A2",
    title: "Automatic Session Logoff",
    description:
      "Implement electronic procedures that terminate an electronic session after a predetermined time of inactivity to prevent unauthorized access to ePHI.",
    category: "Technical Safeguards",
    severity: "MEDIUM",
    weight: 2.0,
    metadata: {
      cfr: "45 CFR §164.312(a)(2)(iii)",
      specification: "Addressable",
      safeguard: "Technical",
    },
  },
  {
    code: "HIPAA-312-B",
    title: "Audit Controls for ePHI",
    description:
      "Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use ePHI.",
    category: "Technical Safeguards",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      cfr: "45 CFR §164.312(b)",
      specification: "Required",
      safeguard: "Technical",
    },
  },
  {
    code: "HIPAA-312-C",
    title: "Encryption of ePHI in Transit",
    description:
      "Implement a mechanism to encrypt ePHI whenever deemed appropriate, including when transmitting ePHI over open networks such as the internet, to guard against unauthorized access to ePHI in transit.",
    category: "Technical Safeguards",
    severity: "HIGH",
    weight: 3.0,
    metadata: {
      cfr: "45 CFR §164.312(e)(2)(ii)",
      specification: "Addressable",
      safeguard: "Technical",
      note: "Treated as HIGH due to criticality to demo data gaps",
    },
  },
];
