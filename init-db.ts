import { pool } from './lib/db/drizzle';

async function main() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "invitations" (
      "id" serial PRIMARY KEY NOT NULL,
      "slug" text NOT NULL,
      "name" text NOT NULL,
      "title" text NOT NULL,
      "image_url" text,
      "created_at" timestamp with time zone DEFAULT now(),
      CONSTRAINT "invitations_slug_unique" UNIQUE("slug")
    );
  `);
  console.log('Created invitations table with slug');
  process.exit(0);
}
main();
