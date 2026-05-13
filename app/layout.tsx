import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://fenica.vn'),
  title: 'Thư mời | CUỘC THI “SĂN VÉ LÊN TÀU CÙNG FENICA”',
  description:
    'Thư mời chính thức tham dự CUỘC THI “SĂN VÉ LÊN TÀU CÙNG FENICA” – sự kiện đặc biệt từ FENICA.',

  keywords: [
    'SĂN VÉ LÊN TÀU CÙNG FENICA',
    'Thư mời FENICA',
    'Sự kiện FENICA',
    'Cuộc thi FENICA',
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
      'CUỘC THI “SĂN VÉ LÊN TÀU CÙNG FENICA” – sự kiện đặc biệt dành cho các thành viên.',
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
