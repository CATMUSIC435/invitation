import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Thư mời | DXMD Vietnam Award 2026',
  description:
    'Thư mời chính thức tham dự DXMD Vietnam Award 2026 – sự kiện vinh danh các cá nhân và doanh nghiệp tiêu biểu trong lĩnh vực tại Việt Nam.',

  keywords: [
    'DXMD Vietnam Award 2026',
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
    title: 'Thư mời DXMD Vietnam Award 2026',
    description:
      'DXMD Vietnam Award 2026 – sự kiện vinh danh các cá nhân và doanh nghiệp xuất sắc trong tại DXMD Việt Nam.',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'DXMD Vietnam Award 2026',
    images: [
      {
        url: '/og-dxmd-vietnam-award-2026.png', // 1200x630
        width: 1200,
        height: 630,
        alt: 'DXMD Vietnam Award 2026',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Thư mời | DXMD Vietnam Award 2026',
    description:
      'Thư mời chính thức tham dự DXMD Vietnam Award 2026 – sự kiện vinh danh tại DXMD Việt Nam.',
    images: ['/og-dxmd-vietnam-award-2026.png'],
  },

  alternates: {
    canonical: 'https://dxmdvietnam.vn/invitation',
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
      <body className="min-h-[100dvh] bg-gray-50">
          {children}
      </body>
    </html>
  );
}
