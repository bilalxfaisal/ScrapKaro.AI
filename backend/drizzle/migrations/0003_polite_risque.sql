CREATE TABLE "user_api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"gemini_api_key" text,
	"exa_api_key" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_api_keys_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE INDEX "user_api_keys_user_id_idx" ON "user_api_keys" USING btree ("user_id");--> statement-breakpoint

-- Ownership is enforced against the Supabase auth.users table
ALTER TABLE "user_api_keys" ADD CONSTRAINT "user_api_keys_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint

-- Row Level Security: users can only access their own records
ALTER TABLE "user_api_keys" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

CREATE POLICY "user_api_keys_select_own" ON "user_api_keys" FOR SELECT TO authenticated USING ("user_id" = auth.uid());--> statement-breakpoint

CREATE POLICY "user_api_keys_insert_own" ON "user_api_keys" FOR INSERT TO authenticated WITH CHECK ("user_id" = auth.uid());--> statement-breakpoint

CREATE POLICY "user_api_keys_update_own" ON "user_api_keys" FOR UPDATE TO authenticated USING ("user_id" = auth.uid()) WITH CHECK ("user_id" = auth.uid());--> statement-breakpoint

CREATE POLICY "user_api_keys_delete_own" ON "user_api_keys" FOR DELETE TO authenticated USING ("user_id" = auth.uid());--> statement-breakpoint

-- Direct DB grants (used if the table is reached outside the backend).
-- RLS still restricts each role to its own rows.
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "user_api_keys" TO authenticated;--> statement-breakpoint

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "user_api_keys" TO service_role;