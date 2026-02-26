# Complete System Architecture for AI-Assured Compliance Dashboard

## 1. SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                         │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    Next.js Web Application                     │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │ │
│  │  │  Admin UI    │  │   User UI    │  │  Public UI   │          │ │
│  │  │  - Framework │  │  - Onboard   │  │  - Login     │          │ │
│  │  │  - Controls  │  │  - Assessment│  │  - Register  │          │ │
│  │  │  - Users     │  │  - Reports   │  │              │          │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              ↕ HTTPS
┌─────────────────────────────────────────────────────────────────────┐
│                       APPLICATION LAYER (API)                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    Next.js API Routes                          │ │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │ │
│  │  │ Auth │ │ Org  │ │ Frame│ │Assess│ │  AI  │ │Report│         │ │
│  │  │      │ │      │ │ work │ │ ment │ │      │ │      │         │ │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘         │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────────┐
│                         BUSINESS LOGIC LAYER                        │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                         Services                               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │ │
│  │  │   Framework  │  │  Assessment  │  │  AI Service  │          │ │
│  │  │   Service    │  │   Service    │  │  - Mapping   │          │ │
│  │  │              │  │  - Scoring   │  │  - Remediate │          │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────────┐
│                          DATA ACCESS LAYER                          │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                      Prisma ORM                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────────┐
│                       PERSISTENCE LAYER                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │   PostgreSQL     │  │    File Storage  │  │     Cache        │   │
│  │   (Primary DB)   │  │    (S3/MinIO)    │  │    (Redis)       │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────────┐
│                       EXTERNAL SERVICES                             │
│  ┌──────────────────┐  ┌──────────────────┐                         │
│  │  Vercel AI SDK   │  │   OpenAI API     │                         │
│  │  (Abstraction)   │  │   (LLM Provider) │                         │
│  └──────────────────┘  └──────────────────┘                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. HIGH-LEVEL ARCHITECTURE

### 2.1 Architecture Diagram

