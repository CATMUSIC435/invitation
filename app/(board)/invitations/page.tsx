import InvitationCardSale from "@/components/atoms/invitation-card-sale";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Thư mời | Magic night Pool Party',
  description:
    'Thư mời chính thức tham dự Magic night Pool Party – sự kiện Magic night Pool Party.',

  keywords: [
    'Magic night Pool Party',
    'Thư mời DXMD',
  ],

  authors: [{ name: 'DXMD Vietnam' }],
  creator: 'DXMD Vietnam',
  publisher: 'DXMD Vietnam',

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: 'Thư mời Magic night Pool Party',
    description:
      'Magic night Pool Party – sự kiện Magic night Pool Party.',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Magic night Pool Party',
    images: [
      {
        url: '/og-image.jpg', // 1200x630
        width: 1200,
        height: 630,
        alt: 'Magic night Pool Party',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Thư mời | Magic night Pool Party',
    description:
      'Thư mời chính thức tham dự Magic night Pool Party – sự kiện Magic night Pool Party.',
    images: ['/og-dxmd-vietnam-award-2025.png'],
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
                <h1 className="flex items-center justify-center gap-4 mx-auto text-xl md:text-4xl font-bold mb-1 text-center bg-gradient-to-r from-[#844d15] to-[#844d15] bg-clip-text text-transparent" style={{ fontFamily: 'SVN Avo bold'}}>
                    THƯ MỜI DXMD VIETNAM <br />MAGIC NIGHT <br /> POOL PARTY
                </h1>
            </div>
            <InvitationCardSale />
        </main>
    );
}
