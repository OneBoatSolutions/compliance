-- Cleanup duplicate index produced by earlier rename/create sequence in some environments
DROP INDEX IF EXISTS "assessments_userId_createdAt_idx";