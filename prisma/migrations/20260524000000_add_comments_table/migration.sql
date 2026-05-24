-- CreateTable
CREATE TABLE IF NOT EXISTS "comments" (
    "id" TEXT NOT NULL,
    "assessmentItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "comments_assessmentItemId_idx" ON "comments"("assessmentItemId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "comments_assessmentItemId_createdAt_idx" ON "comments"("assessmentItemId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_assessmentItemId_fkey" FOREIGN KEY ("assessmentItemId") REFERENCES "assessment_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
