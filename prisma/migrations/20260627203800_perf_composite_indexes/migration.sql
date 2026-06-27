-- CreateIndex
CREATE INDEX "assessment_items_assessmentId_status_controlId_idx" ON "assessment_items"("assessmentId", "status", "controlId");

-- CreateIndex
CREATE INDEX "assessments_userId_organizationId_idx" ON "assessments"("userId", "organizationId");

-- CreateIndex
CREATE INDEX "controls_frameworkId_severity_idx" ON "controls"("frameworkId", "severity");

-- CreateIndex
CREATE INDEX "evidence_assessmentItemId_uploadedAt_idx" ON "evidence"("assessmentItemId", "uploadedAt" DESC);
