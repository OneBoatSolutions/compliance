# Scope and hard constraints you must satisfy in seed data

Task 0.6 requires you to create: **Admin user, Test user, 3 frameworks (GDPR, HIPAA, PCI-DSS) with controls, a sample organization, and a sample assessment with mixed statuses so `prisma db seed` creates realistic demo data.**

Your PRD defines scoring and item-status semantics that your seed distribution should be compatible with:
**NOT_APPLICABLE** items are excluded, **PARTIALLY_COMPLIANT** counts as **0.5**, and scoring is a **weighted average using `control.weight`**, scaled to **0–100**.

You also clarified four additives (not a new plan) that must be applied on top of the above:

- **Strict enum values only**

  **Severity:**
  `LOW | MEDIUM | HIGH | CRITICAL`

  **ItemStatus:**
  `NOT_STARTED | COMPLIANT | PARTIALLY_COMPLIANT | NOT_COMPLIANT | NOT_APPLICABLE`

- **Organization arrays must be real string arrays (Postgres text arrays)**

  `dataHandled: ["PII","ePHI"]`
  `regions: ["US-EAST","EU"]`

- **Weights must be floats 0.1–10.0**
  (e.g., `1.0`, `1.5`, `2.0`)

- **Add 2–3 Evidence records + 1–2 AIInteraction records (COMPLIANCE_MAPPING)**
  to help the frontend populate UI (PRD already describes evidence metadata expectations and the AI mapping response shape).

---

# Seed master records you will create

## Seed users

Per Task 0.6 (store passwords hashed in DB; shown here as seed spec strings).

### User record A (Admin)

- **email:** `admin@cipherion.com`
- **name:** Cipherion Admin
- **role:** `ADMIN`
- **password:** `Admin@123`

### User record B (Test user)

- **email:** `user@test.com`
- **name:** Sarah Chen _(consistent with PRD-style examples)_
- **role:** `USER`
- **password:** `User@1234`

---

# Sample organization profile

Use the PRD’s canonical onboarding example (**“HealthTrack App”**), but with the standardized array tokens you requested.
The PRD explicitly uses this exact business profile in the onboarding flow and then recommends **HIPAA / GDPR / PCI-DSS** for it.

### Organization record

- **productName:** HealthTrack App
- **description:** Mobile app for tracking fitness and nutrition.
- **services:** Data analytics, personalized recommendations.
- **targetCustomers:** Individual consumers, fitness enthusiasts.
- **problemSolved:** Difficulty tracking health metrics consistently.

**dataHandled (string array, standardized):**

```
["PII","ePHI","PAYMENT_CARD_DATA"]
```

_(This matches the PRD’s intent: personal data + health data + payment/subscription processing.)_

**regions (string array, standardized):**

```
["US-EAST","EU"]
```

_(This matches the PRD intent: US + EU operations.)_

---

# Framework records

Frameworks should be **PUBLISHED in seed** so they appear for selection
(PRD: Draft frameworks are not visible to users until published).

Below are **schema-compatible values for your Framework rows**.
`version` is used as a **content version string** for GDPR/HIPAA because your PRD expects semantic versioning to be accepted by admin validation.
For **PCI DSS** we use the real standard version **4.0.1**, which is also semantic.

---

## Framework A

- **code:** GDPR

- **name:** General Data Protection Regulation (GDPR)

- **region:** EU

- **category:** Privacy

- **version:** 1.0.0

- **effectiveDate:** `2018-05-25` _(GDPR applies from 25 May 2018 per Article 99)_

- **status:** `PUBLISHED`

- **publishedAt:** `2026-03-01` _(or “now” in seed)_

- **sourceLink:** use the official Eur-Lex GDPR text link.

**description (paste-ready, ≤ ~1000 chars):**

EU privacy regulation governing processing of personal data. Applies from 25 May 2018. Core obligations include lawful basis & transparency, data subject rights, accountability (records of processing), processor/vendor controls, security of processing, and breach notification. Administrative fines can reach up to **20,000,000 EUR or 4% of worldwide annual turnover** (whichever is higher), depending on the infringement category. Guidance only—this platform is not legal advice.

---

## Framework B

- **code:** HIPAA
- **name:** HIPAA Security Rule
- **region:** US
- **category:** Healthcare
- **version:** 1.0.0
- **effectiveDate:** `2005-04-21`

_(HHS OCR indicates most covered entities had to comply by April 21, 2005; small health plans by April 21, 2006.)_

- **status:** `PUBLISHED`
- **publishedAt:** `2026-03-01`
- **sourceLink:** use HHS “The Security Rule” page or eCFR Subpart C references.

**description (paste-ready):**

