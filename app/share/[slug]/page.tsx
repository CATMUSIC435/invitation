import { db } from '@/lib/db/drizzle';
import { invitations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

type Params = Promise<{ slug: string }>;

async function getInvitationBySlug(slug: string) {
  'use cache';
  const [data] = await db.select().from(invitations).where(eq(invitations.slug, slug));
  return data;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getInvitationBySlug(resolvedParams.slug);

  if (!data) return {};

  return {
    title: `Thư mời của ${data.name} | CUỘC THI “SĂN VÉ LÊN TÀU CÙNG FENICA”`,
    description: `Thư mời chính thức tham gia CUỘC THI “SĂN VÉ LÊN TÀU CÙNG FENICA” của ${data.name} - ${data.title}`,
    openGraph: {
      images: [data.image_url || '/og-image.jpg'],
    }
  };
}

import { Suspense } from 'react';

async function ShareContent({ params }: { params: Params }) {
  const resolvedParams = await params;
  const data = await getInvitationBySlug(resolvedParams.slug);
  if (!data) return notFound();

  return (
    <div className="relative z-10 w-full max-w-md flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-2 text-center uppercase tracking-wider font-avo-bold">Thư mời tham dự</h1>
      <p className="text-[#c19d68] mb-8 text-center text-lg">{data.name} - {data.title}</p>

      {data.image_url ? (
        <div className="relative w-[300px] h-[500px] rounded-2xl shadow-2xl ring-1 ring-white/20 overflow-hidden mb-8 transition-transform hover:scale-105 duration-500">
          <img src={data.image_url} alt={`Thư mời của ${data.name}`} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-[300px] h-[500px] bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-8">
          <span className="text-white/50 text-sm">Không có dữ liệu ảnh</span>
        </div>
      )}

      <div className="flex gap-4 w-full justify-center">
        {data.image_url && (
          <a
            href={data.image_url}
            target="_blank"
            rel="noopener noreferrer"
            download={`invitation-${data.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-6)}.jpg`}
            className="flex-1 bg-gradient-to-r from-[#c19d68] to-[#ac8d45] text-white text-center font-bold py-3.5 rounded-xl shadow-[0_10px_30px_rgba(193,157,104,0.3)] hover:shadow-[0_15px_40px_rgba(193,157,104,0.5)] transition-all duration-300"
          >
            Tải ảnh chất lượng cao
          </a>
        )}
        <Link
          href="/"
          className="flex-none px-6 bg-white/10 text-white border border-white/20 text-center font-bold py-3.5 rounded-xl hover:bg-white/20 transition-all duration-300"
        >
          Tạo thẻ mới
        </Link>
      </div>
    </div>
  );
}

import ShareButtons from '@/components/atoms/share-buttons';

export default function SharePage({ params }: { params: Params }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-transparent relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#c19d68]/50 to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#0e1e2e]/50 to-[#c19d68]/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <ShareButtons />

      <Suspense fallback={
        <div className="relative z-10 flex flex-col items-center justify-center text-white">
          <div className="w-8 h-8 border-4 border-[#c19d68] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Đang tải thư mời...</p>
        </div>
      }>
        <ShareContent params={params} />
      </Suspense>
    </main>
  );
}
