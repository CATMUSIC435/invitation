import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://avatar.dxmd.vn'),
  title: 'Tạo avatar và thư mời | DXMD Vietnam',
  description:
    'Nền tảng tạo avatar và thư mời trực tuyến dành cho các chiến dịch và sự kiện của DXMD Vietnam.',

  keywords: [
    'Tạo avatar DXMD',
    'Thư mời DXMD',
    'Sự kiện DXMD Vietnam',
    'Chiến dịch DXMD Vietnam',
  ],

  authors: [{ name: 'DXMD Vietnam' }],
  creator: 'DXMD Vietnam',
  publisher: 'DXMD Vietnam',

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: 'Tạo avatar và thư mời | DXMD Vietnam',
    description:
      'Nền tảng tạo avatar và thư mời trực tuyến dành cho các chiến dịch và sự kiện của DXMD Vietnam.',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'DXMD Vietnam',
    images: [
      {
        url: '/og-image.jpg', // 1200x630
        width: 1200,
        height: 630,
        alt: 'DXMD Vietnam',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Tạo avatar và thư mời | DXMD Vietnam',
    description:
      'Nền tảng tạo avatar và thư mời trực tuyến dành cho các chiến dịch và sự kiện của DXMD Vietnam.',
    images: ['/og-image.jpg'],
  },

  alternates: {
    canonical: 'https://fenica.vn',
  },

  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',

  category: 'Event',
};

export const viewport: Viewport = {
  maximumScale: 1
};

const manrope = Manrope({ subsets: ['latin'] });

import ParticleWrapper from '@/components/atoms/particle-wrapper';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`bg-[#0a1520] text-gray-100 ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-transparent relative antialiased selection:bg-[#0e1e2e] selection:text-white">
        <ParticleWrapper />
        {children}
      </body>
    </html>
  );
}