US HIPAA Security Rule establishes standards to protect electronic protected health information (ePHI). Requires administrative, physical, and technical safeguards, along with policies/procedures and documentation, aligned to **45 CFR Part 164 Subpart C**. Seed controls in this framework paraphrase required/typical safeguards for readiness tracking; they are not legal guidance.

---

## Framework C

- **code:** PCI-DSS
- **name:** Payment Card Industry Data Security Standard (PCI DSS)
- **region:** Global
- **category:** Financial
- **version:** `4.0.1`

_(Limited revision published June 11, 2024; PCI SSC states no new or deleted requirements in this revision.)_

- **effectiveDate:** `2024-06-11` _(publication date of PCI DSS v4.0.1)_
- **status:** `PUBLISHED`
- **publishedAt:** `2026-03-01`
- **sourceLink:** use the PCI SSC PCI DSS standard page and/or the “Just Published: PCI DSS v4.0.1” announcement.

**description (paste-ready):**

PCI DSS is a global baseline of technical and operational requirements designed to protect payment account data across entities that store, process, transmit CHD/SAD or can impact the CDE. PCI SSC published PCI DSS v4.0 on 31 March 2022 and later issued a limited revision v4.0.1 on 11 June 2024 (clarifications/corrections; no new or deleted requirements). PCI DSS v4.0 is retired on 31 Dec 2024; v4.0.1 becomes the active version supported by PCI SSC.

---

# Control library dataset

All severities are strict enums:

```
LOW | MEDIUM | HIGH | CRITICAL
```

All weights are floats:

```
0.1 – 10.0
```

These controls are intentionally written as **UI-ready “evaluation controls”**:

- short requirement statement
- what to check
- example evidence artifacts

(useful for your checklist UI and for AI remediation prompts, which include control details).

---

# GDPR controls

Derived from GDPR articles in the official text (Eur-Lex) including applicability date (Art. 99) and enforcement/fines (Art. 83).

---

## Control library

| Control.code  | title                                                    | category            | severity | weight | description (seed-ready; paste into Control.description)                                                                                                                                                                                                                                                                            |
| ------------- | -------------------------------------------------------- | ------------------- | -------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GDPR-ART6     | Lawful basis and purpose mapping                         | Lawfulness          | HIGH     | 1.5    | Maintain a register mapping each processing activity to a lawful basis and documented purpose. Evaluate: can the team show lawful basis per activity and align it to disclosures in privacy notices? Evidence examples: processing register/RoPA excerpt; privacy notice mapping; internal decision log for lawful basis selection. |
| GDPR-ART7     | Consent management (where consent is used)               | Consent             | HIGH     | 1.2    | If relying on consent, ensure consent is freely given, specific, informed, unambiguous, and as easy to withdraw as to give. Evaluate: can users withdraw and is consent history auditable? Evidence: consent UI screenshots; consent logs; withdrawal workflow; consent policy.                                                     |
| GDPR-ART12    | Data subject request process and timelines               | Data Subject Rights | MEDIUM   | 1.0    | Provide transparent communication and operational DSAR handling (identity verification, intake, tracking, responses). Evaluate: can the org respond within defined timelines with consistent templates? Evidence: DSAR SOP; ticket workflow; response templates; training notes.                                                    |
| GDPR-ART13-14 | Privacy notice disclosures                               | Transparency        | MEDIUM   | 1.0    | Provide required disclosures at collection (and for indirect collection where applicable) including purposes, legal bases, recipients, retention, and rights. Evaluate: do notices match actual data flows? Evidence: live privacy notice; data inventory ↔ notice mapping; change log.                                             |
| GDPR-ART15    | Right of access fulfillment                              | Data Subject Rights | MEDIUM   | 1.0    | Enable data subjects to obtain confirmation and access to their data and relevant processing info. Evaluate: can exports be produced securely and consistently? Evidence: access request workflow; sample redacted export; identity verification steps.                                                                             |
| GDPR-ART17    | Right to erasure workflow                                | Data Subject Rights | MEDIUM   | 1.0    | Support deletion requests with documented exception handling (where deletion is not required/allowed). Evaluate: can the org delete across systems or document why not? Evidence: deletion runbook; system deletion logs; data retention policy.                                                                                    |
| GDPR-ART20    | Data portability delivery                                | Data Subject Rights | LOW      | 0.8    | Provide portable copies of relevant personal data in a structured, commonly used, machine-readable format when applicable. Evaluate: can exports be delivered securely and in a standard format? Evidence: export format spec; sample CSV/JSON export; secure delivery method.                                                      |
| GDPR-ART25    | Privacy by design and by default                         | Governance & Design | HIGH     | 1.2    | Implement privacy-by-design/default: minimize data, restrict default visibility/access, and embed privacy reviews into SDLC. Evaluate: is there a consistent privacy review gate for new features? Evidence: SDLC checklist; DPIA trigger checklist; architecture review notes.                                                     |
| GDPR-ART30    | Records of processing activities                         | Accountability      | HIGH     | 1.3    | Maintain an up-to-date RoPA/processing register (purposes, categories, recipients, retention, security measures). Evaluate: can the org produce a current RoPA for auditors on demand? Evidence: RoPA doc; update cadence; ownership assignment.                                                                                    |
| GDPR-ART28    | Processor due diligence and contracts                    | Vendor Management   | HIGH     | 1.1    | Use processors that provide sufficient guarantees and execute contracts with required data protection clauses; manage subprocessors. Evaluate: is there a vendor review + DPA tracking process? Evidence: vendor risk assessment; signed DPA; subprocessor list; renewal reminders.                                                 |
| GDPR-ART32    | Security of processing                                   | Security            | HIGH     | 1.5    | Implement appropriate technical/organizational security measures (e.g., confidentiality/integrity/availability controls, testing). Evaluate: is there a defined security baseline and verification (tests/audits)? Evidence: security policy; encryption configs; access controls; security test reports.                           |
| GDPR-ART33    | Supervisory authority breach notification                | Incident Response   | CRITICAL | 1.5    | Maintain an incident response + breach assessment process to notify the supervisory authority when required, including the 72-hour requirement where applicable. Evaluate: can the org triage, classify, and meet notification timelines? Evidence: IR plan; breach decision tree; tabletop exercise record.                        |
| GDPR-ART34    | Data subject breach notification                         | Incident Response   | HIGH     | 1.2    | Maintain a workflow to notify affected individuals when a breach is likely to result in high risk to rights/freedoms. Evaluate: do templates and decision criteria exist? Evidence: notification templates; risk assessment rubric; comms playbook.                                                                                 |
| GDPR-ART35    | DPIA process for high-risk processing                    | Risk Assessment     | MEDIUM   | 1.0    | Perform DPIAs when processing is high-risk; maintain templates, triggers, and review/approval workflow. Evaluate: are DPIAs performed for new high-risk features? Evidence: DPIA template; completed DPIA sample; approval log.                                                                                                     |
| GDPR-ART37-39 | Data Protection Officer responsibilities (if applicable) | Governance          | MEDIUM   | 0.9    | Determine whether a DPO is required; if so, define responsibilities, independence, and contact channel. Evaluate: is DPO requirement assessed and documented? Evidence: DPO determination memo; role description; contact method. (EDPB publishes DPO guidance endorsed at GDPR start.)                                             |

