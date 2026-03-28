-- Runtime-critical composite indexes for current query bottlenecks
CREATE INDEX "assessments_userId_createdAt_desc_idx"
ON "assessments"("userId", "createdAt" DESC);

CREATE INDEX "assessment_items_assessmentId_status_idx"
ON "assessment_items"("assessmentId", "status");
