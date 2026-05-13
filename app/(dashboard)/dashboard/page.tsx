import { db } from '@/lib/db/drizzle';
import { invitations } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import AdminTable from './AdminTable';

export const dynamic = 'force-dynamic';

async function getInvitations() {
  return await db.select().from(invitations).orderBy(desc(invitations.created_at));
}

export default async function DashboardPage() {
  const data = await getInvitations();

  return (
    <section className="flex-1 flex flex-col gap-4 p-4">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="hidden text-[#c19d68] text-xl font-bold tracking-wider uppercase mb-4 font-avo-bold">
          Quản trị Thư Mời
        </h2>
        <AdminTable data={data} />
      </div>
    </section>
  );
}

