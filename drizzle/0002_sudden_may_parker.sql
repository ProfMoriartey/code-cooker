CREATE TABLE "qrgen_multi_page_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"set_id" integer NOT NULL,
	"label" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "qrgen_multi_page_sets" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"short_code" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "qrgen_multi_page_sets_short_code_unique" UNIQUE("short_code")
);
--> statement-breakpoint
ALTER TABLE "qrgen_multi_page_items" ADD CONSTRAINT "qrgen_multi_page_items_set_id_qrgen_multi_page_sets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."qrgen_multi_page_sets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qrgen_multi_page_sets" ADD CONSTRAINT "qrgen_multi_page_sets_userId_qrgen_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."qrgen_user"("id") ON DELETE cascade ON UPDATE no action;