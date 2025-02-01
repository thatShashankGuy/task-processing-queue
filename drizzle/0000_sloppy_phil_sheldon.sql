CREATE TABLE "users" (
	"id" text PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"type" text,
	"payload" json,
	"status" "job_status" DEFAULT 'PENDING',
	"retry_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
