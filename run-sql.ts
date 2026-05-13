import { db } from './lib/db/drizzle';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Altering table invitation_templates...');
  await db.execute(sql`
    ALTER TABLE invitation_templates ADD COLUMN IF NOT EXISTS avatar_position_x INTEGER DEFAULT 450;
    ALTER TABLE invitation_templates ADD COLUMN IF NOT EXISTS avatar_position_y INTEGER DEFAULT 450;
  `);
  console.log('Column added successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
