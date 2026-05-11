import { pool } from './lib/db/drizzle';

async function main() {
  await pool.query('DROP TABLE IF EXISTS invitations;');
  console.log('Dropped table invitations');
  process.exit(0);
}
main();
