import { Suspense } from 'react';
import { fetchSocialData } from './actions';
import SocialTable from './SocialTable';

async function SocialContent() {
  const data = await fetchSocialData();
  return <SocialTable initialData={data} />;
}

export default function SocialDashboardPage() {
  return (
    <section className="flex-1 flex flex-col gap-4">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="hidden text-[#c19d68] text-xl font-bold tracking-wider uppercase mb-4 font-avo-bold">
          Dữ liệu Mạng Xã Hội (Upstash Redis)
        </h2>

        <Suspense fallback={
          <div className="flex justify-center items-center py-20 bg-[#0a1520] border border-white/10 rounded-xl">
            <div className="w-8 h-8 border-4 border-[#c19d68] border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-[#c19d68] font-medium">Đang tải dữ liệu từ Upstash...</span>
          </div>
        }>
          <SocialContent />
        </Suspense>
      </div>
    </section>
  );
}
