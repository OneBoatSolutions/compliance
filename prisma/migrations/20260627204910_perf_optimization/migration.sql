-- CreateIndex
CREATE INDEX "assessment_items_assessmentId_updatedAt_idx" ON "assessment_items"("assessmentId", "updatedAt" DESC);
