-- CreateEnum
CREATE TYPE "RemediationPlanStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RemediationStepStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- Workspace-at-registration support
ALTER TABLE "organizations" ADD COLUMN "name" TEXT;

UPDATE "organizations"
SET "name" = COALESCE(NULLIF("productName", ''), 'Workspace')
WHERE "name" IS NULL;

ALTER TABLE "organizations" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "organizations" ALTER COLUMN "productName" DROP NOT NULL;
ALTER TABLE "organizations" ALTER COLUMN "description" DROP NOT NULL;
ALTER TABLE "organizations" ALTER COLUMN "services" DROP NOT NULL;
ALTER TABLE "organizations" ALTER COLUMN "targetCustomers" DROP NOT NULL;
ALTER TABLE "organizations" ALTER COLUMN "problemSolved" DROP NOT NULL;
UPDATE "organizations" SET "dataHandled" = ARRAY[]::TEXT[] WHERE "dataHandled" IS NULL;
UPDATE "organizations" SET "regions" = ARRAY[]::TEXT[] WHERE "regions" IS NULL;
ALTER TABLE "organizations" ALTER COLUMN "dataHandled" SET DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "organizations" ALTER COLUMN "dataHandled" SET NOT NULL;
ALTER TABLE "organizations" ALTER COLUMN "regions" SET DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "organizations" ALTER COLUMN "regions" SET NOT NULL;

-- CreateTable
CREATE TABLE "remediation_plans" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "assessmentItemId" TEXT NOT NULL,
    "controlId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "status" "RemediationPlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "policies" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "technicalControls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "remediation_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "remediation_steps" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "estimatedHours" INTEGER NOT NULL,
    "status" "RemediationStepStatus" NOT NULL DEFAULT 'TODO',
    "sortOrder" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "remediation_steps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "organizations_name_idx" ON "organizations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "remediation_plans_assessmentItemId_key" ON "remediation_plans"("assessmentItemId");

-- CreateIndex
CREATE INDEX "remediation_plans_assessmentId_idx" ON "remediation_plans"("assessmentId");

-- CreateIndex
CREATE INDEX "remediation_plans_controlId_idx" ON "remediation_plans"("controlId");

-- CreateIndex
CREATE INDEX "remediation_plans_userId_idx" ON "remediation_plans"("userId");

-- CreateIndex
CREATE INDEX "remediation_plans_status_idx" ON "remediation_plans"("status");

-- CreateIndex
CREATE INDEX "remediation_steps_planId_idx" ON "remediation_steps"("planId");

-- CreateIndex
CREATE INDEX "remediation_steps_planId_status_idx" ON "remediation_steps"("planId", "status");

-- CreateIndex
CREATE INDEX "remediation_steps_completedAt_idx" ON "remediation_steps"("completedAt");

-- CreateIndex
CREATE INDEX "assessment_score_logs_assessmentId_createdAt_desc_idx" ON "assessment_score_logs"("assessmentId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "remediation_plans" ADD CONSTRAINT "remediation_plans_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remediation_plans" ADD CONSTRAINT "remediation_plans_assessmentItemId_fkey" FOREIGN KEY ("assessmentItemId") REFERENCES "assessment_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remediation_plans" ADD CONSTRAINT "remediation_plans_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "controls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remediation_plans" ADD CONSTRAINT "remediation_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remediation_steps" ADD CONSTRAINT "remediation_steps_planId_fkey" FOREIGN KEY ("planId") REFERENCES "remediation_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
