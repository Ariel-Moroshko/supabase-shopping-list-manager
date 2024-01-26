DO $$ BEGIN
 CREATE TYPE "language" AS ENUM('en', 'he', 'ru');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"listId" integer NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "categories_name_listId_unique" UNIQUE("name","listId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"categoryId" integer NOT NULL,
	"isInShoppingList" boolean DEFAULT false NOT NULL,
	"isPickedUp" boolean DEFAULT false NOT NULL,
	"pickedUpAt" timestamp,
	"note" text DEFAULT '' NOT NULL,
	CONSTRAINT "items_name_categoryId_unique" UNIQUE("name","categoryId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lists" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"invitationKey" uuid DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"language" "language" DEFAULT 'en' NOT NULL,
	CONSTRAINT "lists_invitationKey_unique" UNIQUE("invitationKey")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text,
	"image" text,
	"mainListId" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usersLists" (
	"userId" uuid NOT NULL,
	"listId" integer NOT NULL,
	CONSTRAINT "usersLists_userId_listId_pk" PRIMARY KEY("userId","listId")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "listId_index" ON "categories" ("listId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "categoryId_index" ON "items" ("categoryId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories" ADD CONSTRAINT "categories_listId_lists_id_fk" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_mainListId_lists_id_fk" FOREIGN KEY ("mainListId") REFERENCES "lists"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersLists" ADD CONSTRAINT "usersLists_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersLists" ADD CONSTRAINT "usersLists_listId_lists_id_fk" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
