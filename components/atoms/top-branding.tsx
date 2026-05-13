import Link from 'next/link';

interface TopBrandingProps {
  url?: string;
}

export default function TopBranding({ url = '/' }: TopBrandingProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center mb-1">
      <Link href={url} className="flex flex-col items-center justify-center hover:opacity-80 transition-opacity">
        <img src="/horizol-android-chrome-512x512.png" alt="DXMD Logo" className="w-36 md:w-44 object-contain mb-1" />
        <h2 className="md:text-lg font-bold text-white uppercase tracking-widest text-center">
          Công Ty Cổ Phần DXMD Việt Nam
        </h2>
      </Link>
    </div>
  );
}
