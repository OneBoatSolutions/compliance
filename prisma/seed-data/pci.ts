import type { SeedControl } from "./types";

export const pciControls: SeedControl[] = [
  {
    code: "PCI-1.1.1",
    title: "Network Security Policies Procedures Documented Updated",
    description:
      "Are network security policies and procedures documented, updated, and communicated?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.1.1",
      testingProcedure: "Review policy documents and interview relevant personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-1.1.2",
    title: "Roles Responsibilities Network Security Activities Documented",
    description:
      "Are roles and responsibilities for network security activities documented and assigned?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.1.2",
      testingProcedure: "Examine responsibility documentation and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-1.2",
    title: "Network Security Controls Configured Maintained Properly",
    description: "Are network security controls configured and maintained properly?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.2",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-1.2.1",
    title: "Configuration Standards Defined Implemented Network Security",
    description:
      "Are configuration standards defined and implemented for network security rulesets?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.2.1",
      testingProcedure: "Examine configuration standards and review system configuration settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-1.2.2",
    title: "Changes Network Connections Network Security Control",
    description:
      "Are changes to network connections and network security control (NSC) configurations approved and managed through a defined change control process?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.2.2",
      testingProcedure:
        "Examine documented procedures, review network configurations, check change control records, and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-1.2.3",
    title: "Accurate Network Diagrams Maintained Showing Connections",
    description:
      "Are accurate network diagrams maintained showing all connections between the cardholder data environment (CDE) and other networks, including wireless networks?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.2.3",
      testingProcedure:
        "Examine network diagrams, review network configurations, and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-1.2.4",
    title: "Accurate Data-flow Diagrams Maintained Showing Account",
    description:
      "Are accurate data-flow diagrams maintained showing all account data flows across systems and networks?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.2.4",
      testingProcedure:
        "Examine data-flow diagrams, observe network configurations, review documentation, and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-1.2.5",
    title: "Allowed Services Protocols Ports Identified Approved",
    description:
      "Are all allowed services, protocols, and ports identified, approved, and justified with a defined business need?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.2.5",
      testingProcedure: "Review documentation and examine system configuration settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-1.2.6",
    title: "Security Controls Implemented Mitigate Risks Insecure",
    description:
      "Are security controls implemented to mitigate risks for insecure services, protocols, and ports?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.2.6",
      testingProcedure: "Review documentation and examine configuration settings",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-1.2.7",
    title: "Network Security Control Configurations Reviewed Least",
    description:
      "Are network security control configurations reviewed at least every six months for relevance and effectiveness?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.2.7",
      testingProcedure:
        "Examine documented procedures, review records of configuration reviews, and examine configuration settings",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-1.2.8",
    title: "Configuration Files Network Security Controls Protected",
    description:
      "Are configuration files for network security controls protected from unauthorized access and kept consistent with active network configurations?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.2.8",
      testingProcedure: "Examine network security control configuration files.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-1.3.1",
    title: "Inbound Traffic Cardholder Data Environment Restricted",
    description:
      "Is inbound traffic to the Cardholder Data Environment (CDE) restricted to only necessary traffic, with all other traffic denied by default?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.3.1",
      testingProcedure:
        "Examine NSC configuration standards and review NSC configuration settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-1.3.2",
    title: "Outbound Traffic From Cardholder Data Environment",
    description:
      "Is outbound traffic from the Cardholder Data Environment (CDE) restricted to only necessary traffic, with all other traffic denied by default?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.3.2",
      testingProcedure:
        "Examine NSC configuration standards and review NSC configuration settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-1.3.3",
    title: "Network Security Controls Implemented Between Wireless",
    description:
      "Are network security controls implemented between wireless networks and the CDE to restrict unauthorized wireless traffic?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.3.3",
      testingProcedure: "Examine configuration settings and review network diagrams.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-1.4.1",
    title: "Network Security Controls Implemented Between Trusted",
    description:
      "Are network security controls implemented between trusted and untrusted networks?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.4.1",
      testingProcedure:
        "Examine NSC configuration standards, review current network diagrams, and examine network configurations",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-1.4.2",
    title: "Inbound Traffic From Untrusted Networks Restricted",
    description:
      "Is inbound traffic from untrusted networks restricted to only authorized services and stateful responses, with all other traffic denied?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.4.2",
      testingProcedure: "Examine NSC documentation and review NSC configuration settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-1.4.3",
    title: "Anti-spoofing Controls Implemented Detect Block Forged",
    description:
      "Are anti-spoofing controls implemented to detect and block forged source IP addresses entering the trusted network?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.4.3",
      testingProcedure: "Examine NSC documentation and review NSC configuration settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-1.4.4",
    title: "Systems Storing Cardholder Data Protected From",
    description:
      "Are systems storing cardholder data protected from direct access from untrusted networks?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.4.4",
      testingProcedure:
        "Review data-flow diagrams and network diagrams, and examine NSC configuration settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-1.4.5",
    title: "Disclosure Internal IP Addresses Routing Information",
    description:
      "Is the disclosure of internal IP addresses and routing information restricted to authorized parties only?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.4.5",
      testingProcedure:
        "Examine NSC configuration settings, review documentation, and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-1.5.1",
    title: "Security Controls Implemented Devices That Connect",
    description:
      "Are security controls implemented on devices that connect to both untrusted networks (e.g., Internet) and the Cardholder Data Environment (CDE)?",
    category: "Install and Maintain Network Security Controls",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "1.5.1",
      testingProcedure:
        "Examine security policies and configuration standards, and review device configuration settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-2.1.1",
    title: "Security Policies Operational Procedures Requirement 2",
    description:
      "Are security policies and operational procedures for Requirement 2 documented, maintained, and communicated to relevant personnel?",
    category: "Apply Secure Configurations to All System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "2.1.1",
      testingProcedure: "Examine documentation and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-2.1.2",
    title: "Roles Responsibilities Activities Requirement 2 Documented",
    description:
      "Are roles and responsibilities for activities in Requirement 2 documented, assigned, and understood?",
    category: "Apply Secure Configurations to All System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "2.1.2",
      testingProcedure: "Examine documentation and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-2.2.1",
    title: "Configuration Standards Defined Implemented System Components",
    description:
      "Are configuration standards defined and implemented for all system components based on industry or vendor hardening guidelines?",
    category: "Apply Secure Configurations to All System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "2.2.1",
      testingProcedure:
        "Examine system configuration standards, review hardening guidelines, check configuration settings, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-2.2.2",
    title: "Vendor Default Accounts Passwords Changed Disabled",
    description:
      "Are vendor default accounts and passwords changed, disabled, or removed before systems are deployed?",
    category: "Apply Secure Configurations to All System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "2.2.2",
      testingProcedure:
        "Examine configuration standards and vendor documentation, review configuration files, observe administrator login, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-2.2.3",
    title: "System Components Configured Ensure Functions Different",
    description:
      "Are system components configured to ensure functions with different security levels are properly separated or secured?",
    category: "Apply Secure Configurations to All System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "2.2.3",
      testingProcedure: "Examine system configuration standards and review system configurations.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-2.2.4",
    title: "Only Necessary Services Protocols Functions Enabled",
    description:
      "Are only necessary services, protocols, and functions enabled on system components?",
    category: "Apply Secure Configurations to All System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "2.2.4",
      testingProcedure: "Examine configuration standards and review system configurations.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-2.2.5",
    title: "If Insecure Services Protocols Used Business",
    description:
      "If insecure services or protocols are used, is business justification documented and additional security controls implemented?",
    category: "Apply Secure Configurations to All System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "2.2.5",
      testingProcedure:
        "Review configuration standards, examine configuration settings, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-2.2.6",
    title: "System Security Parameters Configured Prevent Misuse",
    description:
      "Are system security parameters configured to prevent misuse of system components?",
    category: "Apply Secure Configurations to All System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "2.2.6",
      testingProcedure:
        "Examine system configuration standards, review system configurations, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-2.2.7",
    title: "Non-console Administrative Access Encrypted Using Strong",
    description: "Is all non-console administrative access encrypted using strong cryptography?",
    category: "Apply Secure Configurations to All System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "2.2.7",
      testingProcedure:
        "Examine system configuration standards, observe administrator login, review system configurations, check vendor documentation, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-2.3.1",
    title: "Default Wireless Settings Changed Secured Wireless",
    description:
      "Are default wireless settings (passwords, encryption keys, SNMP defaults, etc.) changed or secured for wireless networks connected to the CDE?",
    category: "Apply Secure Configurations to All System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "2.3.1",
      testingProcedure:
        "Examine policies and procedures, review vendor documentation, check wireless configuration settings, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-2.3.2",
    title: "Wireless Encryption Keys Changed When Personnel",
    description:
      "Are wireless encryption keys changed when personnel leave or when a key is suspected or known to be compromised?",
    category: "Apply Secure Configurations to All System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "2.3.2",
      testingProcedure: "Examine key management documentation and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.1.1",
    title: "Security Policies Operational Procedures Requirement 3",
    description:
      "Are security policies and operational procedures for Requirement 3 documented, maintained, and communicated to relevant personnel?",
    category: "Protect Stored Account Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "3.1.1",
      testingProcedure: "Examine documentation and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.1.2",
    title: "Roles Responsibilities Activities Requirement 3 Documented",
    description:
      "Are roles and responsibilities for activities in Requirement 3 documented, assigned, and understood?",
    category: "Protect Stored Account Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "3.1.2",
      testingProcedure: "Examine documentation and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.2.1",
    title: "Account Data Storage Minimized Through Defined",
    description:
      "Is account data storage minimized through defined data retention and secure disposal policies and processes?",
    category: "Protect Stored Account Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "3.2.1",
      testingProcedure:
        "Examine data retention and disposal policies and procedures, interview personnel, review files and system records where account data is stored, and observe mechanisms used to securely delete or render account data unrecoverable.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.3.1",
    title: "Sensitive Authentication Data Removed Rendered Unrecoverable",
    description:
      "Is sensitive authentication data (SAD) removed or rendered unrecoverable after the authorization process?",
    category: "Protect Stored Account Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "3.3.1",
      testingProcedure:
        "Examine policies and procedures, review system configurations, and observe secure data deletion processes.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.3.1.1",
    title: "Full Track Data Not Stored After",
    description: "Is full track data not stored after the authorization process?",
    category: "Protect Stored Account Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "3.3.1.1",
      testingProcedure: "Examine data sources and storage systems.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.3.1.2",
    title: "Card Verification Code Not Stored After",
    description:
      "Is the card verification code (CVV/CVC) not stored after the authorization process?",
    category: "Protect Stored Account Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "3.3.1.2",
      testingProcedure: "Examine data sources and storage systems.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.3.1.3",
    title: "Pins PIN Blocks Not Stored After",
    description: "Are PINs and PIN blocks not stored after the authorization process?",
    category: "Protect Stored Account Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "3.3.1.3",
      testingProcedure: "Examine data sources and storage systems.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.3.2",
    title: "If Sensitive Authentication Data Stored Before",
    description:
      "If sensitive authentication data is stored before authorization, is it encrypted using strong cryptography?",
    category: "Protect Stored Account Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "3.3.2",
      testingProcedure:
        "Examine data stores and system configurations, and review vendor documentation.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.4.1",
    title: "Primary Account Number Masked When Displayed",
    description:
      "Is the Primary Account Number (PAN) masked when displayed so that only authorized personnel can view the full PAN?",
    category: "Protect Stored Account Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "3.4.1",
      testingProcedure:
        "Examine policies and procedures, review system configurations, check the list of roles authorized to view full PAN, and examine PAN displays (screens, receipts, printouts).",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.4.2",
    title: "Remote-access Technologies Prevent Unauthorized Copying Relocation",
    description:
      "Do remote-access technologies prevent unauthorized copying or relocation of PAN data?",
    category: "Protect Stored Account Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "3.4.2",
      testingProcedure:
        "Examine policies and evidence of technical controls, review remote-access configurations, observe processes, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.5.1",
    title: "PAN Rendered Unreadable Wherever It Stored",
    description:
      "Is PAN rendered unreadable wherever it is stored using approved methods such as hashing, truncation, tokenization, or strong encryption?",
    category: "Protect Stored Account Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "3.5.1",
      testingProcedure:
        "Examine documentation for methods used to render PAN unreadable, review data repositories, check audit logs including payment application logs, and verify controls preventing reconstruction of PAN.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.5.1.1",
    title: "Cryptographic Hashes Used Protect PAN Implemented",
    description:
      "Are cryptographic hashes used to protect PAN implemented with proper key management processes?",
    category: "Protect Stored Account Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "3.5.1.1",
      testingProcedure:
        "Examine documentation on hashing methods, review key management procedures, check data repositories, and review audit logs.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.5.1.2",
    title: "If Disk Partition-level Encryption Used It",
    description:
      "If disk or partition-level encryption is used, is it applied only on removable media or combined with another PAN protection method?",
    category: "Protect Stored Account Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "3.5.1.2",
      testingProcedure:
        "Observe encryption processes and examine system configurations or vendor documentation.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.5.1.3",
    title: "If Disk Partition Encryption Used Access",
    description:
      "If disk or partition encryption is used, are access controls and key management implemented securely?",
    category: "Protect Stored Account Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "3.5.1.3",
      testingProcedure:
        "Examine system configurations, observe authentication processes, review files containing authentication factors, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.6.1",
    title: "Procedures Implemented Protect Cryptographic Keys Used",
    description:
      "Are procedures implemented to protect cryptographic keys used for protecting stored account data from disclosure and misuse?",
    category: "Protect Stored Account Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "3.6.1",
      testingProcedure: "Examine key management policies and procedures.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.6.1.2",
    title: "Secret Private Keys Used Encrypt Stored",
    description:
      "Are secret or private keys used to encrypt stored account data securely stored (e.g., encrypted with a key-encrypting key, stored in a secure cryptographic device, or split into key shares)?",
    category: "Protect Stored Account Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "3.6.1.2",
      testingProcedure:
        "Examine documented procedures, review system configurations, and check key storage locations including key-encrypting keys.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.6.1.3",
    title: "Access Cleartext Cryptographic Key Components Restricted",
    description:
      "Is access to cleartext cryptographic key components restricted to the minimum number of authorized custodians?",
    category: "Protect Stored Account Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "3.6.1.3",
      testingProcedure: "Examine user access lists.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.6.1.4",
    title: "Cryptographic Keys Stored Minimum Number Secure",
    description: "Are cryptographic keys stored in the minimum number of secure locations?",
    category: "Protect Stored Account Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "3.6.1.4",
      testingProcedure: "Examine key storage locations and observe processes.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.7.1",
    title: "Strong Cryptographic Keys Generated According Defined",
    description:
      "Are strong cryptographic keys generated according to defined key-management policies?",
    category: "Protect Stored Account Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "3.7.1",
      testingProcedure:
        "Examine key-management policies and procedures and observe the key generation process.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.7.2",
    title: "Cryptographic Keys Securely Distributed According Key-management",
    description:
      "Are cryptographic keys securely distributed according to key-management policies?",
    category: "Protect Stored Account Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "3.7.2",
      testingProcedure:
        "Examine key-management policies and procedures and observe the key distribution process.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.7.3",
    title: "Cryptographic Keys Securely Stored According Key-management",
    description: "Are cryptographic keys securely stored according to key-management policies?",
    category: "Protect Stored Account Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "3.7.3",
      testingProcedure:
        "Examine key-management policies and procedures and observe the key storage method.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.7.4",
    title: "Cryptographic Keys Changed End Their Defined",
    description:
      "Are cryptographic keys changed at the end of their defined cryptoperiod according to key-management policies?",
    category: "Protect Stored Account Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "3.7.4",
      testingProcedure:
        "Examine key-management policies and procedures, interview personnel, and observe key storage locations.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.7.5",
    title: "Cryptographic Keys Retired Replaced Destroyed When",
    description:
      "Are cryptographic keys retired, replaced, or destroyed when expired or compromised?",
    category: "Protect Stored Account Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "3.7.5",
      testingProcedure: "Examine key-management policies and procedures and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.7.6",
    title: "Manual Cryptographic Key-management Operations Performed Using",
    description:
      "Are manual cryptographic key-management operations performed using split knowledge and dual control?",
    category: "Protect Stored Account Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "3.7.6",
      testingProcedure:
        "Examine key-management policies and procedures, interview personnel, and observe key-management processes.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.7.7",
    title: "Controls Implemented Prevent Unauthorized Substitution Cryptographic",
    description:
      "Are controls implemented to prevent unauthorized substitution of cryptographic keys?",
    category: "Protect Stored Account Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "3.7.7",
      testingProcedure:
        "Examine key-management policies and procedures, interview personnel, and observe processes.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-3.7.8",
    title: "Cryptographic Key Custodians Formally Acknowledge Their",
    description:
      "Do cryptographic key custodians formally acknowledge their key-management responsibilities?",
    category: "Protect Stored Account Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "3.7.8",
      testingProcedure:
        "Examine key-management policies and procedures and review documentation of custodian acknowledgments.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-4.1.1",
    title: "Security Policies Operational Procedures Requirement 4",
    description:
      "Are security policies and operational procedures for Requirement 4 documented, maintained, and communicated to relevant personnel?",
    category:
      "Protect Cardholder Data with Strong Cryptography During Transmission Over Open, Public",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "4.1.1",
      testingProcedure: "Examine documentation and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-4.1.2",
    title: "Roles Responsibilities Activities Requirement 4 Documented",
    description:
      "Are roles and responsibilities for activities in Requirement 4 documented, assigned, and understood?",
    category:
      "Protect Cardholder Data with Strong Cryptography During Transmission Over Open, Public",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "4.1.2",
      testingProcedure: "Examine documentation and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-4.2.1",
    title: "Strong Cryptography Used Protect PAN During",
    description:
      "Is strong cryptography used to protect PAN during transmission over open, public networks?",
    category:
      "Protect Cardholder Data with Strong Cryptography During Transmission Over Open, Public",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "4.2.1",
      testingProcedure:
        "Examine policies and procedures, interview personnel, review system configurations, inspect cardholder data transmissions, and examine encryption keys and certificates.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-4.2.1.1",
    title: "Inventory Maintained Trusted Keys Certificates Used",
    description:
      "Is an inventory maintained for trusted keys and certificates used to protect PAN during transmission?",
    category:
      "Protect Cardholder Data with Strong Cryptography During Transmission Over Open, Public",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "4.2.1.1",
      testingProcedure:
        "Examine policies and procedures and review the inventory of trusted keys and certificates.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-4.2.1.2",
    title: "Wireless Networks Transmitting PAN Connected CDE",
    description:
      "Do wireless networks transmitting PAN or connected to the CDE use strong cryptography based on industry best practices?",
    category:
      "Protect Cardholder Data with Strong Cryptography During Transmission Over Open, Public",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "4.2.1.2",
      testingProcedure: "Examine system configuration settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-4.2.2",
    title: "PAN Encrypted Using Strong Cryptography When",
    description:
      "Is PAN encrypted using strong cryptography when transmitted through end-user messaging technologies (e.g., email, chat)?",
    category:
      "Protect Cardholder Data with Strong Cryptography During Transmission Over Open, Public",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "4.2.2",
      testingProcedure:
        "Examine policies and procedures, review system configurations, and check vendor documentation.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-5.1.1",
    title: "Security Policies Operational Procedures Requirement 5",
    description:
      "Are security policies and operational procedures for Requirement 5 documented, updated, and communicated to relevant personnel?",
    category: "Protect All Systems and Networks from Malicious Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "5.1.1",
      testingProcedure: "Examine documentation and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-5.1.2",
    title: "Roles Responsibilities Malware Protection Activities Documented",
    description:
      "Are roles and responsibilities for malware protection activities documented and assigned?",
    category: "Protect All Systems and Networks from Malicious Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "5.1.2",
      testingProcedure: "Examine documentation and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-5.2.1",
    title: "Anti-malware Solution Deployed System Components Risk",
    description:
      "Is an anti-malware solution deployed on all system components at risk of malware?",
    category: "Protect All Systems and Networks from Malicious Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "5.2.1",
      testingProcedure: "Examine system components and review periodic risk evaluations.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-5.2.2",
    title: "Anti-malware Solution Detect Block Remove Known",
    description: "Does the anti-malware solution detect, block, or remove known types of malware?",
    category: "Protect All Systems and Networks from Malicious Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "5.2.2",
      testingProcedure: "Review vendor documentation and examine system configurations.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-5.2.3",
    title: "System Components Without Anti-malware Periodically Evaluated",
    description:
      "Are system components without anti-malware periodically evaluated to confirm they are not at risk for malware?",
    category: "Protect All Systems and Networks from Malicious Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "5.2.3",
      testingProcedure:
        "Examine policies and procedures, review the list of such components, compare with deployed systems, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-5.2.3.1",
    title: "Evaluation Frequency Systems Not Risk Malware",
    description:
      "Is the evaluation frequency for systems not at risk for malware defined through a targeted risk analysis?",
    category: "Protect All Systems and Networks from Malicious Software",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "5.2.3.1",
      testingProcedure:
        "Examine targeted risk analysis documentation, review evaluation results, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-5.3.1",
    title: "Anti-malware Solution Kept Up Date Through",
    description: "Is the anti-malware solution kept up to date through automatic updates?",
    category: "Protect All Systems and Networks from Malicious Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "5.3.1",
      testingProcedure: "Examine anti-malware configurations, system components, and update logs.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-5.3.2",
    title: "Anti-malware Solution Perform Periodic Real-time Scans",
    description: "Does the anti-malware solution perform periodic or real-time scans of systems?",
    category: "Protect All Systems and Networks from Malicious Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "5.3.2",
      testingProcedure:
        "Examine anti-malware configurations, system components, logs, and scan results.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-5.3.2.1",
    title: "If Periodic Scans Used Scan Frequency",
    description:
      "If periodic scans are used, is the scan frequency defined through targeted risk analysis?",
    category: "Protect All Systems and Networks from Malicious Software",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "5.3.2.1",
      testingProcedure:
        "Examine targeted risk analysis documentation, review scan results, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-5.3.3",
    title: "Removable Media Automatically Scanned Monitored Malware",
    description:
      "Are removable media automatically scanned or monitored for malware when connected to systems?",
    category: "Protect All Systems and Networks from Malicious Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "5.3.3",
      testingProcedure:
        "Examine anti-malware configurations, review systems using removable media, and check logs and scan results.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-5.3.4",
    title: "Anti-malware Audit Logs Enabled Retained According",
    description:
      "Are anti-malware audit logs enabled and retained according to logging requirements?",
    category: "Protect All Systems and Networks from Malicious Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "5.3.4",
      testingProcedure: "Examine anti-malware configuration settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-5.3.5",
    title: "Anti-malware Mechanisms Protected From Being Disabled",
    description:
      "Are anti-malware mechanisms protected from being disabled or altered by unauthorized users?",
    category: "Protect All Systems and Networks from Malicious Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "5.3.5",
      testingProcedure:
        "Examine anti-malware configurations, observe processes, and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-5.4.1",
    title: "Processes Automated Mechanisms Implemented Detect Protect",
    description:
      "Are processes and automated mechanisms implemented to detect and protect against phishing attacks?",
    category: "Protect All Systems and Networks from Malicious Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "5.4.1",
      testingProcedure: "Observe implemented processes and examine security mechanisms.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-6.1.1",
    title: "Security Policies Operational Procedures Requirement 6",
    description:
      "Are security policies and operational procedures for Requirement 6 documented, maintained, and communicated to relevant personnel?",
    category: "Develop and Maintain Secure Systems and Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "6.1.1",
      testingProcedure: "Examine documentation and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-6.1.2",
    title: "Roles Responsibilities Requirement 6 Activities Documented",
    description:
      "Are roles and responsibilities for Requirement 6 activities documented, assigned, and understood?",
    category: "Develop and Maintain Secure Systems and Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "6.1.2",
      testingProcedure: "Examine documentation and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-6.2.1",
    title: "Bespoke Custom Software Developed According Secure",
    description:
      "Is bespoke and custom software developed according to secure development standards and practices?",
    category: "Develop and Maintain Secure Systems and Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "6.2.1",
      testingProcedure: "Examine documented software development procedures.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-6.2.2",
    title: "Software Developers Trained Annually Secure Coding",
    description:
      "Are software developers trained annually on secure coding and software security practices?",
    category: "Develop and Maintain Secure Systems and Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "6.2.2",
      testingProcedure:
        "Examine development procedures, review training records, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-6.2.3",
    title: "Bespoke Custom Software Reviewed Before Release",
    description:
      "Is bespoke and custom software reviewed before release to identify and fix security vulnerabilities?",
    category: "Develop and Maintain Secure Systems and Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "6.2.3",
      testingProcedure:
        "Examine development procedures, interview responsible personnel, and review evidence of software changes.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-6.2.3.1",
    title: "If Manual Code Reviews Used Code",
    description:
      "If manual code reviews are used, are code changes reviewed by independent personnel and approved before release?",
    category: "Develop and Maintain Secure Systems and Software",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "6.2.3.1",
      testingProcedure:
        "Examine development procedures, interview personnel, and review evidence of software changes.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-6.2.4",
    title: "Secure Coding Practices Implemented Protect Software",
    description:
      "Are secure coding practices implemented to protect software from common attacks and vulnerabilities?",
    category: "Develop and Maintain Secure Systems and Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "6.2.4",
      testingProcedure:
        "Examine documented procedures and interview software development personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-6.3.1",
    title: "Security Vulnerabilities Identified Using Industry Sources",
    description:
      "Are security vulnerabilities identified using industry sources and assigned risk rankings?",
    category: "Develop and Maintain Secure Systems and Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "6.3.1",
      testingProcedure:
        "Examine policies and procedures, review documentation, interview personnel, and observe processes.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-6.3.2",
    title: "Inventory Maintained Bespoke Custom Third-party Software",
    description:
      "Is an inventory maintained for bespoke, custom, and third-party software to support vulnerability and patch management?",
    category: "Develop and Maintain Secure Systems and Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "6.3.2",
      testingProcedure: "Examine documentation and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-6.3.3",
    title: "Security Patches Applied System Components Defined",
    description:
      "Are security patches applied to system components within defined timeframes based on risk level?",
    category: "Develop and Maintain Secure Systems and Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "6.3.3",
      testingProcedure:
        "Examine policies and procedures, review system components and installed patches, and compare with vendor patch releases.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-6.4.1",
    title: "Public-facing Web Applications Protected Through Regular",
    description:
      "Are public-facing web applications protected through regular security assessments or automated protection mechanisms?",
    category: "Develop and Maintain Secure Systems and Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "6.4.1",
      testingProcedure:
        "Examine security assessment records, review documented processes, interview personnel, and review system configurations and logs.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-6.4.2",
    title: "Automated Solution Implemented Detect Prevent Web-based",
    description:
      "Is an automated solution implemented to detect and prevent web-based attacks on public-facing web applications?",
    category: "Develop and Maintain Secure Systems and Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "6.4.2",
      testingProcedure:
        "Examine system configuration settings, review audit logs, and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-6.4.3",
    title: "Payment Page Scripts Authorized Integrity-checked Maintained",
    description:
      "Are payment page scripts authorized, integrity-checked, and maintained in an inventory with justification?",
    category: "Develop and Maintain Secure Systems and Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "6.4.3",
      testingProcedure:
        "Examine policies, interview personnel, review inventory records, and examine system configurations.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-6.5.1",
    title: "Changes System Components Managed Through Formal",
    description:
      "Are changes to system components managed through a formal change control process?",
    category: "Develop and Maintain Secure Systems and Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "6.5.1",
      testingProcedure:
        "Examine change control procedures, review recent system changes, and examine change documentation.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-6.5.2",
    title: "After Significant Changes PCI DSS Controls",
    description:
      "After significant changes, are PCI DSS controls verified and documentation updated?",
    category: "Develop and Maintain Secure Systems and Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "6.5.2",
      testingProcedure:
        "Review documentation of significant changes, interview personnel, and observe affected systems and networks.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-6.5.3",
    title: "Pre-production Environments Separated From Production Environments",
    description:
      "Are pre-production environments separated from production environments with access controls?",
    category: "Develop and Maintain Secure Systems and Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "6.5.3",
      testingProcedure:
        "Examine policies, review network documentation and configurations, and examine access control settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-6.5.4",
    title: "Roles Responsibilities Separated Between Production Pre-production",
    description:
      "Are roles and responsibilities separated between production and pre-production environments?",
    category: "Develop and Maintain Secure Systems and Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "6.5.4",
      testingProcedure: "Examine policies, observe processes, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-6.5.5",
    title: "Live PAN Data Prohibited Pre-production Environments",
    description:
      "Is live PAN data prohibited in pre-production environments unless the environment is part of the CDE and properly secured?",
    category: "Develop and Maintain Secure Systems and Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "6.5.5",
      testingProcedure:
        "Examine policies, observe testing processes, interview personnel, and review test data.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-6.5.6",
    title: "Test Data Test Accounts Removed Before",
    description: "Are test data and test accounts removed before systems move to production?",
    category: "Develop and Maintain Secure Systems and Software",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "6.5.6",
      testingProcedure:
        "Examine policies, observe testing processes, interview personnel, and review system data and accounts.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-7.1.1",
    title: "Security Policies Procedures Access Control Documented",
    description:
      "Are security policies and procedures for access control documented, updated, and communicated to relevant personnel?",
    category: "Restrict Access to System Components and Cardholder Data by Business Need to Know",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "7.1.1",
      testingProcedure: "Examine documentation and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-7.1.2",
    title: "Roles Responsibilities Access Control Activities Documented",
    description:
      "Are roles and responsibilities for access control activities documented and assigned?",
    category: "Restrict Access to System Components and Cardholder Data by Business Need to Know",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "7.1.2",
      testingProcedure: "Examine documentation and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-7.2.1",
    title: "Access Control Model Defined Based Job",
    description:
      "Is an access control model defined based on job roles and the principle of least privilege?",
    category: "Restrict Access to System Components and Cardholder Data by Business Need to Know",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "7.2.1",
      testingProcedure:
        "Examine policies and procedures, interview personnel, and review access control model settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-7.2.2",
    title: "User Access Including Privileged Access Assigned",
    description:
      "Is user access, including privileged access, assigned based on job role and least privilege requirements?",
    category: "Restrict Access to System Components and Cardholder Data by Business Need to Know",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "7.2.2",
      testingProcedure:
        "Review policies and procedures, examine user access settings, and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-7.2.3",
    title: "User Access Privileges Approved Authorized Personnel",
    description:
      "Are user access privileges approved by authorized personnel before being granted?",
    category: "Restrict Access to System Components and Cardholder Data by Business Need to Know",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "7.2.3",
      testingProcedure:
        "Review policies and procedures, examine user IDs and privileges, and verify documented approvals.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-7.2.4",
    title: "User Accounts Access Privileges Reviewed Least",
    description:
      "Are user accounts and access privileges reviewed at least every six months to ensure appropriateness?",
    category: "Restrict Access to System Components and Cardholder Data by Business Need to Know",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "7.2.4",
      testingProcedure:
        "Examine policies, interview personnel, and review records of periodic user access reviews.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-7.2.5",
    title: "System Application Accounts Assigned Managed Based",
    description:
      "Are system and application accounts assigned and managed based on the least privileges necessary?",
    category: "Restrict Access to System Components and Cardholder Data by Business Need to Know",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "7.2.5",
      testingProcedure:
        "Review policies, examine system and application account privileges, and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-7.2.5.1",
    title: "System Application Account Privileges Periodically Reviewed",
    description:
      "Are system and application account privileges periodically reviewed and validated by management?",
    category: "Restrict Access to System Components and Cardholder Data by Business Need to Know",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "7.2.5.1",
      testingProcedure:
        "Review policies, examine targeted risk analysis, interview personnel, and review documented access review results.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-7.2.6",
    title: "Access Repositories Storing Cardholder Data Restricted",
    description:
      "Is access to repositories storing cardholder data restricted to authorized users and administrators only?",
    category: "Restrict Access to System Components and Cardholder Data by Business Need to Know",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "7.2.6",
      testingProcedure:
        "Review policies, interview personnel, and examine configuration settings controlling repository access.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-7.3.1",
    title: "Access Control System Implemented Restrict Access",
    description:
      "Is an access control system implemented to restrict access to system components based on business need to know?",
    category: "Restrict Access to System Components and Cardholder Data by Business Need to Know",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "7.3.1",
      testingProcedure: "Review vendor documentation and examine configuration settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-7.3.2",
    title: "Access Control System Configured Enforce Permissions",
    description:
      "Is the access control system configured to enforce permissions based on job roles and functions?",
    category: "Restrict Access to System Components and Cardholder Data by Business Need to Know",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "7.3.2",
      testingProcedure: "Review vendor documentation and examine configuration settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-7.3.3",
    title: "Access Control System Configured Default Deny-all",
    description: "Is the access control system configured with a default deny-all policy?",
    category: "Restrict Access to System Components and Cardholder Data by Business Need to Know",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "7.3.3",
      testingProcedure: "Review vendor documentation and examine configuration settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.1.1",
    title: "Security Policies Procedures Requirement 8 Documented",
    description:
      "Are security policies and procedures for Requirement 8 documented, updated, and communicated to relevant personnel?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.1.1",
      testingProcedure: "Examine documentation and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.1.2",
    title: "Roles Responsibilities Activities Requirement 8 Documented",
    description:
      "Are roles and responsibilities for activities in Requirement 8 documented and assigned?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.1.2",
      testingProcedure: "Examine documentation and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.2.1",
    title: "Users Assigned Unique ID Before Accessing",
    description:
      "Are all users assigned a unique ID before accessing system components or cardholder data?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.2.1",
      testingProcedure: "Interview responsible personnel and examine audit logs or other evidence.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.2.2",
    title: "Shared Generic Accounts Restricted Approved Monitored",
    description:
      "Are shared or generic accounts restricted, approved, and monitored for accountability?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.2.2",
      testingProcedure:
        "Review user account lists, examine authentication policies, and interview system administrators.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.2.4",
    title: "User Account Additions Changes Deletions Authorized",
    description:
      "Are user account additions, changes, and deletions authorized and properly managed?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.2.4",
      testingProcedure: "Examine documented approvals and review system settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.2.5",
    title: "Access Terminated Users Immediately Revoked",
    description: "Is access for terminated users immediately revoked?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.2.5",
      testingProcedure:
        "Review terminated user records, examine user access lists, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.2.6",
    title: "Inactive User Accounts Disabled Removed After",
    description: "Are inactive user accounts disabled or removed after 90 days of inactivity?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.2.6",
      testingProcedure: "Examine user account activity and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.2.7",
    title: "Third-party Remote Access Accounts Enabled Only",
    description:
      "Are third-party remote access accounts enabled only when required and monitored for activity?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.2.7",
      testingProcedure:
        "Interview personnel, review account management documentation, and examine monitoring evidence.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.2.8",
    title: "User Sessions Automatically Locked Re-authenticated After",
    description:
      "Are user sessions automatically locked or re-authenticated after 15 minutes of inactivity?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.2.8",
      testingProcedure: "Examine system configuration settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.3.1",
    title: "Users Administrators Authenticated Using Approved Authentication",
    description:
      "Are users and administrators authenticated using approved authentication factors (e.g., password, token, biometric)?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.3.1",
      testingProcedure:
        "Review authentication documentation and observe the authentication process.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.3.2",
    title: "Authentication Factors Protected Using Strong Cryptography",
    description:
      "Are authentication factors protected using strong cryptography during storage and transmission?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.3.2",
      testingProcedure:
        "Review vendor documentation, examine system configurations, repositories, and data transmissions.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.3.3",
    title: "User Identity Verified Before Changing Authentication",
    description: "Is user identity verified before changing authentication factors?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.3.3",
      testingProcedure: "Review procedures and observe security personnel processes.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.3.4",
    title: "Invalid Login Attempts Limited Accounts Locked",
    description:
      "Are invalid login attempts limited and accounts locked after multiple failed attempts?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.3.4",
      testingProcedure: "Examine system configuration settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.3.5",
    title: "Passwords Set Uniquely Changed After First",
    description: "Are passwords set uniquely and changed after first login or reset?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.3.5",
      testingProcedure: "Review password management procedures and observe security personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.3.6",
    title: "Passwords Meet Minimum Complexity Requirements",
    description: "Do passwords meet minimum complexity requirements (length and character types)?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.3.6",
      testingProcedure: "Examine system configuration settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.3.7",
    title: "Users Prevented From Reusing Their Last",
    description: "Are users prevented from reusing their last passwords?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.3.7",
      testingProcedure: "Review system configuration settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.3.8",
    title: "Authentication Policies Documented Communicated Users",
    description: "Are authentication policies documented and communicated to users?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.3.8",
      testingProcedure: "Review authentication policies, interview personnel, and interview users.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.3.9",
    title: "Passwords Changed Periodically Monitored Dynamically Security",
    description:
      "Are passwords changed periodically or monitored dynamically for security posture?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.3.9",
      testingProcedure: "Inspect system configuration settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.3.10",
    title: "Authentication Factors Assigned Individual Users Protected",
    description:
      "Are authentication factors assigned to individual users and protected from sharing?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.3.10",
      testingProcedure:
        "Review authentication policies, interview personnel, and examine system or physical controls.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.4.1",
    title: "Multi-factor Authentication Implemented Non-console Administrative Access",
    description:
      "Is multi-factor authentication implemented for non-console administrative access to the CDE?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.4.1",
      testingProcedure: "Review network/system configurations and observe administrator login.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.4.2",
    title: "Multi-factor Authentication Implemented Access CDE",
    description: "Is multi-factor authentication implemented for all access to the CDE?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.4.2",
      testingProcedure:
        "Review configurations, observe user logins, and examine supporting evidence.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.4.3",
    title: "Multi-factor Authentication Implemented Remote Access Networks",
    description:
      "Is multi-factor authentication implemented for all remote access to networks that could access the CDE?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.4.3",
      testingProcedure: "Review remote access configurations and observe remote user connections.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.5.1",
    title: "MFA Systems Configured Prevent Bypass Misuse",
    description: "Are MFA systems configured to prevent bypass and misuse?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.5.1",
      testingProcedure:
        "Review vendor documentation, examine MFA configurations, interview personnel, and observe login processes.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.6.1",
    title: "Application System Accounts Managed Prevent Unauthorized",
    description:
      "Are application and system accounts managed to prevent unauthorized interactive login?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.6.1",
      testingProcedure:
        "Review system/application accounts and interview administrative personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.6.2",
    title: "Passwords Application System Accounts Not Hard-coded",
    description:
      "Are passwords for application or system accounts not hard-coded in scripts or source code?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.6.2",
      testingProcedure:
        "Interview personnel and examine scripts, configuration files, and source code.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-8.6.3",
    title: "Passwords Application System Accounts Protected Periodically",
    description:
      "Are passwords for application and system accounts protected, periodically changed, and securely managed?",
    category: "Identify Users and Authenticate Access to System Components",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "8.6.3",
      testingProcedure:
        "Review policies, examine risk analysis documentation, interview personnel, and review system configurations.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.1.1",
    title: "Security Policies Procedures Physical Access Controls",
    description:
      "Are security policies and procedures for physical access controls documented, maintained, and communicated?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "9.1.1",
      testingProcedure: "Examine documentation and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.1.2",
    title: "Roles Responsibilities Physical Security Activities Documented",
    description:
      "Are roles and responsibilities for physical security activities documented and assigned?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "9.1.2",
      testingProcedure: "Examine documentation and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.2.1",
    title: "Physical Entry Controls Implemented Restrict Access",
    description:
      "Are physical entry controls implemented to restrict access to systems in the Cardholder Data Environment (CDE)?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "9.2.1",
      testingProcedure: "Observe physical entry controls and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.2.1.1",
    title: "Physical Access Sensitive Areas CDE Monitored",
    description:
      "Is physical access to sensitive areas in the CDE monitored using video cameras or access control mechanisms?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "9.2.1.1",
      testingProcedure:
        "Observe access points, examine cameras or access controls, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.2.2",
    title: "Controls Implemented Restrict Use Publicly Accessible",
    description: "Are controls implemented to restrict use of publicly accessible network jacks?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "9.2.2",
      testingProcedure: "Interview responsible personnel and observe network jack locations.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.2.3",
    title: "Physical Access Wireless Access Points Networking",
    description:
      "Is physical access to wireless access points, networking equipment, and telecom lines restricted?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "9.2.3",
      testingProcedure: "Interview responsible personnel and observe hardware locations.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.2.4",
    title: "Console Systems Sensitive Areas Locked When",
    description: "Are console systems in sensitive areas locked when not in use?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "9.2.4",
      testingProcedure: "Observe administrator login attempts on consoles.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.3.1",
    title: "Procedures Implemented Authorize Manage Personnel Physical",
    description:
      "Are procedures implemented to authorize and manage personnel physical access to the CDE?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "9.3.1",
      testingProcedure:
        "Examine documented procedures, observe identification methods (ID badges), and observe processes.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.3.1.1",
    title: "Physical Access Sensitive CDE Areas Granted",
    description:
      "Is physical access to sensitive CDE areas granted based on job role and revoked upon termination?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "9.3.1.1",
      testingProcedure:
        "Observe personnel in sensitive areas, review access control lists, interview personnel, and observe processes.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.3.2",
    title: "Procedures Implemented Authorize Manage Visitor Access",
    description: "Are procedures implemented to authorize and manage visitor access to the CDE?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "9.3.2",
      testingProcedure:
        "Examine procedures, observe visitor processes, interview personnel, and observe visitor badges.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.3.3",
    title: "Visitor Badges Collected Deactivated When Visitors",
    description: "Are visitor badges collected or deactivated when visitors leave the facility?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "9.3.3",
      testingProcedure: "Observe visitors leaving and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.3.4",
    title: "Visitor Log Maintained Visitor Details Access",
    description: "Is a visitor log maintained with visitor details and access records?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "9.3.4",
      testingProcedure:
        "Examine visitor logs, interview personnel, and review log storage locations.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.4.1",
    title: "Media Containing Cardholder Data Physically Secured",
    description: "Is all media containing cardholder data physically secured?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "9.4.1",
      testingProcedure: "Examine documentation.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.4.1.1",
    title: "Offline Backups Containing Cardholder Data Stored",
    description: "Are offline backups containing cardholder data stored securely?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "9.4.1.1",
      testingProcedure: "Examine procedures and logs and interview personnel at storage locations.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.4.1.2",
    title: "Security Backup Storage Locations Reviewed Least",
    description: "Is the security of backup storage locations reviewed at least annually?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "9.4.1.2",
      testingProcedure: "Examine procedures, logs, and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.4.2",
    title: "Media Containing Cardholder Data Classified According",
    description: "Is media containing cardholder data classified according to data sensitivity?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "9.4.2",
      testingProcedure: "Examine procedures and review media logs or documentation.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.4.3",
    title: "Media Containing Cardholder Data Securely Logged",
    description:
      "Is media containing cardholder data securely logged and tracked when sent outside the facility?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "9.4.3",
      testingProcedure:
        "Examine procedures, review records and tracking logs, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.4.4",
    title: "Management Approval Required Before Media Containing",
    description:
      "Is management approval required before media containing cardholder data is moved outside the facility?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "9.4.4",
      testingProcedure:
        "Examine procedures, review media tracking logs, and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.4.5",
    title: "Inventory Logs Maintained Electronic Media Containing",
    description:
      "Are inventory logs maintained for all electronic media containing cardholder data?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "9.4.5",
      testingProcedure: "Examine procedures, review inventory logs, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.4.5.1",
    title: "Electronic Media Inventories Reviewed Least Annually",
    description: "Are electronic media inventories reviewed at least annually?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "9.4.5.1",
      testingProcedure: "Examine procedures, review inventory logs, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.4.6",
    title: "Hard-copy Materials Containing Cardholder Data Securely",
    description:
      "Are hard-copy materials containing cardholder data securely destroyed when no longer needed?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "9.4.6",
      testingProcedure:
        "Examine destruction policies, observe destruction processes, interview personnel, and observe storage containers.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.4.7",
    title: "Electronic Media Containing Cardholder Data Destroyed",
    description:
      "Is electronic media containing cardholder data destroyed or rendered unrecoverable when no longer needed?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "9.4.7",
      testingProcedure:
        "Examine destruction policies, observe media destruction processes, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.5.1",
    title: "Point-of-interaction Devices Protected From Tampering Unauthorized",
    description:
      "Are point-of-interaction (POI) devices protected from tampering and unauthorized substitution?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "9.5.1",
      testingProcedure: "Examine policies and procedures.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.5.1.1",
    title: "Up-to-date Inventory POI Devices Maintained",
    description: "Is an up-to-date inventory of POI devices maintained?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "9.5.1.1",
      testingProcedure: "Examine device list, observe device locations, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.5.1.2",
    title: "POI Devices Periodically Inspected Detect Tampering",
    description: "Are POI devices periodically inspected to detect tampering or substitution?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "9.5.1.2",
      testingProcedure:
        "Examine procedures, observe inspection processes, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.5.1.2.1",
    title: "Frequency Method POI Inspections Defined Through",
    description: "Is the frequency and method of POI inspections defined through risk analysis?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "9.5.1.2.1",
      testingProcedure:
        "Examine risk analysis documentation, review inspection results, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-9.5.1.3",
    title: "Personnel Trained Detect Report Tampering Suspicious",
    description:
      "Are personnel trained to detect and report tampering or suspicious behavior involving POI devices?",
    category: "Restrict Physical Access to Cardholder Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "9.5.1.3",
      testingProcedure: "Review training materials and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.1.1",
    title: "Security Policies Procedures Logging Monitoring Documented",
    description:
      "Are security policies and procedures for logging and monitoring documented, updated, and communicated to relevant personnel?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "10.1.1",
      testingProcedure: "Examine documentation and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.1.2",
    title: "Roles Responsibilities Logging Monitoring Activities Documented",
    description:
      "Are roles and responsibilities for logging and monitoring activities documented and assigned?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "10.1.2",
      testingProcedure: "Examine documentation and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.2.1",
    title: "Audit Logs Enabled System Components Cardholder",
    description: "Are audit logs enabled for all system components and cardholder data systems?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "10.2.1",
      testingProcedure: "Interview system administrator and examine system configurations.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.2.1.1",
    title: "Audit Logs Capture Individual User Access",
    description: "Do audit logs capture all individual user access to cardholder data?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "10.2.1.1",
      testingProcedure: "Examine audit log configurations and audit log data.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.2.1.2",
    title: "Audit Logs Capture Actions Performed Users",
    description:
      "Do audit logs capture all actions performed by users with administrative privileges?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "10.2.1.2",
      testingProcedure: "Examine audit log configurations and audit log data.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.2.1.3",
    title: "Audit Logs Record Access Audit Log",
    description: "Do audit logs record all access to audit log files?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "10.2.1.3",
      testingProcedure: "Examine audit log configurations and audit log data.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.2.1.4",
    title: "Audit Logs Record Invalid Logical Access",
    description: "Do audit logs record all invalid logical access attempts?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "10.2.1.4",
      testingProcedure: "Examine audit log configurations and audit log data.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.2.1.5",
    title: "Audit Logs Capture Changes User Accounts",
    description: "Do audit logs capture changes to user accounts and authentication credentials?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "10.2.1.5",
      testingProcedure: "Examine audit log configurations and audit log data.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.2.1.6",
    title: "Audit Logs Record Initialization Starting Stopping",
    description:
      "Do audit logs record the initialization, starting, stopping, or pausing of audit logs?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "10.2.1.6",
      testingProcedure: "Examine audit log configurations and audit log data.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.2.1.7",
    title: "Audit Logs Capture Creation Deletion System-level",
    description: "Do audit logs capture creation and deletion of system-level objects?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "10.2.1.7",
      testingProcedure: "Examine audit log configurations and audit log data.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.2.2",
    title: "Audit Logs Record Required Event Details",
    description:
      "Do audit logs record required event details such as user ID, event type, date/time, success/failure, and source of event?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "10.2.2",
      testingProcedure: "Interview personnel and examine audit log configurations and data.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.3.1",
    title: "Read Access Audit Logs Restricted Authorized",
    description: "Is read access to audit logs restricted to authorized personnel only?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "10.3.1",
      testingProcedure:
        "Interview system administrators and examine system configurations and privileges.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.3.2",
    title: "Audit Log Files Protected From Unauthorized",
    description: "Are audit log files protected from unauthorized modification?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "10.3.2",
      testingProcedure:
        "Examine system configurations and privileges and interview system administrators.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.3.3",
    title: "Audit Logs Regularly Backed Up Secure",
    description:
      "Are audit logs regularly backed up to a secure centralized log server or secure storage?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "10.3.3",
      testingProcedure: "Examine backup configurations or review log files.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.3.4",
    title: "File Integrity Monitoring Used Detect Unauthorized",
    description: "Is file integrity monitoring used to detect unauthorized changes to audit logs?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "10.3.4",
      testingProcedure: "Examine system settings, monitored files, and monitoring results.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.4.1",
    title: "Critical System Security Logs Reviewed Daily",
    description:
      "Are critical system and security logs reviewed daily to detect suspicious activity?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "10.4.1",
      testingProcedure:
        "Examine security policies, observe log review processes, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.4.1.1",
    title: "Automated Tools Used Review Audit Logs",
    description: "Are automated tools used to review audit logs?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "10.4.1.1",
      testingProcedure: "Examine log review tools and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.4.2",
    title: "Logs Other System Components Reviewed Periodically",
    description: "Are logs of other system components reviewed periodically?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "10.4.2",
      testingProcedure:
        "Examine security policies, review log review records, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.4.2.1",
    title: "Frequency Periodic Log Reviews Defined Based",
    description: "Is the frequency of periodic log reviews defined based on risk analysis?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "10.4.2.1",
      testingProcedure: "Examine risk analysis documentation and log review records.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.4.3",
    title: "Anomalies Suspicious Activities Identified Log Reviews",
    description:
      "Are anomalies or suspicious activities identified in log reviews investigated and addressed?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "10.4.3",
      testingProcedure: "Examine security procedures, observe processes, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.5.1",
    title: "Audit Logs Retained Least 12 Months",
    description:
      "Are audit logs retained for at least 12 months with at least three months immediately available for analysis?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "10.5.1",
      testingProcedure:
        "Examine retention policies, system configurations, audit logs, interview personnel, and observe processes.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.6.1",
    title: "System Clocks Synchronized Using Time Synchronization",
    description: "Are system clocks synchronized using time synchronization technology?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "10.6.1",
      testingProcedure: "Examine system configuration settings.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.6.2",
    title: "Systems Configured Use Designated Secure Time",
    description:
      "Are systems configured to use designated and secure time servers for consistent time synchronization?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "10.6.2",
      testingProcedure: "Examine system configuration settings related to time synchronization.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.6.3",
    title: "Time Synchronization Settings Protected Changes Time",
    description:
      "Are time synchronization settings protected and changes to time settings logged and monitored?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "10.6.3",
      testingProcedure:
        "Examine system configurations, synchronization settings, logs, and observe processes.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.7.2",
    title: "Failures Critical Security Control Systems Detected",
    description: "Are failures of critical security control systems detected and alerted promptly?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "10.7.2",
      testingProcedure:
        "Examine documented processes, observe detection and alerting mechanisms, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-10.7.3",
    title: "Failures Critical Security Control Systems Investigated",
    description:
      "Are failures of critical security control systems investigated, documented, and remediated promptly?",
    category: "Log and Monitor All Access to System Components and Cardholder Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "10.7.3",
      testingProcedure:
        "Examine documented processes, interview personnel, and review records of security control failures.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-11.1.1",
    title: "Security Policies Operational Procedures Requirement 11",
    description:
      "Are security policies and operational procedures for Requirement 11 documented, updated, and communicated to relevant personnel?",
    category: "Test Security of Systems and Networks Regularly",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "11.1.1",
      testingProcedure: "Examine documentation and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-11.1.2",
    title: "Roles Responsibilities Security Testing Activities Documented",
    description:
      "Are roles and responsibilities for security testing activities documented, assigned, and understood?",
    category: "Test Security of Systems and Networks Regularly",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "11.1.2",
      testingProcedure: "Examine documentation and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-11.2.1",
    title: "Wireless Access Points Regularly Identified Monitored",
    description:
      "Are wireless access points regularly identified, monitored, and unauthorized access points detected?",
    category: "Test Security of Systems and Networks Regularly",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "11.2.1",
      testingProcedure:
        "Examine policies and procedures, review wireless assessment documentation, check configuration settings, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-11.2.2",
    title: "Inventory Authorized Wireless Access Points Maintained",
    description:
      "Is an inventory of authorized wireless access points maintained with documented business justification?",
    category: "Test Security of Systems and Networks Regularly",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "11.2.2",
      testingProcedure: "Examine documentation.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-11.3.1",
    title: "Internal Vulnerability Scans Performed Least Every",
    description:
      "Are internal vulnerability scans performed at least every three months and vulnerabilities resolved?",
    category: "Test Security of Systems and Networks Regularly",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "11.3.1",
      testingProcedure:
        "Review internal scan reports, examine scan tool configurations, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-11.3.1.1",
    title: "Lower-risk Vulnerabilities Managed Based Organizations Risk",
    description:
      "Are lower-risk vulnerabilities managed based on the organization�s risk analysis process?",
    category: "Test Security of Systems and Networks Regularly",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "11.3.1.1",
      testingProcedure:
        "Examine risk analysis documentation, review scan reports, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-11.3.1.2",
    title: "Authenticated Internal Vulnerability Scans Performed Where",
    description: "Are authenticated internal vulnerability scans performed where applicable?",
    category: "Test Security of Systems and Networks Regularly",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "11.3.1.2",
      testingProcedure:
        "Review scan tool configurations, scan reports, scanning accounts, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-11.3.1.3",
    title: "Internal Vulnerability Scans Performed After Significant",
    description:
      "Are internal vulnerability scans performed after significant system or infrastructure changes?",
    category: "Test Security of Systems and Networks Regularly",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "11.3.1.3",
      testingProcedure:
        "Examine change control documentation, review scan reports, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-11.3.2",
    title: "External Vulnerability Scans Performed Least Every",
    description:
      "Are external vulnerability scans performed at least every three months by an approved scanning vendor (ASV)?",
    category: "Test Security of Systems and Networks Regularly",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "11.3.2",
      testingProcedure: "Examine ASV scan reports.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-11.3.2.1",
    title: "External Vulnerability Scans Performed After Significant",
    description:
      "Are external vulnerability scans performed after significant changes and vulnerabilities remediated?",
    category: "Test Security of Systems and Networks Regularly",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "11.3.2.1",
      testingProcedure:
        "Review change control documentation, examine external scan and rescan reports, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-11.4.1",
    title: "Documented Penetration Testing Methodology Defined Implemented",
    description:
      "Is a documented penetration testing methodology defined and implemented for systems and networks?",
    category: "Test Security of Systems and Networks Regularly",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "11.4.1",
      testingProcedure: "Examine documentation and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-11.4.2",
    title: "Internal Penetration Testing Performed Least Annually",
    description:
      "Is internal penetration testing performed at least annually and after significant changes?",
    category: "Test Security of Systems and Networks Regularly",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "11.4.2",
      testingProcedure:
        "Review scope of work, examine penetration test results, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-11.4.3",
    title: "External Penetration Testing Performed Least Annually",
    description:
      "Is external penetration testing performed at least annually and after significant changes?",
    category: "Test Security of Systems and Networks Regularly",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "11.4.3",
      testingProcedure:
        "Review scope of work, examine penetration test results, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-11.4.4",
    title: "Vulnerabilities Identified During Penetration Testing Remediated",
    description:
      "Are vulnerabilities identified during penetration testing remediated and verified through retesting?",
    category: "Test Security of Systems and Networks Regularly",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "11.4.4",
      testingProcedure: "Examine penetration testing results and remediation evidence.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-11.4.5",
    title: "If Network Segmentation Used Segmentation Controls",
    description:
      "If network segmentation is used, are segmentation controls tested through penetration testing at least annually?",
    category: "Test Security of Systems and Networks Regularly",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "11.4.5",
      testingProcedure:
        "Examine segmentation controls, review penetration testing methodology, check test results, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-11.5.1",
    title: "Intrusion Detection Prevention Systems Implemented Monitor",
    description:
      "Are intrusion detection or prevention systems implemented to monitor network traffic and alert personnel of potential intrusions?",
    category: "Test Security of Systems and Networks Regularly",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "11.5.1",
      testingProcedure:
        "Review system configurations, examine network diagrams, check vendor documentation, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-11.5.2",
    title: "Change-detection Mechanism Implemented Detect Unauthorized Changes",
    description:
      "Is a change-detection mechanism implemented to detect unauthorized changes to critical system files?",
    category: "Test Security of Systems and Networks Regularly",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "11.5.2",
      testingProcedure:
        "Examine system settings, review monitored files, and check monitoring results.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-11.6.1",
    title: "Mechanism Implemented Detect Unauthorized Changes Tampering",
    description:
      "Is a mechanism implemented to detect unauthorized changes or tampering on payment pages?",
    category: "Test Security of Systems and Networks Regularly",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "11.6.1",
      testingProcedure:
        "Review system configuration settings, examine monitored payment pages, review monitoring results, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.1.1",
    title: "Information Security Policy Established Maintained Communicated",
    description:
      "Is an information security policy established, maintained, and communicated to all relevant personnel and partners?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.1.1",
      testingProcedure: "Examine the information security policy and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.1.2",
    title: "Information Security Policy Reviewed Least Annually",
    description:
      "Is the information security policy reviewed at least annually and updated when necessary?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.1.2",
      testingProcedure: "Examine the policy and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.1.3",
    title: "Security Policy Define Roles Responsibilities Information",
    description:
      "Does the security policy define roles and responsibilities for information security and are personnel aware of them?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.1.3",
      testingProcedure: "Examine the policy, interview personnel, and review documented evidence.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.1.4",
    title: "Responsibility Information Security Formally Assigned CISO",
    description:
      "Is responsibility for information security formally assigned to a CISO or senior security officer?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.1.4",
      testingProcedure: "Examine the information security policy.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.2.1",
    title: "Acceptable Use Policies End-user Technologies Documented",
    description:
      "Are acceptable use policies for end-user technologies documented and implemented?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.2.1",
      testingProcedure: "Examine acceptable use policies and interview responsible personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.3.1",
    title: "Documented Risk Analysis Performed Determine Frequency",
    description:
      "Is a documented risk analysis performed to determine the frequency of PCI DSS control activities?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.3.1",
      testingProcedure: "Examine documented policies and procedures.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.3.3",
    title: "Cryptographic Protocols Cipher Suites Documented Reviewed",
    description:
      "Are cryptographic protocols and cipher suites documented and reviewed at least annually?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.3.3",
      testingProcedure: "Examine documentation and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.3.4",
    title: "Hardware Software Technologies Reviewed Annually Ensure",
    description:
      "Are hardware and software technologies reviewed annually to ensure they remain secure and supported?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.3.4",
      testingProcedure: "Examine documentation and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.4.1",
    title: "Inventory System Components Scope PCI DSS",
    description:
      "Is an inventory of all system components in scope for PCI DSS maintained and kept current?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.4.1",
      testingProcedure: "Examine the inventory and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.4.2",
    title: "PCI DSS Scope Reviewed Validated Least",
    description:
      "Is PCI DSS scope reviewed and validated at least annually and after significant changes?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.4.2",
      testingProcedure: "Examine documented scope review results and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.5.1",
    title: "Formal Security Awareness Program Implemented Personnel",
    description: "Is a formal security awareness program implemented for all personnel?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.5.1",
      testingProcedure: "Examine the security awareness program.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.5.2",
    title: "Security Awareness Program Reviewed Updated Least",
    description: "Is the security awareness program reviewed and updated at least annually?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.5.2",
      testingProcedure: "Review program content, evidence of reviews, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.5.3",
    title: "Personnel Receive Security Awareness Training Hire",
    description: "Do personnel receive security awareness training at hire and at least annually?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.5.3",
      testingProcedure:
        "Review training records, interview personnel, and examine training materials.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.5.3.1",
    title: "Security Awareness Training Include Phishing Social",
    description:
      "Does security awareness training include phishing and social engineering threats?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "12.5.3.1",
      testingProcedure: "Examine security awareness training content.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.5.3.2",
    title: "Security Awareness Training Include Acceptable Use",
    description:
      "Does security awareness training include acceptable use of end-user technologies?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "12.5.3.2",
      testingProcedure: "Examine security awareness training content.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.6.1",
    title: "Personnel Screened Prior Hiring If They",
    description:
      "Are personnel screened prior to hiring if they will have access to the cardholder data environment (CDE)?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.6.1",
      testingProcedure: "Interview HR management personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.7.1",
    title: "List Maintained Third-party Service Providers That",
    description:
      "Is a list maintained of all third-party service providers that access or impact cardholder data?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.7.1",
      testingProcedure: "Examine policies, procedures, and the TPSP list.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.7.2",
    title: "Written Agreements Maintained Third-party Service Providers",
    description:
      "Are written agreements maintained with third-party service providers regarding protection of cardholder data?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.7.2",
      testingProcedure: "Examine policies and written agreements.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.7.3",
    title: "Due Diligence Process Implemented Before Engaging",
    description:
      "Is a due diligence process implemented before engaging third-party service providers?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.7.3",
      testingProcedure: "Examine policies, evidence of due diligence, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.7.4",
    title: "PCI DSS Compliance Status Third-party Service",
    description:
      "Is the PCI DSS compliance status of third-party service providers monitored at least annually?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.7.4",
      testingProcedure: "Examine documentation and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.7.5",
    title: "Documentation Maintained Showing Which PCI DSS",
    description:
      "Is documentation maintained showing which PCI DSS controls are handled by the entity and which by third-party providers?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.7.5",
      testingProcedure: "Examine policies, documentation, and interview personnel.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.8.1",
    title: "Incident Response Plan Established Address Security",
    description:
      "Is an incident response plan established to address security incidents affecting the CDE?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.8.1",
      testingProcedure:
        "Examine the incident response plan, interview personnel, and review incident records.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.8.2",
    title: "Incident Response Plan Reviewed Tested Least",
    description: "Is the incident response plan reviewed and tested at least annually?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.8.2",
      testingProcedure: "Interview personnel and examine documentation.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.8.3",
    title: "Personnel Available 24/7 Respond Security Incidents",
    description: "Are personnel available 24/7 to respond to security incidents?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.8.3",
      testingProcedure: "Interview responsible personnel and examine documentation.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.8.4",
    title: "Incident Response Personnel Trained Their Responsibilities",
    description: "Are incident response personnel trained on their responsibilities?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.8.4",
      testingProcedure: "Interview incident response personnel and examine training records.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.8.4.1",
    title: "Frequency Incident Response Training Defined Through",
    description: "Is the frequency of incident response training defined through risk analysis?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      pciReq: "12.8.4.1",
      testingProcedure: "Examine the targeted risk analysis.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.8.5",
    title: "Incident Response Plan Include Responding Alerts",
    description:
      "Does the incident response plan include responding to alerts from security monitoring systems?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.8.5",
      testingProcedure: "Examine documentation and observe incident response processes.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.8.6",
    title: "Incident Response Plan Updated Based Lessons",
    description:
      "Is the incident response plan updated based on lessons learned and industry developments?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.8.6",
      testingProcedure: "Examine policies, procedures, and the incident response plan.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
  {
    code: "PCI-12.8.7",
    title: "Procedures Defined Respond If Stored PAN",
    description:
      "Are procedures defined to respond if stored PAN is discovered outside the expected environment?",
    category: "Support Information Security with Organizational Policies and Programs",
    severity: "HIGH",
    weight: 3,
    metadata: {
      pciReq: "12.8.7",
      testingProcedure:
        "Examine incident response procedures, interview personnel, and review response records.",
      responseOptions:
        "In Place/In Place with CCW/In Place with Remediation/Not Applicable/Not Tested/Not in Place",
    },
  },
];
