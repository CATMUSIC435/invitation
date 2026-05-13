import { getInvitationTemplates } from '@/app/actions';
import TemplateManager from './template-manager';
import { connection } from 'next/server';
import { Suspense } from 'react';

async function InvitationTemplatesContent() {
  await connection();
  const templates = await getInvitationTemplates();
  return <TemplateManager initialTemplates={templates} />;
}

export default function InvitationTemplatesPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-20 bg-[#0a1520] border border-white/10 rounded-xl">
        <div className="w-8 h-8 border-4 border-[#c19d68] border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-[#c19d68] font-medium">Đang tải dữ liệu...</span>
      </div>
    }>
      <InvitationTemplatesContent />
    </Suspense>
  );
}