---

# HIPAA controls

These are aligned to the **HIPAA Security Rule safeguards structure (administrative, physical, technical)** and documentation requirements in **45 CFR Part 164 Subpart C**, particularly **§164.308, §164.310, §164.312, and §164.316**.

Compliance timing references come from **HHS OCR Security Rule materials**.

**NIST SP 800-66 Rev.2** provides implementation guidance context you can mirror in the “evaluation/evidence” phrasing.

---

## Control library

| Control.code               | title                            | category                  | severity | weight | description (seed-ready)                                                                                                                                                                                                                                         |
| -------------------------- | -------------------------------- | ------------------------- | -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HIPAA-164.308(a)(1)(ii)(A) | Risk analysis                    | Administrative Safeguards | CRITICAL | 2.0    | Perform and document an accurate and thorough risk analysis of ePHI confidentiality/integrity/availability. Evaluate: does a current risk analysis exist and cover major systems/data flows? Evidence: risk assessment report; data flow diagram; risk register. |
| HIPAA-164.308(a)(1)(ii)(B) | Risk management plan             | Administrative Safeguards | HIGH     | 1.8    | Implement risk management measures sufficient to reduce risks to a reasonable level. Evaluate: are risks tracked to remediation with owners/dates? Evidence: remediation plan; risk acceptance log; backlog/Jira tickets.                                        |
| HIPAA-164.308(a)(2)        | Assigned security responsibility | Administrative Safeguards | MEDIUM   | 1.0    | Assign a security official responsible for developing and implementing HIPAA security policies/procedures. Evaluate: is there a named owner with authority? Evidence: role letter; org chart; policy approvals.                                                  |
| HIPAA-164.308(a)(3)        | Workforce security               | Administrative Safeguards | MEDIUM   | 1.0    | Ensure workforce members have appropriate access and prevent unauthorized access by workforce. Evaluate: are joiner/mover/leaver controls documented? Evidence: onboarding/offboarding checklist; access review records.                                         |
| HIPAA-164.308(a)(4)        | Information access management    | Administrative Safeguards | HIGH     | 1.2    | Implement policies/procedures for authorizing access to ePHI. Evaluate: is access granted by role/need with approvals? Evidence: access request tickets; RBAC matrix; periodic access review.                                                                    |
| HIPAA-164.308(a)(5)        | Security awareness and training  | Administrative Safeguards | MEDIUM   | 1.0    | Implement a security awareness/training program (phishing, password hygiene, incident reporting). Evaluate: is training completed and tracked? Evidence: LMS reports; training content; attendance logs.                                                         |
| HIPAA-164.308(a)(6)        | Security incident procedures     | Administrative Safeguards | HIGH     | 1.2    | Identify and respond to suspected/known security incidents; mitigate harmful effects and document outcomes. Evaluate: do incident tickets show consistent handling? Evidence: IR SOP; incident postmortems; escalation matrix.                                   |
| HIPAA-164.308(a)(7)        | Contingency plan                 | Administrative Safeguards | HIGH     | 1.5    | Establish contingency plans (backup, disaster recovery, emergency mode ops, testing). Evaluate: are backups tested and recovery drills performed? Evidence: backup reports; DR test record; RTO/RPO policy.                                                      |
| HIPAA-164.308(a)(8)        | Security evaluation              | Administrative Safeguards | MEDIUM   | 1.0    | Perform periodic technical and nontechnical evaluation in response to environmental/operational changes. Evaluate: is there an evaluation cadence and documented outcomes? Evidence: annual review checklist; audit reports; change-impact reviews.              |
| HIPAA-164.310(a)(1)        | Facility access controls         | Physical Safeguards       | MEDIUM   | 1.0    | Limit physical access to systems/facilities housing ePHI while ensuring authorized access. Evaluate: are access mechanisms and visitor logs in place? Evidence: badge access reports; visitor log; facility policy.                                              |
| HIPAA-164.310(d)(1)        | Device and media controls        | Physical Safeguards       | MEDIUM   | 1.0    | Govern disposal, media reuse, accountability, and data backup/storage for devices/media with ePHI. Evaluate: is secure disposal documented? Evidence: asset inventory; wipe certificates; disposal vendor receipts.                                              |
| HIPAA-164.312(a)(2)(i)     | Unique user identification       | Technical Safeguards      | MEDIUM   | 1.0    | Assign unique name/number to track user identity for systems maintaining ePHI. Evaluate: are shared accounts prohibited? Evidence: IAM screenshots; policy; access logs.                                                                                         |
| HIPAA-164.312(a)(2)(iv)    | Encryption and decryption        | Technical Safeguards      | CRITICAL | 2.0    | Implement encryption/decryption as appropriate to protect ePHI (especially at rest) and manage keys securely. Evaluate: is ePHI encrypted at rest where stored? Evidence: DB/storage encryption settings; KMS policies; key rotation evidence.                   |
| HIPAA-164.312(b)           | Audit controls                   | Technical Safeguards      | HIGH     | 1.5    | Implement hardware/software mechanisms that record and examine system activity affecting ePHI. Evaluate: are logs centrally collected and reviewed? Evidence: SIEM configuration; audit log samples; alert rules.                                                |
| HIPAA-164.312(c)(1)        | Integrity controls               | Technical Safeguards      | HIGH     | 1.2    | Implement policies/procedures to protect ePHI from improper alteration/destruction. Evaluate: are integrity mechanisms + change controls in place? Evidence: hashing/signature approach; DB audit trails; change management records.                             |
| HIPAA-164.312(d)           | Person or entity authentication  | Technical Safeguards      | HIGH     | 1.2    | Verify that persons/entities seeking access to ePHI are who they claim (strong auth). Evaluate: are MFA and identity verification used for privileged access? Evidence: IdP policies; MFA enforcement; authentication logs.                                      |
| HIPAA-164.312(e)(1)        | Transmission security            | Technical Safeguards      | HIGH     | 1.5    | Protect ePHI transmitted over networks (integrity controls and encryption). Evaluate: are strong TLS and secure transport required? Evidence: TLS config; API gateway settings; network diagrams.                                                                |
| HIPAA-164.316(b)(1)        | Documentation requirements       | Policies & Documentation  | MEDIUM   | 1.0    | Maintain required security documentation, update it, and retain it per requirements. Evaluate: is documentation versioned and accessible for audit? Evidence: policy repository; version history; retention policy.                                              |

