import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ShareFooter from '@/components/atoms/share-footer';
import TopBranding from '@/components/atoms/top-branding';
import { Metadata } from 'next';
import { db } from '@/lib/db/drizzle';
import { invitationTemplates } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export const metadata: Metadata = {
  title: 'Tạo Thư Mời | DXMD Vietnam',
  description: 'Danh sách các mẫu thư mời nổi bật từ DXMD Vietnam. Hãy chọn mẫu ưng ý và tạo thư mời của bạn ngay hôm nay!',
  openGraph: {
    title: 'Tạo Thư Mời | DXMD Vietnam',
    description: 'Cùng tham gia tạo thư mời cho các sự kiện cùng DXMD Vietnam.',
    url: '/invitations',
    siteName: 'DXMD Vietnam',
    locale: 'vi_VN',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tạo Thư Mời | DXMD Vietnam',
    description: 'Cùng tham gia tạo thư mời cho các sự kiện cùng DXMD Vietnam.',
    images: ['/og-image.jpg'],
  },
};

async function getTemplates() {
  try {
    return await db.select().from(invitationTemplates).orderBy(desc(invitationTemplates.created_at));
  } catch (error) {
    console.error("Error reading from database", error);
    return [];
  }
}

export default async function InvitationsListPage() {
  const templates = await getTemplates();

  return (
    <main className="min-h-screen text-gray-100 flex flex-col font-sans relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#c19d68]/50 to-transparent"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-[#0e1e2e]/50 to-[#c19d68]/5 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <TopBranding />

      <div className="flex flex-col items-center justify-center p-2 md:px-4 md:py-2 relative z-10 w-full max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight uppercase font-avo-bold">
            Tạo Thư Mời
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Cùng DXMD Vietnam lan tỏa thông điệp tích cực bằng cách tạo thư mời sự kiện của bạn.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 w-full">
          {templates.map((template: any) => (
            <Link
              href={`/invitations/${template.slug}`}
              key={template.slug}
              className="group relative overflow-hidden transition-all duration-500 flex flex-col rounded-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0e1e2e] z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>

              <div className="relative aspect-[9/15] w-full overflow-hidden shadow-2xl ring-1 ring-white/10 group-hover:ring-[#c19d68]/50 transition-all duration-500 rounded-xl">
                <div className="absolute inset-0 opacity-[0.05]"
                  style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                </div>
                {template.background_url ? (
                  <img
                    src={template.background_url}
                    alt={template.title || template.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-[#162a40] flex items-center justify-center text-gray-500">No Image</div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-[#050a10] to-transparent pt-12">
                  <h2 className="text-base md:text-xl font-bold text-white mb-1 md:mb-2 font-avo-bold leading-tight line-clamp-2">
                    {template.name}
                  </h2>
                  <p className="text-[#e5e5e5] text-xs md:text-sm line-clamp-1 mb-2 opacity-80">{template.title}</p>
                  <div className="flex items-center text-[#c19d68] text-xs md:text-base font-medium opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <span>Tạo thư mời ngay</span>
                    <ArrowRight className="ml-1 md:ml-2 transform translate-x-0 md:-translate-x-2 group-hover:translate-x-0 transition-transform duration-500 w-3 h-3 md:w-5 md:h-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-20 w-full bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-2">Chưa có thư mời nào</h3>
            <p className="text-gray-400">Vui lòng kiểm tra lại sau hoặc liên hệ Admin.</p>
          </div>
        )}
      </div>

      <ShareFooter />
    </main>
  );
}
