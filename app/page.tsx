import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ShareFooter from '@/components/atoms/share-footer';
import TopBranding from '@/components/atoms/top-branding';
import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tạo Avatar Chiến Dịch | DXMD Việt Nam',
  description: 'Danh sách các mẫu avatar chiến dịch nổi bật từ DXMD Việt Nam. Hãy chọn mẫu ưng ý và tạo avatar ủng hộ chiến dịch ngay hôm nay!',
  openGraph: {
    title: 'Tạo Avatar Chiến Dịch | DXMD Việt Nam',
    description: 'Cùng tham gia tạo avatar ủng hộ các chiến dịch cộng đồng cùng Công Ty Cổ Phần DXMD Việt Nam.',
    url: '/',
    siteName: 'DXMD Việt Nam',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function AvatarMergeListPage() {
  const jsonPath = path.join(process.cwd(), 'public', 'index.json');

  let templates = [];
  try {
    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    templates = JSON.parse(fileContent);
  } catch (error) {
    console.error("Error loading templates", error);
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto flex flex-col items-center justify-start pt-8">

      {/* Top Branding */}
      <TopBranding />

      <div className="mb-12 text-center max-w-2xl mx-auto">
        <p className="text-gray-400 mt-2 text-xs md:text-sm font-light uppercase tracking-[0.15em]">
          Vui lòng chọn một mẫu chiến dịch để tạo avatar của bạn
        </p>
      </div>

      {templates.length === 0 ? (
        <div className="text-center text-[#c19d68]/50 py-12 font-light tracking-widest text-sm uppercase">
          KHÔNG TÌM THẤY MẪU NÀO.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {templates.map((template: any) => (
            <Link
              href={`/avatar/${template.slug}`}
              key={template.slug}
              className="group relative overflow-hidden transition-all duration-500 flex flex-col"
            >
              <div className="aspect-square relative overflow-hidden flex items-center justify-center py-2">
                {/* Background effect */}
                <div className="absolute inset-0 opacity-[0.02]"
                  style={{ backgroundImage: 'linear-gradient(#c19d68 1px, transparent 1px), linear-gradient(90deg, #c19d68 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                </div>
                {template.image ? (
                  <img src={template.image} alt={template.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out relative z-10" />
                ) : (
                  <div className="text-[#c19d68]/50 font-light tracking-widest text-sm uppercase">NO IMAGE</div>
                )}
              </div>
              <div className="p-2 flex-1 flex flex-col">
                <h2 className="text-base font-bold text-white mb-3 line-clamp-2 uppercase tracking-wide leading-relaxed">{template.title}</h2>
                <p className="text-gray-400 text-xs font-light line-clamp-3 mb-6 flex-1 leading-relaxed">{template.content}</p>
                <div className="flex items-center justify-between text-[#c19d68] text-xs font-bold uppercase tracking-[0.1em] mt-auto">
                  <span>Tạo ngay</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Footer / Share */}
      <ShareFooter />
    </div>
  );
}
