import { getAvatarTemplates } from './actions';
import AvatarAdminClient from './client';
import { connection } from 'next/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Quản lý Avatar | Admin Dashboard',
};

async function AvatarAdminContent() {
  await connection();
  const templates = await getAvatarTemplates();
  return <AvatarAdminClient initialTemplates={templates} />;
}

export default function AvatarAdminPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-20 text-[#c19d68]">
        <div className="w-8 h-8 border-4 border-[#c19d68] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AvatarAdminContent />
    </Suspense>
  );
}
