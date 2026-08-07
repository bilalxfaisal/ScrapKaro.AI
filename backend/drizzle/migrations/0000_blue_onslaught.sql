CREATE TABLE "research_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic" text NOT NULL,
	"purpose" text NOT NULL,
	"focus" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
