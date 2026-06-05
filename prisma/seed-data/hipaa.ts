import type { SeedControl } from "./types";

export const hipaaControls: SeedControl[] = [
  {
    code: "HIPAA-S1-Q1",
    title: "Has your practice completed a security risk assessment (SRA) before?",
    description:
      "Requires executing and documenting a comprehensive security risk assessment to identify potential risks and vulnerabilities to ePHI. Compliance is demonstrated by producing the completed assessment report, identifying scope, methodology, and date of completion.",
    category: "Section 1 - SRA Basics",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(1)(ii)(A)",
      specification: "Required",
      section: "Section 1 - SRA Basics",
    },
  },
  {
    code: "HIPAA-S1-Q2",
    title: "Do you review and update your SRA?",
    description:
      "Requires conducting regular reviews and updates of the security risk assessment to address environmental or operational changes. Compliance is demonstrated by maintaining dated revision histories of the risk assessment report.",
    category: "Section 1 - SRA Basics",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(1)(ii)(A)",
      specification: "Required",
      section: "Section 1 - SRA Basics",
    },
  },
  {
    code: "HIPAA-S1-Q3",
    title: "How often do you review and update your SRA?",
    description:
      "Requires establishing a defined schedule, typically annual or in response to significant updates, for reviewing the security risk assessment. Compliance is demonstrated by policy documentation specifying the frequency and matching completed assessment records.",
    category: "Section 1 - SRA Basics",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(1)(ii)(A)",
      specification: "Required",
      section: "Section 1 - SRA Basics",
    },
  },
  {
    code: "HIPAA-S1-Q4",
    title:
      "Do you include all information systems containing, processing, and/or transmitting ePHI in your SRA?",
    description:
      "Requires identifying and cataloging all hardware, software, and network components that handle ePHI within the assessment scope. Compliance is demonstrated by presenting a system inventory cross-referenced with the security risk assessment.",
    category: "Section 1 - SRA Basics",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "N/A",
      specification: "N/A",
      section: "Section 1 - SRA Basics",
    },
  },
  {
    code: "HIPAA-S1-Q5",
    title:
      "How do you verify that that your security measures comply with current HIPAA requirements?",
    description:
      "Requires conducting periodic compliance audits or security gap analyses against the HIPAA Security Rule standards. Compliance is demonstrated by audit reports, gap analysis documentation, or certifications from third-party assessors.",
    category: "Section 1 - SRA Basics",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(1)(ii)(B)",
      specification: "Required",
      section: "Section 1 - SRA Basics",
    },
  },
  {
    code: "HIPAA-S1-Q6",
    title: "What do you include in your SRA documentation?",
    description:
      "Requires compiling risk analysis documentation containing identified threats, vulnerabilities, likelihood, impact, and current safeguards. Compliance is demonstrated by providing the structured risk analysis report and risk registry.",
    category: "Section 1 - SRA Basics",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(1)(ii)(A)",
      specification: "Required",
      section: "Section 1 - SRA Basics",
    },
  },
  {
    code: "HIPAA-S1-Q7",
    title: "Do you respond to the threats and vulnerabilities identified in your SRA?",
    description:
      "Requires executing risk mitigation procedures to address and remediate identified vulnerabilities. Compliance is demonstrated by tracking remediation status, action items, and completed security controls in a risk treatment plan.",
    category: "Section 1 - SRA Basics",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(1)(ii)(B)",
      specification: "Required",
      section: "Section 1 - SRA Basics",
    },
  },
  {
    code: "HIPAA-S1-Q8",
    title:
      "Do you identify specific personnel to respond to and mitigate the threats and vulnerabilities found in your SRA?",
    description:
      "Requires designating responsible individuals or teams for specific risk mitigation actions. Compliance is demonstrated by risk remediation plans or job descriptions assigning accountability for control implementation.",
    category: "Section 1 - SRA Basics",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(1)(ii)(B)",
      specification: "Required",
      section: "Section 1 - SRA Basics",
    },
  },
  {
    code: "HIPAA-S1-Q9",
    title:
      "Do you communicate SRA results to personnel involved in responding to threats or vulnerabilities?",
    description:
      "Requires sharing relevant security risk assessment findings with staff tasked with remediation. Compliance is demonstrated by meeting minutes, email notifications, or shared dashboards detailing tasks and findings.",
    category: "Section 1 - SRA Basics",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(1)(ii)(B)",
      specification: "Required",
      section: "Section 1 - SRA Basics",
    },
  },
  {
    code: "HIPAA-S1-Q10",
    title:
      "How do you communicate SRA results to personnel involved in responding to identified threats or vulnerabilities?",
    description:
      "Requires establishing formal communication channels for distributing risk mitigation responsibilities to relevant staff. Compliance is demonstrated by documented procedures, training records, or tracking logs of risk assessment dissemination.",
    category: "Section 1 - SRA Basics",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(1)(ii)(B)",
      specification: "Required",
      section: "Section 1 - SRA Basics",
    },
  },
  {
    code: "HIPAA-S2-Q1",
    title:
      "Do you maintain documentation of policies and procedures regarding risk assessment, risk management and information security activities?",
    description:
      "Requires establishing, documenting, and maintaining written policies and procedures for all HIPAA Security Rule requirements. Compliance is demonstrated by providing the active information security policy handbook and risk management procedures.",
    category: "Section 2 - Security Policies",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.316(a)",
      specification: "Required",
      section: "Section 2 - Security Policies",
    },
  },
  {
    code: "HIPAA-S2-Q2",
    title:
      "Do you review and update your security documentation, including policies and procedures?",
    description:
      "Requires reviewing and updating security policies and procedures at least annually or in response to significant operational changes. Compliance is demonstrated by documentation reviews with dated signatures or revision control logs.",
    category: "Section 2 - Security Policies",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.316(b)(2)(iii)",
      specification: "Required",
      section: "Section 2 - Security Policies",
    },
  },
  {
    code: "HIPAA-S2-Q3",
    title:
      "How do you update your security program documentation, including policies and procedures?",
    description:
      "Requires defining a formal process for updating and authorizing changes to security documentation. Compliance is demonstrated by change management logs, draft reviews, and official policy approval records.",
    category: "Section 2 - Security Policies",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.316(b)(2)(iii)",
      specification: "Required",
      section: "Section 2 - Security Policies",
    },
  },
  {
    code: "HIPAA-S2-Q4",
    title: "Is the security officer involved in all security policy and procedure updates?",
    description:
      "Requires the designated Security Officer to review, approve, and sign off on all updates to security policies and procedures. Compliance is demonstrated by change logs and policy signature blocks bearing the Security Officer's approval.",
    category: "Section 2 - Security Policies",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.316(b)(2)(iii)",
      specification: "Required",
      section: "Section 2 - Security Policies",
    },
  },
  {
    code: "HIPAA-S2-Q5",
    title:
      "How does documentation for your risk management and security procedures compare to your actual business practices?",
    description:
      "Requires aligning operational workflows with written policies to ensure security practices are accurately documented. Compliance is demonstrated by internal audit results or gap assessments showing consistency between written procedures and daily operations.",
    category: "Section 2 - Security Policies",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.316(b)(1)(i) & (ii)",
      specification: "Required",
      section: "Section 2 - Security Policies",
    },
  },
  {
    code: "HIPAA-S2-Q6",
    title: "How long are information security management and risk management documents kept?",
    description:
      "Requires retaining all security policies, risk assessments, and action records for a minimum of six years from their creation or date last in effect. Compliance is demonstrated by document retention schedules and archived records.",
    category: "Section 2 - Security Policies",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.316(b)(2)(i)",
      specification: "Required",
      section: "Section 2 - Security Policies",
    },
  },
  {
    code: "HIPAA-S2-Q7",
    title:
      "Do you make sure that information security and risk management documentation is available to those who need it?",
    description:
      "Requires ensuring that active security policies and procedures are accessible to workforce members responsible for implementing them. Compliance is demonstrated by publishing policies on an intranet, shared drive, or document management system.",
    category: "Section 2 - Security Policies",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.316(b)(2)(ii)",
      specification: "Required",
      section: "Section 2 - Security Policies",
    },
  },
  {
    code: "HIPAA-S2-Q8",
    title:
      "How do you ensure security and risk management documentation is available to those who need it?",
    description:
      "Requires establishing secure distribution channels or training programs that provide personnel with access to relevant security procedures. Compliance is demonstrated by distribution lists, access control logs for policy repositories, or employee acknowledgments.",
    category: "Section 2 - Security Policies",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.316(b)(2)(ii)",
      specification: "Required",
      section: "Section 2 - Security Policies",
    },
  },
  {
    code: "HIPAA-S3-Q1",
    title:
      "Who within your practice is responsible for developing and implementing information security policies and procedures?",
    description:
      "Requires formally appointing a security official responsible for the development and implementation of security policies. Compliance is demonstrated by official appointment letters, job descriptions, or organizational charts designating the Security Officer.",
    category: "Section 3 - Security & Workforce",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(2)",
      specification: "Required",
      section: "Section 3 - Security & Workforce",
    },
  },
  {
    code: "HIPAA-S3-Q2",
    title: "Do you identify and document the role and responsibilities of the security officer?",
    description:
      "Requires documenting the scope of authority, duties, and responsibilities of the appointed Security Officer. Compliance is demonstrated by a signed job description, corporate charter, or policy document outlining these responsibilities.",
    category: "Section 3 - Security & Workforce",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(2)",
      specification: "Required",
      section: "Section 3 - Security & Workforce",
    },
  },
  {
    code: "HIPAA-S3-Q3",
    title: "Is your security officer qualified for the position?",
    description:
      "Requires verifying that the appointed Security Officer possesses the appropriate training, experience, or certifications. Compliance is demonstrated by training certificates, resumes, or professional credentials on file.",
    category: "Section 3 - Security & Workforce",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(2)",
      specification: "Required",
      section: "Section 3 - Security & Workforce",
    },
  },
  {
    code: "HIPAA-S3-Q4",
    title: "Do workforce members know who the security officer is?",
    description:
      "Requires communicating the identity of the Security Officer to all members of the workforce. Compliance is demonstrated by organization-wide email announcements, newsletter posts, or inclusion of the contact info in onboarding training.",
    category: "Section 3 - Security & Workforce",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(2)",
      specification: "Required",
      section: "Section 3 - Security & Workforce",
    },
  },
  {
    code: "HIPAA-S3-Q5",
    title: "Do workforce members know how and when to contact the security officer?",
    description:
      "Requires instructing employees on the procedures and thresholds for contacting the Security Officer regarding incidents or concerns. Compliance is demonstrated by training materials, reporting hotlines, or documented incident reporting procedures.",
    category: "Section 3 - Security & Workforce",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(2)",
      specification: "Required",
      section: "Section 3 - Security & Workforce",
    },
  },
  {
    code: "HIPAA-S3-Q6",
    title:
      "Who do people contact for security considerations if there is no security officer available or identified within the organization?",
    description:
      "Requires designating a backup contact or escalation path for security matters when the primary Security Officer is unavailable. Compliance is demonstrated by documented escalation procedures or designated backup personnel assignments.",
    category: "Section 3 - Security & Workforce",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "N/A",
      specification: "N/A",
      section: "Section 3 - Security & Workforce",
    },
  },
  {
    code: "HIPAA-S3-Q7",
    title: "How are staff roles and job duties defined with respect to ePHI access?",
    description:
      "Requires defining and documenting access levels to ePHI based on job duties, applying the principle of least privilege. Compliance is demonstrated by role-based access matrices, job descriptions, or access configuration templates.",
    category: "Section 3 - Security & Workforce",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(3)(ii)(A)",
      specification: "Required",
      section: "Section 3 - Security & Workforce",
    },
  },
  {
    code: "HIPAA-S3-Q8",
    title:
      "Do you screen your workforce members (e.g., staff, volunteers, interns) with tools like credential verification or background checks to verify trustworthiness?",
    description:
      "Requires implementing screening procedures for workforce members with potential access to ePHI. Compliance is demonstrated by background check logs, credential verification records, or HR policies mandating pre-employment screening.",
    category: "Section 3 - Security & Workforce",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.308(a)(3)(ii)(B)",
      specification: "Addressable",
      section: "Section 3 - Security & Workforce",
    },
  },
  {
    code: "HIPAA-S3-Q9",
    title: "How are your workforce members screened to verify trustworthiness?",
    description:
      "Requires establishing and documenting standard background check, reference check, and verification workflows for all new hires and contractors. Compliance is demonstrated by written HR screening protocols and completed candidate files.",
    category: "Section 3 - Security & Workforce",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.308(a)(3)(ii)(B)",
      specification: "Addressable",
      section: "Section 3 - Security & Workforce",
    },
  },
  {
    code: "HIPAA-S3-Q10",
    title:
      "Do you ensure that all workforce members (including management) are given security training?",
    description:
      "Requires establishing a mandatory security awareness training program for all members of the workforce. Compliance is demonstrated by maintaining records of training completion, sign-in sheets, or digital training portal transcripts.",
    category: "Section 3 - Security & Workforce",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(5)(i)",
      specification: "Required",
      section: "Section 3 - Security & Workforce",
    },
  },
  {
    code: "HIPAA-S3-Q11",
    title: "How do you ensure that all workforce members are given security training?",
    description:
      "Requires implementing a tracking and enforcement mechanism for security training onboarding and periodic updates. Compliance is demonstrated by training tracker logs, automatic email reminders, or onboarding policies containing training prerequisites.",
    category: "Section 3 - Security & Workforce",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(5)(i)",
      specification: "Required",
      section: "Section 3 - Security & Workforce",
    },
  },
  {
    code: "HIPAA-S3-Q12",
    title: "How long are records of workforce member security training kept?",
    description:
      "Requires retaining documentation of security training completions for at least six years. Compliance is demonstrated by training archives or digital LMS history logs conforming to document retention requirements.",
    category: "Section 3 - Security & Workforce",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(5)(i)",
      specification: "Required",
      section: "Section 3 - Security & Workforce",
    },
  },
  {
    code: "HIPAA-S3-Q13",
    title: "Are procedures in place for monitoring log-in attempts and reporting discrepancies?",
    description:
      "Requires establishing procedures to monitor login attempts, flag multiple failed attempts, and investigate discrepancies. Compliance is demonstrated by system configuration screenshots showing lockout thresholds or audit log analysis reports.",
    category: "Section 3 - Security & Workforce",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.308(a)(5)(ii)(C)",
      specification: "Addressable",
      section: "Section 3 - Security & Workforce",
    },
  },
  {
    code: "HIPAA-S3-Q14",
    title: "Is up-to-date malware protection included in your policies and procedures?",
    description:
      "Requires enacting policies that mandate the installation, automatic updating, and continuous operation of anti-malware software on systems accessing ePHI. Compliance is demonstrated by endpoint management dashboards and security policies.",
    category: "Section 3 - Security & Workforce",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.308(a)(5)(ii)(B)",
      specification: "Addressable",
      section: "Section 3 - Security & Workforce",
    },
  },
  {
    code: "HIPAA-S3-Q15",
    title: "What password security elements are covered in your security training?",
    description:
      "Requires educating workforce members on strong password creation, storage, and management practices. Compliance is demonstrated by training materials covering complexity, expiration, and multi-factor authentication instructions.",
    category: "Section 3 - Security & Workforce",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.308(a)(5)(ii)(D)",
      specification: "Addressable",
      section: "Section 3 - Security & Workforce",
    },
  },
  {
    code: "HIPAA-S3-Q16",
    title: "Do you ensure workforce members maintain ongoing awareness of security requirements?",
    description:
      "Requires conducting ongoing security awareness campaigns or periodic refreshers after initial training. Compliance is demonstrated by security newsletter archives, phishing simulation results, or records of periodic security updates.",
    category: "Section 3 - Security & Workforce",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.308(a)(5)(ii)(A)",
      specification: "Addressable",
      section: "Section 3 - Security & Workforce",
    },
  },
  {
    code: "HIPAA-S3-Q17",
    title:
      "How does your practice ensure workforce members maintain ongoing awareness of security requirements?",
    description:
      "Requires implementing scheduled communication methods, such as monthly bulletins or mock-phishing campaigns, to reinforce security principles. Compliance is demonstrated by schedule lists and evidence of communication distribution.",
    category: "Section 3 - Security & Workforce",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.308(a)(5)(ii)(A)",
      specification: "Addressable",
      section: "Section 3 - Security & Workforce",
    },
  },
  {
    code: "HIPAA-S3-Q18",
    title: "Do you have a sanction policy to enforce security procedures?",
    description:
      "Requires establishing and documenting a formal sanction policy outlining disciplinary actions for workforce members who violate security policies. Compliance is demonstrated by presenting the written sanction policy.",
    category: "Section 3 - Security & Workforce",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(1)(ii)(C)",
      specification: "Required",
      section: "Section 3 - Security & Workforce",
    },
  },
  {
    code: "HIPAA-S3-Q19",
    title:
      "What is included in your sanction policy to hold personnel accountable if they do not follow your security policies and procedures?",
    description:
      "Requires specifying progressive disciplinary measures within the sanction policy, ranging from retraining to termination based on severity. Compliance is demonstrated by employee handbooks and HR files showing application of sanctions.",
    category: "Section 3 - Security & Workforce",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(1)(ii)(C)",
      specification: "Required",
      section: "Section 3 - Security & Workforce",
    },
  },
  {
    code: "HIPAA-S4-Q1",
    title: "Do you manage and control personnel access to ePHI, systems, and facilities?",
    description:
      "Requires establishing access control mechanisms to limit ePHI access to authorized personnel, systems, and physical locations. Compliance is demonstrated by access control policies, facility logs, and user privilege matrices.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(3)(i)",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q2",
    title: "How do you manage and control personnel access to ePHI, systems, and facilities?",
    description:
      "Requires implementing technological safeguards, such as Active Directory groups, and physical safeguards, such as badge readers, to enforce access limits. Compliance is demonstrated by system configurations and physical security architecture records.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(3)(i)",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q3",
    title: "What is your process for authorizing, establishing, and modifying access to ePHI?",
    description:
      "Requires maintaining a documented workflow for requesting, approving, provisioning, and modifying user access privileges. Compliance is demonstrated by access request forms, manager sign-offs, and ticket system logs.",
    category: "Section 4 - Security & Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.308(a)(4)(ii)(B) §164.308(a)(4)(ii)(C )",
      specification: "Addressable",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q4",
    title: "How much access to ePHI is granted to users or other entities?",
    description:
      "Requires limiting user access to the minimum necessary ePHI required to perform their specific job functions. Compliance is demonstrated by user account access reviews and role-based permissions layouts.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.502(b)",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q5",
    title: "How are individual users identified when accessing ePHI?",
    description:
      "Requires assigning a unique user identifier (e.g., username or badge number) to each workforce member to track activity. Compliance is demonstrated by system user lists proving no shared accounts are used.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.312(a)(2)(i)",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q6",
    title: "Do you ensure all of your workforce members have appropriate access to ePHI?",
    description:
      "Requires implementing regular validation checks to ensure that user access permissions remain appropriate over time. Compliance is demonstrated by quarterly or annual user access certification reports signed by department heads.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(3)(i)",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q7",
    title:
      "How do you make sure that your workforce's designated access to ePHI is logical, consistent, and appropriate?",
    description:
      "Requires defining access levels aligned directly with documented job roles and auditing accounts for alignment. Compliance is demonstrated by an access control matrix mapping roles to system permissions and matching user records.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(3)(i)",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q8",
    title: "Do you use encryption everywhere ePHI is stored throughout your organization?",
    description:
      "Requires encrypting ePHI stored on all organizational assets, including servers, workstations, and mobile devices, or documenting alternative safeguards. Compliance is demonstrated by configuration settings showing active full disk encryption.",
    category: "Section 4 - Security & Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.312(a)(2)(iv)",
      specification: "Addressable",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q9",
    title:
      "What procedures do you have in place to encrypt ePHI when deemed reasonable and appropriate?",
    description:
      "Requires documenting cryptographic guidelines, algorithms, and key management procedures for encrypting data at rest and in transit. Compliance is demonstrated by presenting written encryption policies and key management plans.",
    category: "Section 4 - Security & Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.312(e)(2)(ii)",
      specification: "Addressable",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q10",
    title: "Do you use alternative safeguards in place of encryption?",
    description:
      "Requires conducting a formal risk analysis to justify and document equivalent alternative safeguards when encryption is not implemented. Compliance is demonstrated by presenting documented risk assessments and compensatory control designs.",
    category: "Section 4 - Security & Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "N/A",
      specification: "Addressable",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q11",
    title:
      "When encryption is deemed unreasonable or inappropriate to implement, do you document the use of an alternative safeguard?",
    description:
      "Requires formal documentation containing the rationale for not using encryption and a description of the implemented alternative safeguard. Compliance is demonstrated by signed exception forms and risk analysis records.",
    category: "Section 4 - Security & Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "N/A",
      specification: "Addressable",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q12",
    title:
      "Have you evaluated implementing any of the following encryption solutions in your local environment to protect ePHI: full disk encryption, file/folder/volume encryption, database encryption, encryption of thumb drives or other external media (including backup media)?",
    description:
      "Requires conducting a technical assessment of local storage systems and media to determine appropriate encryption locations. Compliance is demonstrated by an encryption evaluation report or security architecture assessment.",
    category: "Section 4 - Security & Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.312(e)(2)(ii)",
      specification: "Addressable",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q13",
    title:
      "Have you evaluated implementing encryption solutions for any of the following cloud services to protect ePHI: email service, file storage, web applications, databases, remote system backups?",
    description:
      "Requires assessing cloud service providers' encryption options for protecting stored ePHI and key control configurations. Compliance is demonstrated by service level agreements, vendor questionnaires, or cloud configuration reports.",
    category: "Section 4 - Security & Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.312(e)(2)(ii)",
      specification: "Addressable",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q14",
    title:
      "Have you evaluated implementing any of the following encryption solutions for ePHI in transit: encryption of internet traffic by means of a VPN, web traffic over HTTP encrypted using Transport Layer Security (TLS), or secure file transfer?",
    description:
      "Requires assessing mechanisms for securing ePHI during electronic transmission across public networks. Compliance is demonstrated by network architecture diagrams, SSL/TLS configuration reports, and VPN client standards.",
    category: "Section 4 - Security & Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.312(e)(2)(ii)",
      specification: "Addressable",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q15",
    title:
      "Do you periodically review your information systems for how security settings can be implemented to safeguard ePHI?",
    description:
      "Requires performing regular reviews of system baseline configurations and hardening standards to ensure ePHI protections are optimized. Compliance is demonstrated by system hardening policies and completed configuration audit logs.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.312(a)(1)",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q16",
    title:
      "How are you aware of the security settings for information systems which process, store, or transmit ePHI?",
    description:
      "Requires maintaining central registry and documentation of baseline security configurations for all systems handling ePHI. Compliance is demonstrated by system configuration databases, security profiles, and administrator guides.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.312(a)(1)",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q17",
    title:
      "Do you use security settings and mechanisms to record and examine information system activity?",
    description:
      "Requires enabling audit logging options on systems containing or transmitting ePHI. Compliance is demonstrated by system settings showing active audit trails for access, modifications, and security events.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.312(b)",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q18",
    title: "What mechanisms are in place to monitor or log system activity?",
    description:
      "Requires employing logging infrastructure, such as centralized SIEM or syslog servers, to aggregate and analyze system logs. Compliance is demonstrated by SIEM configuration files, log collection charts, and vendor contracts.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.312(b)",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q19",
    title: "How do you monitor or track ePHI system activity?",
    description:
      "Requires performing regular reviews of audit logs to identify anomalies or unauthorized access attempts. Compliance is demonstrated by scheduled log review reports, administrator sign-offs, and documented review protocols.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(1)(ii)(D)",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q20",
    title: "Do you have automatic logoff enabled on devices and platforms accessing ePHI?",
    description:
      "Requires configuring systems to automatically log off or lock after a set period of inactivity. Compliance is demonstrated by group policy objects or system screens indicating timeout limits.",
    category: "Section 4 - Security & Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.312(a)(2)(iii)",
      specification: "Addressable",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q21",
    title: "Do you ensure users accessing ePHI are who they claim to be?",
    description:
      "Requires implementing identity verification mechanisms for all users accessing systems containing ePHI. Compliance is demonstrated by multi-factor authentication (MFA) setup or identity provider configuration pages.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.312(d)",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q22",
    title: "How do you ensure users accessing ePHI are who they claim to be?",
    description:
      "Requires configuring specific authentication controls, such as passwords combined with MFA tokens or biometric checks, for system entry. Compliance is demonstrated by authentication policy files and access logs showing MFA prompts.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.312(d)",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q23",
    title: "How do you determine the means by which ePHI is accessed?",
    description:
      "Requires analyzing and documenting the protocols, devices, and network paths used to access ePHI. Compliance is demonstrated by network maps, access logs capturing client details, and API integration specifications.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.312(d)",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q24",
    title: "Do you protect ePHI from unauthorized modification or destruction?",
    description:
      "Requires implementing data integrity controls to protect ePHI from unauthorized modification or destruction. Compliance is demonstrated by configuring digital signatures, file checksums, or database constraint checks.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.312(c)(1)",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q25",
    title: "How do you confirm that ePHI has not been modified or destroyed without authorization?",
    description:
      "Requires utilizing system mechanisms to verify that ePHI has not been altered or destroyed. Compliance is demonstrated by configuring file integrity monitoring (FIM) tools or database transaction logs and reviewing them regularly.",
    category: "Section 4 - Security & Data",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.312(c)(2)",
      specification: "Addressable",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q26",
    title:
      "Do you protect against unauthorized access to or modification of ePHI when it is being transmitted electronically?",
    description:
      "Requires employing guardrails to secure ePHI against unauthorized access or modification during electronic transmission. Compliance is demonstrated by deploying end-to-end encryption protocols like HTTPS, TLS, or SFTP.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.312(e)(1)",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q27",
    title:
      "Have you implemented mechanisms to record activity on information systems that create or use ePHI?",
    description:
      "Requires enabling audit logging mechanisms on all systems processing ePHI to record user creation and modification events. Compliance is demonstrated by audit policy configurations and samples of database or application audit logs.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.312(b)",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q28",
    title:
      "Does the organization stay up to date or informed (e.g., cybersecurity listserv monitoring) on emerging threats and vulnerabilities that may affect information systems?",
    description:
      "Requires establishing subscription channels to track newly discovered vulnerabilities and threats. Compliance is demonstrated by subscription confirmations, threat intelligence feeds, or meeting records showing threat review.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "N/A",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q29",
    title:
      "Is there a process in place to identify and evaluate information systems for potential emerging technical vulnerabilities and how the exposure could affect systems that contain ePHI?",
    description:
      "Requires implementing vulnerability scanning and assessment procedures to detect weaknesses in ePHI systems. Compliance is demonstrated by scan schedules, vulnerability reports, and risk evaluations of findings.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "N/A",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S4-Q30",
    title:
      "If new threats or vulnerabilities are identified through regular scanning, what is done to mitigate and respond to them?",
    description:
      "Requires maintaining a remediation process to patch or mitigate newly identified vulnerabilities within specified timelines. Compliance is demonstrated by change tickets, patching logs, and follow-up scanning verifying remediation.",
    category: "Section 4 - Security & Data",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "N/A",
      specification: "Required",
      section: "Section 4 - Security & Data",
    },
  },
  {
    code: "HIPAA-S5-Q1",
    title:
      "Do you manage access to and use of your facility or facilities (i.e., that house information systems and ePHI)?",
    description:
      "Requires defining physical boundaries and establishing controls to restrict access to facilities containing ePHI. Compliance is demonstrated by physical security policies, keycard system logs, or locked door verification.",
    category: "Section 5 - Security and the Practice",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.310(a)(1)",
      specification: "Required",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q2",
    title: "What physical protections do you have in place to manage facility security risks?",
    description:
      "Requires implementing physical safeguards such as alarms, cameras, and biometric locks to protect facilities housing ePHI. Compliance is demonstrated by physical security floor plans, camera coverage maps, and maintenance logs.",
    category: "Section 5 - Security and the Practice",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.310(a)(2)(ii)",
      specification: "Addressable",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q3",
    title:
      "Do you restrict physical access to and use of your equipment (i.e., equipment that house ePHI)?",
    description:
      "Requires implementing physical barriers or hardware controls to prevent unauthorized access to server rooms or workstation terminals. Compliance is demonstrated by locking server cages, server rack keys, and workstation terminal logs.",
    category: "Section 5 - Security and the Practice",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.310(a)(1)",
      specification: "Required",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q4",
    title: "Do you manage workforce member, visitor, and third-party access to electronic devices?",
    description:
      "Requires establishing and implementing policies to regulate device access for employees, contractors, and visitors. Compliance is demonstrated by guest access agreements, visitor logs, and workstation security settings.",
    category: "Section 5 - Security and the Practice",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.310(b)",
      specification: "Required",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q5",
    title:
      "Do you have physical protections in place, such as cable locks for portable laptops, screen filters for screens visible in high traffic areas, to manage electronic device security risks?",
    description:
      "Requires deploying secondary physical protections on mobile devices and workstations visible to the public. Compliance is demonstrated by equipment inspection logs showing installed cable locks and screen privacy filters.",
    category: "Section 5 - Security and the Practice",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.310(c)",
      specification: "Required",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q6",
    title:
      "What physical protections do you have in place for electronic devices with access to ePHI?",
    description:
      "Requires identifying all devices containing ePHI and applying appropriate physical locks or environmental protections. Compliance is demonstrated by asset lists with documented physical safeguards and inspection audit records.",
    category: "Section 5 - Security and the Practice",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.310(c)",
      specification: "Required",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q7",
    title: "Do you keep an inventory and a location record of all electronic devices?",
    description:
      "Requires maintaining a comprehensive device inventory that tracks hardware models, serial numbers, and physical or owner assignments. Compliance is demonstrated by the active asset inventory database.",
    category: "Section 5 - Security and the Practice",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.310(b)",
      specification: "Required",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q8",
    title:
      "Do you have an authorized user who approves access levels within information systems and locations that use ePHI?",
    description:
      "Requires designating a role responsible for reviewing and approving all user access levels and permissions. Compliance is demonstrated by access authorization matrices and approval records signed by the designated authority.",
    category: "Section 5 - Security and the Practice",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.308(a)(3)(ii)(A)",
      specification: "Addressable",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q9",
    title:
      "Do you validate a person's access to facilities (including workforce members and visitors) based on their role or function?",
    description:
      "Requires verifying identity and role permissions before allowing access to restricted facility zones. Compliance is demonstrated by badge authorization profiles and facility access logs showing validation.",
    category: "Section 5 - Security and the Practice",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.310(a)(2)(iii)",
      specification: "Addressable",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q10",
    title: "How do you validate a person's access to your facility?",
    description:
      "Requires utilizing formal validation mechanisms, such as photo ID checks or electronic badge readers, at facility entry points. Compliance is demonstrated by security check-in protocols and hardware control specifications.",
    category: "Section 5 - Security and the Practice",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.310(a)(2)(iii)",
      specification: "Addressable",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q11",
    title:
      "Do you have access validation requirements for personnel and visitors seeking access to your critical systems (such as IT/OT, software developers, or network admins)?",
    description:
      "Requires establishing specialized authentication and validation checks for individuals accessing critical system areas or networks. Compliance is demonstrated by developer onboarding checklists and administrator access approvals.",
    category: "Section 5 - Security and the Practice",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.310(a)(2)(iii)",
      specification: "Addressable",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q12",
    title:
      "Does this include controlling access to your software programs for testing and revisions?",
    description:
      "Requires restricting access to test environments and source code repositories containing or simulating ePHI data. Compliance is demonstrated by version control access lists and software development pipeline security settings.",
    category: "Section 5 - Security and the Practice",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.310(a)(2)(iii)",
      specification: "Addressable",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q13",
    title:
      "Do you have procedures for validating a third-party person's access to the facility based on their role or function?",
    description:
      "Requires defining verification procedures for vendors, auditors, and other third parties requesting facility access. Compliance is demonstrated by third-party access agreements, pre-registration logs, and visitor escort logs.",
    category: "Section 5 - Security and the Practice",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.310(a)(2)(iii)",
      specification: "Addressable",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q14",
    title:
      "Do you have hardware, software, or other mechanisms that record and examine activity on information systems with access to ePHI?",
    description:
      "Requires employing auditing mechanisms on hardware and software systems to track access, updates, and exports of ePHI. Compliance is demonstrated by system configurations showing enabled event logging.",
    category: "Section 5 - Security and the Practice",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.312(b)",
      specification: "Required",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q15",
    title:
      "What requirements, mechanisms, or controls are in place for retention of audit reports?",
    description:
      "Requires establishing retention rules for system logs and audit reports to ensure availability for at least six years. Compliance is demonstrated by storage retention configurations, log archiving systems, and written policies.",
    category: "Section 5 - Security and the Practice",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.312(b)",
      specification: "Required",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q16",
    title:
      "Do you maintain records of physical changes upgrades, and modifications to your facility?",
    description:
      "Requires documenting structural or layout modifications made to facilities that affect the security of systems housing ePHI. Compliance is demonstrated by facility change management logs, blueprints, and building permits.",
    category: "Section 5 - Security and the Practice",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.310(a)(2)(iv)",
      specification: "Addressable",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q17",
    title: "How do you maintain awareness of the movement of electronic devices and media?",
    description:
      "Requires tracking the transit, transport, and assignment changes of mobile devices and storage media. Compliance is demonstrated by signed custody forms, device tracking databases, and asset checkout logs.",
    category: "Section 5 - Security and the Practice",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.310(d)(2)(iii)",
      specification: "Addressable",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q18",
    title: "Do you back up ePHI to ensure availability when devices are moved?",
    description:
      "Requires verifying that a complete copy of ePHI is safely backed up before moving any physical server or workstation. Compliance is demonstrated by backup logs, movement authorizations, and verified restore reports.",
    category: "Section 5 - Security and the Practice",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.310(d)(2)(iv)",
      specification: "Addressable",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q19",
    title:
      "Do you ensure devices which created, maintained, received, or transmitted ePHI are effectively sanitized when they are disposed of?",
    description:
      "Requires sanitizing or destroying storage media containing ePHI prior to final disposal or recycling. Compliance is demonstrated by device destruction certificates and sanitization log records.",
    category: "Section 5 - Security and the Practice",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.310(d)(1)",
      specification: "Required",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q20",
    title:
      "How do you determine what is considered appropriate use of electronic devices and connected network devices?",
    description:
      "Requires establishing policies that define acceptable use rules for company workstations, laptops, and networks. Compliance is demonstrated by an Acceptable Use Policy signed by all employees during onboarding.",
    category: "Section 5 - Security and the Practice",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.310(b)",
      specification: "Required",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q21",
    title:
      "Do you ensure access to ePHI is terminated when employment or other arrangements with the workforce member ends?",
    description:
      "Requires disabling all logical and physical access credentials immediately upon employee termination. Compliance is demonstrated by termination checklists, ticket closures, and deactivated account histories.",
    category: "Section 5 - Security and the Practice",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.308(a)(3)(ii)(C)",
      specification: "Addressable",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q22",
    title:
      "Do you have procedures for terminating or changing third-party access across your organization when the contract, business associate agreement, or other arrangement with the third party ends or is changed?",
    description:
      "Requires executing structured deprovisioning workflows for contractor and vendor access when business arrangements conclude. Compliance is demonstrated by vendor offboarding checklists and log history showing account closures.",
    category: "Section 5 - Security and the Practice",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.308(a)(3)(ii)(C)",
      specification: "Addressable",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S5-Q23",
    title: "How do you ensure media is sanitized prior to re-use?",
    description:
      "Requires performing cryptographic erasure or secure formatting on storage drives before reallocation to other internal users. Compliance is demonstrated by sanitization tools screenshots and completed reuse logs.",
    category: "Section 5 - Security and the Practice",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.310(d)(2)(ii)",
      specification: "Required",
      section: "Section 5 - Security and the Practice",
    },
  },
  {
    code: "HIPAA-S6-Q1",
    title: "Do you contract with business associates or other third-party vendors?",
    description:
      "Requires identifying all contractors and vendors who create, receive, maintain, or transmit ePHI on behalf of the organization. Compliance is demonstrated by maintaining a vendor catalog and contract database.",
    category: "Section 6 - Security and Business Associates",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "N/A",
      specification: "Required",
      section: "Section 6 - Security and Business Associates",
    },
  },
  {
    code: "HIPAA-S6-Q2",
    title: "Do you allow third-party vendors to access your information systems and/or ePHI?",
    description:
      "Requires controlling and approving external connections from third-party vendors to systems housing ePHI. Compliance is demonstrated by vendor connection approval forms and firewall or VPN configuration access lists.",
    category: "Section 6 - Security and Business Associates",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "N/A",
      specification: "Required",
      section: "Section 6 - Security and Business Associates",
    },
  },
  {
    code: "HIPAA-S6-Q3",
    title:
      "How do you identify which third-party vendors are business associates and need to create, receive, maintain, or transmit ePHI?",
    description:
      "Requires performing a data flow assessment on all vendors to classify those meeting the legal definition of a Business Associate. Compliance is demonstrated by vendor classification records and risk assessment reports.",
    category: "Section 6 - Security and Business Associates",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(b)(1)",
      specification: "Required",
      section: "Section 6 - Security and Business Associates",
    },
  },
  {
    code: "HIPAA-S6-Q4",
    title:
      "How does your practice enforce or monitor access for each of these business associates?",
    description:
      "Requires auditing and tracking the access paths used by Business Associates to connect to corporate networks. Compliance is demonstrated by third-party access audit logs, account lockout policies, and session logs.",
    category: "Section 6 - Security and Business Associates",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(b)(1)",
      specification: "Required",
      section: "Section 6 - Security and Business Associates",
    },
  },
  {
    code: "HIPAA-S6-Q5",
    title:
      "How do business associates communicate important changes in security practices, personnel, etc. to you?",
    description:
      "Requires establishing contractual requirements for Business Associates to notify the organization of security updates or staff changes. Compliance is demonstrated by communication protocols in BAAs and historical email notifications.",
    category: "Section 6 - Security and Business Associates",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "N/A",
      specification: "Required",
      section: "Section 6 - Security and Business Associates",
    },
  },
  {
    code: "HIPAA-S6-Q6",
    title:
      "Have you executed business associate agreements with all business associates who create, receive, maintain, or transmit ePHI on your behalf?",
    description:
      "Requires entering into formal Business Associate Agreements (BAAs) prior to sharing any ePHI. Compliance is demonstrated by presenting signed and dated BAA documents for all classified vendors.",
    category: "Section 6 - Security and Business Associates",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(b)(3)",
      specification: "Required",
      section: "Section 6 - Security and Business Associates",
    },
  },
  {
    code: "HIPAA-S6-Q7",
    title:
      "How do you maintain awareness of business associate security practices (i.e., in addition to Business Associate Agreements)?",
    description:
      "Requires conducting periodic risk assessments or security reviews of Business Associate environments. Compliance is demonstrated by completed vendor security questionnaires, SOC 2 report reviews, or audit notes.",
    category: "Section 6 - Security and Business Associates",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "N/A",
      specification: "Required",
      section: "Section 6 - Security and Business Associates",
    },
  },
  {
    code: "HIPAA-S6-Q8",
    title:
      "Do you include satisfactory assurances within your Business Associate Agreements pertaining to how your business associates safeguard ePHI?",
    description:
      "Requires ensuring all BAAs contain standard clauses mandating the implementation of administrative, physical, and technical safeguards. Compliance is demonstrated by verifying standard BAA template terms.",
    category: "Section 6 - Security and Business Associates",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.314(a)(1)(i)",
      specification: "Required",
      section: "Section 6 - Security and Business Associates",
    },
  },
  {
    code: "HIPAA-S6-Q9",
    title:
      "What terms are in your BAAs to outline how your business associates ensure subcontractors access ePHI securely?",
    description:
      "Requires including provisions in BAAs that bind the Business Associate's subcontractors to the same security restrictions. Compliance is demonstrated by subcontractor disclosure clauses in executed BAAs.",
    category: "Section 6 - Security and Business Associates",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.314(a)(2)(iii)",
      specification: "Required",
      section: "Section 6 - Security and Business Associates",
    },
  },
  {
    code: "HIPAA-S6-Q10",
    title:
      "Do your BAAs require your third-party vendors to report security incidents to your practice in a timely manner?",
    description:
      "Requires BAAs to explicitly require vendors to report security incidents and data breaches within a specified timeline. Compliance is demonstrated by checking breach notification SLA terms in BAAs.",
    category: "Section 6 - Security and Business Associates",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.314(a)(2)(i)( c)",
      specification: "Required",
      section: "Section 6 - Security and Business Associates",
    },
  },
  {
    code: "HIPAA-S6-Q11",
    title:
      "Have you updated all your BAAs to reflect the requirements in the 2013 Omnibus Rule updates to HIPAA?",
    description:
      "Requires verifying that all executed BAAs are legally compliant with 2013 Omnibus Rule requirements. Compliance is demonstrated by reviewing the signature date or presence of Omnibus update addenda.",
    category: "Section 6 - Security and Business Associates",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.314(a)(1)",
      specification: "Required",
      section: "Section 6 - Security and Business Associates",
    },
  },
  {
    code: "HIPAA-S6-Q12",
    title:
      "How does your practice document all of its business associates requiring access to ePHI?",
    description:
      "Requires maintaining a centralized, live register of all Business Associates with links to their respective agreements. Compliance is demonstrated by the Business Associate tracking register.",
    category: "Section 6 - Security and Business Associates",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(b)(1)",
      specification: "Required",
      section: "Section 6 - Security and Business Associates",
    },
  },
  {
    code: "HIPAA-S6-Q13",
    title:
      "Do you obtain Business Associate Agreements (BAAs) from business associates who access another covered entity's ePHI on your behalf?",
    description:
      "Requires executing downstream BAAs whenever the organization acts as a Business Associate and passes ePHI to subcontractors. Compliance is demonstrated by presenting executed downstream contracts.",
    category: "Section 6 - Security and Business Associates",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(b)(2)",
      specification: "Required",
      section: "Section 6 - Security and Business Associates",
    },
  },
  {
    code: "HIPAA-S6-Q14",
    title:
      "Does the organization require business associates and third-party vendors to implement security requirements more stringent than required in the HIPAA Rules?",
    description:
      "Requires assessing vendor risk profiles and drafting custom contract terms to enforce additional protection requirements. Compliance is demonstrated by signed vendor contracts containing specialized security annexes.",
    category: "Section 6 - Security and Business Associates",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "N/A",
      specification: "N/A",
      section: "Section 6 - Security and Business Associates",
    },
  },
  {
    code: "HIPAA-S6-Q15",
    title:
      "How do you track and verify business associate and third-party vendor compliance to security policies and where are these policies documented?",
    description:
      "Requires establishing a regular vendor auditing schedule to confirm policy adherence. Compliance is demonstrated by third-party audit reports and documented vendor oversight policies.",
    category: "Section 6 - Security and Business Associates",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "N/A",
      specification: "N/A",
      section: "Section 6 - Security and Business Associates",
    },
  },
  {
    code: "HIPAA-S7-Q1",
    title: "Does your practice have a contingency plan in the event of an emergency?",
    description:
      "Requires establishing an emergency contingency plan containing backup, disaster recovery, and emergency mode operations procedures. Compliance is demonstrated by providing the signed corporate contingency plan.",
    category: "Section 7 - Contingency Planning",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(7)(i)",
      specification: "Required",
      section: "Section 7 - Contingency Planning",
    },
  },
  {
    code: "HIPAA-S7-Q2",
    title: "Is your contingency plan documented?",
    description:
      "Requires maintaining written, accessible copies of the contingency plan in physical and electronic forms. Compliance is demonstrated by contingency plan file paths and verified physical print locations.",
    category: "Section 7 - Contingency Planning",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(7)(i)",
      specification: "Required",
      section: "Section 7 - Contingency Planning",
    },
  },
  {
    code: "HIPAA-S7-Q3",
    title: "Do you periodically update your contingency plan?",
    description:
      "Requires reviewing and updating the emergency contingency plan annually or after operational tests. Compliance is demonstrated by dated contingency plan revision records and coordinator approval signs.",
    category: "Section 7 - Contingency Planning",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(7)(i)",
      specification: "Required",
      section: "Section 7 - Contingency Planning",
    },
  },
  {
    code: "HIPAA-S7-Q4",
    title: "How do you ensure that your contingency plan is effective and updated appropriately?",
    description:
      "Requires conducting periodic drills or tabletop exercises to test contingency procedures. Compliance is demonstrated by testing schedule templates, exercise logs, and post-drill feedback summaries.",
    category: "Section 7 - Contingency Planning",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(7)(ii)(D)",
      specification: "Required",
      section: "Section 7 - Contingency Planning",
    },
  },
  {
    code: "HIPAA-S7-Q5",
    title:
      "Have you considered what kind of emergencies could damage critical information systems or prevent access to ePHI within your practice?",
    description:
      "Requires conducting a business impact analysis (BIA) to identify threat scenarios such as fires, power failures, or ransomware. Compliance is demonstrated by the BIA document and risk analysis registry.",
    category: "Section 7 - Contingency Planning",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(7)(i)",
      specification: "Required",
      section: "Section 7 - Contingency Planning",
    },
  },
  {
    code: "HIPAA-S7-Q6",
    title: "What types of emergencies have you considered?",
    description:
      "Requires documenting specific threat responses for natural disasters, cyber incidents, and utility disruptions in the plan. Compliance is demonstrated by dedicated response sections inside the contingency manual.",
    category: "Section 7 - Contingency Planning",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(7)(i)",
      specification: "Required",
      section: "Section 7 - Contingency Planning",
    },
  },
  {
    code: "HIPAA-S7-Q7",
    title:
      "Have you documented in your policies and procedures various emergency types and how you would respond to them?",
    description:
      "Requires outlining operational workflows for active emergency response and safety instructions. Compliance is demonstrated by documented standard operating procedures (SOPs) for emergency response.",
    category: "Section 7 - Contingency Planning",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(7)(i)",
      specification: "Required",
      section: "Section 7 - Contingency Planning",
    },
  },
  {
    code: "HIPAA-S7-Q8",
    title:
      "Does your practice have policies and procedures in place to prevent, detect, and respond to security incidents?",
    description:
      "Requires establishing a formal Incident Response Plan (IRP) covering incident definition, detection mechanisms, and isolation steps. Compliance is demonstrated by presenting the written IRP.",
    category: "Section 7 - Contingency Planning",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(6)(i)",
      specification: "Required",
      section: "Section 7 - Contingency Planning",
    },
  },
  {
    code: "HIPAA-S7-Q9",
    title: "How does your practice prevent, detect, and respond to security incidents?",
    description:
      "Requires deploying firewalls, intrusion detection systems, and logging alerts to identify and respond to events. Compliance is demonstrated by system alerts, security dashboard settings, and incident log archives.",
    category: "Section 7 - Contingency Planning",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(6)(i)",
      specification: "Required",
      section: "Section 7 - Contingency Planning",
    },
  },
  {
    code: "HIPAA-S7-Q10",
    title: "Has your practice identified specific personnel as your incident response team?",
    description:
      "Requires designating a Computer Security Incident Response Team (CSIRT) with defined roles and contact details. Compliance is demonstrated by IRP team rosters and emergency escalation lists.",
    category: "Section 7 - Contingency Planning",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(6)(ii)",
      specification: "Required",
      section: "Section 7 - Contingency Planning",
    },
  },
  {
    code: "HIPAA-S7-Q11",
    title: "How are members of your incident response team identified and trained?",
    description:
      "Requires verifying that CSIRT members receive specialized incident handling training. Compliance is demonstrated by certificates, mock incident review logs, and training course documentation.",
    category: "Section 7 - Contingency Planning",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(6)(ii)",
      specification: "Required",
      section: "Section 7 - Contingency Planning",
    },
  },
  {
    code: "HIPAA-S7-Q12",
    title:
      "Has your practice evaluated and determined which systems and ePHI are necessary for maintaining business-as-usual in the event of an emergency?",
    description:
      "Requires classifying systems to determine critical services and recover targets (RTO/RPO) for ePHI backups. Compliance is demonstrated by a system classification document containing prioritized recovery tiers.",
    category: "Section 7 - Contingency Planning",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(7)(i)",
      specification: "Required",
      section: "Section 7 - Contingency Planning",
    },
  },
  {
    code: "HIPAA-S7-Q13",
    title:
      "How would your practice maintain access to ePHI in the event of an emergency, system failure, or physical disaster?",
    description:
      "Requires implementing an Emergency Mode Operation Plan specifying secondary sites or cloud infrastructure for ePHI access. Compliance is demonstrated by standby system layouts and cloud failover settings.",
    category: "Section 7 - Contingency Planning",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.312(a)(2)(ii)",
      specification: "Required",
      section: "Section 7 - Contingency Planning",
    },
  },
  {
    code: "HIPAA-S7-Q14",
    title:
      "How would your practice maintain security of ePHI and crucial business processes before, during, and after an emergency?",
    description:
      "Requires verifying that safety controls (e.g., encryption, access controls) remain active during emergency failover events. Compliance is demonstrated by security configuration rules for backup sites.",
    category: "Section 7 - Contingency Planning",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(7)(ii)(C)",
      specification: "Required",
      section: "Section 7 - Contingency Planning",
    },
  },
  {
    code: "HIPAA-S7-Q15",
    title: "Do you have a plan for backing up and restoring critical data?",
    description:
      "Requires maintaining regular, encrypted backups of ePHI and testing the restore process on separate systems. Compliance is demonstrated by backup schedules, execution logs, and successful test restore records.",
    category: "Section 7 - Contingency Planning",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(7)(ii)(A),§164.308(a)(7)(ii)(B), and §164.308(a)(7)(ii)(E)",
      specification: "Required & Addressable",
      section: "Section 7 - Contingency Planning",
    },
  },
  {
    code: "HIPAA-S7-Q16",
    title: "How is your practice's emergency procedure activated?",
    description:
      "Requires defining activation criteria, thresholds, and authorities for declaring emergencies. Compliance is demonstrated by documented emergency declaration procedures in the contingency plan.",
    category: "Section 7 - Contingency Planning",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.312(a)(2)(ii)",
      specification: "Required",
      section: "Section 7 - Contingency Planning",
    },
  },
  {
    code: "HIPAA-S7-Q17",
    title:
      "How is access to your facility coordinated in the event of disasters or emergency situations?",
    description:
      "Requires defining physical security protocols for controlling facility entry during disaster situations. Compliance is demonstrated by documented emergency facility control guidelines and auxiliary badge verification.",
    category: "Section 7 - Contingency Planning",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      cfrReference: "§164.310(a)(2)(i)",
      specification: "Addressable",
      section: "Section 7 - Contingency Planning",
    },
  },
  {
    code: "HIPAA-S7-Q18",
    title: "How is your emergency procedure terminated after the emergency circumstance is over?",
    description:
      "Requires establishing a formal deactivation process to safely transition back to normal operations and audit the incident. Compliance is demonstrated by off-alert checklist logs and post-incident review documents.",
    category: "Section 7 - Contingency Planning",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.312(a)(2)(ii)",
      specification: "Required",
      section: "Section 7 - Contingency Planning",
    },
  },
  {
    code: "HIPAA-S7-Q19",
    title:
      "Do you formally evaluate the effectiveness of your security safeguards, including physical safeguards?",
    description:
      "Requires conducting periodic evaluations of overall security posture, including technical and physical audits. Compliance is demonstrated by completed evaluation checklists, compliance certifications, or external audit records.",
    category: "Section 7 - Contingency Planning",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(8)",
      specification: "Required",
      section: "Section 7 - Contingency Planning",
    },
  },
  {
    code: "HIPAA-S7-Q20",
    title:
      "How do you evaluate the effectiveness of your security safeguards, including physical safeguards?",
    description:
      "Requires establishing a systematic audit methodology that reviews system configurations, employee training, and physical barrier checks. Compliance is demonstrated by written evaluation guidelines and documented check reports.",
    category: "Section 7 - Contingency Planning",
    severity: "HIGH",
    weight: 3,
    metadata: {
      cfrReference: "§164.308(a)(8)",
      specification: "Required",
      section: "Section 7 - Contingency Planning",
    },
  },
];
