-- AlterTable
ALTER TABLE "password_reset_tokens"
ADD COLUMN "usedAt" TIMESTAMP(3),
ADD COLUMN "invalidatedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "password_reset_tokens_userId_usedAt_invalidatedAt_expiresAt_idx"
ON "password_reset_tokens"("userId", "usedAt", "invalidatedAt", "expiresAt");