---

# PCI DSS controls

**PCI DSS v4.0** was published **March 31, 2022** and **v4.0.1 (limited revision)** on **June 11, 2024**; PCI SSC states it includes clarifications/corrections with **no new or deleted requirements** and that **PCI DSS v4.0 retires on 31 Dec 2024**.

PCI SSC describes **PCI DSS** as a baseline of **technical and operational requirements to protect payment account data** for entities that store/process/transmit **CHD/SAD** or can impact the **CDE**.

---

## Control library

| Control.code | title                                | category          | severity | weight | description (seed-ready)                                                                                                                                                                                                                                                                                          |
| ------------ | ------------------------------------ | ----------------- | -------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PCI-1.2      | Network security controls            | Network Security  | HIGH     | 1.5    | Maintain network security controls to restrict inbound/outbound traffic to what is necessary for the CDE and document rule intent. Evaluate: is there a reviewed ruleset and segmentation rationale? Evidence: firewall/NSC configs; rule review log; network diagram.                                            |
| PCI-2.2      | Secure configurations                | Hardening         | MEDIUM   | 1.2    | Apply secure configuration standards to system components; remove insecure defaults. Evaluate: do baseline hardening standards exist and are they applied? Evidence: CIS-aligned baseline; config management output; golden image docs.                                                                           |
| PCI-3.4      | Render PAN unreadable at rest        | Data Protection   | CRITICAL | 2.0    | Protect stored account data by rendering PAN unreadable (tokenization, strong encryption, etc.) and limiting exposure. Evaluate: can the org prove PAN is not stored in cleartext? Evidence: DB schema review; encryption proof; tokenization design.                                                             |
| PCI-3.6      | Cryptographic key management         | Data Protection   | HIGH     | 1.5    | Manage cryptographic keys securely (generation, storage, access control, rotation, retirement). Evaluate: are keys protected and rotated with audits? Evidence: KMS policies; rotation logs; key access audit trails.                                                                                             |
| PCI-4.2      | Encrypt transmission of account data | Data Protection   | HIGH     | 1.5    | Use strong cryptography and secure protocols for transmission of account data over open/public networks. Evaluate: is TLS enforced end-to-end with modern configs? Evidence: TLS policy; endpoint scans; API gateway config.                                                                                      |
| PCI-5.1      | Malware defenses                     | Endpoint Security | MEDIUM   | 1.2    | Deploy anti-malware/EDR where applicable and keep it current. Evaluate: is protection enabled and monitored? Evidence: EDR console screenshot; alert history; update policy.                                                                                                                                      |
| PCI-6.3      | Secure development and patching      | Secure SDLC       | HIGH     | 1.5    | Develop securely, manage changes, and remediate vulnerabilities with defined timelines. Evaluate: are patches and SDLC controls enforced with evidence? Evidence: change tickets; dependency scanning output; patch reports. (PCI SSC notes v4.0.1 includes clarifications, e.g., around Requirement 6 language.) |
| PCI-7.2      | Least privilege / need-to-know       | Access Control    | MEDIUM   | 1.0    | Restrict access to system components and data based on business need-to-know. Evaluate: is RBAC documented and reviewed? Evidence: access matrix; least privilege reviews; group memberships.                                                                                                                     |
| PCI-8.4      | Multi-factor authentication          | Access Control    | HIGH     | 1.5    | Require MFA for access into the CDE (and other in-scope access as applicable) and manage authentication securely. Evaluate: is MFA broadly enforced and exceptions documented? Evidence: IdP MFA policies; access logs; exception register.                                                                       |
| PCI-10.2     | Audit logging and monitoring         | Monitoring        | HIGH     | 1.2    | Implement audit logs for system events and review/alert on suspicious activity. Evaluate: are logs centralized and reviewed at required cadence? Evidence: SIEM dashboards; log retention settings; alert playbooks.                                                                                              |
| PCI-11.3     | Security testing                     | Testing           | HIGH     | 1.5    | Perform vulnerability scans/penetration testing and validate segmentation where applicable. Evaluate: are tests scheduled and findings tracked? Evidence: scan reports; pen test reports; remediation tickets.                                                                                                    |
| PCI-12.1     | Security policy and program          | Governance        | MEDIUM   | 1.0    | Maintain an information security policy and supporting program to sustain PCI controls over time. Evaluate: is policy current and assigned to owners? Evidence: policy set; annual review log; training acknowledgements.                                                                                         |

