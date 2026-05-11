import { db } from './lib/db/drizzle';
import { invitations } from './lib/db/schema';

async function main() {
  console.log('Deleting all invitations...');
  await db.delete(invitations);
  console.log('Successfully deleted all invitations.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
