ALTER TABLE "qrgen_qr_codes" ADD COLUMN "is_dynamic" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "qrgen_qr_codes" ADD COLUMN "short_code" varchar(255);--> statement-breakpoint
ALTER TABLE "qrgen_qr_codes" ADD COLUMN "target_url" text;--> statement-breakpoint
ALTER TABLE "qrgen_qr_codes" ADD COLUMN "scan_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "qrgen_qr_codes" ADD CONSTRAINT "qrgen_qr_codes_short_code_unique" UNIQUE("short_code");