---

# Sample assessment with mixed statuses

**Strict `ItemStatus` enums + computed score expectations + comments**

---

## Assessment record (seed)

Your PRD expects assessment creation with status **`IN_PROGRESS`** and items created per selected frameworks; it also defines that **scoring recalculates as statuses change**.

**Assessment**

- **status:** `IN_PROGRESS`
- **score:** set to the computed overall score after seeding items
  _(or store `null` initially and compute once you set statuses; your UI will show it after calculation either way)._

The PRD’s formula **rounds to 1 decimal**.

---

# Seeded assessment items status map

This distribution is intentionally designed to:

- include **all five statuses** (including `NOT_APPLICABLE`)
- produce a **realistic overall score** using PRD weighted scoring
- leave a **few high-severity gaps** to exercise AI remediation and **“critical risks” UI**

---

# GDPR items

| Control.code  | status              | comments (optional, seed-ready)                                              |
| ------------- | ------------------- | ---------------------------------------------------------------------------- |
| GDPR-ART6     | COMPLIANT           | Lawful basis mapped per processing activity; reviewed in Q1.                 |
| GDPR-ART7     | PARTIALLY_COMPLIANT | Consent capture exists, but withdrawal + audit trail not fully standardized. |
| GDPR-ART12    | COMPLIANT           | DSAR SOP exists with tracked intake and response templates.                  |
| GDPR-ART13-14 | COMPLIANT           | Privacy notice published and mapped to inventory.                            |
| GDPR-ART15    | COMPLIANT           | Access exports supported via internal data export tool.                      |
| GDPR-ART17    | COMPLIANT           | Deletion workflow documented; manual steps for 2 legacy systems.             |
| GDPR-ART20    | NOT_STARTED         | No standardized portability export (machine-readable) yet.                   |
| GDPR-ART25    | COMPLIANT           | Privacy review added to feature launch checklist.                            |
| GDPR-ART30    | PARTIALLY_COMPLIANT | RoPA exists but not consistently updated per release cycle.                  |
| GDPR-ART28    | COMPLIANT           | DPAs in place for key vendors; renewal tracker maintained.                   |
| GDPR-ART32    | COMPLIANT           | TLS enforced; access controls documented; security testing scheduled.        |
| GDPR-ART33    | NOT_COMPLIANT       | No tested 72-hour supervisory authority notification playbook.               |
| GDPR-ART34    | NOT_STARTED         | No templated data-subject breach comms workflow.                             |
| GDPR-ART35    | COMPLIANT           | DPIA template exists; performed for EU feature rollout.                      |
| GDPR-ART37-39 | NOT_APPLICABLE      | DPO requirement evaluated as not applicable for current scale.               |

