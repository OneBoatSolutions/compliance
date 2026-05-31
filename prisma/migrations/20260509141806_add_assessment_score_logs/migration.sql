-- CreateTable
CREATE TABLE "assessment_score_logs" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "frameworkScores" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_score_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "assessment_score_logs_assessmentId_idx" ON "assessment_score_logs"("assessmentId");

-- CreateIndex
CREATE INDEX "assessment_score_logs_createdAt_idx" ON "assessment_score_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "assessment_score_logs" ADD CONSTRAINT "assessment_score_logs_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
