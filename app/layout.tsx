import PageButton from '@/components/molecules/page-button';
import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Thư mời | DXMD Vietnam Award 2025',
  description:
    'Thư mời chính thức tham dự DXMD Vietnam Award 2025 – sự kiện vinh danh các cá nhân và doanh nghiệp tiêu biểu tại DXMD Việt Nam.',

  keywords: [
    'DXMD Vietnam Award 2025',
    'Thư mời DXMD',
    'Sự kiện công nghệ Việt Nam',
    'Vietnam Digital Transformation Award',
  ],

  authors: [{ name: 'DXMD Vietnam' }],
  creator: 'DXMD Vietnam',
  publisher: 'DXMD Vietnam',

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: 'Thư mời DXMD Vietnam Award 2025',
    description:
      'DXMD Vietnam Award 2025 – sự kiện vinh danh các cá nhân và doanh nghiệp xuất sắc trong tại DXMD Việt Nam.',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'DXMD Vietnam Award 2025',
    images: [
      {
        url: '/og-image.jpg', // 1200x630
        width: 1200,
        height: 630,
        alt: 'DXMD Vietnam Award 2025',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Thư mời | DXMD Vietnam Award 2025',
    description:
      'Thư mời chính thức tham dự DXMD Vietnam Award 2025 – sự kiện vinh danh tại DXMD Việt Nam.',
    images: ['/og-dxmd-vietnam-award-2025.png'],
  },

  alternates: {
    canonical: 'https://marketing.dxmd.vn',
  },

  category: 'Event',
};


export const viewport: Viewport = {
  maximumScale: 1
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-gray-50 relative">
        <div className='absolute top-0 left-0 w-full'>
          <div className='w-full flex justify-center items-center gap-4 px-4 md:px-0'>
            <PageButton
              href="/"
              label="DXMD VIETNAM AWARD 2025"
              bgColor="bg-gradient-to-r from-[#844d15] to-yellow-500"
              textColor="text-white"
            />
            <PageButton
              href="/invitations"
              label="MAGIC NIGHT POOL PARTY"
              bgColor="bg-gradient-to-r from-[#844d15] to-yellow-500"
              textColor="text-white"
            />
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
