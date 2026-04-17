ALTER TABLE "qrgen_multi_page_sets" ADD COLUMN "background_color" varchar(7) DEFAULT '#F9FAFB' NOT NULL;--> statement-breakpoint
ALTER TABLE "qrgen_multi_page_sets" ADD COLUMN "button_color" varchar(7) DEFAULT '#FFFFFF' NOT NULL;--> statement-breakpoint
ALTER TABLE "qrgen_multi_page_sets" ADD COLUMN "button_hover_color" varchar(7) DEFAULT '#4F46E5' NOT NULL;--> statement-breakpoint
ALTER TABLE "qrgen_multi_page_sets" ADD COLUMN "text_color" varchar(7) DEFAULT '#111827' NOT NULL;