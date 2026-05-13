import { db } from './lib/db/drizzle';
import { sql } from 'drizzle-orm';

async function main() {
  await db.execute(sql`ALTER TABLE invitation_templates ADD COLUMN IF NOT EXISTS has_company boolean DEFAULT true;`);
  console.log("Done");
  process.exit(0);
}
main();