---

# HIPAA items

| Control.code               | status              | comments (optional, seed-ready)                                  |
| -------------------------- | ------------------- | ---------------------------------------------------------------- |
| HIPAA-164.308(a)(1)(ii)(A) | COMPLIANT           | Annual risk analysis performed; risks tracked in register.       |
| HIPAA-164.308(a)(1)(ii)(B) | PARTIALLY_COMPLIANT | Risk treatment plan in progress; 4 risks pending mitigation.     |
| HIPAA-164.308(a)(2)        | COMPLIANT           | Security Officer assigned and documented.                        |
| HIPAA-164.308(a)(3)        | COMPLIANT           | Joiner/mover/leaver checklist enforced through IT tickets.       |
| HIPAA-164.308(a)(4)        | COMPLIANT           | RBAC matrix defined; access approvals required.                  |
| HIPAA-164.308(a)(5)        | PARTIALLY_COMPLIANT | Training exists; phishing simulations not yet implemented.       |
| HIPAA-164.308(a)(6)        | COMPLIANT           | Incident response SOP exists with reporting channel.             |
| HIPAA-164.308(a)(7)        | PARTIALLY_COMPLIANT | Backups configured; DR restore tests irregular.                  |
| HIPAA-164.308(a)(8)        | NOT_STARTED         | No formal periodic security evaluation cadence yet.              |
| HIPAA-164.310(a)(1)        | COMPLIANT           | Office access restricted; visitor logs maintained.               |
| HIPAA-164.310(d)(1)        | COMPLIANT           | Device inventory maintained; secure wipe required on disposal.   |
| HIPAA-164.312(a)(2)(i)     | COMPLIANT           | No shared accounts; unique IDs enforced in IdP.                  |
| HIPAA-164.312(a)(2)(iv)    | NOT_COMPLIANT       | Encryption at rest not implemented for one production datastore. |
| HIPAA-164.312(b)           | PARTIALLY_COMPLIANT | Logging exists; alerts and review procedures incomplete.         |
| HIPAA-164.312(c)(1)        | COMPLIANT           | Change controls + integrity checks in place for ePHI records.    |
| HIPAA-164.312(d)           | COMPLIANT           | MFA required for admin access; SSO enforced.                     |
| HIPAA-164.312(e)(1)        | COMPLIANT           | TLS enforced for API traffic; transmission encryption verified.  |
| HIPAA-164.316(b)(1)        | COMPLIANT           | Policies versioned and retained in controlled repository.        |

---

# PCI DSS items

