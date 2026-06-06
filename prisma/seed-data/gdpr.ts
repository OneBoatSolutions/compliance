import type { SeedControl } from "./types";

export const gdprControls: SeedControl[] = [
  {
    code: "GDPR-D1.0",
    title:
      "Can the organization generally identify all locations where personal data is stored across the enterprise?",
    description:
      "Requires maintaining an up-to-date data map and asset inventory that covers all on-premise servers, cloud databases, and third-party SaaS integrations where personal data is processed.",
    category: "Data Discovery & Inventory",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 15(3)",
      evidenceRequired: "Data map, Asset inventory, Cloud storage list",
      area: "Discover",
    },
  },
  {
    code: "GDPR-D1.1",
    title:
      "Does the organization have the ability to locate all instances of personal data pertaining to a given data subject?",
    description:
      "Requires establishing search mechanisms or data discovery tools capable of scanning all repository sources to retrieve a specific subject's data. Compliance is demonstrated by run logs of data discovery queries.",
    category: "Data Discovery & Inventory",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 15(3)",
      evidenceRequired: "Search logs, Data discovery tool report",
      area: "Discover",
    },
  },
  {
    code: "GDPR-D1.2",
    title:
      "Does the organization have a formal process in place to search for personal data in a consistent and timely manner?",
    description:
      "Requires establishing a documented standard operating procedure defining the steps, query methods, and responsible staff for locating subject data. Compliance is demonstrated by the active search procedures manual.",
    category: "Data Discovery & Inventory",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 15(3)",
      evidenceRequired: "Standard Operating Procedure (SOP)",
      area: "Discover",
    },
  },
  {
    code: "GDPR-D1.3",
    title:
      "Does the organization have technology for a single search to return all instances of personal data for a given subject?",
    description:
      "Requires deploying unified data discovery software or index search solutions that query all connected data stores simultaneously. Compliance is demonstrated by tool license certificates and search UI layouts.",
    category: "Data Discovery & Inventory",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 15(3)",
      evidenceRequired: "Tool documentation, UI screenshot",
      area: "Discover",
    },
  },
  {
    code: "GDPR-D2.0",
    title: "Can the organization categorize the types of personal data it uses?",
    description:
      "Requires defining classification categories for personal data, such as contact details, financial records, and identifiers. Compliance is demonstrated by data taxonomy policies and database schema configuration tables.",
    category: "Data Discovery & Inventory",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 30, 32",
      evidenceRequired: "Data classification policy, Data schema",
      area: "Discover",
    },
  },
  {
    code: "GDPR-D2.1",
    title: "Does the organization label data sensitivity (e.g., 'sensitive', 'confidential')?",
    description:
      "Requires applying metadata tags or classification labels to all stored files and database entries containing personal data. Compliance is demonstrated by directory scans showing data tags and automated labeling rules.",
    category: "Data Discovery & Inventory",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 30, 32",
      evidenceRequired: "Metadata tags, Classification labels",
      area: "Discover",
    },
  },
  {
    code: "GDPR-D2.2",
    title: "Does the organization label data with applicable geographic restrictions?",
    description:
      "Requires marking stored data records with their geographic source or residency constraints to regulate regional processing rules. Compliance is demonstrated by regional data flags in database systems and transfer audits.",
    category: "Data Discovery & Inventory",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 30, 32",
      evidenceRequired: "Regional data tags, Data residency policy",
      area: "Discover",
    },
  },
  {
    code: "GDPR-D2.3",
    title: "Does the organization label the origin of data (subject vs. third-party)?",
    description:
      "Requires tracking and labeling data collection sources, separating directly collected subject data from third-party imports. Compliance is demonstrated by lineage mapping diagrams and data source fields in databases.",
    category: "Data Discovery & Inventory",
    severity: "LOW",
    weight: 1,
    metadata: {
      article: "Art. 30, 32",
      evidenceRequired: "Data lineage records, Source metadata",
      area: "Discover",
    },
  },
  {
    code: "GDPR-D2.4",
    title: "Are data classification activities performed in a consistent and timely manner?",
    description:
      "Requires running classification checks at scheduled intervals or upon ingestion to maintain labeling accuracy. Compliance is demonstrated by execution logs of data cataloging runs and scanning schedules.",
    category: "Data Discovery & Inventory",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 30, 32",
      evidenceRequired: "Audit logs of classification runs",
      area: "Discover",
    },
  },
  {
    code: "GDPR-D2.5",
    title: "Does the organization automatically perform all classification activities?",
    description:
      "Requires deploying rule-based triggers or machine learning scanners to automatically discover and classify ingested personal data. Compliance is demonstrated by active script files and tool configuration logs.",
    category: "Data Discovery & Inventory",
    severity: "LOW",
    weight: 1,
    metadata: {
      article: "Art. 30, 32",
      evidenceRequired: "Automation scripts, AI/ML tool logs",
      area: "Discover",
    },
  },
  {
    code: "GDPR-D3.0",
    title: "Does the organization have a tool to catalog how/where personal data is used?",
    description:
      "Requires utilizing a centralized software platform or data catalog tool to track data processing streams and physical storage areas. Compliance is demonstrated by tool administration console access and data dictionary reports.",
    category: "Data Discovery & Inventory",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 30",
      evidenceRequired: "Inventory tool access, Data catalog",
      area: "Discover",
    },
  },
  {
    code: "GDPR-D3.1",
    title: "Does the organization have a complete inventory with all instances documented?",
    description:
      "Requires compiling a master register of processing activities (RoPA) containing all data elements, purposes, and storage areas. Compliance is demonstrated by presenting the updated RoPA document.",
    category: "Data Discovery & Inventory",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 30",
      evidenceRequired: "Master Data Inventory (RoPA)",
      area: "Discover",
    },
  },
  {
    code: "GDPR-D3.2",
    title: "Is there technology in place to automate updates to the inventory?",
    description:
      "Requires configuring automated connectors that update the data inventory when schema changes or new integrations occur. Compliance is demonstrated by connector API logs and scheduler settings.",
    category: "Data Discovery & Inventory",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 30",
      evidenceRequired: "Integration logs, API documentation",
      area: "Discover",
    },
  },
  {
    code: "GDPR-D3.3",
    title: "Is there a process used regularly to keep the inventory up to date?",
    description:
      "Requires establishing a formal revision process that schedules periodic reviews of the data inventory by business owners. Compliance is demonstrated by scheduled meeting logs and review approval records.",
    category: "Data Discovery & Inventory",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 30",
      evidenceRequired: "Review schedule, Sign-off logs",
      area: "Discover",
    },
  },
  {
    code: "GDPR-D3.4",
    title: "Is there an inventory of all processing activities where data is being obtained?",
    description:
      "Requires cataloging all entry channels and processing activities that ingest personal data into the enterprise. Compliance is demonstrated by a dedicated processing activity log detailing each data stream.",
    category: "Data Discovery & Inventory",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 30",
      evidenceRequired: "Processing activity registry",
      area: "Discover",
    },
  },
  {
    code: "GDPR-D3.5",
    title: "Are details of processing (scope, purpose, consent) documented for each activity?",
    description:
      "Requires ensuring every entry in the processing activities registry specifies the data scope, business purpose, and corresponding lawful basis. Compliance is demonstrated by detailed columns in the RoPA.",
    category: "Data Discovery & Inventory",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 30",
      evidenceRequired: "RoPA detailed entries",
      area: "Discover",
    },
  },
  {
    code: "GDPR-M1.0",
    title: "Does the organization have a data governance program?",
    description:
      "Requires establishing a structured data governance framework that defines roles, responsibilities, and accountability for privacy. Compliance is demonstrated by providing the signed privacy program charter.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 5, 24",
      evidenceRequired: "Governance framework, Charter",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M1.1",
    title: "Is there an organizational structure and formal charter for the program?",
    description:
      "Requires defining and documenting the organizational governance structure, identifying the DPO and governing committees. Compliance is demonstrated by providing org charts and the formal governance charter.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 5, 24",
      evidenceRequired: "Org chart, Signed Charter",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M1.2",
    title: "Is data governance integrated across departments for consistency?",
    description:
      "Requires establishing a cross-functional privacy committee containing representatives from engineering, legal, HR, and marketing. Compliance is demonstrated by committee charters and dated meeting minutes.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 5, 24",
      evidenceRequired: "Cross-functional committee minutes",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M1.3",
    title: "Are there data privacy and protection policies?",
    description:
      "Requires defining, approving, and publishing written data privacy and security policies aligned with GDPR standards. Compliance is demonstrated by providing active internal privacy policies.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 5, 24",
      evidenceRequired: "Published Privacy Policies",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M1.4",
    title: "Is there technology to monitor and report policy violations?",
    description:
      "Requires deploying security tools, such as DLP or log analyzers, configured to detect and flag unauthorized personal data usage. Compliance is demonstrated by DLP alerts and audit log configurations.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 5, 24",
      evidenceRequired: "DLP logs, Monitoring alerts",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M1.5",
    title: "Do policies enforce accountability within the organization?",
    description:
      "Requires incorporating privacy compliance standards into employment terms, training mandates, and third-party contracts. Compliance is demonstrated by onboarding agreements and signed confidentiality pledges.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 5, 24",
      evidenceRequired: "Performance reviews, Signed NDAs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-GW-CH",
    title: "Does the organization collect or process personal data of children?",
    description:
      "Requires conducting a business review to determine if children's personal data is ingested by any service. Compliance is demonstrated by documentation certifying data scope and target user demographics.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    isGateway: true,
    metadata: {
      article: "Art. 8",
      evidenceRequired: "Answer YES or NO. If NO -> mark sub-controls M1.6-M1.8 as N/A",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M1.6",
    title: "Are there specific protections for children's personal data?",
    description:
      "Requires establishing specialized access controls and consent prompts for systems handling minor data. Compliance is demonstrated by children's privacy policy pages and application age verification screenshots.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 5, 24",
      evidenceRequired: "Children's privacy policy, Age gates",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M1.7",
    title: "Are requirements for children's data consent fulfilled?",
    description:
      "Requires obtaining and documenting parental or guardian consent before processing children's personal data. Compliance is demonstrated by signed parental consent forms and digital verification records.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 8",
      evidenceRequired: "Parental consent forms",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M1.8",
    title: "Can the organization validate the age of a child and guardian identity?",
    description:
      "Requires employing age estimation or identity validation workflows to verify that the consent-giver is the legal guardian. Compliance is demonstrated by verification service integration settings and log samples.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 8",
      evidenceRequired: "ID verification logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-GW-SC",
    title:
      "Does the organization process special category personal data (health, biometric, religion, racial origin etc.)?",
    description:
      "Requires analyzing all processed data elements to determine if special categories under Article 9 are stored. Compliance is demonstrated by data classification schemas and system inventory lists.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    isGateway: true,
    metadata: {
      article: "Art. 9",
      evidenceRequired: "Answer YES or NO. If NO -> mark sub-controls M1.9-M1.10 as N/A",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M1.9",
    title: "Is legal justification documented for using special categories of data?",
    description:
      "Requires mapping every instance of special category processing to a legal condition under Article 9(2). Compliance is demonstrated by formal legal opinions, RoPA records, or processing registers.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 9",
      evidenceRequired: "Legal opinion, Consent forms",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M1.10",
    title: "Is explicit consent obtained for sensitive (racial/religious) data?",
    description:
      "Requires configuring user interface flows that require explicit, unambiguous actions to accept sensitive data processing. Compliance is demonstrated by consent interface layouts and database consent flag records.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 9",
      evidenceRequired: "Affirmative action logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M2.0",
    title: "Does the organization provide privacy notices to data subjects?",
    description:
      "Requires publishing comprehensive privacy notices that explain data collection, storage, and rights. Compliance is demonstrated by providing the public privacy policy URL and active web copy.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 12-14",
      evidenceRequired: "Public Privacy Notice",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M2.1",
    title: "Are the privacy notices written in clear and plain language?",
    description:
      "Requires drafting privacy notices that avoid complex legalese and are readable by general audiences. Compliance is demonstrated by presenting readability index reports or consumer focus group reviews.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 12-14",
      evidenceRequired: "Readability assessment",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M2.2",
    title: "Are notices governed by a formal policy/process for timely sharing?",
    description:
      "Requires establishing standard procedures to update and display notices whenever data collection workflows change. Compliance is demonstrated by notice review policies and update release histories.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 12-14",
      evidenceRequired: "Notice management SOP",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M2.3",
    title: "Do notices include contact details and purposes for data use?",
    description:
      "Requires verifying that privacy notices contain contact information for the DPO and distinct purposes for processing. Compliance is demonstrated by a compliance checklist audit of published notices.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 12-14",
      evidenceRequired: "Notice checklist audit",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M2.4",
    title: "Are notices shared at first contact when informing subjects of objections?",
    description:
      "Requires presenting a privacy notice or link during the first point of user communication or sign-up. Compliance is demonstrated by customer registration flowcharts and application capture screenshots.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 12-14",
      evidenceRequired: "Customer journey flowcharts",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M2.5",
    title: "Are notices generated and shared by automated means?",
    description:
      "Requires using automated email triggers or pop-ups to deliver privacy disclosures immediately when user creation occurs. Compliance is demonstrated by backend code scripts and trigger event logs.",
    category: "Data Governance & Rights",
    severity: "LOW",
    weight: 1,
    metadata: {
      article: "Art. 12-14",
      evidenceRequired: "System workflow diagrams",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M2.6",
    title: "Are notices shared at all points where personal data is collected?",
    description:
      "Requires placing links to privacy policies on all digital forms, checkout pages, and sign-up interfaces. Compliance is demonstrated by web UI screenshots and page templates.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 12-14",
      evidenceRequired: "Web/App screenshots",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M2.7",
    title: "Are notices shared when data is obtained from third-party sources?",
    description:
      "Requires notifying subjects within a reasonable period (max 30 days) when their data is acquired from indirect partners. Compliance is demonstrated by automated third-party communication logs.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 12-14",
      evidenceRequired: "Third-party notice logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M2.8",
    title: "Are notices shared before using data for new purposes?",
    description:
      "Requires presenting updated disclosures and obtaining approval prior to processing existing data for any new operational purpose. Compliance is demonstrated by change request forms and consent updates.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 12-14",
      evidenceRequired: "Change management logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M3.0",
    title: "Can the organization discontinue processing some forms of data on request?",
    description:
      "Requires implementing systems to halt processing operations for specific fields or workflows when requested by the data subject. Compliance is demonstrated by opt-out dashboards and database status tables.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 21",
      evidenceRequired: "Opt-out mechanism proof",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M3.1",
    title: "Can the organization stop all processing (especially marketing) on request?",
    description:
      "Requires establishing system suppression lists that isolate contacts and prevent marketing transmissions. Compliance is demonstrated by suppression logs, unsubscribe tests, and active mailers configuration.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 21",
      evidenceRequired: "Suppression lists",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M3.2",
    title: "Is justification provided to the subject if a request is rejected?",
    description:
      "Requires documenting legal reasons and drafting formal responses when a request to stop processing is denied. Compliance is demonstrated by standard rejection templates and legal sign-off logs.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 21",
      evidenceRequired: "Email templates, Legal review",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M3.3",
    title: "Does the organization maintain evidence of discontinued data use?",
    description:
      "Requires maintaining chronological logs of all opt-out and objection requests with matching system changes. Compliance is demonstrated by database audit trails showing status alterations.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 21",
      evidenceRequired: "Audit trail of opt-outs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M3.4",
    title: "Is there a process to respond to stop-processing requests promptly?",
    description:
      "Requires establishing a standard operating procedure defining handling timelines and escalations for objections. Compliance is demonstrated by DSAR SOP documents and response time metrics.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 21",
      evidenceRequired: "Request handling SOP",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M3.5",
    title: "Are stop-processing activities performed automatically?",
    description:
      "Requires connecting user portal opt-out clicks directly to system APIs that immediately update processing flags. Compliance is demonstrated by API integration flowcharts and runtime logs.",
    category: "Data Governance & Rights",
    severity: "LOW",
    weight: 1,
    metadata: {
      article: "Art. 21",
      evidenceRequired: "API logs, Automated workflow",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M4.0",
    title: "Can the organization obtain consent from data subjects?",
    description:
      "Requires establishing user consent capture mechanisms on websites and application entry points. Compliance is demonstrated by cookie banners, opt-in forms, and consent storage mechanisms.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 7, 8, 9",
      evidenceRequired: "Consent banners/forms",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M4.1",
    title: "Is consent obtained prior to processing?",
    description:
      "Requires blocking all processing scripts and cookies until the user has performed an affirmative opt-in action. Compliance is demonstrated by timestamped consent logs and website tag manager rules.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 7, 8, 9",
      evidenceRequired: "Consent logs (Timestamped)",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M4.2",
    title: "Is consent obtained promptly for all required activities?",
    description:
      "Requires conducting compliance checks to verify that consent workflows cover all active data collection operations. Compliance is demonstrated by annual privacy compliance audits and consent gap reviews.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 7, 8, 9",
      evidenceRequired: "Compliance audit report",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M4.3",
    title: "Does the organization automatically obtain all necessary consent?",
    description:
      "Requires employing a certified Consent Management Platform (CMP) that manages and stores user consent preferences automatically. Compliance is demonstrated by active CMP dashboards and script integrations.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 7",
      evidenceRequired: "Cookie bot/Consent Manager",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M5.0",
    title: "Is there a published way for subjects to communicate on privacy?",
    description:
      "Requires providing clear channels (e.g., email address, contact form) for users to submit privacy inquiries. Compliance is demonstrated by published DPO contact details on the website.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 15-20",
      evidenceRequired: "Contact page, DPO email",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M5.1",
    title: "Is there an online portal for erasure/objection requests (DSAR)?",
    description:
      "Requires implementing a dedicated Data Subject Access Request (DSAR) portal to receive and organize requests. Compliance is demonstrated by DSAR interface screenshots and portal link access.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 15-20",
      evidenceRequired: "DSAR Portal screenshot",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M5.2",
    title: "Are there backend tools to track requests to resolution?",
    description:
      "Requires utilizing case management tools or ticketers to monitor the progress and completion of DSAR tasks. Compliance is demonstrated by DSAR ticket queues and progress logs.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 15-20",
      evidenceRequired: "Ticketing system (e.g., Jira, OneTrust)",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M5.3",
    title: "Can the organization validate the identity of requestors?",
    description:
      "Requires implementing validation processes to verify the requestor's identity before releasing personal data. Compliance is demonstrated by verification policy files and identity provider configuration settings.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 12",
      evidenceRequired: "Identity verification policy",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M5.4",
    title: "Is personnel trained to respond to privacy requests?",
    description:
      "Requires delivering training to support and privacy staff regarding DSAR response timelines and redaction rules. Compliance is demonstrated by training slide decks and completion records.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 12",
      evidenceRequired: "Training records",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M5.5",
    title: "Can the organization notify recipients of data about erasure/restrictions?",
    description:
      "Requires establishing processes to notify third-party recipients and subprocessors when a user requests data erasure. Compliance is demonstrated by automated downstream API call logs or notification emails.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 19",
      evidenceRequired: "Downstream notification logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M5.6",
    title: "Can subjects/regulators view the status of their requests?",
    description:
      "Requires deploying a tracking interface where data subjects and regulatory authorities can check request progress. Compliance is demonstrated by portal screenshots and customer tracking URLs.",
    category: "Data Governance & Rights",
    severity: "LOW",
    weight: 1,
    metadata: {
      article: "Art. 12",
      evidenceRequired: "Portal tracking UI",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M5.7",
    title: "Are response times (e.g., 30 days) defined for requestors?",
    description:
      "Requires defining internal and external response SLA limits, typically 30 calendar days, in the privacy procedure. Compliance is demonstrated by DSAR SLAs and response date tracking logs.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 12",
      evidenceRequired: "Service Level Agreement (SLA)",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M5.8",
    title: "Can the organization automatically respond to inquiries?",
    description:
      "Requires configuring email templates or portals to automatically send confirmation receipts when requests are received. Compliance is demonstrated by email trigger configurations and auto-acknowledgment logs.",
    category: "Data Governance & Rights",
    severity: "LOW",
    weight: 1,
    metadata: {
      article: "Art. 12",
      evidenceRequired: "Auto-reply logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M6.0",
    title: "Can the organization correct/complete data when requested?",
    description:
      "Requires implementing procedures to update or complete inaccurate personal data upon validation of a correction request. Compliance is demonstrated by data correction ticket logs and UI change forms.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 16",
      evidenceRequired: "Correction workflow proof",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M6.1",
    title: "Can the organization correct ALL data subject instances?",
    description:
      "Requires updating all instances of subject data across primary databases, replicas, and connected apps upon correction. Compliance is demonstrated by query updates and database syncing logs.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 16",
      evidenceRequired: "Database update logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M6.2",
    title: "Is evidence of corrections recorded and shareable?",
    description:
      "Requires logging all data correction transactions and providing proof of completion to data subjects. Compliance is demonstrated by transaction logs and confirmation emails.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 16",
      evidenceRequired: "Change logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M6.3",
    title: "Are corrections performed consistently and promptly?",
    description:
      "Requires implementing tracking mechanisms to monitor and ensure corrections are resolved within GDPR timelines. Compliance is demonstrated by response time metrics and DSAR closure reports.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 16",
      evidenceRequired: "Response time reports",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M6.4",
    title: "Are some corrections performed automatically?",
    description:
      "Requires providing self-service interfaces or account settings that allow data subjects to edit their own profile information. Compliance is demonstrated by portal user guides and database transaction logs.",
    category: "Data Governance & Rights",
    severity: "LOW",
    weight: 1,
    metadata: {
      article: "Art. 16",
      evidenceRequired: "Self-service portal logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M6.5",
    title: "Are all corrections performed automatically?",
    description:
      "Requires integrating self-service APIs that immediately propagate profile corrections across all internal systems. Compliance is demonstrated by application design plans and data propagation flows.",
    category: "Data Governance & Rights",
    severity: "LOW",
    weight: 1,
    metadata: {
      article: "Art. 16",
      evidenceRequired: "System architecture diagrams",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M7.0",
    title: "Is there a mechanism to locate and erase data on request?",
    description:
      "Requires establishing technical tools or automated scripts to identify and remove all copies of a subject's data from systems. Compliance is demonstrated by erasure procedures and tool interface maps.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 17",
      evidenceRequired: "Erasure SOP",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M7.1",
    title: "Is personnel trained on how to locate and erase data?",
    description:
      "Requires delivering training to operational and engineering staff on erasure protocols, including database deletion and backup handling. Compliance is demonstrated by training logs and syllabus records.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 17",
      evidenceRequired: "Training certificates",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M7.2",
    title: "Can personnel determine when erasure should be fulfilled vs. denied?",
    description:
      "Requires providing staff with clear criteria to evaluate erasure requests against legal retention requirements. Compliance is demonstrated by request evaluation checklists and DPO sign-off logs.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 17",
      evidenceRequired: "Erasure criteria checklist",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M7.3",
    title: "Is there a process to erase data completely and accurately?",
    description:
      "Requires defining a structured workflow to confirm that all records, including database rows and cache files, are removed. Compliance is demonstrated by data destruction policies and system test records.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 17",
      evidenceRequired: "Data destruction policy",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M7.4",
    title: "Is there a record that an erasure request was fulfilled?",
    description:
      "Requires maintaining immutable records of completed erasure transactions without storing deleted personal data. Compliance is demonstrated by signed certificates of destruction or transaction hashes.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 17",
      evidenceRequired: "Certificate of destruction",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M7.5",
    title: "Can the organization contact other controllers to fulfill erasure?",
    description:
      "Requires establishing notification procedures to inform external data controllers who process the subject's shared data of the erasure request. Compliance is demonstrated by outbound communication logs.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 17",
      evidenceRequired: "Communication logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M7.6",
    title: "Is there technology to erase data across multiple data stores?",
    description:
      "Requires deploying data orchestration tools or centralized scripts to sync deletions across on-premise and cloud data stores. Compliance is demonstrated by orchestration logs and script code.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 17",
      evidenceRequired: "Orchestration tool logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M7.7",
    title: "Can erasure be performed automatically?",
    description:
      "Requires utilizing APIs that trigger data deletion across all connected databases immediately when an erasure request is approved. Compliance is demonstrated by system architecture diagrams and API logs.",
    category: "Data Governance & Rights",
    severity: "LOW",
    weight: 1,
    metadata: {
      article: "Art. 17",
      evidenceRequired: "Script/API logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M8.0",
    title: "Can subjects get a copy of their data in electronic format?",
    description:
      "Requires providing a secure portal or service for users to download their personal data in a digital format. Compliance is demonstrated by system export samples and user portal screenshots.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 20",
      evidenceRequired: "Sample data export",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M8.1",
    title: "Is data provided in a common, machine-readable format (.xls/.xml)?",
    description:
      "Requires structuring data exports in widely accepted formats, such as JSON, CSV, or XML, to facilitate portability. Compliance is demonstrated by sample export files showing correct formats.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 20",
      evidenceRequired: "Export file sample",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M8.2",
    title: "Is data provided automatically to the subject?",
    description:
      "Requires configuring a self-service download tool that compiles and delivers data packages without manual intervention. Compliance is demonstrated by tool workflow diagrams and access log files.",
    category: "Data Governance & Rights",
    severity: "LOW",
    weight: 1,
    metadata: {
      article: "Art. 20",
      evidenceRequired: "Download link logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M8.3",
    title: "Can data be sent directly to another controller?",
    description:
      "Requires supporting standardized data transfer protocols or APIs to transmit data packages directly to other service providers. Compliance is demonstrated by data transmission configuration records.",
    category: "Data Governance & Rights",
    severity: "LOW",
    weight: 1,
    metadata: {
      article: "Art. 20",
      evidenceRequired: "Portability process flow",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M9.0",
    title: "Is there a policy to restrict processing when required?",
    description:
      "Requires establishing a written policy that defines the conditions, timelines, and methods for restricting data processing under Article 18. Compliance is demonstrated by the active data restriction policy.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 18",
      evidenceRequired: "Restriction policy",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M9.1",
    title: "Can the organization suspend/restrict processing on request?",
    description:
      "Requires implementing system configuration flags, such as data locks, to restrict processing without deleting records. Compliance is demonstrated by database schema settings showing restriction flags.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 18",
      evidenceRequired: "'Freeze' flag in database",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M9.2",
    title: "Are there procedures to notify processors to restrict processing?",
    description:
      "Requires establishing a process to notify third-party processors when a restriction request is active for a subject. Compliance is demonstrated by outbound notification logs and processor confirmations.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 18",
      evidenceRequired: "Processor notification logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M9.3",
    title: "Are recipients notified automatically of restrictions?",
    description:
      "Requires utilizing automated API integrations or messages to notify downstream systems immediately when processing is restricted. Compliance is demonstrated by automated script logs.",
    category: "Data Governance & Rights",
    severity: "LOW",
    weight: 1,
    metadata: {
      article: "Art. 18",
      evidenceRequired: "Automated email/API logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M9.4",
    title: "Is there a process to notify subjects if a restriction is lifted?",
    description:
      "Requires establishing procedures to inform data subjects in writing before a temporary processing restriction is removed. Compliance is demonstrated by communication records and email templates.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 18",
      evidenceRequired: "Notification templates",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M9.5",
    title: "Are subjects notified automatically when processing resumes?",
    description:
      "Requires configuring automated email or message triggers that alert users when system restrictions on their data are deactivated. Compliance is demonstrated by system trigger settings and notification logs.",
    category: "Data Governance & Rights",
    severity: "LOW",
    weight: 1,
    metadata: {
      article: "Art. 18",
      evidenceRequired: "System trigger logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M9.6",
    title: "Is a record maintained of restricted processing instances?",
    description:
      "Requires logging all restricted processing requests, actions, and current status in a central audit system. Compliance is demonstrated by data restriction register entries.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 18",
      evidenceRequired: "Restriction audit logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M9.7",
    title: "Is a record maintained of why restrictions were resumed?",
    description:
      "Requires documenting the legal or operational justification for lifting a processing restriction in the audit logs. Compliance is demonstrated by audit log comments and manager approvals.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 18",
      evidenceRequired: "Justification logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-GW-ADM",
    title:
      "Does the organization use automated decision-making or profiling that produces legal or similarly significant effects on individuals?",
    description:
      "Requires assessing operations to determine if algorithms make decision outputs that affect user rights or legal status. Compliance is demonstrated by algorithmic impact assessments and PRD reviews.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    isGateway: true,
    metadata: {
      article: "Art. 22",
      evidenceRequired: "Answer YES or NO. If NO -> mark sub-controls M10.0-M10.4 as N/A",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M10.0",
    title: "Can the organization identify fully automated decisions?",
    description:
      "Requires maintaining a registry of all algorithms, models, and decision-making logic that operate without human intervention. Compliance is demonstrated by providing the algorithm register.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 22",
      evidenceRequired: "Algorithmic inventory",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M10.1",
    title: "Are automated decisions evaluated for legal justification?",
    description:
      "Requires conducting a formal data protection impact assessment (DPIA) to verify the lawful basis for automated decisions. Compliance is demonstrated by signed DPIA records.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 22",
      evidenceRequired: "DPIA, Legal review",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M10.2",
    title: "Is there a policy for when human intervention is necessary?",
    description:
      "Requires establishing policies that define thresholds and paths for human review of automated decisions. Compliance is demonstrated by the active automated decision-making policy.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 22",
      evidenceRequired: "Automation policy",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M10.3",
    title: "Is there a procedure for human review of inconsistent decisions?",
    description:
      "Requires establishing workflows for human operators to audit, override, or verify automated outputs when flagged by subjects or systems. Compliance is demonstrated by operator review logs.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 22",
      evidenceRequired: "Reviewer logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M10.4",
    title: "Can subjects challenge or explain their view on a decision?",
    description:
      "Requires providing a feedback channel or interface for subjects to express their point of view and contest automated decisions. Compliance is demonstrated by user interface screenshots.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 22",
      evidenceRequired: "Appeal process documentation",
      area: "Manage",
    },
  },
  {
    code: "GDPR-GW-DPO",
    title:
      "Is the organization required to appoint a Data Protection Officer (public authority, large-scale processing, or special category data)?",
    description:
      "Requires conducting a legal assessment to verify if DPO appointment criteria under Article 37 are met. Compliance is demonstrated by a documented legal assessment memo.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    isGateway: true,
    metadata: {
      article: "Art. 37",
      evidenceRequired: "Answer YES or NO. If NO -> mark sub-controls M11.0-M11.6 as N/A",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M11.0",
    title: "Is there an appointed Data Protection Officer (DPO)?",
    description:
      "Requires appointing a qualified individual or contracting an external DPO service to oversee privacy compliance. Compliance is demonstrated by DPO contracts or official appointment letters.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 37",
      evidenceRequired: "Appointment letter, Job desc.",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M11.1",
    title: "Does the DPO conduct regular privacy training?",
    description:
      "Requires the DPO to plan and deliver privacy awareness training sessions to the workforce at scheduled intervals. Compliance is demonstrated by training logs and syllabus materials.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 39",
      evidenceRequired: "Training attendance logs",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M11.2",
    title: "Does the DPO maintain a professional peer network?",
    description:
      "Requires the DPO to participate in professional privacy associations or forums to stay informed on best practices. Compliance is demonstrated by active membership certificates or credentials.",
    category: "Data Governance & Rights",
    severity: "LOW",
    weight: 1,
    metadata: {
      article: "Art. 38",
      evidenceRequired: "Association memberships",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M11.3",
    title: "Does the DPO perform independent review and oversight?",
    description:
      "Requires the DPO to run independent audits of company data practices and report compliance levels to executive management. Compliance is demonstrated by completed audit reports.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 39",
      evidenceRequired: "Internal audit reports",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M11.4",
    title: "Does the DPO stay up to date with regulatory requirements?",
    description:
      "Requires the DPO to complete continuous professional development courses and track regulatory updates. Compliance is demonstrated by training certificates and compliance trackers.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 37",
      evidenceRequired: "CPD records, Certifications",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M11.5",
    title: "Does the DPO provide guidance on defining privacy roles?",
    description:
      "Requires the DPO to assist departments in allocating privacy and security responsibilities within team structures. Compliance is demonstrated by privacy role matrices (RACI).",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 39",
      evidenceRequired: "Responsibility matrix (RACI)",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M11.6",
    title: "Does the DPO review all compliance regulations (GDPR, etc.)?",
    description:
      "Requires the DPO to conduct annual compliance reviews against GDPR and other relevant regional regulations. Compliance is demonstrated by providing the DPO's annual review report.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 39",
      evidenceRequired: "Regulatory gap analysis",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M12.0",
    title: "Does the organization include privacy in risk management?",
    description:
      "Requires integrating privacy risks, such as data leaks or non-compliance, into the corporate enterprise risk management framework. Compliance is demonstrated by corporate risk register entries.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 24, 32",
      evidenceRequired: "Risk Register",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M12.1",
    title: "Are there principles for addressing risk across the org?",
    description:
      "Requires documenting core guidelines and risk tolerance levels for managing personal data risk across business lines. Compliance is demonstrated by risk management framework policies.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 24",
      evidenceRequired: "ERM Framework",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M12.2",
    title: "Is there a framework to assess and manage threats?",
    description:
      "Requires implementing a repeatable risk assessment methodology to identify, evaluate, and prioritize threats to ePHI. Compliance is demonstrated by risk assessment methodology docs.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 24",
      evidenceRequired: "Risk assessment methodology",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M12.3",
    title: "Are mitigation or transfer strategies defined?",
    description:
      "Requires establishing response protocols, such as cyber insurance or data isolation, to manage identified risks. Compliance is demonstrated by risk treatment plans.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 24",
      evidenceRequired: "Risk Treatment Plan",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M12.4",
    title: "Is risk prioritized to focus on high-value assets?",
    description:
      "Requires focusing risk assessment efforts on data stores containing high-volume or sensitive personal data. Compliance is demonstrated by asset classification maps and risk heat maps.",
    category: "Data Governance & Rights",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 24",
      evidenceRequired: "Heat maps, Asset criticality",
      area: "Manage",
    },
  },
  {
    code: "GDPR-M12.5",
    title: "Are financial/reputational risks of data mishandling included?",
    description:
      "Requires incorporating business impact metrics, such as potential fines or brand damage, into privacy risk evaluations. Compliance is demonstrated by risk registry impact scoring rules.",
    category: "Data Governance & Rights",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 24",
      evidenceRequired: "Impact analysis reports",
      area: "Manage",
    },
  },
  {
    code: "GDPR-P1.0",
    title: "Is 'Privacy by Design' integrated into tech and structure?",
    description:
      "Requires embedding data protection principles into system design and product development workflows. Compliance is demonstrated by product design checklists and privacy review records in SDLC.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 25",
      evidenceRequired: "Product design docs",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P1.1",
    title: "Does the organization have the ability to pseudonymize data?",
    description:
      "Requires implementing technical workflows, such as hashing or tokenization, to separate direct identifiers from data profiles. Compliance is demonstrated by database schemas and tokenization script logs.",
    category: "Data Protection & Security",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 25",
      evidenceRequired: "De-identification protocol",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P1.2",
    title: "Is there a process for data minimization (needed data only)?",
    description:
      "Requires limiting data collection interfaces to fields that are strictly necessary for the declared business purpose. Compliance is demonstrated by data collection forms and API schema definitions.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 25",
      evidenceRequired: "Data collection review logs",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P1.3",
    title: "Are access controls (Segregation of Duties) established?",
    description:
      "Requires establishing logical boundaries and identity roles that prevent individual users from having end-to-end control of data processes. Compliance is demonstrated by role privilege charts.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 25",
      evidenceRequired: "IAM policy, Access matrix",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P1.4",
    title: "Is access provided using the 'Principle of Least Privilege'?",
    description:
      "Requires configuring identity groups to restrict user access to only the specific data fields required for their active role. Compliance is demonstrated by IAM configurations and access logs.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 25",
      evidenceRequired: "User access review logs",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P1.5",
    title: "Is privacy integrated into all relevant policies and processes?",
    description:
      "Requires reviewing and aligning operational business policies to include core data protection requirements. Compliance is demonstrated by policy revision histories showing privacy integrations.",
    category: "Data Protection & Security",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 25",
      evidenceRequired: "Global Policy review",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P1.6",
    title: "Is a privacy culture embedded through ongoing training?",
    description:
      "Requires conducting periodic privacy awareness campaigns and compliance training for all employees. Compliance is demonstrated by training attendance reports and campaign materials.",
    category: "Data Protection & Security",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 25",
      evidenceRequired: "Awareness campaign stats",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P1.7",
    title: "Is privacy integrated into the SDLC?",
    description:
      "Requires establishing software release gates that require a privacy impact review before code deployment. Compliance is demonstrated by SDLC gate checklists and Jira workflow configurations.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 25",
      evidenceRequired: "Security/Privacy gates in Jira",
      area: "Protect",
    },
  },
  {
    code: "GDPR-GW-ENC",
    title:
      "Does the organization store or transmit sensitive personal data requiring encryption (e.g., IDs, financial, health data)?",
    description:
      "Requires assessing data fields to identify sensitive records that mandate cryptographic protection. Compliance is demonstrated by system configuration checklists and database audits.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    isGateway: true,
    metadata: {
      article: "Art. 32",
      evidenceRequired: "Answer YES or NO. If NO -> mark sub-controls P2.0-P2.4 as N/A",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P2.0",
    title: "Is sensitive data (IDs, Bank Nos) encrypted?",
    description:
      "Requires encrypting sensitive records at rest and in transit using strong cryptographic algorithms. Compliance is demonstrated by database encryption status checks and SSL/TLS configurations.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 32",
      evidenceRequired: "Encryption scan results",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P2.1",
    title: "Is there an encryption policy (what/how/why)?",
    description:
      "Requires establishing a formal encryption policy that defines approved algorithms, key lengths, and usage rules. Compliance is demonstrated by providing the active encryption policy document.",
    category: "Data Protection & Security",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 32",
      evidenceRequired: "Encryption Policy",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P2.2",
    title: "Does a data protection standard document encryption criteria?",
    description:
      "Requires outlining technical encryption standards, covering key rotation schedules and cryptographic strength requirements. Compliance is demonstrated by active technical security standard sheets.",
    category: "Data Protection & Security",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 32",
      evidenceRequired: "Technical Standard doc",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P2.3",
    title: "Are appropriate technologies in place for encryption?",
    description:
      "Requires deploying key management services (KMS) or hardware security modules (HSM) to secure cryptographic keys. Compliance is demonstrated by KMS architecture layouts and admin logs.",
    category: "Data Protection & Security",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 32",
      evidenceRequired: "Tool list (HSM, KMS)",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P2.4",
    title: "Is new encryption technology regularly analyzed?",
    description:
      "Requires reviewing emerging cryptographic algorithms and standards periodically to replace legacy encryption methods. Compliance is demonstrated by evaluation logs and security roadmaps.",
    category: "Data Protection & Security",
    severity: "LOW",
    weight: 1,
    metadata: {
      article: "Art. 32",
      evidenceRequired: "Tech roadmap, research logs",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P3.0",
    title: "Is there an ongoing effort to identify CIA controls?",
    description:
      "Requires defining and maintaining security controls designed to support confidentiality, integrity, and availability of personal data. Compliance is demonstrated by corporate security roadmap records.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 32",
      evidenceRequired: "Security Roadmap",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P3.1",
    title: "Are CIA requirements formally defined for personal data?",
    description:
      "Requires documenting specific confidentiality, integrity, and availability metrics for systems housing personal data. Compliance is demonstrated by data security standard manuals.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 32",
      evidenceRequired: "Data Security Standard",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P3.2",
    title: "Are measures defined to meet CIA requirements?",
    description:
      "Requires mapping system configurations and security tools directly to documented CIA requirements. Compliance is demonstrated by control mapping tables and audit logs.",
    category: "Data Protection & Security",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 32",
      evidenceRequired: "Control mapping",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P3.3",
    title: "Is there a program for regular investment in security?",
    description:
      "Requires allocating annual budget and resources to maintain, upgrade, and audit corporate security systems and staff training. Compliance is demonstrated by signed budget approvals and resource allocation records.",
    category: "Data Protection & Security",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 32",
      evidenceRequired: "IT budget, Training spend",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P3.4",
    title: "Are controls in place to use data only as authorized?",
    description:
      "Requires restricting system access to prevent unauthorized utilization of personal data beyond its approved purpose. Compliance is demonstrated by user role permissions and access authorization logs.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 29",
      evidenceRequired: "RBAC logs",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P3.5",
    title: "Are partner agreements limited to authorized data use?",
    description:
      "Requires executing Data Processing Agreements (DPAs) with partners that legally restrict data usage to specified, authorized purposes. Compliance is demonstrated by executed and signed DPA documents.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 29",
      evidenceRequired: "Data Processing Agreement (DPA)",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P3.6",
    title: "Can data availability be restored timely after an incident?",
    description:
      "Requires establishing and testing disaster recovery (DR) plans to ensure personal data can be restored promptly after system failure or breach. Compliance is demonstrated by backup tests and DR reports.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 32",
      evidenceRequired: "DR/BCP test results",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P3.7",
    title: "Are safeguards implemented for international data transfers?",
    description:
      "Requires executing Standard Contractual Clauses (SCCs) or Binding Corporate Rules (BCRs) for all data transfers outside the EU/EEA. Compliance is demonstrated by active SCC contracts and transfer logs.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 46",
      evidenceRequired: "SCCs, BCRs",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P3.8",
    title: "Are confidentiality measures (ACLs, physical) in place?",
    description:
      "Requires deploying access control lists (ACLs) and physical barriers to ensure only authorized staff access personal data stores. Compliance is demonstrated by active directory configurations and physical audit logs.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 32",
      evidenceRequired: "Physical security audit",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P3.9",
    title: "Are integrity measures (hashing, backups) in place?",
    description:
      "Requires implementing data integrity protections, such as cryptographic hashing and regular offsite backups, to detect and prevent data corruption. Compliance is demonstrated by backup verification reports.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 32",
      evidenceRequired: "Backup verification logs",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P4.0",
    title: "Is there a breach response plan in place?",
    description:
      "Requires documenting a formal Incident Response Plan (IRP) that defines steps to contain, evaluate, and report data breaches. Compliance is demonstrated by presenting the approved IRP.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 33, 34",
      evidenceRequired: "Incident Response Plan (IRP)",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P4.1",
    title: "Does the org notify authorities within 72 hours?",
    description:
      "Requires establishing incident workflows to notify supervisory authorities of data breaches within 72 hours of detection. Compliance is demonstrated by breach notification procedures and incident registers.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 33",
      evidenceRequired: "Breach notification logs",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P4.2",
    title: "Are breach notices clear and inclusive of nature/remedy?",
    description:
      "Requires drafting clear and concise data breach notices for affected subjects that describe the incident nature and recommended mitigation steps. Compliance is demonstrated by subject notification templates.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 34",
      evidenceRequired: "Subject notification templates",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P4.3",
    title: "Is technology in place to detect breaches?",
    description:
      "Requires deploying security monitoring tools, such as SIEM or intrusion detection systems, to continuously monitor networks for breach indicators. Compliance is demonstrated by active SIEM rules.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 33",
      evidenceRequired: "SIEM, IDS/IPS logs",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P4.4",
    title: "Are detailed records of breaches maintained?",
    description:
      "Requires keeping a comprehensive record of all security incidents, including description, effects, and remediation steps. Compliance is demonstrated by the active incident and breach register.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 33",
      evidenceRequired: "Breach register",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P4.5",
    title: "Are lessons learned from breaches documented/applied?",
    description:
      "Requires conducting post-mortem reviews after security incidents to identify improvement actions and update controls. Compliance is demonstrated by post-incident reports and updated policy files.",
    category: "Data Protection & Security",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 33",
      evidenceRequired: "Post-mortem reports",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P4.6",
    title: "Are breach response procedures regularly updated?",
    description:
      "Requires reviewing and updating the Incident Response Plan annually or after major incident tabletop tests. Compliance is demonstrated by annual IRP review stamps and test logs.",
    category: "Data Protection & Security",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 33",
      evidenceRequired: "Annual IRP review",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P4.7",
    title: "Are metrics maintained for breach detection/remediation?",
    description:
      "Requires tracking and reporting performance metrics, such as Mean Time to Detect (MTTD) and Mean Time to Respond (MTTR), to management. Compliance is demonstrated by SOC dashboard reports.",
    category: "Data Protection & Security",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 33",
      evidenceRequired: "SOC Dashboards",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P5.0",
    title: "Does the org perform security testing (technical/social)?",
    description:
      "Requires scheduling regular technical penetration testing and social engineering drills to identify weaknesses. Compliance is demonstrated by pen-test reports and phishing simulation logs.",
    category: "Data Protection & Security",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 32",
      evidenceRequired: "Pentest reports",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P5.1",
    title: "Is there a process to regularly evaluate security measures?",
    description:
      "Requires maintaining a vulnerability management process that scans systems and schedules patch remediation. Compliance is demonstrated by vulnerability scanning policies and patch history.",
    category: "Data Protection & Security",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 32",
      evidenceRequired: "Vulnerability Mgmt Policy",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P5.2",
    title: "Do external partners periodically test security?",
    description:
      "Requires contracting external, qualified security firms to perform independent security assessments on corporate networks. Compliance is demonstrated by signed third-party audit reports.",
    category: "Data Protection & Security",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 32",
      evidenceRequired: "3rd party audit report",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P5.3",
    title: "Is technology in place to regularly test security measures?",
    description:
      "Requires utilizing automated vulnerability scanning tools to run scheduled checks on production networks and applications. Compliance is demonstrated by scanner dashboard configurations.",
    category: "Data Protection & Security",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 32",
      evidenceRequired: "Vulnerability scanner logs",
      area: "Protect",
    },
  },
  {
    code: "GDPR-P5.4",
    title: "Are appropriate personnel in place to perform testing?",
    description:
      "Requires establishing a qualified security team or hiring third-party security assessors to manage vulnerability scanning. Compliance is demonstrated by the security team roster.",
    category: "Data Protection & Security",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 32",
      evidenceRequired: "Security team org chart",
      area: "Protect",
    },
  },
  {
    code: "GDPR-R1.0",
    title: "Does the org maintain RoPA with purpose/scope?",
    description:
      "Requires maintaining a comprehensive Record of Processing Activities (RoPA) that outlines processing purposes, scope, and data retention. Compliance is demonstrated by the active RoPA document.",
    category: "Regulatory Compliance & Reporting",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 30",
      evidenceRequired: "Completed RoPA",
      area: "Report",
    },
  },
  {
    code: "GDPR-R1.1",
    title: "Does RoPA include justification and contact categories?",
    description:
      "Requires detailing legal justifications, data classifications, and recipient contact information within the RoPA entries. Compliance is demonstrated by completed RoPA spreadsheets.",
    category: "Regulatory Compliance & Reporting",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 30",
      evidenceRequired: "RoPA audit",
      area: "Report",
    },
  },
  {
    code: "GDPR-R1.2",
    title: "Is personnel in place to support data recording?",
    description:
      "Requires designating specific roles, such as data stewards or champions, responsible for updating processing records. Compliance is demonstrated by job assignments and RoPA change logs.",
    category: "Regulatory Compliance & Reporting",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 30",
      evidenceRequired: "Data stewards list",
      area: "Report",
    },
  },
  {
    code: "GDPR-R1.3",
    title: "Is technology in place to record required information?",
    description:
      "Requires deploying GRC software or structured databases to record and manage processing activities. Compliance is demonstrated by GRC tool administration screens.",
    category: "Regulatory Compliance & Reporting",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 30",
      evidenceRequired: "GRC tool (e.g., TrustArc)",
      area: "Report",
    },
  },
  {
    code: "GDPR-R1.4",
    title: "Are processes defined to record required information?",
    description:
      "Requires establishing a standard process for documenting and approving new processing activities before operations start. Compliance is demonstrated by the processing record SOP.",
    category: "Regulatory Compliance & Reporting",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 30",
      evidenceRequired: "Data entry SOP",
      area: "Report",
    },
  },
  {
    code: "GDPR-R1.5",
    title: "Is there a process to stay updated on Codes of Conduct?",
    description:
      "Requires establishing channels to monitor supervisory authority publications and industry codes of conduct regularly. Compliance is demonstrated by monitoring logs or legal updates.",
    category: "Regulatory Compliance & Reporting",
    severity: "LOW",
    weight: 1,
    metadata: {
      article: "Art. 30",
      evidenceRequired: "Regulatory feed logs",
      area: "Report",
    },
  },
  {
    code: "GDPR-R1.6",
    title: "Can the org demonstrate adherence to standards/BCRs?",
    description:
      "Requires maintaining documentation that proves adherence to approved codes of conduct or Binding Corporate Rules (BCRs). Compliance is demonstrated by BCR approvals or certifications.",
    category: "Regulatory Compliance & Reporting",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 24",
      evidenceRequired: "Compliance certifications",
      area: "Report",
    },
  },
  {
    code: "GDPR-GW-INT",
    title: "Does the organization transfer personal data outside the EU/EEA?",
    description:
      "Requires reviewing data flow diagrams to determine if personal data is transferred to entities outside the EU/EEA. Compliance is demonstrated by transfer route maps and vendor listings.",
    category: "Regulatory Compliance & Reporting",
    severity: "HIGH",
    weight: 3,
    isGateway: true,
    metadata: {
      article: "Art. 45, 46",
      evidenceRequired: "Answer YES or NO. If NO -> mark sub-controls R2.0-R2.5 as N/A",
      area: "Report",
    },
  },
  {
    code: "GDPR-R2.0",
    title: "Is there documentation of EU data transfers?",
    description:
      "Requires maintaining a detailed register of all personal data transfer flows outside the EU/EEA, including destination details. Compliance is demonstrated by the data transfer log.",
    category: "Regulatory Compliance & Reporting",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 45, 46",
      evidenceRequired: "Data flow diagrams",
      area: "Report",
    },
  },
  {
    code: "GDPR-R2.1",
    title: "Is there a record of ongoing and ad-hoc EU transfers?",
    description:
      "Requires tracking both automated system transfers and manual, ad-hoc files shared with international third parties. Compliance is demonstrated by system export logs and transfer registry entries.",
    category: "Regulatory Compliance & Reporting",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 30",
      evidenceRequired: "Transfer registry",
      area: "Report",
    },
  },
  {
    code: "GDPR-R2.2",
    title: "Is there a process to monitor country adequacy status?",
    description:
      "Requires establishing a regular process to monitor European Commission adequacy decisions to verify the legal status of target nations. Compliance is demonstrated by review logs.",
    category: "Regulatory Compliance & Reporting",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 45",
      evidenceRequired: "Legal update logs",
      area: "Report",
    },
  },
  {
    code: "GDPR-R2.3",
    title: "Are personnel assigned to track international transfers?",
    description:
      "Requires appointing privacy team members or legal specialists to evaluate and track cross-border transfers. Compliance is demonstrated by DPO or trade compliance officer assignments.",
    category: "Regulatory Compliance & Reporting",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 46",
      evidenceRequired: "Trade/Privacy officer roles",
      area: "Report",
    },
  },
  {
    code: "GDPR-R2.4",
    title: "Is technology used to track transfer locations/safeguards?",
    description:
      "Requires implementing cloud access security brokers (CASB) or DLP tools configured to detect and block international data transfers. Compliance is demonstrated by CASB rule profiles.",
    category: "Regulatory Compliance & Reporting",
    severity: "LOW",
    weight: 1,
    metadata: {
      article: "Art. 46",
      evidenceRequired: "CASB/DLP location logs",
      area: "Report",
    },
  },
  {
    code: "GDPR-R2.5",
    title: "Are processes defined to track/record geo-transfers?",
    description:
      "Requires documenting standard procedures for evaluating and approving international transfers, including transfer impact assessments. Compliance is demonstrated by cross-border transfer SOPs.",
    category: "Regulatory Compliance & Reporting",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 46",
      evidenceRequired: "Transfer SOP",
      area: "Report",
    },
  },
  {
    code: "GDPR-GW-3P",
    title:
      "Does the organization share personal data with third-party service providers / processors?",
    description:
      "Requires verifying vendor services to identify third parties that process personal data on behalf of the organization. Compliance is demonstrated by the third-party processor inventory.",
    category: "Regulatory Compliance & Reporting",
    severity: "HIGH",
    weight: 3,
    isGateway: true,
    metadata: {
      article: "Art. 28",
      evidenceRequired: "Answer YES or NO. If NO -> mark sub-controls R3.0-R3.5 as N/A",
      area: "Report",
    },
  },
  {
    code: "GDPR-R3.0",
    title: "Is there an inventory of third-party data processors?",
    description:
      "Requires maintaining a centralized, up-to-date registry of all third-party vendors classified as data processors. Compliance is demonstrated by the processor inventory database.",
    category: "Regulatory Compliance & Reporting",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 28",
      evidenceRequired: "Vendor Inventory",
      area: "Report",
    },
  },
  {
    code: "GDPR-R3.1",
    title: "Are third-parties assessed for data compliance?",
    description:
      "Requires performing pre-contractual and periodic compliance reviews of third-party processor security practices. Compliance is demonstrated by completed vendor risk questionnaires.",
    category: "Regulatory Compliance & Reporting",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 28",
      evidenceRequired: "Vendor Risk Assessment (VRA)",
      area: "Report",
    },
  },
  {
    code: "GDPR-R3.2",
    title: "Are protection requirements defined for all third-parties?",
    description:
      "Requires drafting standard data protection requirements, covering confidentiality and breach reporting, for vendor engagements. Compliance is demonstrated by corporate security addenda.",
    category: "Regulatory Compliance & Reporting",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 28",
      evidenceRequired: "Security Addendum",
      area: "Report",
    },
  },
  {
    code: "GDPR-R3.3",
    title: "Are requirements embedded in third-party contracts?",
    description:
      "Requires executing signed contracts or Data Processing Addenda (DPAs) with processors that contain Article 28 clauses. Compliance is demonstrated by signed vendor contracts.",
    category: "Regulatory Compliance & Reporting",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 28",
      evidenceRequired: "Signed DPAs",
      area: "Report",
    },
  },
  {
    code: "GDPR-R3.4",
    title: "Are there procedures for auditing third-party compliance?",
    description:
      "Requires establishing contractual right-to-audit clauses and schedules to verify vendor compliance to data policies. Compliance is demonstrated by vendor audit logs and schedules.",
    category: "Regulatory Compliance & Reporting",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 28",
      evidenceRequired: "Right-to-audit logs",
      area: "Report",
    },
  },
  {
    code: "GDPR-R3.5",
    title: "Is there ongoing communication with third-parties?",
    description:
      "Requires establishing regular check-ins or review meetings with critical data processors to track security posture updates. Compliance is demonstrated by vendor meeting minutes.",
    category: "Regulatory Compliance & Reporting",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 28",
      evidenceRequired: "Vendor review meetings",
      area: "Report",
    },
  },
  {
    code: "GDPR-GW-DPIA",
    title:
      "Does the organization perform high-risk processing activities that require a Data Protection Impact Assessment (DPIA)?",
    description:
      "Requires reviewing processing activities against Article 35 triggers to identify high-risk operations. Compliance is demonstrated by DPIA screening check results.",
    category: "Regulatory Compliance & Reporting",
    severity: "HIGH",
    weight: 3,
    isGateway: true,
    metadata: {
      article: "Art. 35",
      evidenceRequired: "Answer YES or NO. If NO -> mark sub-controls R4.0-R4.6 as N/A",
      area: "Report",
    },
  },
  {
    code: "GDPR-R4.0",
    title: "Does the organization have a formal process to determine when a DPIA is required?",
    description:
      "Requires implementing a DPIA threshold assessment process to screen new projects or technologies for high risk. Compliance is demonstrated by threshold assessment logs.",
    category: "Regulatory Compliance & Reporting",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 35(1)",
      evidenceRequired: "DPIA Threshold Assessment",
      area: "Report",
    },
  },
  {
    code: "GDPR-R4.1",
    title: "Does the organization conduct DPIAs for high-risk processing activities?",
    description:
      "Requires executing and documenting formal Data Protection Impact Assessments (DPIAs) for all flagged high-risk operations. Compliance is demonstrated by providing completed DPIA reports.",
    category: "Regulatory Compliance & Reporting",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 35(7)",
      evidenceRequired: "Completed DPIA Reports",
      area: "Report",
    },
  },
  {
    code: "GDPR-R4.2",
    title: "Is the DPO consulted during the performance of a DPIA?",
    description:
      "Requires involving the DPO throughout the DPIA process, incorporating their feedback and recommendations into the final report. Compliance is demonstrated by DPO sign-off signatures.",
    category: "Regulatory Compliance & Reporting",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 35(2)",
      evidenceRequired: "DPO Sign-off/Review logs",
      area: "Report",
    },
  },
  {
    code: "GDPR-R4.3",
    title: "Does the DPIA include measures to address risks and demonstrate compliance?",
    description:
      "Requires defining and tracking risk mitigation actions and technical safeguards within every completed DPIA report. Compliance is demonstrated by risk treatment plans.",
    category: "Regulatory Compliance & Reporting",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 35(7)(d)",
      evidenceRequired: "Risk Treatment Plan",
      area: "Report",
    },
  },
  {
    code: "GDPR-R4.4",
    title: "Does the organization seek the views of data subjects on intended processing?",
    description:
      "Requires establishing processes, such as surveys or public consultations, to gather subject feedback on intended high-risk processing. Compliance is demonstrated by consultation records.",
    category: "Regulatory Compliance & Reporting",
    severity: "LOW",
    weight: 1,
    metadata: {
      article: "Art. 35(9)",
      evidenceRequired: "Consultation records",
      area: "Report",
    },
  },
  {
    code: "GDPR-R4.5",
    title: "Does the organization consult the Supervisory Authority prior to high-risk processing?",
    description:
      "Requires submitting the DPIA to the supervisory authority for prior consultation when a DPIA indicates high residual risk. Compliance is demonstrated by regulator correspondence logs.",
    category: "Regulatory Compliance & Reporting",
    severity: "HIGH",
    weight: 3,
    metadata: {
      article: "Art. 36(1)",
      evidenceRequired: "Regulator correspondence",
      area: "Report",
    },
  },
  {
    code: "GDPR-R4.6",
    title: "Is there a process to review and update DPIAs when processing risk changes?",
    description:
      "Requires re-evaluating and updating completed DPIAs when operational workflows or processing risks change. Compliance is demonstrated by DPIA revision logs.",
    category: "Regulatory Compliance & Reporting",
    severity: "MEDIUM",
    weight: 2,
    metadata: {
      article: "Art. 35(11)",
      evidenceRequired: "Revision history logs",
      area: "Report",
    },
  },
];
