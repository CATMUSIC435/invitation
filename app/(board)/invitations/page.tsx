import InvitationCard from "@/components/atoms/invitation-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Thư mời | Magic night Pool Party',
  description:
    'Thư mời chính thức tham dự Magic night Pool Party – sự kiện Magic night Pool Party.',

  keywords: [
    'SĂN VÉ LÊN TÀU CÙNG FENICA',
    'Thư mời FENICA',
    'Sự kiện FENICA',
    'Fenica Vietnam',
  ],

  authors: [{ name: 'FENICA' }],
  creator: 'FENICA',
  publisher: 'FENICA',

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: 'Thư mời CUỘC THI “SĂN VÉ LÊN TÀU CÙNG FENICA”',
    description:
      'CUỘC THI “SĂN VÉ LÊN TÀU CÙNG FENICA” – sự kiện đặc biệt từ FENICA.',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'CUỘC THI “SĂN VÉ LÊN TÀU CÙNG FENICA”',
    images: [
      {
        url: '/og-image.jpg', // 1200x630
        width: 1200,
        height: 630,
        alt: 'CUỘC THI “SĂN VÉ LÊN TÀU CÙNG FENICA”',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Thư mời | CUỘC THI “SĂN VÉ LÊN TÀU CÙNG FENICA”',
    description:
      'Thư mời chính thức tham dự CUỘC THI “SĂN VÉ LÊN TÀU CÙNG FENICA”.',
    images: ['/og-image.jpg'],
  },

  alternates: {
    canonical: 'https://marketing.dxmd.vn',
  },

  category: 'Event',
};

export default function Page() {
    return (
        <main className="p-4">
            <div className="mt-14 md:mt-10 mb-8 text-center">
                <h1 className="flex items-center justify-center gap-4 mx-auto text-xl md:text-4xl font-bold mb-1 text-center bg-gradient-to-r from-[#844d15] to-[#844d15] bg-clip-text text-transparent font-avo-bold">
                    THƯ MỜI DXMD VIETNAM <br />MAGIC NIGHT <br /> POOL PARTY
                </h1>
            </div>
            <InvitationCard />
        </main>
    );
}