```
┌───────────────────────────────────────────────────────────────────────┐
│                              CLIENT TIER                              │
│                                                                       │
│   ┌─────────────────────────────────────────────────────────────┐     │
│   │              Next.js 14+ (App Router)                       │     │
│   │  ┌────────────┐  ┌────────────┐  ┌────────────┐             │     │
│   │  │   Admin    │  │    User    │  │   Auth     │             │     │
│   │  │   Portal   │  │   Portal   │  │   Pages    │             │     │
│   │  │            │  │            │  │            │             │     │
│   │  │ - CRUD     │  │ - Onboard  │  │ - Login    │             │     │
│   │  │ - Manage   │  │ - Assess   │  │ - Register │             │     │
│   │  │ - Monitor  │  │ - Report   │  │            │             │     │
│   │  └────────────┘  └────────────┘  └────────────┘             │     │
│   │                                                             │     │
│   │  State Management: Zustand                                  │     │
│   │  UI Components: Tailwind CSS + shadcn/ui                    │     │
│   └─────────────────────────────────────────────────────────────┘     │
└───────────────────────────────────────────────────────────────────────┘
                                  ↕
┌───────────────────────────────────────────────────────────────────────┐
│                          APPLICATION TIER                             │
│                                                                       │
│   ┌─────────────────────────────────────────────────────────────┐     │
│   │                  Next.js API Routes                         │     │
│   │                                                             │     │
│   │  /api/auth/*          - Authentication & Authorization      │     │
│   │  /api/organizations/* - Org onboarding                      │     │
│   │  /api/frameworks/*    - Framework CRUD (Admin)              │     │
│   │  /api/assessments/*   - Assessment management               │     │
│   │  /api/ai/*            - AI services (mapping, remediation)  │     │
│   │  /api/reports/*       - Report generation                   │     │
│   │                                                             │     │
│   └─────────────────────────────────────────────────────────────┘     │
│                                                                       │
│   ┌─────────────────────────────────────────────────────────────┐     │
│   │                    Business Services                        │     │
│   │                                                             │     │
│   │  ┌──────────────────┐  ┌───────────────────┐                │     │
│   │  │ Framework Service│  │ Assessment Service│                │     │
│   │  │ - CRUD           │  │ - Create          │                │     │
│   │  │ - Validation     │  │ - Update          │                │     │
│   │  │                  │  │ - Score calc      │                │     │
│   │  └──────────────────┘  └───────────────────┘                │     │
│   │                                                             │     │
│   │  ┌──────────────────┐  ┌──────────────────┐                 │     │
│   │  │   AI Service     │  │  Report Service  │                 │     │
│   │  │ - Map compliance │  │ - Generate PDF   │                 │     │
│   │  │ - Remediation    │  │ - Web view       │                 │     │
│   │  └──────────────────┘  └──────────────────┘                 │     │
│   └─────────────────────────────────────────────────────────────┘     │
└───────────────────────────────────────────────────────────────────────┘
                                  ↕
┌───────────────────────────────────────────────────────────────────────┐
│                            DATA TIER                                  │
│                                                                       │
│   ┌──────────────────────────────────────────────────────────────┐    │
│   │               PostgreSQL Database                            │    │
│   │                                                              │    │
│   │  Tables:                                                     │    │
│   │  - users                                                     │    │
│   │  - organizations                                             │    │
│   │  - frameworks                                                │    │
│   │  - controls                                                  │    │
│   │  - assessments                                               │    │
│   │  - assessment_items                                          │    │
│   │  - evidence                                                  │    │
│   │                                                              │    │
│   │  Access: Prisma ORM                                          │    │
│   └──────────────────────────────────────────────────────────────┘    │
│                                                                       │
│   ┌─────────────────────────────────────────────────────────────┐     │
│   │              File Storage (AWS S3 / MinIO)                  │     │
│   │  - Evidence files                                           │     │
│   │  - Generated reports (PDF)                                  │     │
│   └─────────────────────────────────────────────────────────────┘     │
│                                                                       │
│   ┌─────────────────────────────────────────────────────────────┐     │
│   │                    Cache Layer (Redis)                      │     │
│   │  - Session data                                             │     │
│   │  - AI response cache                                        │     │
│   │  - Rate limiting                                            │     │
│   └─────────────────────────────────────────────────────────────┘     │
└───────────────────────────────────────────────────────────────────────┘
                                  ↕
┌───────────────────────────────────────────────────────────────────────┐
│                       EXTERNAL SERVICES TIER                          │
│                                                                       │
│   ┌─────────────────────────────────────────────────────────────┐     │
│   │                    AI Provider                              │     │
│   │  Vercel AI SDK → OpenAI / Anthropic Claude                  │     │
│   │                                                             │     │
│   │  Use Cases:                                                 │     │
│   │  1. Compliance framework mapping                            │     │
│   │  2. Remediation plan generation                             │     │
│   │  3. Report narrative generation                             │     │
│   └─────────────────────────────────────────────────────────────┘     │
└───────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Interaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   USER JOURNEY: COMPLIANCE ASSESSMENT           │
└─────────────────────────────────────────────────────────────────┘

Step 1: Organization Onboarding
┌──────┐     ┌─────────┐    ┌────────────┐     ┌────────────┐
│ User │───▶  Next.js  ───▶│ API Route  │───▶ │ AI Service
└──────┘     │   UI    │    │ /api/org/  │     │  (OpenAI)  │
             └─────────┘    │  onboard   │     └────────────┘
                            └────────────┘          │
                                  │                │
                                  ▼                ▼
                           ┌────────────┐    ┌──────────┐
                           │  Database  │    │AI returns│
                           │  (Prisma)  │    │suggested │
                           └────────────┘    │frameworks│
                                             └──────────┘

Step 2: Framework Selection
┌──────┐    ┌─────────┐    ┌────────────┐    ┌──────────┐
│ User │───▶│Framework│───▶│ Assessment │───▶│ Database │
│Select│    │ Display │    │  Service   │    │  Create  │
└──────┘    └─────────┘    └────────────┘    └──────────┘

Step 3: Checklist Completion
┌──────┐    ┌─────────┐    ┌────────────┐     ┌──────────┐
│ User │───▶ Checklist ───▶ Assessment  ───▶  Database
│Update│    │   UI    │    │  Service   │     │  Update  │
│Status│    │         │    │ + Scoring  │     └──────────┘
└──────┘    └─────────┘    └────────────┘

Step 4: Report Generation
┌──────┐    ┌─────────┐    ┌────────────┐    ┌──────────┐
│ User │───▶ Report   ───▶    Report    ───▶   PDF
│Click │    │  Button │    │  Service   │    │ Generator│
└──────┘    └─────────┘    └────────────┘    └──────────┘
                                  │                │
                                  ▼                ▼
                           ┌────────────┐    ┌──────────┐
                           │     S3     │◀───   File
                           │  Storage   │    │   Save   │
                           └────────────┘    └──────────┘

Step 5: AI Remediation
┌──────┐    ┌─────────┐     ┌────────────┐     ┌──────────┐
│ User │───▶   Get   ───▶  AI Service ───▶   OpenAI
│Click │    │Remediate│     │            │     │   API    │
└──────┘    └─────────┘     └────────────┘     └──────────┘
                                  │                │
                                  ▼                ▼
                           ┌────────────┐    ┌──────────┐
                           │  Display   │◀───  Parse
                           │   Plan     │    │ Response │
                           └────────────┘    └──────────┘
```

