'use client';
import { startTransition, useActionState, useEffect } from 'react';
import { User } from '@/lib/db/schema';
import { getUsers } from '@/app/(login)/actions';
import { DataTable } from '@/components/molecules/data-table';
import { ChartAreaInteractive } from '@/components/molecules/chart-area-interactive';


export default function SettingsPage() {
  const [users, runAction, isPending] = useActionState<User[], FormData>(
    getUsers,
    []
  );
  useEffect(() => {
    if (users.length === 0) {
      startTransition(() => {
        const formData = new FormData();
        formData.append('avatar', '');
        runAction(formData)
      })
    }
  }, [])

  return (
    <section className="flex-1 flex flex-col gap-4 p-4 lg:p-8">
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      {users.length === 0 ? null : <DataTable data={users} />}
    </section>
  );
}
