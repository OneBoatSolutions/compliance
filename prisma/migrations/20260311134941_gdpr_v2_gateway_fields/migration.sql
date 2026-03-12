-- AlterTable
ALTER TABLE "assessment_items" ADD COLUMN     "evidenceNotes" TEXT,
ADD COLUMN     "owner" TEXT,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "targetDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "controls" ADD COLUMN     "isGateway" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "control_dependencies" (
    "id" TEXT NOT NULL,
    "parentControlId" TEXT NOT NULL,
    "childControlId" TEXT NOT NULL,
    "triggerValue" TEXT NOT NULL,
    "effect" TEXT NOT NULL,

    CONSTRAINT "control_dependencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "control_dependencies_parentControlId_idx" ON "control_dependencies"("parentControlId");

-- CreateIndex
CREATE INDEX "control_dependencies_childControlId_idx" ON "control_dependencies"("childControlId");

-- CreateIndex
CREATE UNIQUE INDEX "control_dependencies_parentControlId_childControlId_key" ON "control_dependencies"("parentControlId", "childControlId");

-- AddForeignKey
ALTER TABLE "control_dependencies" ADD CONSTRAINT "control_dependencies_parentControlId_fkey" FOREIGN KEY ("parentControlId") REFERENCES "controls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "control_dependencies" ADD CONSTRAINT "control_dependencies_childControlId_fkey" FOREIGN KEY ("childControlId") REFERENCES "controls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
