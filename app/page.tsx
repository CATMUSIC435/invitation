import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ShareFooter from '@/components/atoms/share-footer';
import TopBranding from '@/components/atoms/top-branding';
import { Metadata } from 'next';
import { db } from '@/lib/db/drizzle';
import { avatarTemplates } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export const metadata: Metadata = {
  title: 'Tạo Avatar Chiến Dịch | FENICA',
  description: 'Danh sách các mẫu avatar chiến dịch nổi bật từ FENICA. Hãy chọn mẫu ưng ý và tạo avatar ủng hộ chiến dịch ngay hôm nay!',
  openGraph: {
    title: 'Tạo Avatar Chiến Dịch | FENICA',
    description: 'Cùng tham gia tạo avatar ủng hộ các chiến dịch cộng đồng cùng FENICA.',
    url: '/',
    siteName: 'FENICA',
    locale: 'vi_VN',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tạo Avatar Chiến Dịch | FENICA',
    description: 'Cùng tham gia tạo avatar ủng hộ các chiến dịch cộng đồng cùng FENICA.',
    images: ['/og-image.jpg'],
  },
};

async function getTemplates() {
  'use cache';
  try {
    return await db.select().from(avatarTemplates).orderBy(desc(avatarTemplates.created_at));
  } catch (error) {
    console.error("Error reading from database", error);
    return [];
  }
}

export default async function AvatarMergeListPage() {
  const templates = await getTemplates();

  return (
    <main className="min-h-screen text-gray-100 flex flex-col font-sans relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#c19d68]/50 to-transparent"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-[#0e1e2e]/50 to-[#c19d68]/5 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <TopBranding />

      <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-4 relative z-10 w-full max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="hidden text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight uppercase font-avo-bold">
            Tạo Avatar Chiến Dịch
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Cùng FENICA lan tỏa thông điệp tích cực bằng cách tạo và chia sẻ avatar chiến dịch của bạn.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 w-full">
          {templates.map((template: any) => (
            <Link
              href={`/avatar/${template.slug}`}
              key={template.slug}
              className="group relative overflow-hidden transition-all duration-500 flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0e1e2e] z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>

              <div className="relative aspect-[4/5] w-full overflow-hidden shadow-2xl ring-1 ring-white/10 group-hover:ring-[#c19d68]/50 transition-all duration-500">
                <div className="absolute inset-0 opacity-[0.05]"
                  style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                </div>
                {template.image_url ? (
                  <img
                    src={template.image_url}
                    alt={template.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-[#162a40] flex items-center justify-center text-gray-500">No Image</div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h2 className="text-base md:text-2xl font-bold text-white mb-1 md:mb-2 font-avo-bold leading-tight line-clamp-2">{template.title}</h2>
                  <div className="flex items-center text-[#c19d68] text-xs md:text-base font-medium opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <span>Tham gia ngay</span>
                    <ArrowRight className="ml-1 md:ml-2 transform translate-x-0 md:-translate-x-2 group-hover:translate-x-0 transition-transform duration-500 w-3 h-3 md:w-5 md:h-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-20 w-full bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-2">Chưa có chiến dịch nào</h3>
            <p className="text-gray-400">Vui lòng kiểm tra lại sau hoặc liên hệ Admin.</p>
          </div>
        )}
      </div>

      <ShareFooter />
    </main>
  );
}
