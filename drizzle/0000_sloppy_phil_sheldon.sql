CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE job_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
CREATE TABLE "users" (
	"id" text PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"type" text,
	"payload" json,
	"status" "job_status" DEFAULT 'PENDING',
	"retry_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);