CREATE TABLE "posts" (
	"id" serial PRIMARY KEY,
	"slug" text NOT NULL UNIQUE,
	"title" text NOT NULL,
	"excerpt" text DEFAULT '' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"category" text NOT NULL,
	"kind" text DEFAULT 'article' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"author_name" text NOT NULL,
	"author_role" text DEFAULT '' NOT NULL,
	"owner_id" text NOT NULL,
	"owner_email" text DEFAULT '' NOT NULL,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"sources" text[] DEFAULT '{}'::text[] NOT NULL,
	"cover_key" text,
	"featured" boolean DEFAULT false NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"review_note" text DEFAULT '' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "posts_status_published_idx" ON "posts" ("status","published_at");--> statement-breakpoint
CREATE INDEX "posts_owner_idx" ON "posts" ("owner_id");
