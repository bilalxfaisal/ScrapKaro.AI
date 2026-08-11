CREATE TABLE "research_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic" text NOT NULL,
	"purpose" text NOT NULL,
	"focus" text,
	"source_types" jsonb NOT NULL,
	"research_goal" text NOT NULL,
	"search_queries" jsonb NOT NULL,
	"keywords" jsonb NOT NULL,
	"recommended_sources" jsonb NOT NULL,
	"results" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