---

## 3. LOW-LEVEL ARCHITECTURE

### 3.1 Frontend Architecture (Detailed)

```
┌───────────────────────────────────────────────────────────────────┐
│                    FRONTEND STRUCTURE (Next.js 14)                │
└───────────────────────────────────────────────────────────────────┘

/app
├── (auth)                              # Auth route group
│   ├── login/
│   │   └── page.tsx                    # Login page
│   ├── register/
│   │   └── page.tsx                    # Register page
│   └── layout.tsx                      # Auth layout
│
├── (admin)                             # Admin route group
│   ├── dashboard/
│   │   └── page.tsx                    # Admin dashboard
│   ├── frameworks/
│   │   ├── page.tsx                    # List frameworks
│   │   ├── new/
│   │   │   └── page.tsx                # Create framework
│   │   └── [id]/
│   │       ├── page.tsx                # Edit framework
│   │       └── controls/
│   │           ├── page.tsx            # List controls
│   │           └── [controlId]/
│   │               └── page.tsx        # Edit control
│   ├── users/
│   │   ├── page.tsx                    # User management
│   │   └── [id]/
│   │       └── page.tsx                # Edit user
│   └── layout.tsx                      # Admin layout
│
├── (user)                              # User route group
│   ├── dashboard/
│   │   └── page.tsx                    # User dashboard
│   ├── onboarding/
│   │   ├── page.tsx                    # Step 1: Org details
│   │   └── suggested-frameworks/
│   │       └── page.tsx                # Step 2: AI suggestions
│   ├── assessments/
│   │   ├── page.tsx                    # List assessments
│   │   ├── new/
│   │   │   └── page.tsx                # Create assessment
│   │   └── [id]/
│   │       ├── page.tsx                # Assessment overview
│   │       ├── checklist/
│   │       │   └── page.tsx            # Checklist view
│   │       ├── evidence/
│   │       │   └── page.tsx            # Evidence upload
│   │       └── report/
│   │           └── page.tsx            # Report view
│   └── layout.tsx                      # User layout
│
├── api/                                # API routes
│   ├── auth/
│   │   ├── login/route.ts
│   │   ├── logout/route.ts
│   │   └── register/route.ts
│   ├── organizations/
│   │   ├── route.ts                    # POST: create org
│   │   └── [id]/route.ts               # GET, PATCH
│   ├── frameworks/
│   │   ├── route.ts                    # GET (list), POST (create)
│   │   └── [id]/
│   │       ├── route.ts                # GET, PATCH, DELETE
│   │       └── controls/
│   │           ├── route.ts            # GET, POST
│   │           └── [controlId]/
│   │               └── route.ts        # PATCH, DELETE
│   ├── assessments/
│   │   ├── route.ts                    # GET, POST
│   │   └── [id]/
│   │       ├── route.ts                # GET, PATCH
│   │       ├── items/
│   │       │   └── [itemId]/
│   │       │       └── route.ts        # PATCH (update status)
│   │       └── score/
│   │           └── route.ts            # GET (calculate score)
│   ├── ai/
│   │   ├── map-compliance/route.ts     # POST: AI mapping
│   │   └── remediation/route.ts        # POST: Get remediation
│   ├── reports/
│   │   └── [assessmentId]/
│   │       ├── generate/route.ts       # POST: Generate report
│   │       └── download/route.ts       # GET: Download PDF
│   └── evidence/
│       ├── upload/route.ts             # POST: Upload file
│       └── [id]/route.ts               # GET, DELETE
│
├── components/
│   ├── ui/                             # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── admin/
│   │   ├── framework-form.tsx
│   │   ├── control-form.tsx
│   │   └── user-table.tsx
│   ├── user/
│   │   ├── onboarding-form.tsx
│   │   ├── framework-selector.tsx
│   │   ├── checklist-item.tsx
│   │   ├── evidence-uploader.tsx
│   │   └── compliance-score-card.tsx
│   ├── ai/
│   │   ├── ai-suggestions.tsx
│   │   └── remediation-plan.tsx
│   └── reports/
│       ├── report-preview.tsx
│       └── score-chart.tsx
│
├── lib/
│   ├── prisma.ts                       # Prisma client singleton
│   ├── auth.ts                         # Auth utilities
│   ├── api-client.ts                   # Frontend API client
│   └── utils.ts                        # Common utilities
│
├── stores/                             # Zustand stores
│   ├── auth-store.ts
│   ├── assessment-store.ts
│   └── framework-store.ts
│
└── types/
    ├── user.ts
    ├── framework.ts
    ├── assessment.ts
    └── api.ts
```