| Control.code | status              | comments (optional, seed-ready)                                        |
| ------------ | ------------------- | ---------------------------------------------------------------------- |
| PCI-1.2      | COMPLIANT           | Network security rules documented; quarterly review scheduled.         |
| PCI-2.2      | COMPLIANT           | Hardened baselines applied via CI/CD + configuration management.       |
| PCI-3.4      | NOT_COMPLIANT       | PAN encryption/tokenization not implemented for legacy billing export. |
| PCI-3.6      | PARTIALLY_COMPLIANT | Key storage is centralized; rotation evidence incomplete.              |
| PCI-4.2      | COMPLIANT           | TLS enforced; weak ciphers disabled.                                   |
| PCI-5.1      | COMPLIANT           | EDR deployed on endpoints; alerts monitored.                           |
| PCI-6.3      | PARTIALLY_COMPLIANT | Secure coding standards exist; SAST/DAST coverage incomplete.          |
| PCI-7.2      | COMPLIANT           | Least privilege enforced; quarterly access reviews performed.          |
| PCI-8.4      | PARTIALLY_COMPLIANT | MFA for admins enabled; not fully enforced for all in-scope access.    |
| PCI-10.2     | COMPLIANT           | Centralized logging configured; retention meets internal policy.       |
| PCI-11.3     | NOT_STARTED         | Pen test vendor not selected; scans not scheduled.                     |
| PCI-12.1     | COMPLIANT           | InfoSec policy approved and reviewed annually.                         |

---

# Expected scores for validation

Using the PRD scoring formula (**weighted average; `NOT_APPLICABLE` excluded; `PARTIALLY_COMPLIANT` = 0.5**), this seed set is tuned to produce realistic demo numbers.

- **GDPR expected score:** ~70.9%
- **HIPAA expected score:** ~74.5%
- **PCI DSS expected score:** ~65.4%

**Overall expected score (all applicable items):** ~70.7%
_(round to 1 decimal place)_

---

# Evidence mock records

**Two to three sample rows to populate the UI**

Your PRD expects **evidence metadata** such as **filename, size, MIME type, uploader, and description**, and it references PDF-like evidence _(“Access Control Policy v2.1”)_ as an example.

Below are **3 seed-ready Evidence records**.
They are designed to look realistic and to attach to meaningful controls **(one HIPAA, one GDPR, one PCI)**.

Because `Evidence.assessmentItemId` depends on IDs created during seeding, each record states **which control’s AssessmentItem it must attach to**.

---

## Evidence record E1 (HIPAA encryption gap evidence)

- **Attach to AssessmentItem:** control `HIPAA-164.312(a)(2)(iv)`

- **userId:** Test user (Sarah)

- **filename:**
  `seed/hipaa/encryption-at-rest-gap-analysis.pdf`

- **originalName:**
  `Encryption-at-Rest-Gap-Analysis.pdf`

- **mimeType:**
  `application/pdf`

- **fileSize:**
  `482193` bytes

- **description:**
  Gap analysis for ePHI encryption at rest; legacy datastore identified.

- **fileUrl:**

  ```
  https://minio.local/seed-bucket/seed/hipaa/encryption-at-rest-gap-analysis.pdf
  ```

---

## Evidence record E2 (GDPR RoPA partial evidence)

- **Attach to AssessmentItem:** control `GDPR-ART30`

- **userId:** Test user (Sarah)

- **filename:**
  `seed/gdpr/ropa-inventory.xlsx`

- **originalName:**
  `RoPA-Inventory-HealthTrack.xlsx`

