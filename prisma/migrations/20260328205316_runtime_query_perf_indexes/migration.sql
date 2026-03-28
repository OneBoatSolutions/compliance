DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM pg_class
		WHERE relkind = 'i'
			AND relname = 'assessments_userId_createdAt_desc_idx'
	)
	AND NOT EXISTS (
		SELECT 1
		FROM pg_class
		WHERE relkind = 'i'
			AND relname = 'assessments_userId_createdAt_idx'
	) THEN
		ALTER INDEX "assessments_userId_createdAt_desc_idx" RENAME TO "assessments_userId_createdAt_idx";
	END IF;
END
$$;
