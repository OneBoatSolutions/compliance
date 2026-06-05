import type { SeedControl } from "./types";

export const pciControls: SeedControl[] = [
  {
    code: "PCI-1.1.1",
    title: "Are network security policies and procedures documented, updated, and communicated?",
    description:
      "Requires documenting, communicating, and regularly updating network security policies and procedures. Compliance is demonstrated by presenting approved policy records and staff acknowledgement logs.",
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
    title:
      "Are roles and responsibilities for network security activities documented and assigned?",
    description:
      "Requires documenting and assigning specific roles and responsibilities for all network security activities. Compliance is demonstrated by presenting role assignment matrices and job descriptions.",
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
    title: "Are network security controls configured and maintained properly?",
    description:
      "Requires implementing and configuration-managing active network security controls across all network segments. Compliance is demonstrated by active firewall configurations and rule reviews.",
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
    title: "Are configuration standards defined and implemented for network security rulesets?",
    description:
      "Requires defining and implementing hardening and configuration standards for network security control rulesets. Compliance is demonstrated by presenting standard operating procedures and active rule configurations.",
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
    title:
      "Are changes to network connections and network security control (NSC) configurations approved and managed through a defined change control process?",
    description:
      "Requires managing and approving connection changes and network security configurations through a formal change control process. Compliance is demonstrated by change request tickets and approval logs.",
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
    title:
      "Are accurate network diagrams maintained showing all connections between the cardholder data environment (CDE) and other networks, including wireless networks?",
    description:
      "Requires maintaining accurate, up-to-date network diagrams showing all connections between the cardholder data environment (CDE) and other networks. Compliance is demonstrated by presenting verified network topology diagrams.",
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
    title:
      "Are accurate data-flow diagrams maintained showing all account data flows across systems and networks?",
    description:
      "Requires maintaining accurate data-flow diagrams that document all cardholder and account data transmissions across networks and systems. Compliance is demonstrated by presenting current data-flow diagrams.",
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
    title:
      "Are all allowed services, protocols, and ports identified, approved, and justified with a defined business need?",
    description:
      "Requires identifying, approving, and documenting business justifications for all allowed services, protocols, and ports. Compliance is demonstrated by presenting the approved services list and system configuration audits.",
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
    title:
      "Are security controls implemented to mitigate risks for insecure services, protocols, and ports?",
    description:
      "Requires implementing compensating security controls for any insecure services, protocols, or ports in use. Compliance is demonstrated by configuration settings and risk assessment documentation.",
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
    title:
      "Are network security control configurations reviewed at least every six months for relevance and effectiveness?",
    description:
      "Requires reviewing network security control configurations at least every six months to confirm their relevance and effectiveness. Compliance is demonstrated by presenting dated review logs and approvals.",
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
    title:
      "Are configuration files for network security controls protected from unauthorized access and kept consistent with active network configurations?",
    description:
      "Requires protecting network security control configuration files from unauthorized access and maintaining parity with active configurations. Compliance is demonstrated by access control lists and integrity logs.",
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
    title:
      "Is inbound traffic to the Cardholder Data Environment (CDE) restricted to only necessary traffic, with all other traffic denied by default?",
    description:
      "Requires restricting inbound traffic to the Cardholder Data Environment (CDE) to only authorized streams while denying all other traffic by default. Compliance is demonstrated by firewall rule tables.",
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
    title:
      "Is outbound traffic from the Cardholder Data Environment (CDE) restricted to only necessary traffic, with all other traffic denied by default?",
    description:
      "Requires restricting outbound traffic from the Cardholder Data Environment (CDE) to only necessary pathways while denying all other egress by default. Compliance is demonstrated by firewall rule configurations.",
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
    title:
      "Are network security controls implemented between wireless networks and the CDE to restrict unauthorized wireless traffic?",
    description:
      "Requires deploying network security controls between wireless networks and the Cardholder Data Environment (CDE) to block unauthorized wireless traffic. Compliance is demonstrated by active rule configurations and boundary scans.",
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
    title: "Are network security controls implemented between trusted and untrusted networks?",
    description:
      "Requires establishing network security controls at all boundaries between trusted and untrusted networks. Compliance is demonstrated by firewall routing configurations and network topology reviews.",
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
    title:
      "Is inbound traffic from untrusted networks restricted to only authorized services and stateful responses, with all other traffic denied?",
    description:
      "Requires restricting inbound traffic from untrusted networks to authorized services and stateful connection responses. Compliance is demonstrated by firewall access rules and traffic logs.",
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
    title:
      "Are anti-spoofing controls implemented to detect and block forged source IP addresses entering the trusted network?",
    description:
      "Requires implementing anti-spoofing filters to detect and block forged source IP addresses from entering trusted networks. Compliance is demonstrated by router configurations and packet inspection logs.",
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
    title:
      "Are systems storing cardholder data protected from direct access from untrusted networks?",
    description:
      "Requires protecting systems storing cardholder data from direct access or routing from untrusted networks. Compliance is demonstrated by firewall rulesets and system architecture maps.",
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
    title:
      "Is the disclosure of internal IP addresses and routing information restricted to authorized parties only?",
    description:
      "Requires restricting the disclosure of internal IP addresses and routing tables to authorized personnel only. Compliance is demonstrated by network configurations and system information policies.",
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
    title:
      "Are security controls implemented on devices that connect to both untrusted networks (e.g., Internet) and the Cardholder Data Environment (CDE)?",
    description:
      "Requires implementing personal firewalls or comparable security controls on devices that bridge untrusted networks and the CDE. Compliance is demonstrated by endpoint policy audits and device settings.",
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
    title:
      "Are security policies and operational procedures for Requirement 2 documented, maintained, and communicated to relevant personnel?",
    description:
      "Requires documenting, maintaining, and communicating secure configuration policies and procedures to all relevant personnel. Compliance is demonstrated by policy review dates and signature records.",
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
    title:
      "Are roles and responsibilities for activities in Requirement 2 documented, assigned, and understood?",
    description:
      "Requires assigning and documenting roles and responsibilities for managing system hardening and configuration activities. Compliance is demonstrated by organizational charts and job descriptions.",
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
    title:
      "Are configuration standards defined and implemented for all system components based on industry or vendor hardening guidelines?",
    description:
      "Requires establishing hardening standards for all system components aligned with industry or vendor guidelines. Compliance is demonstrated by presenting documented standards and configuration audit results.",
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
    title:
      "Are vendor default accounts and passwords changed, disabled, or removed before systems are deployed?",
    description:
      "Requires changing, disabling, or removing all vendor default accounts and passwords prior to system deployment. Compliance is demonstrated by configuration baselines and active user directory audits.",
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
    title:
      "Are system components configured to ensure functions with different security levels are properly separated or secured?",
    description:
      "Requires separating system components or services that operate at different security levels. Compliance is demonstrated by server configuration profiles and virtualization boundaries.",
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
    title: "Are only necessary services, protocols, and functions enabled on system components?",
    description:
      "Requires enabling only necessary services, protocols, and functions on all active system components. Compliance is demonstrated by hardening templates and active service port scans.",
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
    title:
      "If insecure services or protocols are used, is business justification documented and additional security controls implemented?",
    description:
      "Requires documenting a business justification and implementing additional controls for any insecure services or protocols. Compliance is demonstrated by risk approvals and security settings.",
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
    title: "Are system security parameters configured to prevent misuse of system components?",
    description:
      "Requires configuring system security parameters to prevent unauthorized command execution and system misuse. Compliance is demonstrated by baseline audits and active operating system configuration files.",
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
    title: "Is all non-console administrative access encrypted using strong cryptography?",
    description:
      "Requires encrypting all non-console administrative access sessions using strong cryptography. Compliance is demonstrated by server configuration reviews and active remote administration logs.",
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
    title:
      "Are default wireless settings (passwords, encryption keys, SNMP defaults, etc.) changed or secured for wireless networks connected to the CDE?",
    description:
      "Requires changing default passwords, encryption keys, and SNMP settings on all wireless devices connected to the CDE. Compliance is demonstrated by wireless access point configuration settings.",
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
    title:
      "Are wireless encryption keys changed when personnel leave or when a key is suspected or known to be compromised?",
    description:
      "Requires updating wireless encryption keys immediately when staff members leave or when key compromise is suspected. Compliance is demonstrated by key rotation schedules and incident logs.",
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
    title:
      "Are security policies and operational procedures for Requirement 3 documented, maintained, and communicated to relevant personnel?",
    description:
      "Requires documenting, maintaining, and communicating data protection policies and procedures to relevant personnel. Compliance is demonstrated by policy review stamps and acknowledgment signatures.",
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
    title:
      "Are roles and responsibilities for activities in Requirement 3 documented, assigned, and understood?",
    description:
      "Requires documenting and assigning specific roles and responsibilities for protecting stored account data. Compliance is demonstrated by organizational matrices and personnel assignment files.",
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
    title:
      "Is account data storage minimized through defined data retention and secure disposal policies and processes?",
    description:
      "Requires minimizing account data storage using formal retention limits and secure disposal procedures. Compliance is demonstrated by data inventory reviews and destruction logs.",
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
    title:
      "Is sensitive authentication data (SAD) removed or rendered unrecoverable after the authorization process?",
    description:
      "Requires removing or rendering unrecoverable all sensitive authentication data (SAD) following the authorization process. Compliance is demonstrated by database schemas and secure deletion script logs.",
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
    title: "Is full track data not stored after the authorization process?",
    description:
      "Requires ensuring that full magnetic stripe or chip track data is not stored after authorization. Compliance is demonstrated by transaction database audits and API payloads.",
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
    title: "Is the card verification code (CVV/CVC) not stored after the authorization process?",
    description:
      "Requires ensuring that card verification codes (CVV/CVC) are completely discarded after authorization. Compliance is demonstrated by database schema reviews and application logs.",
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
    title: "Are PINs and PIN blocks not stored after the authorization process?",
    description:
      "Requires ensuring that PINs and PIN blocks are not retained in any storage after authorization. Compliance is demonstrated by cryptographic processor configuration checks and log audits.",
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
    title:
      "If sensitive authentication data is stored before authorization, is it encrypted using strong cryptography?",
    description:
      "Requires encrypting any pre-authorization sensitive authentication data using strong cryptography. Compliance is demonstrated by cryptographic key records and configuration settings.",
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
    title:
      "Is the Primary Account Number (PAN) masked when displayed so that only authorized personnel can view the full PAN?",
    description:
      "Requires masking the Primary Account Number (PAN) when displayed, restricting full view to authorized roles only. Compliance is demonstrated by interface screenshots and access control configurations.",
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
    title: "Do remote-access technologies prevent unauthorized copying or relocation of PAN data?",
    description:
      "Requires configuring remote-access technologies to block copying or unauthorized relocation of PAN data. Compliance is demonstrated by remote access security profiles and session audit logs.",
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
    title:
      "Is PAN rendered unreadable wherever it is stored using approved methods such as hashing, truncation, tokenization, or strong encryption?",
    description:
      "Requires rendering stored PAN unreadable using approved methods like hashing, truncation, tokenization, or strong encryption. Compliance is demonstrated by database audits and cryptographic scans.",
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
    title:
      "Are cryptographic hashes used to protect PAN implemented with proper key management processes?",
    description:
      "Requires implementing proper key management and salting processes for cryptographic hashes used to protect PAN. Compliance is demonstrated by key management files and system configurations.",
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
    title:
      "If disk or partition-level encryption is used, is it applied only on removable media or combined with another PAN protection method?",
    description:
      "Requires restricting disk or partition-level encryption to removable media or using it in conjunction with other PAN controls. Compliance is demonstrated by partition settings and encryption audits.",
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
    title:
      "If disk or partition encryption is used, are access controls and key management implemented securely?",
    description:
      "Requires implementing secure access controls and key management processes on systems using disk or partition encryption. Compliance is demonstrated by access control list configurations and KMS keys.",
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
    title:
      "Are procedures implemented to protect cryptographic keys used for protecting stored account data from disclosure and misuse?",
    description:
      "Requires establishing and implementing procedures to protect key-management and cryptographic keys from disclosure. Compliance is demonstrated by key custodian signature sheets and secure key logs.",
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
    title:
      "Are secret or private keys used to encrypt stored account data securely stored (e.g., encrypted with a key-encrypting key, stored in a secure cryptographic device, or split into key shares)?",
    description:
      "Requires storing cryptographic private and secret keys securely using hardware security modules or key-encrypting keys. Compliance is demonstrated by KMS settings and HSM hardware audits.",
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
    title:
      "Is access to cleartext cryptographic key components restricted to the minimum number of authorized custodians?",
    description:
      "Requires restricting access to cleartext key components to the minimum authorized custodians. Compliance is demonstrated by user access matrices and custodian rosters.",
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
    title: "Are cryptographic keys stored in the minimum number of secure locations?",
    description:
      "Requires storing cryptographic keys in the minimum number of secure and authorized locations. Compliance is demonstrated by key storage audits and configuration registry listings.",
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
    title: "Are strong cryptographic keys generated according to defined key-management policies?",
    description:
      "Requires generating strong cryptographic keys in accordance with defined key-management procedures. Compliance is demonstrated by key generator software settings and entropy configuration audits.",
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
    title: "Are cryptographic keys securely distributed according to key-management policies?",
    description:
      "Requires distributing cryptographic keys securely in accordance with key-management policies. Compliance is demonstrated by transfer logs and secure distribution channel settings.",
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
    title: "Are cryptographic keys securely stored according to key-management policies?",
    description:
      "Requires storing cryptographic keys in secure storage structures according to key-management policies. Compliance is demonstrated by storage authorization reviews and database configurations.",
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
    title:
      "Are cryptographic keys changed at the end of their defined cryptoperiod according to key-management policies?",
    description:
      "Requires rotating cryptographic keys at the end of their defined cryptoperiod according to key-management policies. Compliance is demonstrated by key rotation records and system scheduling logs.",
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
    title: "Are cryptographic keys retired, replaced, or destroyed when expired or compromised?",
    description:
      "Requires retiring, replacing, or destroying cryptographic keys upon expiration or suspected compromise. Compliance is demonstrated by key destruction logs and replacement registers.",
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
    title:
      "Are manual cryptographic key-management operations performed using split knowledge and dual control?",
    description:
      "Requires performing manual key-management tasks using split knowledge and dual control procedures. Compliance is demonstrated by dual signature logs and key custodian rosters.",
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
    title: "Are controls implemented to prevent unauthorized substitution of cryptographic keys?",
    description:
      "Requires implementing security controls to prevent unauthorized modification or substitution of cryptographic keys. Compliance is demonstrated by integrity monitoring settings and access audits.",
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
    title:
      "Do cryptographic key custodians formally acknowledge their key-management responsibilities?",
    description:
      "Requires cryptographic key custodians to formally acknowledge their specific key-management responsibilities. Compliance is demonstrated by signed custodian agreement forms.",
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
    title:
      "Are security policies and operational procedures for Requirement 4 documented, maintained, and communicated to relevant personnel?",
    description:
      "Requires documenting, maintaining, and communicating cardholder data transmission policies to all relevant personnel. Compliance is demonstrated by policy review dates and training logs.",
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
    title:
      "Are roles and responsibilities for activities in Requirement 4 documented, assigned, and understood?",
    description:
      "Requires documenting and assigning roles and responsibilities for secure cardholder transmission activities. Compliance is demonstrated by role description templates and assignments.",
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
    title:
      "Is strong cryptography used to protect PAN during transmission over open, public networks?",
    description:
      "Requires using strong cryptography to protect PAN during transmission over public networks. Compliance is demonstrated by SSL/TLS configuration reviews and network packet traces.",
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
    title:
      "Is an inventory maintained for trusted keys and certificates used to protect PAN during transmission?",
    description:
      "Requires maintaining an active inventory of all trusted keys and certificates used to protect PAN during transmission. Compliance is demonstrated by presenting the certificate inventory and lifecycle logs.",
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
    title:
      "Do wireless networks transmitting PAN or connected to the CDE use strong cryptography based on industry best practices?",
    description:
      "Requires using strong cryptography for all wireless networks connected to the CDE or transmitting PAN. Compliance is demonstrated by wireless router configuration parameters and signal encryption scans.",
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
    title:
      "Is PAN encrypted using strong cryptography when transmitted through end-user messaging technologies (e.g., email, chat)?",
    description:
      "Requires encrypting PAN with strong cryptography when transmitted through end-user messaging channels. Compliance is demonstrated by email and chat system transport settings and outbound message logs.",
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
    title:
      "Are security policies and operational procedures for Requirement 5 documented, updated, and communicated to relevant personnel?",
    description:
      "Requires documenting, updating, and communicating malware protection policies and procedures to relevant personnel. Compliance is demonstrated by review dates and staff acknowledgement signatures.",
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
    title:
      "Are roles and responsibilities for malware protection activities documented and assigned?",
    description:
      "Requires documenting and assigning roles and responsibilities for malware protection tasks. Compliance is demonstrated by organizational matrices and personnel assignment files.",
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
    title: "Is an anti-malware solution deployed on all system components at risk of malware?",
    description:
      "Requires deploying an anti-malware solution on all system components determined to be at risk. Compliance is demonstrated by endpoint protection status dashboards and system lists.",
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
    title: "Does the anti-malware solution detect, block, or remove known types of malware?",
    description:
      "Requires configuring anti-malware software to detect, block, or remove known malware types. Compliance is demonstrated by active policy profiles and detection logs.",
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
    title:
      "Are system components without anti-malware periodically evaluated to confirm they are not at risk for malware?",
    description:
      "Requires conducting periodic evaluations of system components lacking anti-malware to confirm they remain at low risk. Compliance is demonstrated by documented risk evaluation reports.",
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
    title:
      "Is the evaluation frequency for systems not at risk for malware defined through a targeted risk analysis?",
    description:
      "Requires defining the evaluation frequency for systems not at risk for malware using a targeted risk analysis. Compliance is demonstrated by providing the risk assessment report.",
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
    title: "Is the anti-malware solution kept up to date through automatic updates?",
    description:
      "Requires keeping the anti-malware solution up to date through automated update mechanisms. Compliance is demonstrated by updater configurations and agent version reports.",
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
    title: "Does the anti-malware solution perform periodic or real-time scans of systems?",
    description:
      "Requires configuring anti-malware software to perform continuous real-time or scheduled periodic scans. Compliance is demonstrated by scanning policy profiles and daemon configuration logs.",
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
    title:
      "If periodic scans are used, is the scan frequency defined through targeted risk analysis?",
    description:
      "Requires establishing periodic anti-malware scan frequencies based on a targeted risk analysis. Compliance is demonstrated by presenting the risk analysis report and scheduler configurations.",
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
    title:
      "Are removable media automatically scanned or monitored for malware when connected to systems?",
    description:
      "Requires automatically scanning or monitoring removable media upon connection to systems. Compliance is demonstrated by endpoint agent rulesets and scan logs.",
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
    title: "Are anti-malware audit logs enabled and retained according to logging requirements?",
    description:
      "Requires enabling and retaining anti-malware audit logs in accordance with retention policies. Compliance is demonstrated by log server settings and audit trail indices.",
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
    title:
      "Are anti-malware mechanisms protected from being disabled or altered by unauthorized users?",
    description:
      "Requires protecting anti-malware mechanisms from unauthorized deactivation or modification. Compliance is demonstrated by administrative access settings and tamper protection logs.",
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
    title:
      "Are processes and automated mechanisms implemented to detect and protect against phishing attacks?",
    description:
      "Requires implementing automated tools and processes to detect and block phishing attempts. Compliance is demonstrated by email gateway filters and security awareness training logs.",
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
    title:
      "Are security policies and operational procedures for Requirement 6 documented, maintained, and communicated to relevant personnel?",
    description:
      "Requires documenting, maintaining, and communicating secure software development policies to relevant staff. Compliance is demonstrated by review logs and policy acknowledgement forms.",
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
    title:
      "Are roles and responsibilities for Requirement 6 activities documented, assigned, and understood?",
    description:
      "Requires documenting and assigning roles and responsibilities for secure development and vulnerability management activities. Compliance is demonstrated by role matrices and personnel files.",
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
    title:
      "Is bespoke and custom software developed according to secure development standards and practices?",
    description:
      "Requires developing bespoke and custom software in accordance with secure coding standards. Compliance is demonstrated by secure SDLC guidelines and code review checklists.",
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
    title:
      "Are software developers trained annually on secure coding and software security practices?",
    description:
      "Requires delivering annual secure coding training to all software development personnel. Compliance is demonstrated by training syllabus records and developer attendance logs.",
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
    title:
      "Is bespoke and custom software reviewed before release to identify and fix security vulnerabilities?",
    description:
      "Requires reviewing bespoke and custom software before production release to identify and remediate security vulnerabilities. Compliance is demonstrated by pre-release review sign-offs.",
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
    title:
      "If manual code reviews are used, are code changes reviewed by independent personnel and approved before release?",
    description:
      "Requires independent review and approval of code changes before release when manual reviews are utilized. Compliance is demonstrated by pull request approvals and reviewer lists.",
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
    title:
      "Are secure coding practices implemented to protect software from common attacks and vulnerabilities?",
    description:
      "Requires implementing secure coding practices to protect software from common vulnerabilities, such as injection attacks. Compliance is demonstrated by code scans and developer guidelines.",
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
    title:
      "Are security vulnerabilities identified using industry sources and assigned risk rankings?",
    description:
      "Requires identifying security vulnerabilities using industry sources and assigning objective risk rankings. Compliance is demonstrated by vulnerability feeds and risk ranking criteria.",
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
    title:
      "Is an inventory maintained for bespoke, custom, and third-party software to support vulnerability and patch management?",
    description:
      "Requires maintaining an accurate inventory of bespoke, custom, and third-party software to support patch management. Compliance is demonstrated by presenting the software inventory spreadsheet.",
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
    title:
      "Are security patches applied to system components within defined timeframes based on risk level?",
    description:
      "Requires applying security patches to all system components within risk-based timeframes. Compliance is demonstrated by patch management logs and system version audits.",
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
    title:
      "Are public-facing web applications protected through regular security assessments or automated protection mechanisms?",
    description:
      "Requires protecting public-facing web applications with regular security assessments or automated protection tools. Compliance is demonstrated by application scanning logs and WAF configurations.",
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
    title:
      "Is an automated solution implemented to detect and prevent web-based attacks on public-facing web applications?",
    description:
      "Requires implementing an automated solution, such as a WAF, to block attacks on public-facing web applications. Compliance is demonstrated by active WAF rule profiles.",
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
    title:
      "Are payment page scripts authorized, integrity-checked, and maintained in an inventory with justification?",
    description:
      "Requires authorizing, integrity-checking, and inventorying all active payment page scripts. Compliance is demonstrated by script integrity logs and the authorized script registry.",
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
    title: "Are changes to system components managed through a formal change control process?",
    description:
      "Requires managing all system component changes through a formal change control process. Compliance is demonstrated by change request ticket approvals and post-implementation reviews.",
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
    title: "After significant changes, are PCI DSS controls verified and documentation updated?",
    description:
      "Requires verifying PCI DSS controls and updating documentation following any significant changes. Compliance is demonstrated by post-change audit sign-offs and policy updates.",
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
    title:
      "Are pre-production environments separated from production environments with access controls?",
    description:
      "Requires separating pre-production environments from production environments using logical network access controls. Compliance is demonstrated by firewall rules and IAM separation profiles.",
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
    title:
      "Are roles and responsibilities separated between production and pre-production environments?",
    description:
      "Requires segregating personnel roles and duties between production and pre-production systems. Compliance is demonstrated by IAM assignment audits and user privilege reports.",
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
    title:
      "Is live PAN data prohibited in pre-production environments unless the environment is part of the CDE and properly secured?",
    description:
      "Requires prohibiting live PAN data in pre-production environments unless the system is fully secured within the CDE boundary. Compliance is demonstrated by database scans and sanitization logs.",
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
    title: "Are test data and test accounts removed before systems move to production?",
    description:
      "Requires removing all test data and test accounts prior to moving systems into production. Compliance is demonstrated by production system checks and deployment logs.",
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
    title:
      "Are security policies and procedures for access control documented, updated, and communicated to relevant personnel?",
    description:
      "Requires documenting, updating, and communicating access control policies and procedures to relevant personnel. Compliance is demonstrated by policy revision histories and training logs.",
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
    title: "Are roles and responsibilities for access control activities documented and assigned?",
    description:
      "Requires documenting and assigning roles and responsibilities for access control tasks. Compliance is demonstrated by access approval workflows and job descriptions.",
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
    title:
      "Is an access control model defined based on job roles and the principle of least privilege?",
    description:
      "Requires defining an access control model based on job roles and the principle of least privilege. Compliance is demonstrated by presenting the access control matrix.",
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
    title:
      "Is user access, including privileged access, assigned based on job role and least privilege requirements?",
    description:
      "Requires assigning user access, including privileged access, based strictly on job role and least privilege. Compliance is demonstrated by IAM directory privilege listings.",
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
    title: "Are user access privileges approved by authorized personnel before being granted?",
    description:
      "Requires obtaining approvals from authorized personnel before granting user access privileges. Compliance is demonstrated by completed access request forms and approvals.",
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
    title:
      "Are user accounts and access privileges reviewed at least every six months to ensure appropriateness?",
    description:
      "Requires reviewing user accounts and access privileges at least every six months. Compliance is demonstrated by presenting dated user access review logs and manager sign-offs.",
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
    title:
      "Are system and application accounts assigned and managed based on the least privileges necessary?",
    description:
      "Requires assigning and managing system and application accounts based on the least privileges necessary. Compliance is demonstrated by active account listings and configuration reviews.",
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
    title:
      "Are system and application account privileges periodically reviewed and validated by management?",
    description:
      "Requires periodic reviews and validation of system and application account privileges by management. Compliance is demonstrated by signed privilege validation reports.",
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
    title:
      "Is access to repositories storing cardholder data restricted to authorized users and administrators only?",
    description:
      "Requires restricting access to repositories storing cardholder data to authorized users and administrators. Compliance is demonstrated by database access control configurations.",
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
    title:
      "Is an access control system implemented to restrict access to system components based on business need to know?",
    description:
      "Requires implementing an access control system that restricts system access based on business need to know. Compliance is demonstrated by active IAM permissions policies.",
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
    title:
      "Is the access control system configured to enforce permissions based on job roles and functions?",
    description:
      "Requires configuring the access control system to enforce permissions mapped directly to job roles. Compliance is demonstrated by configuration settings of directory services.",
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
    title: "Is the access control system configured with a default deny-all policy?",
    description:
      "Requires configuring the access control system to default to a deny-all policy for all resources. Compliance is demonstrated by system authorization configuration files.",
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
    title:
      "Are security policies and procedures for Requirement 8 documented, updated, and communicated to relevant personnel?",
    description:
      "Requires documenting, updating, and communicating user identification and authentication policies to relevant personnel. Compliance is demonstrated by policy review stamps.",
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
    title:
      "Are roles and responsibilities for activities in Requirement 8 documented and assigned?",
    description:
      "Requires documenting and assigning roles and responsibilities for user identity and credential management tasks. Compliance is demonstrated by organization charts.",
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
    title:
      "Are all users assigned a unique ID before accessing system components or cardholder data?",
    description:
      "Requires assigning a unique identifier to all users before they access system components or cardholder data. Compliance is demonstrated by active user directory lists.",
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
    title: "Are shared or generic accounts restricted, approved, and monitored for accountability?",
    description:
      "Requires restricting, approving, and monitoring the use of shared or generic accounts to maintain accountability. Compliance is demonstrated by shared account registries.",
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
    title: "Are user account additions, changes, and deletions authorized and properly managed?",
    description:
      "Requires authorizing and managing user account additions, modifications, and terminations. Compliance is demonstrated by provisioning ticket history logs.",
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
    title: "Is access for terminated users immediately revoked?",
    description:
      "Requires immediately revoking access privileges for all terminated users. Compliance is demonstrated by comparing termination dates with deactivation logs.",
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
    title: "Are inactive user accounts disabled or removed after 90 days of inactivity?",
    description:
      "Requires disabling or removing user accounts after 90 days of inactivity. Compliance is demonstrated by inactive account scan reports and system configurations.",
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
    title:
      "Are third-party remote access accounts enabled only when required and monitored for activity?",
    description:
      "Requires enabling third-party remote access accounts only when required and monitoring their active sessions. Compliance is demonstrated by connection requests and audit logs.",
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
    title:
      "Are user sessions automatically locked or re-authenticated after 15 minutes of inactivity?",
    description:
      "Requires automatically locking or requesting re-authentication for user sessions inactive for 15 minutes. Compliance is demonstrated by screensaver and session group policy settings.",
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
    title:
      "Are users and administrators authenticated using approved authentication factors (e.g., password, token, biometric)?",
    description:
      "Requires authenticating all users and administrators using approved authentication factors. Compliance is demonstrated by authentication protocol configurations and IAM parameters.",
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
    title:
      "Are authentication factors protected using strong cryptography during storage and transmission?",
    description:
      "Requires protecting authentication factors during storage and transmission using strong cryptography. Compliance is demonstrated by password hashing algorithms and secure transport settings.",
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
    title: "Is user identity verified before changing authentication factors?",
    description:
      "Requires verifying a user's identity before updating or resetting their authentication factors. Compliance is demonstrated by helpdesk verification tickets and authentication reset logs.",
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
    title: "Are invalid login attempts limited and accounts locked after multiple failed attempts?",
    description:
      "Requires limiting invalid login attempts and locking accounts after a configured maximum of failed tries. Compliance is demonstrated by active lockout policy files.",
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
    title: "Are passwords set uniquely and changed after first login or reset?",
    description:
      "Requires setting unique initial passwords and enforcing a change upon first login or reset. Compliance is demonstrated by user account lifecycle logs and directory system policy settings.",
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
    title: "Do passwords meet minimum complexity requirements (length and character types)?",
    description:
      "Requires enforcing minimum complexity standards for passwords, covering length and character variety. Compliance is demonstrated by password policy settings and directory configuration files.",
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
    title: "Are users prevented from reusing their last passwords?",
    description:
      "Requires restricting users from reusing their previously used passwords. Compliance is demonstrated by password history policy parameters and user account logs.",
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
    title: "Are authentication policies documented and communicated to users?",
    description:
      "Requires documenting and communicating user authentication policies to the workforce. Compliance is demonstrated by signed employee acknowledgement logs and published policy documents.",
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
    title: "Are passwords changed periodically or monitored dynamically for security posture?",
    description:
      "Requires changing passwords periodically or dynamically monitoring credential security posture. Compliance is demonstrated by system credential settings and security dashboard metrics.",
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
    title: "Are authentication factors assigned to individual users and protected from sharing?",
    description:
      "Requires assigning authentication credentials to single users and prohibiting credential sharing. Compliance is demonstrated by unique user profile listings and security policy acknowledgements.",
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
    title:
      "Is multi-factor authentication implemented for non-console administrative access to the CDE?",
    description:
      "Requires implementing multi-factor authentication for all non-console administrative access to the CDE. Compliance is demonstrated by system administration configs and MFA session logs.",
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
    title: "Is multi-factor authentication implemented for all access to the CDE?",
    description:
      "Requires implementing multi-factor authentication for all user access to the CDE. Compliance is demonstrated by IAM portal settings and MFA audit logs.",
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
    title:
      "Is multi-factor authentication implemented for all remote access to networks that could access the CDE?",
    description:
      "Requires implementing multi-factor authentication for all remote connection points capable of accessing the CDE. Compliance is demonstrated by VPN and firewall profile configurations.",
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
    title: "Are MFA systems configured to prevent bypass and misuse?",
    description:
      "Requires configuring multi-factor authentication systems to block bypass rules and credential misuse. Compliance is demonstrated by MFA global configurations and administrative bypass logs.",
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
    title: "Are application and system accounts managed to prevent unauthorized interactive login?",
    description:
      "Requires managing application and system accounts to restrict interactive login capability. Compliance is demonstrated by service account profiles and active login logs.",
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
    title:
      "Are passwords for application or system accounts not hard-coded in scripts or source code?",
    description:
      "Requires ensuring that application and service passwords are not hard-coded within source files or scripts. Compliance is demonstrated by automated code scans and secret manager configurations.",
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
    title:
      "Are passwords for application and system accounts protected, periodically changed, and securely managed?",
    description:
      "Requires protecting and periodically rotating application and system account passwords. Compliance is demonstrated by vault management configuration logs and rotation schedules.",
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
    title:
      "Are security policies and procedures for physical access controls documented, maintained, and communicated?",
    description:
      "Requires documenting, maintaining, and communicating physical access control policies to relevant staff. Compliance is demonstrated by facility security manuals and acknowledgment records.",
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
    title:
      "Are roles and responsibilities for physical security activities documented and assigned?",
    description:
      "Requires documenting and assigning roles and responsibilities for facility physical security tasks. Compliance is demonstrated by security team rosters and duty logs.",
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
    title:
      "Are physical entry controls implemented to restrict access to systems in the Cardholder Data Environment (CDE)?",
    description:
      "Requires implementing physical entry barriers to restrict access to systems housed in the CDE. Compliance is demonstrated by facility badge entry records and physical barrier layouts.",
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
    title:
      "Is physical access to sensitive areas in the CDE monitored using video cameras or access control mechanisms?",
    description:
      "Requires monitoring physical access to sensitive CDE areas using cameras or access control tools. Compliance is demonstrated by video recording logs and badge scanner reports.",
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
    title: "Are controls implemented to restrict use of publicly accessible network jacks?",
    description:
      "Requires implementing controls to restrict network connectivity on publicly accessible ports. Compliance is demonstrated by switch port configuration settings and physical jack disablement logs.",
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
    title:
      "Is physical access to wireless access points, networking equipment, and telecom lines restricted?",
    description:
      "Requires physically locking wireless access points, networking hardware, and telecom lines in secure areas. Compliance is demonstrated by facility audits and locked rack cabinet logs.",
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
    title: "Are console systems in sensitive areas locked when not in use?",
    description:
      "Requires locking console systems located in sensitive physical areas when they are unattended. Compliance is demonstrated by system idle-lock rules and physical security walk audit records.",
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
    title:
      "Are procedures implemented to authorize and manage personnel physical access to the CDE?",
    description:
      "Requires implementing procedures to authorize and manage personnel physical access to the CDE. Compliance is demonstrated by badge database records and access authorization forms.",
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
    title:
      "Is physical access to sensitive CDE areas granted based on job role and revoked upon termination?",
    description:
      "Requires granting physical access based on job role and revoking it immediately upon termination. Compliance is demonstrated by badge database audits and HR offboarding tickets.",
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
    title: "Are procedures implemented to authorize and manage visitor access to the CDE?",
    description:
      "Requires implementing procedures to authorize, escort, and manage visitor access to CDE facilities. Compliance is demonstrated by guest sign-in sheets and visitor escort protocols.",
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
    title: "Are visitor badges collected or deactivated when visitors leave the facility?",
    description:
      "Requires collecting or deactivating visitor badges when guests leave the facility. Compliance is demonstrated by visitor badge inventory logs and deactivation timestamp records.",
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
    title: "Is a visitor log maintained with visitor details and access records?",
    description:
      "Requires maintaining a visitor log that records visitor names, organizations, and entry/exit times. Compliance is demonstrated by presenting guest logbooks or digital logs.",
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
    title: "Is all media containing cardholder data physically secured?",
    description:
      "Requires physically securing all storage media containing cardholder data to prevent unauthorized retrieval. Compliance is demonstrated by media safe logs and locked cabinet inspections.",
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
    title: "Are offline backups containing cardholder data stored securely?",
    description:
      "Requires storing offline backups containing cardholder data in secure, off-site locations. Compliance is demonstrated by backup facility security reviews and transport chain-of-custody logs.",
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
    title: "Is the security of backup storage locations reviewed at least annually?",
    description:
      "Requires reviewing the security controls of all backup storage locations at least annually. Compliance is demonstrated by presenting signed annual security review forms.",
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
    title: "Is media containing cardholder data classified according to data sensitivity?",
    description:
      "Requires classifying all media containing cardholder data according to its sensitivity level. Compliance is demonstrated by media labeling standards and active data classification logs.",
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
    title:
      "Is media containing cardholder data securely logged and tracked when sent outside the facility?",
    description:
      "Requires logging and tracking all media containing cardholder data when sent outside the facility. Compliance is demonstrated by presenting transit manifest logs and sign-off sheets.",
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
    title:
      "Is management approval required before media containing cardholder data is moved outside the facility?",
    description:
      "Requires obtaining management approval before cardholder media is moved outside the facility. Compliance is demonstrated by completed transfer approval tickets.",
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
    title: "Are inventory logs maintained for all electronic media containing cardholder data?",
    description:
      "Requires maintaining detailed inventory logs of all electronic media that contains cardholder data. Compliance is demonstrated by presenting the active media inventory register.",
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
    title: "Are electronic media inventories reviewed at least annually?",
    description:
      "Requires reviewing and validating electronic media inventories at least annually. Compliance is demonstrated by presenting signed annual inventory audit logs.",
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
    title:
      "Are hard-copy materials containing cardholder data securely destroyed when no longer needed?",
    description:
      "Requires securely destroying hard-copy materials containing cardholder data when no longer needed. Compliance is demonstrated by shredding contractor certificates and destruction logs.",
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
    title:
      "Is electronic media containing cardholder data destroyed or rendered unrecoverable when no longer needed?",
    description:
      "Requires destroying or rendering unrecoverable electronic media containing cardholder data when no longer needed. Compliance is demonstrated by media degaussing or sanitization logs.",
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
    title:
      "Are point-of-interaction (POI) devices protected from tampering and unauthorized substitution?",
    description:
      "Requires protecting point-of-interaction (POI) devices from tampering and unauthorized substitution. Compliance is demonstrated by POI physical security seals and serial verification logs.",
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
    title: "Is an up-to-date inventory of POI devices maintained?",
    description:
      "Requires maintaining an accurate, up-to-date inventory of all deployed POI devices. Compliance is demonstrated by presenting the POI hardware inventory registry.",
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
    title: "Are POI devices periodically inspected to detect tampering or substitution?",
    description:
      "Requires inspecting POI devices periodically to detect physical tampering or hardware substitution. Compliance is demonstrated by dated inspection checklist logs.",
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
    title: "Is the frequency and method of POI inspections defined through risk analysis?",
    description:
      "Requires defining POI device inspection frequencies and methodologies using a documented risk analysis. Compliance is demonstrated by presenting the risk analysis report.",
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
    title:
      "Are personnel trained to detect and report tampering or suspicious behavior involving POI devices?",
    description:
      "Requires training personnel to detect and report suspicious behavior or tampering on POI devices. Compliance is demonstrated by training logs and incident report sheets.",
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
    title:
      "Are security policies and procedures for logging and monitoring documented, updated, and communicated to relevant personnel?",
    description:
      "Requires documenting, updating, and communicating logging and monitoring policies to relevant personnel. Compliance is demonstrated by policy review history entries.",
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
    title:
      "Are roles and responsibilities for logging and monitoring activities documented and assigned?",
    description:
      "Requires documenting and assigning roles and responsibilities for system logging and monitoring activities. Compliance is demonstrated by administrative team assignment files.",
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
    title: "Are audit logs enabled for all system components and cardholder data systems?",
    description:
      "Requires enabling comprehensive audit logging across all system components and CDE servers. Compliance is demonstrated by log service daemon configuration profiles.",
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
    title: "Do audit logs capture all individual user access to cardholder data?",
    description:
      "Requires audit logs to capture all individual user access events for cardholder data stores. Compliance is demonstrated by database audit trail settings and access logs.",
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
    title: "Do audit logs capture all actions performed by users with administrative privileges?",
    description:
      "Requires audit logs to record all administrative and privileged actions executed by users. Compliance is demonstrated by operating system syslog configurations and audit reports.",
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
    title: "Do audit logs record all access to audit log files?",
    description:
      "Requires logging all access and read events for active audit log files to ensure security. Compliance is demonstrated by file access monitoring settings.",
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
    title: "Do audit logs record all invalid logical access attempts?",
    description:
      "Requires audit logs to capture and record all failed logical access attempts. Compliance is demonstrated by active firewall security logs and authentication failure reports.",
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
    title: "Do audit logs capture changes to user accounts and authentication credentials?",
    description:
      "Requires audit logs to capture all user account creations, modifications, and deletions. Compliance is demonstrated by directory services event logs and audit registry scans.",
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
    title: "Do audit logs record the initialization, starting, stopping, or pausing of audit logs?",
    description:
      "Requires logging any start, stop, pause, or initialization operations affecting audit log services. Compliance is demonstrated by log management service audit trail entries.",
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
    title: "Do audit logs capture creation and deletion of system-level objects?",
    description:
      "Requires audit logs to capture all system-level object creations and deletions. Compliance is demonstrated by operating system security audits and file system event logs.",
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
    title:
      "Do audit logs record required event details such as user ID, event type, date/time, success/failure, and source of event?",
    description:
      "Requires logging detailed event parameters including user ID, event type, timestamp, success/failure, and origin. Compliance is demonstrated by sample syslog payloads.",
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
    title: "Is read access to audit logs restricted to authorized personnel only?",
    description:
      "Requires restricting read access to audit log files to authorized users only. Compliance is demonstrated by file system ACLs and log server group permission settings.",
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
    title: "Are audit log files protected from unauthorized modification?",
    description:
      "Requires protecting audit log files from unauthorized modification using write-once media or server rules. Compliance is demonstrated by log server settings and read-only attributes.",
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
    title:
      "Are audit logs regularly backed up to a secure centralized log server or secure storage?",
    description:
      "Requires backing up audit logs regularly to a secure centralized log server. Compliance is demonstrated by cron backup logs and centralized SIEM input profiles.",
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
    title: "Is file integrity monitoring used to detect unauthorized changes to audit logs?",
    description:
      "Requires implementing file integrity monitoring (FIM) to detect unauthorized changes to audit logs. Compliance is demonstrated by FIM software configurations and warning alert logs.",
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
    title: "Are critical system and security logs reviewed daily to detect suspicious activity?",
    description:
      "Requires reviewing critical system and security logs daily to identify suspicious activities. Compliance is demonstrated by daily review checklist signatures or ticket logs.",
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
    title: "Are automated tools used to review audit logs?",
    description:
      "Requires deploying automated log analysis or SIEM tools to continuously review audit logs. Compliance is demonstrated by active SIEM alarm rule screens.",
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
    title: "Are logs of other system components reviewed periodically?",
    description:
      "Requires reviewing logs of non-critical system components periodically. Compliance is demonstrated by schedule configurations and completed review checklist records.",
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
    title: "Is the frequency of periodic log reviews defined based on risk analysis?",
    description:
      "Requires defining periodic log review frequencies using a formal risk analysis. Compliance is demonstrated by presenting the risk analysis report.",
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
    title:
      "Are anomalies or suspicious activities identified in log reviews investigated and addressed?",
    description:
      "Requires investigating and addressing all anomalies or suspicious activities flagged in log reviews. Compliance is demonstrated by incident tickets and remediation logs.",
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
    title:
      "Are audit logs retained for at least 12 months with at least three months immediately available for analysis?",
    description:
      "Requires retaining audit logs for at least 12 months, with three months immediately queryable. Compliance is demonstrated by log retention configs and active directory search response times.",
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
    title: "Are system clocks synchronized using time synchronization technology?",
    description:
      "Requires synchronizing all system clocks using automated time synchronization technology. Compliance is demonstrated by NTP configuration files and system time audits.",
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
    title:
      "Are systems configured to use designated and secure time servers for consistent time synchronization?",
    description:
      "Requires configuring systems to retrieve time from designated, secure NTP servers. Compliance is demonstrated by NTP server lists and active connection state audits.",
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
    title:
      "Are time synchronization settings protected and changes to time settings logged and monitored?",
    description:
      "Requires protecting time configurations from unauthorized changes and auditing modifications. Compliance is demonstrated by clock security parameters and change logs.",
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
    title: "Are failures of critical security control systems detected and alerted promptly?",
    description:
      "Requires implementing automated alerts to detect failures of critical security controls promptly. Compliance is demonstrated by monitoring rulesets and simulated failover logs.",
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
    title:
      "Are failures of critical security control systems investigated, documented, and remediated promptly?",
    description:
      "Requires investigating, documenting, and resolving all critical security control failures promptly. Compliance is demonstrated by support tickets and incident root-cause reports.",
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
    title:
      "Are security policies and operational procedures for Requirement 11 documented, updated, and communicated to relevant personnel?",
    description:
      "Requires documenting, updating, and communicating security testing policies to relevant personnel. Compliance is demonstrated by policy revision histories and training logs.",
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
    title:
      "Are roles and responsibilities for security testing activities documented, assigned, and understood?",
    description:
      "Requires assigning and documenting roles for all vulnerability scanning and security testing activities. Compliance is demonstrated by team matrices and job descriptions.",
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
    title:
      "Are wireless access points regularly identified, monitored, and unauthorized access points detected?",
    description:
      "Requires scanning for and detecting unauthorized wireless access points at regular intervals. Compliance is demonstrated by wireless scan logs and signal inspection files.",
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
    title:
      "Is an inventory of authorized wireless access points maintained with documented business justification?",
    description:
      "Requires maintaining an inventory of authorized wireless access points with business justifications. Compliance is demonstrated by presenting the wireless hardware inventory register.",
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
    title:
      "Are internal vulnerability scans performed at least every three months and vulnerabilities resolved?",
    description:
      "Requires performing internal vulnerability scans at least every three months and remediating findings. Compliance is demonstrated by scanner schedules and remediation ticket logs.",
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
    title:
      "Are lower-risk vulnerabilities managed based on the organization�s risk analysis process?",
    description:
      "Requires managing and remediating lower-risk vulnerabilities based on the organization's risk analysis. Compliance is demonstrated by vulnerability management procedures and exception logs.",
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
    title: "Are authenticated internal vulnerability scans performed where applicable?",
    description:
      "Requires conducting authenticated internal vulnerability scans where technically feasible. Compliance is demonstrated by scanner credentials configuration screens and scan reports.",
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
    title:
      "Are internal vulnerability scans performed after significant system or infrastructure changes?",
    description:
      "Requires executing internal vulnerability scans immediately following any significant infrastructure changes. Compliance is demonstrated by post-change validation logs.",
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
    title:
      "Are external vulnerability scans performed at least every three months by an approved scanning vendor (ASV)?",
    description:
      "Requires performing external vulnerability scans at least quarterly using an Approved Scanning Vendor (ASV). Compliance is demonstrated by presenting ASV scan reports.",
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
    title:
      "Are external vulnerability scans performed after significant changes and vulnerabilities remediated?",
    description:
      "Requires running external vulnerability scans and resolving findings after any significant network changes. Compliance is demonstrated by post-change ASV scans.",
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
    title:
      "Is a documented penetration testing methodology defined and implemented for systems and networks?",
    description:
      "Requires defining and implementing a formal penetration testing methodology covering CDE boundaries. Compliance is demonstrated by presenting the penetration testing policy.",
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
    title:
      "Is internal penetration testing performed at least annually and after significant changes?",
    description:
      "Requires performing internal penetration testing at least annually and after major structural changes. Compliance is demonstrated by signed penetration test reports.",
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
    title:
      "Is external penetration testing performed at least annually and after significant changes?",
    description:
      "Requires executing external penetration testing at least annually and after significant boundary changes. Compliance is demonstrated by third-party testing report sign-offs.",
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
    title:
      "Are vulnerabilities identified during penetration testing remediated and verified through retesting?",
    description:
      "Requires remediating penetration testing vulnerabilities and verifying resolutions via targeted retesting. Compliance is demonstrated by remediation records and retest reports.",
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
    title:
      "If network segmentation is used, are segmentation controls tested through penetration testing at least annually?",
    description:
      "Requires testing network segmentation controls at least annually using active penetration testing. Compliance is demonstrated by presenting boundary testing reports.",
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
    title:
      "Are intrusion detection or prevention systems implemented to monitor network traffic and alert personnel of potential intrusions?",
    description:
      "Requires implementing intrusion detection or prevention systems to monitor network boundaries and alert on threats. Compliance is demonstrated by active IDS/IPS configurations.",
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
    title:
      "Is a change-detection mechanism implemented to detect unauthorized changes to critical system files?",
    description:
      "Requires deploying file integrity monitoring (FIM) or change-detection systems to protect critical files. Compliance is demonstrated by FIM configuration parameters.",
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
    title:
      "Is a mechanism implemented to detect unauthorized changes or tampering on payment pages?",
    description:
      "Requires implementing automated mechanisms to detect unauthorized script modifications on payment pages. Compliance is demonstrated by script integrity audit logs.",
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
    title:
      "Is an information security policy established, maintained, and communicated to all relevant personnel and partners?",
    description:
      "Requires establishing, maintaining, and communicating an information security policy to all staff and partners. Compliance is demonstrated by the security policy handbook.",
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
    title:
      "Is the information security policy reviewed at least annually and updated when necessary?",
    description:
      "Requires reviewing the global information security policy at least annually. Compliance is demonstrated by signed review stamps and policy change control history.",
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
    title:
      "Does the security policy define roles and responsibilities for information security and are personnel aware of them?",
    description:
      "Requires outlining roles and responsibilities for information security within policy files. Compliance is demonstrated by role definition pages and training signs.",
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
    title:
      "Is responsibility for information security formally assigned to a CISO or senior security officer?",
    description:
      "Requires formally assigning responsibility for corporate information security to a senior security officer. Compliance is demonstrated by organizational board resolutions.",
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
    title: "Are acceptable use policies for end-user technologies documented and implemented?",
    description:
      "Requires documenting and enforcing acceptable use policies for all corporate end-user technologies. Compliance is demonstrated by employee acceptable use signs.",
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
    title:
      "Is a documented risk analysis performed to determine the frequency of PCI DSS control activities?",
    description:
      "Requires performing a documented risk analysis to define frequencies for PCI DSS control tasks. Compliance is demonstrated by providing the completed risk analysis report.",
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
    title:
      "Are cryptographic protocols and cipher suites documented and reviewed at least annually?",
    description:
      "Requires documenting and reviewing all cryptographic protocols and cipher suites at least annually. Compliance is demonstrated by security standard reviews and ciphers lists.",
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
    title:
      "Are hardware and software technologies reviewed annually to ensure they remain secure and supported?",
    description:
      "Requires conducting annual reviews of software and hardware technologies to verify active vendor support. Compliance is demonstrated by technology lifecycle lists.",
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
    title:
      "Is an inventory of all system components in scope for PCI DSS maintained and kept current?",
    description:
      "Requires maintaining a current inventory of all system components within the PCI DSS scope. Compliance is demonstrated by presenting the system component inventory.",
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
    title:
      "Is PCI DSS scope reviewed and validated at least annually and after significant changes?",
    description:
      "Requires reviewing and validating the PCI DSS scope boundary at least annually. Compliance is demonstrated by scope verification logs and network layout reviews.",
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
    title: "Is a formal security awareness program implemented for all personnel?",
    description:
      "Requires implementing a formal security awareness program for all workforce members. Compliance is demonstrated by the security training program curriculum.",
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
    title: "Is the security awareness program reviewed and updated at least annually?",
    description:
      "Requires reviewing and updating the security awareness program curriculum at least annually. Compliance is demonstrated by program update logs and review signatures.",
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
    title: "Do personnel receive security awareness training at hire and at least annually?",
    description:
      "Requires delivering security awareness training to all personnel upon hire and at least annually. Compliance is demonstrated by training logs and attendance sheets.",
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
    title: "Does security awareness training include phishing and social engineering threats?",
    description:
      "Requires including phishing and social engineering threat awareness in security training. Compliance is demonstrated by training course content reviews.",
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
    title: "Does security awareness training include acceptable use of end-user technologies?",
    description:
      "Requires incorporating acceptable use rules of technology into security training modules. Compliance is demonstrated by training content slides and test questions.",
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
    title:
      "Are personnel screened prior to hiring if they will have access to the cardholder data environment (CDE)?",
    description:
      "Requires screening personnel candidates prior to hire if they will have CDE access privileges. Compliance is demonstrated by completed background check files.",
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
    title:
      "Is a list maintained of all third-party service providers that access or impact cardholder data?",
    description:
      "Requires maintaining an accurate directory of all third-party service providers with cardholder data access. Compliance is demonstrated by vendor inventory logs.",
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
    title:
      "Are written agreements maintained with third-party service providers regarding protection of cardholder data?",
    description:
      "Requires maintaining written agreements with third-party providers regarding the safety of cardholder data. Compliance is demonstrated by active vendor service level contracts.",
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
    title: "Is a due diligence process implemented before engaging third-party service providers?",
    description:
      "Requires implementing a formal due diligence process before engaging new third-party service providers. Compliance is demonstrated by completed vendor assessments.",
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
    title:
      "Is the PCI DSS compliance status of third-party service providers monitored at least annually?",
    description:
      "Requires monitoring the PCI DSS compliance status of all active third-party providers at least annually. Compliance is demonstrated by vendor AOC certificates.",
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
    title:
      "Is documentation maintained showing which PCI DSS controls are handled by the entity and which by third-party providers?",
    description:
      "Requires documenting specific PCI DSS control responsibilities between the entity and third-party providers. Compliance is demonstrated by the control responsibility matrix.",
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
    title:
      "Is an incident response plan established to address security incidents affecting the CDE?",
    description:
      "Requires establishing an incident response plan to handle potential security events in the CDE. Compliance is demonstrated by the approved Incident Response Plan.",
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
    title: "Is the incident response plan reviewed and tested at least annually?",
    description:
      "Requires testing and reviewing the incident response plan at least annually. Compliance is demonstrated by tabletop test reports and post-test signatures.",
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
    title: "Are personnel available 24/7 to respond to security incidents?",
    description:
      "Requires having incident response personnel available 24/7 to address security incidents. Compliance is demonstrated by paging system alerts and on-call rosters.",
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
    title: "Are incident response personnel trained on their responsibilities?",
    description:
      "Requires providing specific training to all designated incident response personnel. Compliance is demonstrated by response training logs and certifications.",
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
    title: "Is the frequency of incident response training defined through risk analysis?",
    description:
      "Requires defining training frequencies for incident response personnel through risk analysis. Compliance is demonstrated by risk analysis records.",
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
    title:
      "Does the incident response plan include responding to alerts from security monitoring systems?",
    description:
      "Requires the incident response plan to include protocols for alerts generated by monitoring systems. Compliance is demonstrated by response playbook profiles.",
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
    title:
      "Is the incident response plan updated based on lessons learned and industry developments?",
    description:
      "Requires updating the incident response plan using lessons learned from prior tabletop tests or events. Compliance is demonstrated by post-mortem report stamps.",
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
    title:
      "Are procedures defined to respond if stored PAN is discovered outside the expected environment?",
    description:
      "Requires defining procedures to respond if stored PAN is located outside authorized environments. Compliance is demonstrated by data leakage incident playbooks.",
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
