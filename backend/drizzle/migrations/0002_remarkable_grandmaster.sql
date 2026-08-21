-- Add user_id column (nullable first so existing dev rows don't break the ALTER)
ALTER TABLE "research_sessions" ADD COLUMN "user_id" uuid;--> statement-breakpoint

-- Cleanup: this database currently contains only development data (2 rows) and
-- auth.users is empty, so existing rows cannot be attributed to any owner.
-- They are explicitly deleted here rather than left orphaned/invisible once RLS
-- is enabled. With real production data a backfill to real user ids would be
-- required instead of deletion.
DELETE FROM "research_sessions" WHERE "user_id" IS NULL;--> statement-breakpoint

-- Every history record must have an owner
ALTER TABLE "research_sessions" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint

CREATE INDEX "research_sessions_user_id_idx" ON "research_sessions" USING btree ("user_id");--> statement-breakpoint

-- Ownership is enforced against the Supabase auth.users table
ALTER TABLE "research_sessions" ADD CONSTRAINT "research_sessions_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint

-- Row Level Security: users can only access their own records
ALTER TABLE "research_sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

CREATE POLICY "research_sessions_select_own" ON "research_sessions" FOR SELECT TO authenticated USING ("user_id" = auth.uid());--> statement-breakpoint

CREATE POLICY "research_sessions_insert_own" ON "research_sessions" FOR INSERT TO authenticated WITH CHECK ("user_id" = auth.uid());--> statement-breakpoint

CREATE POLICY "research_sessions_update_own" ON "research_sessions" FOR UPDATE TO authenticated USING ("user_id" = auth.uid()) WITH CHECK ("user_id" = auth.uid());--> statement-breakpoint

CREATE POLICY "research_sessions_delete_own" ON "research_sessions" FOR DELETE TO authenticated USING ("user_id" = auth.uid());--> statement-breakpoint

-- Direct DB grants (used if the table is reached outside the backend).
-- RLS still restricts each role to its own rows.
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "research_sessions" TO authenticated;--> statement-breakpoint

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "research_sessions" TO service_role;