- **mimeType:**
  `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

- **fileSize:**
  `913284` bytes

- **description:**
  Draft records of processing activities; needs quarterly refresh cadence.

- **fileUrl:**

  ```
  https://minio.local/seed-bucket/seed/gdpr/ropa-inventory.xlsx
  ```

---

## Evidence record E3 (PCI logging evidence)

- **Attach to AssessmentItem:** control `PCI-10.2`

- **userId:** Test user (Sarah)

- **filename:**
  `seed/pci/siem-log-retention-policy.pdf`

- **originalName:**
  `SIEM-Log-Retention-Policy.pdf`

- **mimeType:**
  `application/pdf`

- **fileSize:**
  `268044` bytes

- **description:**
  SIEM logging and retention policy excerpt for PCI audit logging control.

- **fileUrl:**

```
https://minio.local/seed-bucket/seed/pci/siem-log-retention-policy.pdf
```

---

# AIInteraction mock records

**One to two COMPLIANCE_MAPPING examples with JSON-stringified input/output**

Your PRD’s **AI mapping flow** takes the **organization profile** and returns a **JSON response containing a ranked list of frameworks with confidence scores and explanations**.

Your schema allows **`assessmentId` to be nullable** for mapping runs that happen **before an assessment is created**.

That matches the PRD flow:

```
AI suggests frameworks → user selects → assessment is created
```

Below are **2 seed-ready AIInteraction rows**.

Both use:

```
type = COMPLIANCE_MAPPING
```

The **input and output values are JSON strings** and should be stored **exactly as strings**.

---

# AIInteraction A1 (pre-assessment mapping)

- **assessmentId:** `null`
- **type:** `COMPLIANCE_MAPPING`
- **model:** `gpt-4o-mini` _(dummy label)_
- **tokensUsed:** `1120`
- **durationMs:** `1840`

### input (JSON string to store)

```json
{
  "productName": "HealthTrack App",
  "description": "Mobile app for tracking fitness and nutrition.",
  "services": "Data analytics, personalized recommendations.",
  "targetCustomers": "Individual consumers, fitness enthusiasts.",
  "problemSolved": "Difficulty tracking health metrics consistently.",
  "dataHandled": ["PII", "ePHI", "PAYMENT_CARD_DATA"],
  "regions": ["US-EAST", "EU"],
  "task": "Map this organization to applicable compliance frameworks. Return up to 8 frameworks with confidence (0-100), explanation (2-3 sentences), and tags."
}
```

### output (JSON string to store)

```json
{
  "frameworks": [
    {
      "code": "HIPAA",
      "name": "HIPAA Security Rule",
      "confidence": 95,
      "explanation": "Your product processes electronic protected health information (ePHI) for U.S. users. HIPAA Security Rule safeguards apply to systems that store, process, or transmit ePHI through administrative, physical, and technical controls.",
      "tags": ["healthcare", "us", "ephi", "security"]
    },
    {
      "code": "GDPR",
      "name": "General Data Protection Regulation (GDPR)",
      "confidence": 90,
      "explanation": "You operate in the EU and process personally identifiable information. GDPR applies to processing of personal data in the EU, requiring lawful basis, transparency, data subject rights handling, and strong security and breach procedures.",
      "tags": ["privacy", "eu", "pii", "data-protection"]
    },
    {
      "code": "PCI-DSS",
      "name": "Payment Card Industry Data Security Standard (PCI DSS)",
      "confidence": 85,
      "explanation": "You process payment card data for subscriptions. PCI DSS is required by payment programs for entities handling cardholder data and mandates controls like encryption, access management, logging, and security testing.",
      "tags": ["payments", "card-data", "security", "financial"]
    }
  ]
}
```

---

# AIInteraction A2 (mapping attached to assessment)

- **assessmentId:** `<ASSESSMENT_ID>`
- **type:** `COMPLIANCE_MAPPING`
- **model:** `gpt-4o-mini`
- **tokensUsed:** `980`
- **durationMs:** `1520`

### input

```json
{
  "assessmentId": "<ASSESSMENT_ID>",
  "organizationId": "<ORG_ID>",
  "regions": ["US-EAST", "EU"],
  "dataHandled": ["PII", "ePHI", "PAYMENT_CARD_DATA"],
  "task": "Confirm or refine applicable compliance frameworks for this assessment context."
}
```

### output

```json
{
  "frameworks": [
    {
      "code": "HIPAA",
      "name": "HIPAA Security Rule",
      "confidence": 96,
      "explanation": "Primary driver is ePHI handling in the U.S.; Security Rule safeguards are core.",
      "tags": ["healthcare", "us", "ephi"]
    },
    {
      "code": "GDPR",
      "name": "General Data Protection Regulation (GDPR)",
      "confidence": 88,
      "explanation": "EU operations + PII triggers GDPR obligations including rights handling and breach response.",
      "tags": ["privacy", "eu", "pii"]
    },
    {
      "code": "PCI-DSS",
      "name": "Payment Card Industry Data Security Standard (PCI DSS)",
      "confidence": 84,
      "explanation": "Subscription billing involving card data requires PCI DSS controls around storage, transmission, access, and monitoring.",
      "tags": ["payments", "card-data"]
    }
  ],
  "notes": "Confidence reflects typical applicability; confirm scope with payment processor and legal counsel."
}
```

---

# Final pre-coding validation checklist

Run these checks before implementing the seed script to avoid schema/runtime issues.

- Ensure all **Control.severity** values are exactly one of:

```
LOW | MEDIUM | HIGH | CRITICAL
```

- Ensure every **AssessmentItem.status** is exactly one of:

```
NOT_STARTED | COMPLIANT | PARTIALLY_COMPLIANT | NOT_COMPLIANT | NOT_APPLICABLE
```

- Ensure **Organization.dataHandled** and **Organization.regions** are arrays (`String[]`) and **not serialized strings**.

- Ensure every **Control.weight** is a **float** (`1.0`, `1.5`, `2.0`, etc.) and within **0.1–10.0**.

- Ensure there are **no duplicate `(frameworkId, code)` pairs** among controls.
  _(schema constraint: `@@unique([frameworkId, code])`)_

- Mark frameworks as **PUBLISHED** and set **publishedAt**, otherwise they may not appear in framework selection flows.

- **Evidence mocks** must reference **real `assessmentItemId` values** created during the seed run.

- **AIInteraction COMPLIANCE_MAPPING mocks** must follow the PRD mapping response shape:
  - frameworks array
  - confidence
  - explanation
  - tags

- `assessmentId` **can be null** for mapping runs that occur **before assessment creation**.

---