### 3.2 State Management (Zustand)

```typescript
// stores/assessment-store.ts
import { create } from "zustand";
import { Assessment, AssessmentItem, ItemStatus } from "@/types";

interface AssessmentState {
  // State
  currentAssessment: Assessment | null;
  items: AssessmentItem[];
  complianceScore: number | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadAssessment: (id: string) => Promise<void>;
  updateItemStatus: (itemId: string, status: ItemStatus, comments?: string) => Promise<void>;
  calculateScore: () => Promise<void>;
  reset: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  currentAssessment: null,
  items: [],
  complianceScore: null,
  isLoading: false,
  error: null,

  loadAssessment: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/assessments/${id}`);
      const data = await response.json();
      set({
        currentAssessment: data.assessment,
        items: data.items,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateItemStatus: async (itemId: string, status: ItemStatus, comments?: string) => {
    try {
      const response = await fetch(
        `/api/assessments/${get().currentAssessment?.id}/items/${itemId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, comments }),
        },
      );
      const updatedItem = await response.json();

      set((state) => ({
        items: state.items.map((item) => (item.id === itemId ? updatedItem : item)),
      }));

      // Recalculate score
      await get().calculateScore();
    } catch (error) {
      set({ error: error.message });
    }
  },

  calculateScore: async () => {
    const assessmentId = get().currentAssessment?.id;
    if (!assessmentId) return;

    try {
      const response = await fetch(`/api/assessments/${assessmentId}/score`);
      const { score } = await response.json();
      set({ complianceScore: score });
    } catch (error) {
      set({ error: error.message });
    }
  },

  reset: () =>
    set({
      currentAssessment: null,
      items: [],
      complianceScore: null,
      isLoading: false,
      error: null,
    }),
}));
```

### 3.3 Backend Architecture (Detailed)

#### API Route Structure

```typescript
// app/api/assessments/[id]/items/[itemId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { ItemStatus } from "@prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } },
) {
  try {
    // 1. Authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request body
    const body = await request.json();
    const { status, comments } = body;

    // 3. Validation
    if (!Object.values(ItemStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // 4. Authorization check
    const assessment = await prisma.assessment.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (assessment.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 5. Update item
    const updatedItem = await prisma.assessmentItem.update({
      where: { id: params.itemId },
      data: {
        status,
        comments,
        updatedAt: new Date(),
      },
      include: {
        control: true,
      },
    });

    // 6. Recalculate assessment score
    await recalculateAssessmentScore(params.id);

    // 7. Return updated item
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating assessment item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function recalculateAssessmentScore(assessmentId: string) {
  const items = await prisma.assessmentItem.findMany({
    where: { assessmentId },
    include: { control: true },
  });

  const applicableItems = items.filter((item) => item.status !== ItemStatus.NOT_APPLICABLE);

  if (applicableItems.length === 0) {
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: { score: 0 },
    });
    return;
  }

  const totalWeight = applicableItems.reduce((sum, item) => sum + (item.control.weight || 1.0), 0);

  const weightedScore = applicableItems.reduce((sum, item) => {
    const itemScore = getItemScore(item.status);
    const weight = item.control.weight || 1.0;
    return sum + itemScore * weight;
  }, 0);

  const score = (weightedScore / totalWeight) * 100;

  await prisma.assessment.update({
    where: { id: assessmentId },
    data: { score },
  });
}

function getItemScore(status: ItemStatus): number {
  const scoreMap: Record<ItemStatus, number> = {
    COMPLIANT: 1.0,
    PARTIALLY_COMPLIANT: 0.5,
    NOT_COMPLIANT: 0.0,
    NOT_APPLICABLE: 0.0,
  };
  return scoreMap[status];
}
```

### 3.4 Service Layer Architecture

```typescript
// services/ai-service.ts
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export class AIService {
  /**
   * Map organization details to compliance frameworks
   */
  static async mapCompliance(input: {
    productName: string;
    description: string;
    services: string;
    targetCustomers: string;
    problemSolved: string;
    dataHandled: string[];
    regions: string[];
  }): Promise<{
    frameworks: Array<{
      id: string;
      name: string;
      confidence: number;
      explanation: string;
    }>;
  }> {
    const prompt = this.buildMappingPrompt(input);

    const { text } = await generateText({
      model: openai("gpt-4-turbo"),
      messages: [
        {
          role: "system",
          content: `You are a compliance expert. Analyze the organization details and suggest applicable compliance frameworks.
          
Return a JSON array with this exact structure:
{
  "frameworks": [
    {
      "id": "framework_code",
      "name": "Framework Name",
      "confidence": 0.95,
      "explanation": "Why this applies..."
    }
  ]
}

Available frameworks to consider:
- GDPR (EU data protection)
- HIPAA (US healthcare)
- PCI-DSS (Payment card data)
- SOC2 (Security controls)
- ISO27001 (Information security)
- CCPA (California privacy)
- NIST CSF (Cybersecurity framework)`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    try {
      const parsed = JSON.parse(text);
      return parsed;
    } catch (error) {
      throw new Error("Failed to parse AI response");
    }
  }

  private static buildMappingPrompt(input: any): string {
    return `
Analyze this organization:

Product/Service: ${input.productName}
Description: ${input.description}
Services Offered: ${input.services}
Target Customers: ${input.targetCustomers}
Problem Being Solved: ${input.problemSolved}
Data Handled: ${input.dataHandled.join(", ")}
Regions of Operation: ${input.regions.join(", ")}

Suggest the most applicable compliance frameworks with confidence scores and explanations.
`;
  }

  /**
   * Generate remediation plan for non-compliant items
   */
  static async generateRemediation(input: {
    controlTitle: string;
    controlDescription: string;
    currentStatus: string;
    framework: string;
  }): Promise<{
    steps: Array<{
      title: string;
      description: string;
      priority: "HIGH" | "MEDIUM" | "LOW";
      owner: string;
    }>;
    policySuggestions: string[];
    technicalControls: string[];
  }> {
    const prompt = `
Framework: ${input.framework}
Control: ${input.controlTitle}
Description: ${input.controlDescription}
Current Status: ${input.currentStatus}

Generate a detailed remediation plan with:
1. Step-by-step actions (prioritized)
2. Policy suggestions
3. Technical control recommendations

Return as JSON:
{
  "steps": [
    {
      "title": "...",
      "description": "...",
      "priority": "HIGH|MEDIUM|LOW",
      "owner": "Security Team|IT|Compliance|..."
    }
  ],
  "policySuggestions": ["...", "..."],
  "technicalControls": ["...", "..."]
}
`;

    const { text } = await generateText({
      model: openai("gpt-4-turbo"),
      messages: [
        {
          role: "system",
          content:
            "You are a compliance remediation expert. Provide actionable, specific guidance.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
    });

    return JSON.parse(text);
  }
}

// services/assessment-service.ts
import { prisma } from "@/lib/prisma";
import { ItemStatus } from "@prisma/client";

export class AssessmentService {
  /**
   * Create a new assessment from selected frameworks
   */
  static async createAssessment(userId: string, organizationId: string, frameworkIds: string[]) {
    return await prisma.$transaction(async (tx) => {
      // 1. Create assessment
      const assessment = await tx.assessment.create({
        data: {
          userId,
          organizationId,
          status: "IN_PROGRESS",
          score: 0,
        },
      });

      // 2. Get all controls for selected frameworks
      const controls = await tx.control.findMany({
        where: {
          frameworkId: { in: frameworkIds },
        },
      });

      // 3. Create assessment items for each control
      const items = await Promise.all(
        controls.map((control) =>
          tx.assessmentItem.create({
            data: {
              assessmentId: assessment.id,
              controlId: control.id,
              status: ItemStatus.NOT_STARTED,
            },
          }),
        ),
      );

      return { assessment, items };
    });
  }

  /**
   * Calculate compliance score
   */
  static calculateScore(
    items: Array<{
      status: ItemStatus;
      control: { weight?: number };
    }>,
  ): number {
    const applicableItems = items.filter((item) => item.status !== ItemStatus.NOT_APPLICABLE);

    if (applicableItems.length === 0) return 0;

    const totalWeight = applicableItems.reduce(
      (sum, item) => sum + (item.control.weight || 1.0),
      0,
    );

    const weightedScore = applicableItems.reduce((sum, item) => {
      const itemScore = this.getItemScore(item.status);
      const weight = item.control.weight || 1.0;
      return sum + itemScore * weight;
    }, 0);

    return (weightedScore / totalWeight) * 100;
  }

  private static getItemScore(status: ItemStatus): number {
    const scoreMap: Record<ItemStatus, number> = {
      COMPLIANT: 1.0,
      PARTIALLY_COMPLIANT: 0.5,
      NOT_COMPLIANT: 0.0,
      NOT_APPLICABLE: 0.0,
    };
    return scoreMap[status];
  }

  /**
   * Get risk summary
   */
  static getRiskSummary(
    items: Array<{
      status: ItemStatus;
      control: { severity: string };
    }>,
  ) {
    const nonCompliantItems = items.filter(
      (item) =>
        item.status === ItemStatus.NOT_COMPLIANT || item.status === ItemStatus.PARTIALLY_COMPLIANT,
    );

    const riskDistribution = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    };

    nonCompliantItems.forEach((item) => {
      const severity = item.control.severity as keyof typeof riskDistribution;
      riskDistribution[severity]++;
    });

    return {
      totalRisks: nonCompliantItems.length,
      distribution: riskDistribution,
      criticalCount: riskDistribution.CRITICAL,
    };
  }
}

// services/report-service.ts
import PDFDocument from "pdfkit";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export class ReportService {
  private static s3Client = new S3Client({
    region: process.env.AWS_REGION!,
  });

  /**
   * Generate compliance readiness report
   */
  static async generateReport(assessmentId: string): Promise<string> {
    // 1. Fetch assessment data
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        organization: true,
        items: {
          include: {
            control: {
              include: {
                framework: true,
              },
            },
            evidence: true,
          },
        },
      },
    });

    if (!assessment) throw new Error("Assessment not found");

    // 2. Calculate metrics
    const score = AssessmentService.calculateScore(assessment.items);
    const riskSummary = AssessmentService.getRiskSummary(assessment.items);

    // 3. Generate PDF
    const pdfBuffer = await this.generatePDF({
      assessment,
      score,
      riskSummary,
    });

    // 4. Upload to S3
    const key = `reports/${assessmentId}-${Date.now()}.pdf`;
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Body: pdfBuffer,
        ContentType: "application/pdf",
      }),
    );

    // 5. Save report record
    await prisma.report.create({
      data: {
        assessmentId,
        type: "COMPLIANCE_READINESS",
        format: "PDF",
        fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
      },
    });

    return key;
  }

  private static async generatePDF(data: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Header
      doc.fontSize(20).text("Compliance Readiness Report", { align: "center" });
      doc.moveDown();

      // Organization details
      doc.fontSize(14).text("Organization Details");
      doc.fontSize(10).text(`Name: ${data.assessment.organization.name}`);
      doc.text(`Description: ${data.assessment.organization.description}`);
      doc.moveDown();

      // Compliance score
      doc.fontSize(14).text("Compliance Score");
      doc.fontSize(24).text(`${data.score.toFixed(1)}%`, { align: "center" });
      doc.moveDown();

      // Risk summary
      doc.fontSize(14).text("Risk Summary");
      doc.fontSize(10).text(`Total Risks: ${data.riskSummary.totalRisks}`);
      doc.text(`Critical: ${data.riskSummary.distribution.CRITICAL}`);
      doc.text(`High: ${data.riskSummary.distribution.HIGH}`);
      doc.text(`Medium: ${data.riskSummary.distribution.MEDIUM}`);
      doc.text(`Low: ${data.riskSummary.distribution.LOW}`);
      doc.moveDown();

      // Controls breakdown
      doc.addPage();
      doc.fontSize(14).text("Controls Breakdown");
      doc.moveDown();

      data.assessment.items.forEach((item: any) => {
        doc.fontSize(10);
        doc.text(`${item.control.title}`);
        doc.fontSize(8).text(`Status: ${item.status}`, { indent: 20 });
        doc.text(`Severity: ${item.control.severity}`, { indent: 20 });
        if (item.comments) {
          doc.text(`Comments: ${item.comments}`, { indent: 20 });
        }
        doc.moveDown(0.5);
      });

      doc.end();
    });
  }
}
```

### 3.5 Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== USER & AUTH ====================

model User {
  id            String        @id @default(cuid())
  email         String        @unique
  name          String
  password      String        // Hashed
  role          Role          @default(USER)

  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  // Relations
  assessments   Assessment[]

  @@index([email])
  @@index([role])
}

enum Role {
  ADMIN
  USER
}

// ==================== ORGANIZATION ====================

model Organization {
  id              String        @id @default(cuid())

  // Basic details
  productName     String
  description     String
  services        String
  targetCustomers String
  problemSolved   String

  // Data & compliance
  dataHandled     String[]      // ["PII", "PHI", "Financial"]
  regions         String[]      // ["US", "EU", "APAC"]

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Relations
  assessments     Assessment[]

  @@index([createdAt])
}

// ==================== COMPLIANCE FRAMEWORKS ====================

model Framework {
  id              String        @id @default(cuid())

  code            String        @unique   // "GDPR", "HIPAA", "PCI-DSS"
  name            String                  // "General Data Protection Regulation"
  description     String
  region          String                  // "EU", "US", "Global"
  category        String                  // "Privacy", "Security", "Healthcare"
  version         String
  effectiveDate   DateTime

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Relations
  controls        Control[]

  @@index([code])
  @@index([region])
  @@index([category])
}

model Control {
  id              String        @id @default(cuid())
  frameworkId     String

  code            String                  // "GDPR-7.1", "HIPAA-164.308"
  title           String
  description     String
  category        String?                 // "Access Control", "Encryption"
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

  @@index([userId])
  @@index([organizationId])
  @@index([status])
  @@index([createdAt])
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

  filename          String
  fileUrl           String                 // S3 URL
  fileSize          Int
  mimeType          String

  uploadedAt        DateTime      @default(now())

  // Relations
  assessmentItem    AssessmentItem @relation(fields: [assessmentItemId], references: [id], onDelete: Cascade)

  @@index([assessmentItemId])
  @@index([uploadedAt])
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

  type            AIType
  input           String                   // JSON stringified
  output          String                   // JSON stringified
  model           String                   // "gpt-4-turbo"
  tokensUsed      Int?

  createdAt       DateTime      @default(now())

  @@index([type])
  @@index([createdAt])
}

enum AIType {
  COMPLIANCE_MAPPING
  REMEDIATION_PLAN
  REPORT_NARRATIVE
}
```

### 3.6 Infrastructure Architecture

```yaml
# docker-compose.yml (Local Development)
version: "3.8"

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: compliance_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: compliance
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: compliance_cache
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  # MinIO (S3-compatible storage)
  minio:
    image: minio/minio:latest
    container_name: compliance_storage
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin123
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

```
# Production Deployment Architecture (Vercel + AWS)

┌─────────────────────────────────────────────────────────────────┐
│                        PRODUCTION STACK                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND & API HOSTING                                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Vercel Platform                                            │ │
│  │  ├─ Next.js App (SSR + Static)                             │ │
│  │  ├─ Edge Functions (Middleware)                            │ │
│  │  ├─ Serverless Functions (API Routes)                      │ │
│  │  ├─ Global CDN                                             │ │
│  │  └─ Auto-scaling                                           │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  DATABASE                                                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ AWS RDS PostgreSQL                                         │ │
│  │  ├─ Instance: db.t3.medium (production)                    │ │
│  │  ├─ Multi-AZ deployment                                    │ │
│  │  ├─ Read replicas (optional)                               │ │
│  │  ├─ Automated backups (7-day retention)                    │ │
│  │  └─ Encryption at rest (KMS)                               │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FILE STORAGE                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ AWS S3                                                     │ │
│  │  ├─ Bucket: compliance-evidence                            │ │
│  │  ├─ Bucket: compliance-reports                             │ │
│  │  ├─ Versioning enabled                                     │ │
│  │  ├─ Server-side encryption                                 │ │
│  │  └─ Lifecycle policies (archive after 90 days)             │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  CACHE LAYER                                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ AWS ElastiCache (Redis)                                    │ │
│  │  ├─ Instance: cache.t3.micro                               │ │
│  │  ├─ Session storage                                        │ │
│  │  ├─ AI response cache                                      │ │
│  │  └─ Rate limiting                                          │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  AI SERVICES                                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Vercel AI SDK → OpenAI / Anthropic                         │ │
│  │  ├─ Model: GPT-4-Turbo / Claude 3.5 Sonnet                 │ │
│  │  ├─ Rate limited                                           │ │
│  │  └─ Response caching                                       │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  MONITORING & LOGGING                                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ ├─ Vercel Analytics (Frontend performance)                 │ │
│  │ ├─ AWS CloudWatch (Logs & Metrics)                         │ │
│  │ ├─ Sentry (Error tracking)                                 │ │
│  │ └─ Uptime monitoring (StatusPage / Pingdom)                │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  SECURITY                                                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ ├─ AWS WAF (Web Application Firewall)                      │ │
│  │ ├─ Cloudflare (DDoS protection)                            │ │
│  │ ├─ AWS Secrets Manager (API keys, DB credentials)          │ │
│  │ └─ AWS KMS (Encryption keys)                               │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 3.7 Authentication & Authorization Flow

```typescript
// lib/auth.ts (NextAuth configuration)
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// middleware.ts (Route protection)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin");
  const isUserPage = request.nextUrl.pathname.startsWith("/user");

  // Redirect to login if not authenticated
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from auth pages
  if (token && isAuthPage) {
    const role = token.role as string;
    const redirectUrl = role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Check admin access
  if (isAdminPage && token?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Check user access
  if (isUserPage && token?.role !== "USER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/login", "/register"],
};
```

---

## 4. SECURITY ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                             │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Network Security
├─ TLS 1.3 (HTTPS enforced)
├─ WAF (SQL injection, XSS protection)
├─ DDoS protection (Cloudflare)
└─ IP whitelisting (admin routes)

Layer 2: Application Security
├─ Authentication (NextAuth)
├─ Authorization (RBAC)
├─ CSRF protection
├─ Input validation (Zod)
├─ SQL injection prevention (Prisma ORM)
└─ Rate limiting (Redis)

Layer 3: Data Security
├─ Password hashing (bcrypt)
├─ Encryption at rest
├─ Encryption in transit (TLS)
├─ Secure file upload (signed URLs)
└─ PII handling (minimal storage)

Layer 4: API Security
├─ JWT tokens
├─ API rate limiting
├─ Request signing
└─ Audit logging

Layer 5: Infrastructure Security
├─ VPC isolation
├─ Security groups
├─ IAM roles (least privilege)
├─ Secrets management (Enviornment Variable)
└─ Regular security updates
```

---

## 5. PERFORMANCE OPTIMIZATION

```typescript
// Caching Strategy
const cachingLayers = {
  // 1. Browser caching
  static: {
    maxAge: "1 year",
    assets: ["CSS", "JS", "Images"],
  },

  // 2. CDN caching (Vercel Edge)
  edge: {
    duration: "1 hour",
    revalidate: true,
  },

  // 3. Redis caching
  redis: {
    session: 3600, // 1 hour
    aiResponse: 86400, // 24 hours
    frameworks: 3600, // 1 hour
  },

  // 4. Database query optimization
  database: {
    indexes: [
      "user.email",
      "assessment.userId",
      "assessmentItem.assessmentId",
      "control.frameworkId",
    ],
    queryOptimization: "Prisma select optimization",
  },
};

// Database connection pooling
const prismaClientOptions = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ["query", "error", "warn"],
  errorFormat: "pretty",
  // Connection pool
  connection: {
    poolSize: 10,
    poolTimeout: 30000,
  },
};
```

---

This comprehensive architecture provides:

1. **Scalability**: Serverless functions, CDN, horizontal scaling capability
2. **Security**: Multi-layer security with encryption, RBAC, audit trails
3. **Performance**: Caching strategies, optimized queries, CDN
4. **Maintainability**: Clean separation of concerns, type safety, testing
5. **Reliability**: Health checks, monitoring, automated backups
6. **Cost-efficiency**: Pay-per-use serverless, auto-scaling
