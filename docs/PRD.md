# Product Requirements Document (PRD)

## AI-Assured Compliance Dashboard

**Version:** 1.0  
**Date:** February 12, 2026  
**Product Owner:** Cipherion Team  
**Document Status:** Initial Draft

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [Problem Statement](#3-problem-statement)
4. [Target Audience](#4-target-audience)
5. [Product Goals & Success Metrics](#5-product-goals--success-metrics)
6. [User Personas](#6-user-personas)
7. [User Stories & Use Cases](#7-user-stories--use-cases)
8. [Functional Requirements](#8-functional-requirements)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [User Experience & Design](#10-user-experience--design)
11. [Technical Architecture](#11-technical-architecture)
12. [Data Model](#12-data-model)
13. [AI/ML Requirements](#13-aiml-requirements)
14. [Security & Compliance](#14-security--compliance)
15. [Analytics & Reporting](#15-analytics--reporting)
16. [Release Planning](#16-release-planning)
17. [Dependencies & Risks](#17-dependencies--risks)
18. [Appendices](#18-appendices)

---

## 1. Executive Summary

### 1.1 Vision Statement

Build a comprehensive, AI-powered compliance management platform that helps organizations discover, assess, and maintain compliance readiness across multiple regulatory frameworks without requiring deep legal expertise.

### 1.2 Product Mission

Democratize compliance management by providing an intelligent, self-service platform that:

- Automatically identifies applicable regulatory frameworks
- Guides organizations through structured compliance assessments
- Generates actionable remediation plans using AI
- Produces audit-ready compliance reports

### 1.3 Strategic Alignment

**Market Opportunity:**

- Growing regulatory complexity (250+ compliance frameworks globally)
- SMBs spend 25% of their budget on compliance-related activities
- 73% of organizations struggle to understand which regulations apply to them
- Compliance automation market expected to reach $45B by 2027

**Competitive Advantage:**

- AI-driven framework discovery (unique differentiator)
- No-code compliance assessment platform
- Integrated remediation guidance
- Single-tenant security model for sensitive compliance data

---

## 2. Product Overview

### 2.1 Product Description

The AI-Assured Compliance Dashboard is a web-based SaaS platform that enables organizations to:

1. **Discover** - Input business details and receive AI-powered recommendations for applicable compliance frameworks
2. **Assess** - Complete structured checklists derived from regulatory controls
3. **Track** - Monitor compliance readiness with real-time scoring and risk visualization
4. **Remediate** - Receive AI-generated, step-by-step remediation plans
5. **Report** - Generate comprehensive compliance readiness reports for stakeholders and auditors

### 2.2 Key Features

| Feature                    | Description                                                       | Priority          |
| -------------------------- | ----------------------------------------------------------------- | ----------------- |
| AI Framework Mapping       | Intelligent matching of business profile to compliance frameworks | P0 (Must Have)    |
| Assessment Engine          | Structured checklist-based compliance evaluation                  | P0 (Must Have)    |
| Real-time Scoring          | Dynamic compliance score calculation                              | P0 (Must Have)    |
| AI Remediation             | Automated remediation plan generation                             | P0 (Must Have)    |
| Report Generation          | PDF/Web compliance readiness reports                              | P0 (Must Have)    |
| Framework Admin            | CRUD operations for compliance frameworks (Admin)                 | P0 (Must Have)    |
| User Management            | Role-based access control (Admin/User)                            | P0 (Must Have)    |
| Multi-Framework Assessment | Assess against multiple frameworks simultaneously                 | P1 (Should Have)  |
| Evidence Templates         | Pre-built evidence requirement templates                          | P1 (Should Have)  |
| Audit Trail                | Complete history of assessment changes                            | P2 (Nice to Have) |
| Collaboration              | Comments and task assignment                                      | P2 (Nice to Have) |

### 2.3 What This Product Is NOT

❌ **Not a Certification Authority** - Does not provide official compliance certification  
❌ **Not Legal Advice** - Provides guidance, not legal counsel  
❌ **Not an Audit Service** - Does not replace third-party audits  
❌ **Not a Filing System** - Does not submit regulatory filings  
❌ **Not Multi-Tenant (v1.0)** - Single organization per deployment

---

## 3. Problem Statement

### 3.1 Current State Problems

**For Small to Medium Businesses (SMBs):**

1. **Discovery Problem**
   - Don't know which regulations apply to their business
   - Spend 40+ hours researching applicable frameworks
   - Miss critical regulatory requirements

2. **Translation Problem**
   - Legal frameworks written in complex language
   - Difficulty translating requirements into actionable tasks
   - No clear mapping to technical/operational controls

3. **Assessment Problem**
   - Manual spreadsheet tracking (error-prone)
   - No standardized assessment methodology
   - Lack of visibility into compliance gaps

4. **Remediation Problem**
   - Don't know how to fix compliance gaps
   - Generic consulting advice (expensive, slow)
   - No prioritization guidance

5. **Reporting Problem**
   - Time-consuming manual report creation
   - Inconsistent documentation
   - Difficulty demonstrating compliance to stakeholders

### 3.2 Market Gaps

Current solutions are either:

- **Too Complex** - Enterprise GRC platforms (too expensive, require dedicated teams)
- **Too Generic** - Spreadsheet templates (no intelligence, manual)
- **Too Narrow** - Single-framework tools (don't scale)

### 3.3 Impact of Problem

- **Financial:** Average $5M cost of non-compliance fines
- **Operational:** 3-6 months to achieve initial compliance
- **Reputational:** 60% of customers won't trust non-compliant businesses
- **Strategic:** Compliance blockers prevent market expansion

---

## 4. Target Audience

### 4.1 Primary Target Market

**Industry Segments:**

1. **SaaS/Technology Companies** (30-500 employees)
   - Handling customer data
   - Expanding to regulated markets (EU, healthcare)
   - Need: GDPR, SOC 2, ISO 27001

2. **Healthcare/Health Tech** (20-200 employees)
   - Processing health information
   - Need: HIPAA, HITECH, state-specific regulations

3. **FinTech/Financial Services** (25-300 employees)
   - Handling payment data
   - Need: PCI-DSS, SOC 2, financial regulations

4. **E-commerce/Retail** (50-500 employees)
   - Processing customer payments and data
   - Need: PCI-DSS, GDPR/CCPA

### 4.2 Geographic Focus

**Phase 1:** United States, European Union  
**Phase 2:** UK, Canada, Australia  
**Phase 3:** APAC markets

### 4.3 User Roles

| Role               | Description                    | Percentage of Users |
| ------------------ | ------------------------------ | ------------------- |
| Compliance Manager | Primary user, runs assessments | 40%                 |
| IT/Security Lead   | Technical implementation       | 30%                 |
| Operations Manager | Process owner                  | 15%                 |
| Executive/CFO      | Report consumer                | 10%                 |
| Admin (Internal)   | Platform administrator         | 5%                  |

---

## 5. User Personas

### Persona 1: Sarah - Compliance Manager

**Demographics:**

- Age: 32
- Title: Compliance Manager
- Company: SaaS startup (150 employees)
- Location: San Francisco, CA

**Background:**

- MBA, 5 years in operations/compliance
- Responsible for SOC 2, GDPR compliance
- Reports to CFO/COO
- Works with IT and Security teams

**Goals:**

- Pass SOC 2 Type II audit this year
- Demonstrate GDPR compliance to EU customers
- Reduce time spent on compliance admin work
- Build scalable compliance processes

**Pain Points:**

- Drowning in spreadsheets and documentation
- Doesn't have legal/technical background
- Uncertain about regulatory requirements
- Struggles to get IT buy-in for controls
- Manual report creation takes weeks

**Technology Comfort:**

- High - comfortable with SaaS tools
- Uses: Jira, Confluence, Google Workspace
- Prefers: Clean UI, automation, integrations

**Use Case:**
"I need to know exactly what we need to do for SOC 2 and GDPR, track our progress in one place, and generate reports for our auditors without spending weeks on documentation."

---

### Persona 2: Mike - IT Security Lead

**Demographics:**

- Age: 38
- Title: Director of IT Security
- Company: Healthcare startup (80 employees)
- Location: Boston, MA

**Background:**

- Computer Science degree, CISSP certified
- 12 years in IT/Security
- Responsible for HIPAA compliance
- Manages team of 5 engineers

**Goals:**

- Achieve HIPAA compliance certification
- Implement technical security controls
- Pass security audits
- Reduce security incidents

**Pain Points:**

- Legal/regulatory text is confusing
- Unsure which technical controls map to HIPAA
- Limited budget for consulting
- Needs to justify security investments to executives
- Compliance feels like "checkbox exercise"

**Technology Comfort:**

- Very High - technical background
- Uses: AWS, Docker, Terraform, GitHub
- Prefers: API access, automation, integrations

**Use Case:**
"I know security, but I don't know compliance law. I need clear mapping from HIPAA requirements to actual technical controls I can implement, and I need to prove we're compliant without hiring expensive consultants."

---

### Persona 3: Rachel - Operations Manager

**Demographics:**

- Age: 45
- Title: VP of Operations
- Company: E-commerce retailer (200 employees)
- Location: Austin, TX

**Background:**

- Business Administration degree
- 15 years in operations management
- Responsible for PCI-DSS compliance
- Works with payment processors

**Goals:**

- Maintain PCI-DSS certification
- Streamline payment processing operations
- Reduce compliance costs
- Ensure business continuity

**Pain Points:**

- Compliance feels overwhelming
- Annual audits are stressful
- Hard to keep track of all requirements
- Process documentation is scattered
- Difficult to get executive budget approval

**Technology Comfort:**

- Medium - comfortable with common tools
- Uses: Excel, Shopify, QuickBooks
- Prefers: Simple, guided workflows

**Use Case:**
"I need step-by-step guidance on PCI-DSS requirements, easy tracking of what we've done and what's left, and clear reports I can show to our payment processor and auditors."

---

### Persona 4: David - CFO/Executive

**Demographics:**

- Age: 50
- Title: Chief Financial Officer
- Company: FinTech startup (120 employees)
- Location: New York, NY

**Background:**

- CPA, MBA
- 20 years in finance/executive roles
- Board member responsibilities
- Oversees compliance budget

**Goals:**

- Ensure regulatory compliance (avoid fines)
- Demonstrate due diligence to investors/board
- Optimize compliance spend
- Enable business growth into regulated markets

**Pain Points:**

- Limited visibility into compliance status
- Concerned about regulatory risk
- Doesn't understand technical details
- Needs executive-level reporting
- Compliance feels like cost center

**Technology Comfort:**

- Medium - uses business tools
- Uses: Excel, Salesforce, Tableau
- Prefers: Dashboards, summaries, ROI metrics

**Use Case:**
"I need a dashboard that shows our overall compliance posture, highlights critical risks, and generates reports I can present to the board and investors. I need confidence we won't face regulatory fines."

---

### Persona 5: Alex - Admin (Internal - Cipherion)

**Demographics:**

- Age: 28
- Title: Compliance Content Manager
- Company: Cipherion (product company)
- Location: Remote

**Background:**

- Legal background, paralegal experience
- Subject matter expert in compliance frameworks
- Maintains regulatory content
- Works with legal/compliance consultants

**Goals:**

- Keep framework content up-to-date
- Ensure accuracy of control mappings
- Support customer success
- Scale content operations

**Pain Points:**

- Regulations change frequently
- Manual content updates are time-consuming
- Need version control for frameworks
- Customer questions about framework accuracy

**Technology Comfort:**

- High - comfortable with CMS systems
- Uses: Notion, Airtable, GitHub
- Prefers: Structured workflows, bulk operations

**Use Case:**
"I need an efficient way to add new compliance frameworks, update existing ones when regulations change, and ensure all control mappings are accurate and current."

---

## 6. User Stories & Use Cases

### 6.1 Epic 1: Organization Onboarding & Framework Discovery

#### User Story 1.1: Business Profile Creation

**As a** Compliance Manager  
**I want to** input my organization's business details  
**So that** the system can identify which compliance frameworks apply to us

**Acceptance Criteria:**

- [ ] Form accepts: product name, description, services, target customers, problem solved
- [ ] Form accepts data types: checkboxes for PII, PHI, Financial, Payment, Biometric, etc.
- [ ] Form accepts regions: multi-select for US, EU, UK, Canada, APAC, etc.
- [ ] Form validates required fields
- [ ] Progress is auto-saved
- [ ] Can edit profile after submission

**User Flow:**

```
1. User clicks "Start Assessment"
2. System displays onboarding form (Step 1/2)
3. User fills in:
   - Product name: "HealthTrack App"
   - Description: "Mobile app for tracking fitness and nutrition"
   - Services: "Data analytics, personalized recommendations"
   - Target customers: "Individual consumers, fitness enthusiasts"
   - Problem solved: "Difficulty tracking health metrics consistently"
4. User selects data types:
   ✓ PII (names, emails)
   ✓ Health data (fitness metrics, nutrition)
   ✓ Payment data (subscription processing)
5. User selects regions:
   ✓ United States
   ✓ European Union
6. User clicks "Next"
7. System saves profile and proceeds to AI analysis
```

---

#### User Story 1.2: AI Framework Suggestions

**As a** Compliance Manager  
**I want to** receive AI-powered suggestions for applicable frameworks  
**So that** I don't miss any regulatory requirements

**Acceptance Criteria:**

- [ ] AI processes business profile within 10 seconds
- [ ] AI returns ranked list of frameworks (max 8)
- [ ] Each suggestion includes:
  - Framework name and code
  - Confidence score (0-100%)
  - Explanation (2-3 sentences)
  - Framework category (Privacy, Security, Healthcare, etc.)
- [ ] Suggestions are sorted by confidence (highest first)
- [ ] User can accept/reject each suggestion
- [ ] User can manually add frameworks not suggested
- [ ] System explains why each framework was suggested

**User Flow:**

```
1. System shows "Analyzing your business..." (loading state)
2. AI returns suggestions:

   ✓ HIPAA (95% confidence)
   "Your app processes health data for US consumers. HIPAA applies to
   apps handling protected health information."

   ✓ GDPR (90% confidence)
   "You operate in the EU and process personal data. GDPR is mandatory
   for EU data processing."

   ✓ PCI-DSS (85% confidence)
   "You process payment card data for subscriptions. PCI-DSS compliance
   is required by payment processors."

   ◯ SOC 2 (75% confidence)
   "As a SaaS provider, SOC 2 demonstrates security controls to customers."

3. User reviews suggestions
4. User selects: HIPAA, GDPR, PCI-DSS
5. User clicks "Start Assessment"
6. System creates assessment instance
```

---

### 6.2 Epic 2: Compliance Assessment

#### User Story 2.1: View Assessment Checklist

**As a** Compliance Manager  
**I want to** see a structured checklist of all required controls  
**So that** I know exactly what needs to be evaluated

**Acceptance Criteria:**

- [ ] Checklist displays all controls from selected frameworks
- [ ] Controls are grouped by framework
- [ ] Each control shows:
  - Control ID and title
  - Description
  - Severity level (Low/Medium/High/Critical)
  - Current status
  - Evidence requirements
- [ ] Checklist is filterable by:
  - Framework
  - Status
  - Severity
  - Category
- [ ] Checklist shows progress (X% complete)
- [ ] Checklist is sortable

**User Flow:**

```
1. User opens assessment
2. System displays dashboard:

   Overall Progress: 35% (42/120 items completed)

   Frameworks:
   - HIPAA: 40% (20/50 items)
   - GDPR: 30% (15/50 items)
   - PCI-DSS: 35% (7/20 items)

3. User clicks "View Checklist"
4. System displays grouped checklist:

   HIPAA - Administrative Safeguards (10/20 completed)
   ├─ ✓ HIPAA-164.308(a)(1) - Security Management Process [COMPLIANT]
   ├─ ◐ HIPAA-164.308(a)(3) - Workforce Security [PARTIALLY_COMPLIANT]
   ├─ ○ HIPAA-164.308(a)(4) - Information Access Management [NOT_STARTED]
   └─ ...

5. User can filter, sort, search checklist
```

---

#### User Story 2.2: Update Control Status

**As an** IT Security Lead  
**I want to** mark controls as compliant/non-compliant  
**So that** we can track our compliance progress

**Acceptance Criteria:**

- [ ] User can set status to:
  - Not Started (default)
  - Compliant
  - Partially Compliant
  - Not Compliant
  - Not Applicable
- [ ] Status changes are saved immediately
- [ ] Compliance score updates in real-time
- [ ] User can add comments (optional)
- [ ] User can attach evidence (optional)
- [ ] Status change is logged in audit trail
- [ ] UI shows visual feedback (loading, success)

**User Flow:**

```
1. User clicks control "HIPAA-164.312(a)(1) - Access Control"
2. System displays control details panel:

   Control: Access Control
   Description: Implement technical policies and procedures for
   electronic information systems that maintain electronic protected
   health information to allow access only to authorized persons.

   Current Status: Not Started
   Severity: High

3. User clicks status dropdown
4. User selects "Compliant"
5. User adds comment: "Implemented role-based access control using Auth0"
6. User clicks "Save"
7. System updates status
8. System recalculates score (35% → 36%)
9. System shows success message
```

---

#### User Story 2.3: Upload Evidence (Future Consideration)

**As a** Compliance Manager  
**I want to** attach evidence documents to controls  
**So that** we have proof of compliance for auditors

**Acceptance Criteria:**

- [ ] User can upload multiple files per control
- [ ] Supported file types: PDF, DOCX, XLSX, PNG, JPG, CSV
- [ ] Max file size: 10MB per file
- [ ] Files are virus-scanned on upload
- [ ] Files are encrypted at rest
- [ ] User can add description for each file
- [ ] User can delete uploaded evidence
- [ ] Evidence shows upload date and uploader
- [ ] System generates secure download links

**User Flow:**

```
1. User clicks "Add Evidence" on control
2. System displays upload modal
3. User drags/drops file: "access-control-policy.pdf"
4. User adds description: "Company access control policy v2.1"
5. User clicks "Upload"
6. System validates file (type, size, virus scan)
7. System uploads to S3
8. System saves evidence record
9. System displays evidence in control:

   Evidence:
   📄 access-control-policy.pdf
      Uploaded by: Sarah Chen
      Date: Feb 12, 2026
      Description: Company access control policy v2.1
      [View] [Delete]
```

---

### 6.3 Epic 3: AI Remediation

#### User Story 3.1: Request Remediation Plan

**As a** Compliance Manager  
**I want to** get AI-generated remediation guidance for non-compliant controls  
**So that** I know exactly how to fix compliance gaps

**Acceptance Criteria:**

- [ ] "Get Remediation Plan" button visible on non-compliant items
- [ ] AI generates plan within 10 seconds
- [ ] Plan includes:
  - Step-by-step actions (prioritized)
  - Policy suggestions
  - Technical control recommendations
  - Implementation owner (role)
  - Estimated effort
- [ ] User can save plan
- [ ] User can export plan
- [ ] User can request regeneration

**User Flow:**

```
1. User identifies non-compliant control
2. User clicks "Get Remediation Plan"
3. System shows loading state
4. AI analyzes control and generates plan:

   REMEDIATION PLAN
   Control: HIPAA-164.312(a)(1) - Access Control

   PRIORITY ACTIONS:

   1. Implement Role-Based Access Control (RBAC)
      Priority: HIGH
      Owner: IT Security Team
      Steps:
      - Define user roles (Admin, Clinician, Support, etc.)
      - Map roles to data access permissions
      - Implement RBAC in application (recommend Auth0, Okta)
      - Document role matrix
      Estimated Effort: 40 hours

   2. Enable Multi-Factor Authentication (MFA)
      Priority: HIGH
      Owner: IT Security Team
      Steps:
      - Enable MFA for all user accounts
      - Require MFA for administrative access
      - Configure MFA policies (TOTP, SMS, hardware token)
      Estimated Effort: 16 hours

   3. Implement Access Logging
      Priority: MEDIUM
      Owner: DevOps Team
      Steps:
      - Enable access logs in application
      - Set up centralized logging (recommend Datadog, Splunk)
      - Configure alerts for suspicious access patterns
      - Retain logs for 6+ years (HIPAA requirement)
      Estimated Effort: 24 hours

   POLICY RECOMMENDATIONS:
   - Access Control Policy
   - Password Policy
   - MFA Policy
   - User Provisioning/Deprovisioning Procedures

   TECHNICAL CONTROLS:
   - Identity Provider (Auth0, Okta, Azure AD)
   - Logging Platform (Datadog, Splunk, ELK)
   - Secrets Management (AWS Secrets Manager, HashiCorp Vault)

5. User reviews plan
6. User clicks "Save Plan"
7. System saves plan to control
```

---

### 6.4 Epic 4: Reporting

#### User Story 4.1: Generate Compliance Report

**As a** CFO  
**I want to** generate a comprehensive compliance readiness report  
**So that** I can share our compliance status with the board and auditors

**Acceptance Criteria:**

- [ ] "Generate Report" button enabled when assessment > 50% complete
- [ ] Report generation completes within 5 seconds
- [ ] Report includes:
  - Executive summary
  - Organization profile
  - Frameworks assessed
  - Overall compliance score
  - Framework-specific scores
  - Risk summary
  - Control status breakdown
  - Evidence inventory
  - Remediation recommendations
  - Appendices (control details)
- [ ] Report available in PDF and Web formats
- [ ] Report is downloadable
- [ ] Report includes generation date/time
- [ ] Report is shareable via link

**User Flow:**

```
1. User completes assessment (80% complete)
2. User clicks "Generate Report"
3. System validates assessment readiness
4. System shows "Generating report..." (3-5 seconds)
5. System generates PDF:

   ┌─────────────────────────────────────────────┐
   │   COMPLIANCE READINESS REPORT               │
   │   HealthTrack App                           │
   │   Generated: February 12, 2026              │
   └─────────────────────────────────────────────┘

   EXECUTIVE SUMMARY

   Overall Compliance Score: 72%
   Compliance Status: Partially Compliant
   Critical Risks: 2

   This report summarizes the compliance readiness of
   HealthTrack App across HIPAA, GDPR, and PCI-DSS frameworks...

   FRAMEWORK SCORES
   - HIPAA: 75% (38/50 controls compliant)
   - GDPR: 70% (35/50 controls compliant)
   - PCI-DSS: 65% (13/20 controls compliant)

   RISK SUMMARY
   Total Gaps: 34 controls
   - Critical: 2 controls
   - High: 8 controls
   - Medium: 15 controls
   - Low: 9 controls

   TOP PRIORITY REMEDIATIONS
   1. Implement encryption at rest (HIPAA-164.312(a)(2)(iv))
   2. Enable audit logging (GDPR Art. 30)
   3. Implement PCI cardholder data encryption (PCI-3.4)

   [... detailed sections continue ...]

6. System displays report preview
7. User clicks "Download PDF"
8. System saves report to S3
9. System provides download link
```

---

### 6.5 Epic 5: Admin - Framework Management

#### User Story 5.1: Add New Compliance Framework

**As an** Admin  
**I want to** add new compliance frameworks to the system  
**So that** users can assess against the latest regulations

**Acceptance Criteria:**

- [ ] Admin can access "Framework Management" section
- [ ] Admin can create new framework with:
  - Code (unique identifier)
  - Name
  - Description
  - Region
  - Category
  - Version
  - Effective date
  - Source link
- [ ] Framework starts as "Draft" status
- [ ] Admin can add controls to framework
- [ ] Admin can publish framework (makes it available to users)
- [ ] All fields are validated
- [ ] Version history is maintained

**User Flow:**

```
1. Admin navigates to "Admin → Frameworks"
2. Admin clicks "Add Framework"
3. Admin fills form:
   - Code: CCPA
   - Name: California Consumer Privacy Act
   - Description: California's privacy law for consumer data protection
   - Region: US (California)
   - Category: Privacy
   - Version: 1.0
   - Effective Date: January 1, 2020
   - Source Link: https://oag.ca.gov/privacy/ccpa
4. Admin clicks "Create"
5. System creates framework (Draft status)
6. Admin proceeds to add controls
```

---

#### User Story 5.2: Add Controls to Framework

**As an** Admin  
**I want to** add individual controls to a compliance framework  
**So that** users have a complete checklist to assess

**Acceptance Criteria:**

- [ ] Admin can add multiple controls to framework
- [ ] Each control requires:
  - Control ID (unique within framework)
  - Title
  - Description
  - Category
  - Severity (Low/Medium/High/Critical)
  - Weight (for scoring, default 1.0)
- [ ] Admin can bulk import controls (CSV)
- [ ] Admin can reorder controls
- [ ] Admin can edit controls
- [ ] Admin can delete controls (if not in use)
- [ ] Changes are versioned

**User Flow:**

```
1. Admin opens framework "CCPA"
2. Admin clicks "Add Control"
3. Admin fills form:
   - Control ID: CCPA-1798.100
   - Title: Right to Know
   - Description: Consumers have the right to request information
     about personal data collected about them
   - Category: Consumer Rights
   - Severity: High
   - Weight: 1.5
4. Admin clicks "Save"
5. System validates uniqueness
6. System adds control to framework
7. Admin repeats for additional controls
```

---

## 7. Functional Requirements

### 7.1 Authentication & Authorization

#### FR-AUTH-001: User Registration

**Priority:** P0 (Must Have)

**Description:** Users must be able to create accounts with email/password.

**Requirements:**

- System shall accept email and password during registration
- System shall validate email format
- System shall enforce password requirements:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character
- System shall hash passwords using bcrypt (cost factor 12)
- System shall send email verification link
- System shall prevent duplicate email registrations
- System shall create user with default role "USER"

**Acceptance Criteria:**

```gherkin
Given I am on the registration page
When I enter valid email and password
And I submit the form
Then my account is created
And I receive a verification email
And I can log in after verification
```

---

#### FR-AUTH-002: User Login

**Priority:** P0 (Must Have)

**Description:** Users must be able to authenticate with email/password.

**Requirements:**

- System shall accept email and password
- System shall validate credentials against database
- System shall generate JWT session token (expires in 7 days)
- System shall redirect to role-appropriate dashboard
- System shall implement rate limiting (5 failed attempts = 15 min lockout)
- System shall log all authentication attempts

**Acceptance Criteria:**

```gherkin
Given I am on the login page
When I enter valid credentials
Then I am authenticated
And I am redirected to my dashboard
And my session is maintained for 7 days
```

---

#### FR-AUTH-003: Role-Based Access Control

**Priority:** P0 (Must Have)

**Description:** System must enforce role-based permissions.

**Requirements:**

| Action                  | Admin | User |
| ----------------------- | ----- | ---- |
| View frameworks         | ✓     | ✓    |
| Create framework        | ✓     | ✗    |
| Edit framework          | ✓     | ✗    |
| Delete framework        | ✓     | ✗    |
| Create assessment       | ✓     | ✓    |
| Edit own assessment     | ✓     | ✓    |
| Edit others' assessment | ✓     | ✗    |
| Generate report         | ✓     | ✓    |
| Manage users            | ✓     | ✗    |

**Acceptance Criteria:**

```gherkin
Given I am logged in as a User
When I attempt to access admin routes
Then I receive 403 Forbidden error
And I cannot perform admin actions
```

---

### 7.2 Organization Onboarding

#### FR-ORG-001: Business Profile Input

**Priority:** P0 (Must Have)

**Description:** Users must be able to input organization details.

**Requirements:**

- System shall provide form with fields:
  - Product/Service name (required, max 100 chars)
  - Business description (required, max 500 chars)
  - Services offered (required, max 300 chars)
  - Target customers (required, max 200 chars)
  - Problem being solved (required, max 300 chars)
- System shall provide multi-select for data types:
  - PII (Personally Identifiable Information)
  - PHI (Protected Health Information)
  - Financial data
  - Payment card data
  - Biometric data
  - Children's data
  - Employee data
  - Other
- System shall provide multi-select for regions:
  - United States
  - European Union
  - United Kingdom
  - Canada
  - Australia
  - APAC
  - Latin America
  - Other
- System shall validate all required fields
- System shall auto-save progress every 30 seconds
- System shall allow editing after submission

**Acceptance Criteria:**

```gherkin
Given I am creating an organization profile
When I fill all required fields
And I select data types and regions
And I submit the form
Then my profile is saved
And I proceed to framework suggestions
```

---

#### FR-ORG-002: AI Framework Mapping

**Priority:** P0 (Must Have)

**Description:** System must use AI to suggest applicable frameworks.

**Requirements:**

- System shall send organization profile to AI service
- System shall receive AI response within 10 seconds
- AI response shall include:
  - Framework code (e.g., "GDPR")
  - Framework name
  - Confidence score (0-100%)
  - Explanation (2-3 sentences)
  - Relevance tags
- System shall return up to 8 framework suggestions
- System shall rank suggestions by confidence (descending)
- System shall display confidence score with visual indicator:
  - 90-100%: Very High (green)
  - 75-89%: High (blue)
  - 60-74%: Medium (yellow)
  - < 60%: Low (gray, not displayed)
- System shall explain why framework was suggested
- System shall log AI interaction for audit

**AI Prompt Template:**

```
Analyze this organization and suggest applicable compliance frameworks:

Product: {productName}
Description: {description}
Services: {services}
Customers: {targetCustomers}
Problem: {problemSolved}
Data Types: {dataHandled}
Regions: {regions}

Return JSON:
{
  "frameworks": [
    {
      "code": "GDPR",
      "name": "General Data Protection Regulation",
      "confidence": 95,
      "explanation": "Your organization processes personal data in the EU...",
      "tags": ["privacy", "eu", "pii"]
    }
  ]
}
```

**Acceptance Criteria:**

```gherkin
Given I have submitted my organization profile
When the AI analyzes my information
Then I receive framework suggestions within 10 seconds
And each suggestion has a confidence score
And each suggestion has an explanation
And suggestions are ranked by confidence
```

---

#### FR-ORG-003: Framework Selection

**Priority:** P0 (Must Have)

**Description:** Users must be able to select/deselect suggested frameworks.

**Requirements:**

- System shall display AI-suggested frameworks as pre-selected
- System shall allow user to deselect suggestions
- System shall allow user to manually add frameworks (searchable dropdown)
- System shall require at least 1 framework selected
- System shall show framework details on hover/click:
  - Full description
  - Region applicability
  - Category
  - Number of controls
- System shall save framework selections
- System shall proceed to assessment creation

**Acceptance Criteria:**

```gherkin
Given I am viewing framework suggestions
When I select HIPAA and GDPR
And I deselect SOC 2
And I manually add PCI-DSS
Then I have 3 frameworks selected
And I can proceed to assessment creation
```

---

### 7.3 Assessment Management

#### FR-ASMT-001: Create Assessment

**Priority:** P0 (Must Have)

**Description:** System must create assessment instance from selected frameworks.

**Requirements:**

- System shall create Assessment record with:
  - Unique ID
  - User ID
  - Organization ID
  - Status: "IN_PROGRESS"
  - Score: 0
  - Created timestamp
- System shall retrieve all controls for selected frameworks
- System shall create AssessmentItem record for each control:
  - Assessment ID
  - Control ID
  - Status: "NOT_STARTED"
  - No comments/evidence initially
- System shall execute in database transaction (all-or-nothing)
- System shall redirect to assessment dashboard
- System shall send email notification to user

**Business Rules:**

- 1 organization can have multiple assessments
- 1 assessment can include multiple frameworks
- Each control creates 1 assessment item

**Acceptance Criteria:**

```gherkin
Given I have selected HIPAA and GDPR frameworks
When I click "Create Assessment"
Then an assessment is created with status IN_PROGRESS
And assessment items are created for all HIPAA + GDPR controls
And I am redirected to the assessment dashboard
And I receive a confirmation email
```

---

#### FR-ASMT-002: View Assessment Dashboard

**Priority:** P0 (Must Have)

**Description:** Users must see overview of assessment progress.

**Requirements:**

- System shall display:
  - Overall compliance score (0-100%)
  - Progress percentage (items completed / total items)
  - Breakdown by framework
  - Risk summary (Critical/High/Medium/Low)
  - Recent activity
  - Quick actions (View Checklist, Generate Report, Get Help)
- System shall show visual progress indicators:
  - Progress bar
  - Pie chart (status distribution)
  - Risk heatmap
- System shall update metrics in real-time
- System shall highlight critical gaps

**Dashboard Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  Assessment: HealthTrack Compliance                     │
│  Status: In Progress | Last Updated: 2 hours ago        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Overall Compliance Score                               │
│  ┌─────────────────────────────────────────────┐        │
│  │            68%                              │        │
│  │  ███████████████████░░░░░░░░░               │        │
│  └─────────────────────────────────────────────┘        │
│                                                         │
│  Progress: 82 / 120 items completed (68%)               │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Framework Breakdown                                    │
│  ┌────────────┬───────────┬──────────┐                  │
│  │ Framework  │ Score     │ Progress │                  │
│  ├────────────┼───────────┼──────────┤                  │
│  │ HIPAA      │ 72%       │ 36/50    │                  │
│  │ GDPR       │ 65%       │ 33/50    │                  │
│  │ PCI-DSS    │ 68%       │ 13/20    │                  │
│  └────────────┴───────────┴──────────┘                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Risk Summary                                           │
│  ┌────────────┬───────┐                                 │
│  │ Critical   │   2   │                                 │
│  │ High       │   8   │                                 │
│  │ Medium     │  15   │                                 │
│  │ Low        │   9   │                                 │
│  └────────────┴───────┘                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Acceptance Criteria:**

```gherkin
Given I am viewing my assessment dashboard
Then I see my overall compliance score
And I see progress for each framework
And I see risk summary with counts
And metrics update when I complete items
```

---

#### FR-ASMT-003: View Assessment Checklist

**Priority:** P0 (Must Have)

**Description:** Users must see complete list of assessment items.

**Requirements:**

- System shall display all assessment items
- System shall group items by framework (collapsible sections)
- System shall sub-group by control category
- Each item shall display:
  - Control ID
  - Control title
  - Description (expandable)
  - Severity badge
  - Current status
  - Last updated timestamp
  - Evidence count (if any)
- System shall provide filters:
  - Framework (multi-select)
  - Status (multi-select)
  - Severity (multi-select)
  - Category (multi-select)
  - Search (by control ID or title)
- System shall provide sorting:
  - Severity (Critical → Low)
  - Status (Not Started first)
  - Control ID (alphanumeric)
  - Last Updated (newest first)
- System shall paginate (50 items per page)
- System shall show filter/sort applied count

**Acceptance Criteria:**

```gherkin
Given I am viewing the checklist
Then I see all assessment items grouped by framework
And I can filter by status = "Not Started"
And I see only incomplete items
And I can sort by severity
And critical items appear first
```

---

#### FR-ASMT-004: Update Assessment Item Status

**Priority:** P0 (Must Have)

**Description:** Users must be able to update item status and add comments.

**Requirements:**

- System shall provide status options:
  - Not Started (gray)
  - Compliant (green)
  - Partially Compliant (yellow)
  - Not Compliant (red)
  - Not Applicable (blue)
- System shall allow inline status change (dropdown)
- System shall provide optional comment field (max 1000 chars)
- System shall save changes immediately (optimistic update)
- System shall show loading indicator during save
- System shall show success/error feedback
- System shall recalculate compliance score automatically
- System shall update "Last Updated" timestamp
- System shall log change in audit trail (if enabled)

**Status Change Rules:**

- Not Applicable items are excluded from score calculation
- Partially Compliant counts as 50% compliant
- Status can be changed at any time (not locked)

**Acceptance Criteria:**

```gherkin
Given I am viewing an assessment item
When I change status from "Not Started" to "Compliant"
And I add comment "Implemented MFA using Auth0"
Then the status is saved immediately
And the compliance score is recalculated
And the item shows as updated
```

---

#### FR-ASMT-005: Real-Time Scoring

**Priority:** P0 (Must Have)

**Description:** System must calculate compliance score dynamically.

**Requirements:**

- System shall recalculate score on every status change
- System shall use weighted scoring formula:

```
Applicable Items = All items WHERE status != "Not Applicable"

Total Weight = SUM(control.weight) for all applicable items

Weighted Score = SUM(item_score × control.weight) for all applicable items

Where item_score:
  - Compliant = 1.0
  - Partially Compliant = 0.5
  - Not Compliant = 0.0
  - Not Started = 0.0

Compliance Score = (Weighted Score / Total Weight) × 100
```

- System shall round score to 1 decimal place
- System shall calculate overall score AND per-framework scores
- System shall update score within 200ms
- System shall persist score to database
- System shall broadcast score update to UI (if multiple tabs open)

**Example Calculation:**

```
HIPAA Controls:
1. Access Control (weight: 1.5) - Compliant = 1.5 points
2. Encryption (weight: 2.0) - Partially Compliant = 1.0 points
3. Audit Logs (weight: 1.0) - Not Compliant = 0 points
4. Training (weight: 1.0) - Not Applicable = excluded

Total Weight: 1.5 + 2.0 + 1.0 = 4.5
Weighted Score: 1.5 + 1.0 + 0 = 2.5
Compliance Score: (2.5 / 4.5) × 100 = 55.6%
```

**Acceptance Criteria:**

```gherkin
Given I have an assessment with 10 items
And 5 items are Compliant
And 3 items are Partially Compliant
And 2 items are Not Compliant
When the system calculates the score
Then I see a score of approximately 65%
And the score updates when I change any item status
```

---

### 7.4 Evidence Management

#### FR-EVID-001: Upload Evidence Files

**Priority:** P0 (Must Have)

**Description:** Users must be able to upload files as evidence.

**Requirements:**

- System shall accept file uploads for any assessment item
- System shall support file types:
  - Documents: PDF, DOCX, XLSX, TXT
  - Images: PNG, JPG, JPEG
  - Archives: ZIP (max 10MB uncompressed)
- System shall enforce file size limit: 10MB per file
- System shall scan files for viruses (ClamAV or similar)
- System shall reject files that fail virus scan
- System shall upload files to S3 storage
- System shall generate secure signed URLs (expire in 7 days)
- System shall encrypt files at rest (S3 server-side encryption)
- System shall allow multiple files per item (max 20 files)
- System shall require file description (max 200 chars)
- System shall show upload progress bar
- System shall handle upload failures gracefully

**Evidence Metadata:**

- Filename
- File size
- MIME type
- Upload timestamp
- Uploaded by (user ID)
- Description
- S3 key
- Download URL

**Acceptance Criteria:**

```gherkin
Given I am viewing an assessment item
When I click "Add Evidence"
And I upload a valid PDF file
And I add description "Access Control Policy v2.1"
Then the file is uploaded to S3
And evidence record is created
And I see the file in the evidence list
And I can download the file
```

---

#### FR-EVID-002: View and Manage Evidence (Future Scope)

**Priority:** P2 (Future Scope)

**Description:** Users must be able to view and delete evidence.

**Requirements:**

- System shall display all evidence for an item
- Each evidence shall show:
  - File icon (based on type)
  - Filename
  - Description
  - File size
  - Upload date
  - Uploaded by (user name)
  - Actions (View, Download, Delete)
- System shall generate fresh signed URLs for viewing
- System shall allow evidence deletion
- System shall confirm before deleting
- System shall delete file from S3 on deletion
- System shall maintain evidence count on item

**Acceptance Criteria:**

```gherkin
Given I have uploaded evidence
When I view the assessment item
Then I see all evidence files
And I can download any file
And I can delete evidence
And the file is removed from S3
```

---

### 7.5 AI Remediation

#### FR-AI-001: Generate Remediation Plan

**Priority:** P0 (Must Have)

**Description:** System must generate AI-powered remediation guidance.

**Requirements:**

- System shall show "Get Remediation Plan" button on:
  - Not Compliant items
  - Partially Compliant items
  - Not Started items (optional)
- System shall send control details to AI service:
  - Framework name
  - Control ID
  - Control title
  - Control description
  - Current status
  - Control severity
- System shall receive AI response within 10 seconds
- AI response shall include:
  - Prioritized action steps (3-5 steps)
  - Policy suggestions (2-3 policies)
  - Technical control recommendations (2-3 controls)
  - Implementation owner (role)
  - Estimated effort (hours)
- System shall display plan in readable format
- System shall allow saving plan (optional)
- System shall allow exporting plan (PDF, MD)
- System shall allow regenerating plan
- System shall log AI interaction

**AI Prompt Template:**

```
You are a compliance expert. Generate a remediation plan.

Framework: {frameworkName}
Control: {controlId} - {controlTitle}
Description: {controlDescription}
Current Status: {currentStatus}
Severity: {severity}

Generate a JSON response:
{
  "steps": [
    {
      "title": "Action title",
      "description": "Detailed steps...",
      "priority": "HIGH|MEDIUM|LOW",
      "owner": "IT Security|Compliance|HR|...",
      "estimatedHours": 24
    }
  ],
  "policies": ["Policy 1", "Policy 2"],
  "technicalControls": ["Control 1", "Control 2"]
}

Make recommendations specific and actionable.
```

**Acceptance Criteria:**

```gherkin
Given I have a non-compliant item
When I click "Get Remediation Plan"
Then I receive a plan within 10 seconds
And the plan includes prioritized steps
And each step has an owner and effort estimate
And I can save or export the plan
```

---

### 7.6 Reporting

#### FR-RPT-001: Generate Compliance Report

**Priority:** P0 (Must Have)

**Description:** System must generate comprehensive PDF report.

**Requirements:**

- System shall allow report generation when assessment > 50% complete
- System shall generate report within 5 seconds
- Report shall include:

**Cover Page:**

- Report title
- Organization name
- Frameworks assessed
- Generation date/time
- Report version

**Executive Summary (1-2 pages):**

- Overall compliance score (large, prominent)
- Status indicator (Compliant / Partially Compliant / Non-Compliant)
- Key findings (3-5 bullets)
- Critical risks (count + list)
- Top recommendations (3-5)

**Organization Profile:**

- Product/service name
- Business description
- Data types handled
- Regions of operation

**Framework Scores:**

- Table with framework name, score, status
- Visual score indicators
- Control completion counts

**Risk Summary:**

- Risk distribution (Critical/High/Medium/Low)
- Risk heatmap visualization
- Non-compliant items by severity

**Control Status Breakdown:**

- Table of all controls with:
  - Framework
  - Control ID
  - Control title
  - Status
  - Severity
  - Evidence count
- Grouped by framework
- Color-coded by status

**Evidence Inventory:**

- List of all uploaded evidence
- Grouped by control
- Includes filename, upload date

**Remediation Recommendations:**

- Top 10 priority actions
- Based on severity and status
- Includes brief guidance

**Appendices:**

- Glossary of terms
- Framework descriptions
- Compliance methodology

- System shall generate PDF using PDFKit or similar
- System shall upload PDF to S3
- System shall provide download link
- System shall log report generation

**Acceptance Criteria:**

```gherkin
Given I have completed 80% of my assessment
When I click "Generate Report"
Then a PDF report is generated within 5 seconds
And the report includes all required sections
And I can download the PDF
And the PDF is professionally formatted
```

---

#### FR-RPT-002: Web Report View

**Priority:** P1 (Should Have)

**Description:** System should provide web-based report view.

**Requirements:**

- System shall generate HTML version of report
- System shall display in-app (no download required)
- System shall provide print stylesheet
- System shall allow sharing via link
- System shall apply same structure as PDF
- Web view shall load within 2 seconds

**Acceptance Criteria:**

```gherkin
Given I have generated a report
When I click "View Report"
Then I see a web version of the report
And I can print the report
And I can share a link to the report
```

---

### 7.7 Admin - Framework Management

#### FR-ADM-001: Create Framework

**Priority:** P0 (Must Have)

**Description:** Admin must be able to create compliance frameworks.

**Requirements:**

- System shall provide framework creation form
- System shall require fields:
  - Code (unique, uppercase, max 20 chars, no spaces)
  - Name (max 200 chars)
  - Description (max 1000 chars)
  - Region (dropdown: US, EU, UK, Global, etc.)
  - Category (dropdown: Privacy, Security, Healthcare, Financial, etc.)
  - Version (semantic versioning, e.g., 1.0.0)
  - Effective Date (date picker)
  - Source Link (URL, optional)
- System shall validate code uniqueness
- System shall create framework with status "Draft"
- System shall auto-generate timestamps
- System shall redirect to control management

**Acceptance Criteria:**

```gherkin
Given I am an admin
When I create a new framework with code "CCPA"
Then the framework is created with status Draft
And I am redirected to add controls
And the framework is not yet visible to users
```

---

#### FR-ADM-002: Add Controls to Framework

**Priority:** P0 (Must Have)

**Description:** Admin must be able to add controls to frameworks.

**Requirements:**

- System shall provide control creation form
- System shall require fields:
  - Control ID (unique within framework, e.g., CCPA-1798.100)
  - Title (max 200 chars)
  - Description (max 2000 chars)
  - Category (text, max 100 chars)
  - Severity (dropdown: Low/Medium/High/Critical)
  - Weight (number, default 1.0, min 0.1, max 10.0)
- System shall validate Control ID uniqueness within framework
- System shall allow bulk import via CSV:
  - Template: control_id, title, description, category, severity, weight
  - Validate all rows before import
  - Show preview before committing
  - Import in transaction (all-or-nothing)
- System shall allow reordering controls (drag-and-drop)
- System shall show control count

**Acceptance Criteria:**

```gherkin
Given I am editing a framework
When I add a control with ID "CCPA-1798.100"
Then the control is added to the framework
And I can add more controls
And I can import controls via CSV
```

---

#### FR-ADM-003: Publish Framework

**Priority:** P0 (Must Have)

**Description:** Admin must be able to publish frameworks.

**Requirements:**

- System shall validate framework before publishing:
  - Has at least 1 control
  - All required fields filled
  - No duplicate control IDs
- System shall change status from "Draft" to "Published"
- System shall set published timestamp
- System shall make framework visible to users
- System shall send notification to users (optional)
- System shall prevent editing published frameworks (version instead)

**Acceptance Criteria:**

```gherkin
Given I have a framework with 10 controls
When I click "Publish"
Then the framework status changes to Published
And users can now select this framework
And I cannot edit the published version
```

---

#### FR-ADM-004: Version Framework

**Priority:** P1 (Should Have)

**Description:** Admin should be able to create new framework versions.

**Requirements:**

- System shall allow creating new version of published framework
- System shall copy all controls from previous version
- System shall increment version number (e.g., 1.0.0 → 1.1.0)
- System shall create as Draft status
- System shall maintain version history
- System shall allow users to upgrade assessments to new version

**Acceptance Criteria:**

```gherkin
Given I have published framework GDPR v1.0
When I create version 1.1
Then a new draft framework GDPR v1.1 is created
And it contains all controls from v1.0
And I can modify controls before publishing
```

---

#### FR-ADM-005: Manage Users

**Priority:** P0 (Must Have)

**Description:** Admin must be able to manage user accounts.

**Requirements:**

- System shall display user list with:
  - Name
  - Email
  - Role
  - Created date
  - Last login
  - Status (Active/Inactive)
- System shall allow creating new users
- System shall allow editing user details:
  - Name
  - Email
  - Role
- System shall allow deactivating users
- System shall allow password reset
- System shall prevent admin from deleting themselves
- System shall require at least 1 active admin

**Acceptance Criteria:**

```gherkin
Given I am an admin
When I view the user list
Then I see all users with their details
And I can create new users
And I can change user roles
And I can deactivate users
```

---

## 8. Non-Functional Requirements

### 8.1 Performance Requirements

#### NFR-PERF-001: API Response Time

**Priority:** P0

**Requirement:** 95th percentile (p95) API response time must be < 500ms for standard operations.

**Operations:**

- GET requests (list, retrieve): < 300ms
- POST/PATCH requests (create, update): < 500ms
- DELETE requests: < 300ms

**Exclusions:** AI operations, report generation

**Measurement:** CloudWatch metrics, New Relic APM

---

#### NFR-PERF-002: AI Response Time

**Priority:** P0

**Requirement:** AI operations must complete within acceptable timeframes:

- Framework mapping: < 10 seconds (95th percentile)
- Remediation plan: < 10 seconds (95th percentile)
- Report narrative: < 15 seconds (95th percentile)

**Mitigation for timeouts:**

- Show progress indicator
- Allow cancellation
- Provide fallback response

---

#### NFR-PERF-003: Report Generation Time

**Priority:** P0

**Requirement:** PDF report generation must complete within 5 seconds for typical assessment (100-150 controls).

**Measurement:** Server-side timing logs

---

#### NFR-PERF-004: Page Load Time

**Priority:** P0

**Requirement:**

- First Contentful Paint (FCP): < 1.5 seconds
- Largest Contentful Paint (LCP): < 2.5 seconds
- Time to Interactive (TTI): < 3.5 seconds

**Measurement:** Vercel Analytics, Lighthouse CI

---

#### NFR-PERF-005: Database Query Performance

**Priority:** P0

**Requirement:**

- Simple queries (single table): < 50ms
- Complex queries (joins, aggregations): < 200ms
- Assessment score calculation: < 100ms

**Strategy:**

- Proper indexing
- Query optimization
- Connection pooling (10-50 connections)

---

### 8.2 Scalability Requirements

#### NFR-SCALE-001: Concurrent Users

**Priority:** P1

**Requirement:** System must support 100 concurrent users (v1.0 target).

**Future:** 1,000 concurrent users (v2.0)

---

#### NFR-SCALE-002: Data Volume

**Priority:** P0

**Requirement:** System must handle:

- 100 organizations
- 500 assessments
- 50,000 assessment items
- 10,000 evidence files (100GB storage) (Future Scope)

**Future:** 10x growth (v2.0)

---

#### NFR-SCALE-003: Horizontal Scaling

**Priority:** P1

**Requirement:** System architecture must support horizontal scaling:

- Stateless API (no server-side sessions)
- Database read replicas
- CDN for static assets
- S3 for file storage

---

### 8.3 Availability Requirements

#### NFR-AVAIL-001: Uptime

**Priority:** P0

**Requirement:** System must maintain 99.5% uptime (monthly).

**Downtime allowance:** ~3.6 hours per month

**Exclusions:**

- Scheduled maintenance (with 48h notice)
- Force majeure events

---

#### NFR-AVAIL-002: Disaster Recovery

**Priority:** P0

**Requirement:**

- Database backups: Daily, retained 30 days
- Point-in-time recovery: Within 5 minutes
- Recovery Time Objective (RTO): 4 hours
- Recovery Point Objective (RPO): 1 hour

---

#### NFR-AVAIL-003: Monitoring & Alerting

**Priority:** P0

**Requirement:** System must monitor:

- API availability (uptime checks every 1 min)
- Error rates (alert if > 1% of requests)
- Response times (alert if p95 > 1s)
- Database performance (alert if queries > 500ms)
- Storage usage (alert if > 80% capacity)

**Alert channels:** Email, Slack, PagerDuty

---

### 8.4 Security Requirements

#### NFR-SEC-001: Authentication

**Priority:** P0

**Requirement:**

- Passwords must be hashed using bcrypt (cost factor 12)
- Session tokens must be JWT with 7-day expiration
- Must implement rate limiting (5 failed login attempts = 15 min lockout)
- Must support password reset via email

---

#### NFR-SEC-002: Authorization

**Priority:** P0

**Requirement:**

- Must implement Role-Based Access Control (RBAC)
- Must enforce least privilege principle
- Must validate permissions on every API request
- Must audit authorization failures

---

#### NFR-SEC-003: Data Encryption

**Priority:** P0

**Requirement:**

- **In Transit:** TLS 1.3 for all connections
- **At Rest:**
  - Database: Cipherion's encryption
  - Files: S3 server-side encryption (AES-256)
  - Backups: Encrypted
- **Application:** No plain-text storage of sensitive data

---

#### NFR-SEC-004: Input Validation

**Priority:** P0

**Requirement:**

- Must validate all user inputs (client & server-side)
- Must sanitize inputs to prevent XSS
- Must use parameterized queries to prevent SQL injection
- Must validate file uploads (type, size, virus scan)

---

#### NFR-SEC-005: Security Headers

**Priority:** P0

**Requirement:** Must implement security headers:

```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
X-XSS-Protection: 1; mode=block
```

#### NFR-SEC-006: Audit Logging

**Priority:** P1

**Requirement:** Must log security events:

- Authentication attempts (success/failure)
- Authorization failures
- Data modifications (admin actions)
- File uploads/downloads
- Framework publications

**Retention:** 1 year minimum

---

### 8.5 Compliance Requirements

#### NFR-COMP-001: Data Privacy

**Priority:** P0

**Requirement:**

- Must comply with GDPR (EU data protection)
- Must provide data deletion capability
- Must provide data export capability
- Must obtain consent for data processing

---

#### NFR-COMP-002: SOC 2 Type II

**Priority:** P1 (Future)

**Requirement:** System must be SOC 2 Type II compliant by v2.0:

- Security controls
- Availability controls
- Confidentiality controls
- Processing integrity

---

### 8.6 Usability Requirements

#### NFR-USE-001: Browser Support

**Priority:** P0

**Requirement:** Must support modern browsers:

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

---

#### NFR-USE-002: Mobile Responsiveness

**Priority:** P1

**Requirement:** Must be usable on mobile devices (tablet+):

- Responsive design (breakpoints: 768px, 1024px, 1280px)
- Touch-friendly controls
- Readable text (min 14px)

---

#### NFR-USE-003: Accessibility

**Priority:** P1

**Requirement:** Must meet WCAG 2.1 Level AA:

- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios (4.5:1 minimum)
- Alt text for images
- ARIA labels

---

#### NFR-USE-004: Internationalization

**Priority:** P2 (Future)

**Requirement:** Must support localization (v2.0):

- English (default)
- Spanish
- French
- German

---

### 8.7 Maintainability Requirements

#### NFR-MAINT-001: Code Quality

**Priority:** P1

**Requirement:**

- Must use TypeScript for type safety
- Must maintain test coverage > 80%
- Must pass linting (ESLint)
- Must pass type checking (tsc --noEmit)
- Must document all public APIs

---

#### NFR-MAINT-002: Deployment

**Priority:** P1

**Requirement:**

- Must use CI/CD pipeline (GitHub Actions)
- Must run tests before deployment
- Must use blue-green deployment
- Must support rollback within 5 minutes

---

#### NFR-MAINT-003: Monitoring

**Priority:** P1

**Requirement:**

- Must collect application metrics (Vercel Analytics)
- Must collect error logs (Sentry)
- Must collect infrastructure metrics (CloudWatch)
- Must provide dashboards for stakeholders

---

## 9. User Experience & Design

### 9.1 Design Principles

1. **Clarity Over Complexity**
   - Use simple, plain language
   - Avoid legal jargon where possible
   - Provide tooltips for technical terms

2. **Progressive Disclosure**
   - Show essential information first
   - Hide advanced options behind clicks
   - Use expandable sections

3. **Feedback & Guidance**
   - Show loading states
   - Confirm destructive actions
   - Provide success/error messages
   - Offer contextual help

4. **Consistency**
   - Consistent navigation
   - Consistent terminology
   - Consistent visual language

5. **Accessibility**
   - High contrast
   - Keyboard navigation
   - Screen reader support

---

### 9.2 Visual Design System

#### Color Palette (yet to decide)

```
Primary:
Secondary:
Accent:

Semantic:
Success:
Warning:
Error:
Info:

Neutral:
Gray-50:
Gray-100:
Gray-200:
Gray-500:
Gray-900:

Status Colors:
Compliant:
Partially:
Not Compliant:
Not Started:
Not Applicable:
```

#### Typography

```
Font Family: Inter (system-ui fallback)

Headings:
H1: 2.5rem (40px) - Bold
H2: 2rem (32px) - Semibold
H3: 1.5rem (24px) - Semibold
H4: 1.25rem (20px) - Medium

Body:
Large: 1.125rem (18px)
Regular: 1rem (16px)
Small: 0.875rem (14px)
Tiny: 0.75rem (12px)
```

#### Spacing

```
4px increments (Tailwind scale):
0.5 = 2px
1 = 4px
2 = 8px
3 = 12px
4 = 16px
6 = 24px
8 = 32px
12 = 48px
16 = 64px
```

---

### 9.3 Key UI Components

#### Navigation

- **Top Navigation Bar**
  - Logo (left)
  - Main navigation (center)
  - User menu (right)
  - Notifications bell
  - Theme toggle

- **Sidebar Navigation** (Admin/User dashboards)
  - Dashboard
  - Assessments
  - Frameworks (Admin only)
  - Users (Admin only)
  - Settings

#### Forms

- **Input Fields**
  - Label above input
  - Placeholder text (example)
  - Helper text below (optional)
  - Error message (red, with icon)
  - Required indicator (\*)

- **Buttons**
  - Primary: Filled, blue
  - Secondary: Outlined, gray
  - Destructive: Filled, red
  - Ghost: No background, hover effect

- **Dropdowns**
  - Searchable select
  - Multi-select with tags
  - Clear button

#### Data Display

- **Tables**
  - Sortable columns
  - Filterable
  - Pagination
  - Row actions (hover menu)
  - Empty state

- **Cards**
  - Shadow on hover
  - Title, description, actions
  - Status badges

- **Progress Indicators**
  - Progress bar (percentage)
  - Circular progress (score)
  - Step indicators (wizard)

#### Feedback

- **Toasts** (top-right)
  - Success (green, checkmark)
  - Error (red, X)
  - Info (blue, i)
  - Auto-dismiss (5 seconds)

- **Loading States**
  - Spinner
  - Skeleton screens
  - Progress bars

- **Empty States**
  - Illustration
  - Message
  - Call-to-action button

---

### 9.4 Key User Flows

#### Flow 1: New User Onboarding

```
1. Register
   ├─ Enter email, password, name
   ├─ Verify email
   └─ Log in

2. Organization Setup
   ├─ Enter business details
   ├─ Select data types
   ├─ Select regions
   └─ Submit

3. Framework Suggestions
   ├─ View AI suggestions
   ├─ Select frameworks
   └─ Create assessment

4. Dashboard
   └─ See empty assessment (0% complete)
```

#### Flow 2: Complete Assessment

```
1. View Dashboard
   └─ See overall progress

2. Open Checklist
   ├─ Filter by "Not Started"
   └─ Sort by "Severity"

3. Update Items
   ├─ For each item:
   │  ├─ Read description
   │  ├─ Change status
   │  ├─ Add comment (optional)
   │  └─ Upload evidence (optional)
   └─ Watch score increase

4. Review Progress
   └─ Return to dashboard

5. Generate Report
   ├─ Click "Generate Report"
   ├─ Wait 3-5 seconds
   └─ Download PDF
```

#### Flow 3: Get Remediation Guidance

```
1. Identify Non-Compliant Item
   └─ Filter checklist by "Not Compliant"

2. Request Remediation
   ├─ Click "Get Remediation Plan"
   └─ Wait for AI response (5-10 seconds)

3. Review Plan
   ├─ Read prioritized steps
   ├─ Review policy suggestions
   └─ Review technical controls

4. Save/Export Plan
   └─ Export as PDF or Markdown

5. Implement Actions
   └─ Work through steps offline
```

---

### 9.5 Wireframes (Text-Based)

#### Dashboard (User)

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]  Dashboard  Assessments           [Notifications] [▾]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  HealthTrack Compliance Assessment                          │
│  Status: In Progress | Last updated: 2 hours ago            │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Overall Compliance Score                             │  │
│  │  ┌─────────────────────────────────────┐              │  │
│  │  │         68%                         │              │  │
│  │  │  ███████████████████░░░░░░░░░       │              │  │
│  │  └─────────────────────────────────────┘              │  │
│  │  82 / 120 items completed                             │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────┬─────────────┬─────────────┐                │
│  │   HIPAA     │    GDPR     │  PCI-DSS    │                │
│  │    72%      │    65%      │    68%      │                │
│  │   36/50     │   33/50     │   13/20     │                │
│  └─────────────┴─────────────┴─────────────┘                │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Risk Summary                                         │  │
│  │  Critical: 2  High: 8  Medium: 15  Low: 9             │  │
│  │  [View Details]                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  [View Checklist]  [Generate Report]  [Get Help]            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Checklist View

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]  Dashboard  Assessments           [Notifications] [▾]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Assessment Checklist                                       │
│                                                             │
│  [ Search]  [Framework ▾] [Status ▾] [Severity ▾]           │
│                                                             │
│  ▼ HIPAA - Administrative Safeguards (10/20 completed)      │
│    ┌─────────────────────────────────────────────────────┐  │
│    │   HIPAA-164.308(a)(1) - Security Management         │  │
│    │   Status: Compliant | Severity: High                │  │
│    │   Last updated: 2 days ago                          │  │
│    │   Evidence: 2 files                                 │  │
│    └─────────────────────────────────────────────────────┘  │
│    ┌─────────────────────────────────────────────────────┐  │
│    │   HIPAA-164.308(a)(3) - Workforce Security          │  │
│    │   Status: Partially Compliant | Severity: Medium    │  │
│    │   [Get Remediation Plan]                            │  │
│    └─────────────────────────────────────────────────────┘  │
│    ┌─────────────────────────────────────────────────────┐  │
│    │ ○ HIPAA-164.308(a)(4) - Information Access Mgmt     │  │
│    │   Status: Not Started | Severity: High              │  │
│    │   [Start]                                           │  │
│    └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ▼ HIPAA - Physical Safeguards (8/15 completed)             │
│    ...                                                      │
│                                                             │
│  [1] 2 3 ... 10 Next                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Control Detail (Modal)

```
┌─────────────────────────────────────────────────────────────┐
│  HIPAA-164.312(a)(1) - Access Control                    [X]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Description:                                               │
│  Implement technical policies and procedures for            │
│  electronic information systems that maintain electronic    │
│  protected health information to allow access only to       │
│  authorized persons or software programs.                   │
│                                                             │
│  Severity: [ High]    Weight: 1.5                           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Status: [Compliant ▾]                               │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Comments (optional):                                │    │
│  │ [Implemented RBAC using Auth0. All users require    │    │
│  │  MFA to access PHI.]                                │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Evidence (2 files):                                        │
│  access-control-policy.pdf                                  │
│     Uploaded by Sarah Chen on Feb 10, 2026                  │
│     [View] [Download] [Delete]                              │
│                                                             │
│   rbac-implementation-guide.docx                            │
│     Uploaded by Mike Johnson on Feb 11, 2026                │
│     [View] [Download] [Delete]                              │
│                                                             │
│  [+ Add Evidence]                                           │
│                                                             │
│  [Get Remediation Plan]                                     │
│                                                             │
│                           [Cancel]  [Save Changes]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Technical Architecture

### 10.1 System Architecture

**Architecture Pattern:** Monolithic (v1.0), Microservices-ready (v2.0)

**Deployment Model:** Single-tenant (v1.0), Multi-tenant (v2.0)

**Stack:**

- **Frontend:** Next.js 14+ (React, TypeScript)
- **Backend:** Next.js API Routes (Node.js)
- **Database:** PostgreSQL 16 (AWS RDS)
- **File Storage:** AWS S3
- **Cache:** Redis (AWS ElastiCache)
- **AI:** Vercel AI SDK → OpenAI GPT-4 / Anthropic Claude
- **Hosting:** Vercel
- **Monitoring:** Vercel Analytics, Sentry, CloudWatch

---

### 10.2 Technology Stack

#### Frontend

```
Framework: Next.js 14.2+
Language: TypeScript 5.4+
UI Library: React 18+
State Management: Zustand 4+
Styling: Tailwind CSS 3+
UI Components: shadcn/ui (Radix UI)
Forms: React Hook Form + Zod
Data Fetching: TanStack Query (React Query)
```

#### Backend

```
Runtime: Node.js 20 LTS
Framework: Next.js API Routes
ORM: Prisma 5+
Validation: Zod
Authentication: BetterAuth / NextAuth.js
File Processing: Multer, Sharp
PDF Generation: PDFKit
CSV Parsing: PapaParse
```

#### Database

```
RDBMS: PostgreSQL 16
Hosting: Neon Instance or a Shared instance will be provided
Connection Pooling: Prisma (10-50 connections)
Backups: Automated daily, 30-day retention
```

#### Infrastructure

```
Hosting: Vercel
CDN: Vercel Edge Network
File Storage: Cloudflare
Cache: Redis
Secrets:  Vercel Environment Variables
CI/CD: GitHub Actions
```

#### External Services

```
AI Provider: OpenAI (GPT-4-Turbo) / Anthropic (Claude 3.5 Sonnet)
Email: SendGrid / Resend / SMTP
Monitoring: Sentry (errors), CloudWatch (metrics)
Analytics: Vercel Analytics
```

---

### 10.3 Database Schema

See Section 1q (Data Model) for draft Prisma schema.

---

### 10.4 API Design

**API Style:** RESTful  
**Authentication:** JWT (Bearer tokens)  
**Content Type:** JSON

**Base URL:** `https://app.cipherion.com/api`

**Common Headers:**

```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Standard Responses:**

```json
// Success
{
  "data": { ... },
  "message": "Success"
}

// Error
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

**Pagination:**

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 120,
    "pages": 3
  }
}
```

---

### 10.5 Security Architecture

**Layers:**

1. Network (TLS, WAF, DDoS protection)
2. Application (Auth, RBAC, input validation)
3. Data (Encryption at rest/in transit)
4. Infrastructure (VPC, security groups, IAM)

**See Section 14 for complete security requirements.**

---

## 11. Data Model

### Complete Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== USERS & AUTH ====================

model User {
  id            String        @id @default(cuid())
  email         String        @unique
  name          String
  password      String        // Hashed with bcrypt
  role          Role          @default(USER)

  emailVerified DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  lastLoginAt   DateTime?

  // Relations
  organizations Organization[]
  assessments   Assessment[]

  @@index([email])
  @@index([role])
  @@map("users")
}

enum Role {
  ADMIN
  USER
}

// ==================== ORGANIZATION ====================

model Organization {
  id              String        @id @default(cuid())
  userId          String        // Creator

  // Business details
  productName     String
  description     String
  services        String
  targetCustomers String
  problemSolved   String

  // Compliance context
  dataHandled     String[]      // ["PII", "PHI", "Financial"]
  regions         String[]      // ["US", "EU", "UK"]

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Relations
  user            User          @relation(fields: [userId], references: [id])
  assessments     Assessment[]

  @@index([userId])
  @@index([createdAt])
  @@map("organizations")
}

// ==================== FRAMEWORKS & CONTROLS ====================

model Framework {
  id              String        @id @default(cuid())

  code            String        @unique   // "GDPR", "HIPAA"
  name            String                  // "General Data Protection Regulation"
  description     String
  region          String                  // "EU", "US", "Global"
  category        String                  // "Privacy", "Security"
  version         String                  // "1.0.0"
  effectiveDate   DateTime
  sourceLink      String?

  status          FrameworkStatus @default(DRAFT)
  publishedAt     DateTime?

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Relations
  controls        Control[]

  @@index([code])
  @@index([region])
  @@index([category])
  @@index([status])
  @@map("frameworks")
}

enum FrameworkStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model Control {
  id              String        @id @default(cuid())
  frameworkId     String

  code            String                  // "GDPR-7.1"
  title           String
  description     String
  category        String?
  severity        Severity      @default(MEDIUM)
  weight          Float         @default(1.0)

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Relations
  framework       Framework     @relation(fields: [frameworkId], references: [id], onDelete: Cascade)
  assessmentItems AssessmentItem[]

  @@unique([frameworkId, code])
  @@index([frameworkId])
  @@index([severity])
  @@map("controls")
}

enum Severity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

// ==================== ASSESSMENTS ====================

model Assessment {
  id              String        @id @default(cuid())
  userId          String
  organizationId  String

  status          AssessmentStatus @default(IN_PROGRESS)
  score           Float?                   // 0-100

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  completedAt     DateTime?

  // Relations
  user            User          @relation(fields: [userId], references: [id])
  organization    Organization  @relation(fields: [organizationId], references: [id])
  items           AssessmentItem[]
  reports         Report[]
  aiInteractions  AIInteraction[]

  @@index([userId])
  @@index([organizationId])
  @@index([status])
  @@index([createdAt])
  @@map("assessments")
}

enum AssessmentStatus {
  DRAFT
  IN_PROGRESS
  COMPLETED
}

model AssessmentItem {
  id              String        @id @default(cuid())
  assessmentId    String
  controlId       String

  status          ItemStatus    @default(NOT_STARTED)
  comments        String?

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Relations
  assessment      Assessment    @relation(fields: [assessmentId], references: [id], onDelete: Cascade)
  control         Control       @relation(fields: [controlId], references: [id])
  evidence        Evidence[]

  @@unique([assessmentId, controlId])
  @@index([assessmentId])
  @@index([controlId])
  @@index([status])
  @@map("assessment_items")
}

enum ItemStatus {
  NOT_STARTED
  COMPLIANT
  PARTIALLY_COMPLIANT
  NOT_COMPLIANT
  NOT_APPLICABLE
}

// ==================== EVIDENCE ====================

model Evidence {
  id                String        @id @default(cuid())
  assessmentItemId  String
  userId            String        // Uploader

  filename          String
  originalName      String
  fileUrl           String                 // S3 URL
  fileSize          Int
  mimeType          String
  description       String?

  uploadedAt        DateTime      @default(now())

  // Relations
  assessmentItem    AssessmentItem @relation(fields: [assessmentItemId], references: [id], onDelete: Cascade)

  @@index([assessmentItemId])
  @@index([uploadedAt])
  @@map("evidence")
}

// ==================== REPORTS ====================

model Report {
  id              String        @id @default(cuid())
  assessmentId    String

  type            ReportType
  format          ReportFormat
  fileUrl         String?                  // S3 URL for PDF

  generatedAt     DateTime      @default(now())

  // Relations
  assessment      Assessment    @relation(fields: [assessmentId], references: [id], onDelete: Cascade)

  @@index([assessmentId])
  @@index([generatedAt])
  @@map("reports")
}

enum ReportType {
  COMPLIANCE_READINESS
  EXECUTIVE_SUMMARY
}

enum ReportFormat {
  PDF
  WEB
}

// ==================== AI INTERACTIONS ====================

model AIInteraction {
  id              String        @id @default(cuid())
  assessmentId    String?

  type            AIType
  input           String                   // JSON stringified
  output          String                   // JSON stringified
  model           String                   // "gpt-4-turbo"
  tokensUsed      Int?
  durationMs      Int?

  createdAt       DateTime      @default(now())

  // Relations
  assessment      Assessment?   @relation(fields: [assessmentId], references: [id], onDelete: SetNull)

  @@index([assessmentId])
  @@index([type])
  @@index([createdAt])
  @@map("ai_interactions")
}

enum AIType {
  COMPLIANCE_MAPPING
  REMEDIATION_PLAN
  REPORT_NARRATIVE
}
```

---

## 12. AI/ML Requirements

### 12.1 AI Use Cases

**Use Case 1: Compliance Framework Mapping**

- **Input:** Organization profile (business details, data types, regions)
- **Output:** Ranked list of applicable frameworks with confidence scores
- **Model:** GPT-4-Turbo / Claude 3.5 Sonnet
- **Latency:** < 10 seconds
- **Accuracy Target:** 90% (measured by manual review)

**Use Case 2: Remediation Plan Generation**

- **Input:** Control details, current status
- **Output:** Step-by-step remediation plan with priorities
- **Model:** GPT-4-Turbo / Claude 3.5 Sonnet
- **Latency:** < 10 seconds

**Use Case 3: Report Narrative Generation**

- **Input:** Assessment data, scores, risks
- **Output:** Executive summary text
- **Model:** GPT-4-Turbo / Claude 3.5 Sonnet
- **Latency:** < 15 seconds

---

### 12.2 AI Architecture

**Approach:** Direct LLM calls (no RAG in v1.0)

**Flow:**

```
User Input → Prompt Template → LLM API → Response Parsing → User Display
```

**Prompt Engineering Strategy:**

- Use few-shot examples
- Specify output format (JSON)
- Provide clear constraints
- Include error handling instructions

---

### 12.3 AI Safety & Quality

**Hallucination Mitigation:**

- Use temperature 0.3-0.4 (lower = more deterministic)
- Request citations/sources
- Add confidence scores
- Flag low-confidence outputs for review

**Quality Assurance:**

- Manual review of sample outputs (10% of generations)
- A/B testing of prompt variations
- User feedback mechanism ("Was this helpful?")
- Track acceptance rate of AI suggestions

**Bias & Fairness:**

- Avoid biased training examples
- Review outputs for legal/compliance accuracy
- Provide disclaimer: "AI-generated, not legal advice"

---

### 12.4 AI Cost Management

**Cost Controls:**

- Cache responses (24-hour TTL)
- Rate limit per user (10 requests/hour)
- Use cheaper models for simple tasks
- Monitor token usage

**Cost Estimation:**

```
GPT-4-Turbo Pricing (as of 2026):
- Input: $10 / 1M tokens
- Output: $30 / 1M tokens

Typical Request:
- Framework mapping: ~2,000 tokens input, 1,000 tokens output = $0.05
- Remediation plan: ~1,500 tokens input, 2,000 tokens output = $0.075

Monthly estimate (100 users, 5 requests/user):
- 500 requests × $0.06 avg = $30/month
```

---

## 13. Security & Compliance

### 13.1 Security Measures

**Authentication:** (Better Auth)

- Email/password with bcrypt hashing
- JWT session tokens (7-day expiration)
- Rate limiting (5 failed attempts = 15 min lockout)
- Email verification required
- Password reset via secure token

**Authorization:**

- Role-Based Access Control (RBAC)
- Admin vs. User roles
- Permission checks on every API request
- Principle of least privilege

**Data Protection:**

- TLS 1.3 for all connections
- Database encryption at rest
- File encryption at rest
- No plain-text storage of sensitive data
- PII handling minimization

**Input Validation:**

- Client-side validation (React Hook Form + Zod)
- Server-side validation (Zod schemas)
- SQL injection prevention (Prisma ORM)
- XSS prevention (React escaping + CSP headers)
- File upload validation (type, size, virus scan)

**Security Headers:**

```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

**Secrets Management:**

- Secrets Manager for production
- Vercel Environment Variables
- No secrets in code repository
- Regular rotation (DB: 90 days, API keys: 180 days)

---

### 13.2 Compliance Certifications (Roadmap)

**v1.0:**

- GDPR compliant (data privacy)
- Basic security controls

**v2.0:**

- SOC 2 Type II certification
- ISO 27001 certification (optional)
- HIPAA-ready infrastructure (for healthcare customers)

---

### 13.3 Data Privacy

**User Data:**

- Collect only necessary data
- Obtain explicit consent
- Provide data export (JSON)
- Provide data deletion
- Honor "Do Not Track"

**Data Retention:**

- Active assessments: Indefinite
- Deleted assessments: 30-day soft delete
- Audit logs: 1 year
- Backups: No
