'use client';

import { useState, useEffect } from 'react';
import { Facebook, QrCode, Globe, X } from 'lucide-react';

export default function ShareButtons() {
  const [url, setUrl] = useState('');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
  };

  const goToProject = () => {
    const projectUrl = process.env.NEXT_PUBLIC_PROJECT_URL || 'https://fenica.vn/';
    window.open(projectUrl, '_blank');
  };

  return (
    <>
      {/* Fixed Share Buttons */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">

        {/* Facebook Share */}
        <button
          onClick={shareFacebook}
          className="w-10 h-10 md:w-12 md:h-12 bg-[#1877F2] rounded-md flex items-center justify-center text-white shadow-lg hover:scale-110 hover:shadow-[#1877F2]/50 transition-all duration-300 group relative"
          title="Chia sẻ lên Facebook"
        >
          <Facebook size={22} fill="currentColor" />
          <span className="absolute right-full mr-3 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Facebook
          </span>
        </button>

        {/* Project Website */}
        <button
          onClick={goToProject}
          className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-md flex items-center justify-center text-white shadow-lg hover:scale-110 hover:bg-white/20 transition-all duration-300 group relative border border-white/20 backdrop-blur-sm"
          title="Trang chủ dự án"
        >
          <Globe size={22} />
          <span className="absolute right-full mr-3 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Fenica.vn
          </span>
        </button>

        {/* QR Code */}
        <button
          onClick={() => setShowQR(true)}
          className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#c19d68] to-[#ac8d45] rounded-md flex items-center justify-center text-white shadow-lg hover:scale-110 hover:shadow-[#c19d68]/50 transition-all duration-300 group relative"
          title="Mã QR"
        >
          <QrCode size={22} />
          <span className="absolute right-full mr-3 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Mã QR
          </span>
        </button>

      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowQR(false)}>
          <div className="bg-[#0a1520] border border-[#c19d68]/30 p-8 rounded-2xl max-w-sm w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold text-white text-center mb-6 uppercase tracking-widest text-[#c19d68]">Mã QR Thư Mời</h3>
            <div className="bg-white p-4 rounded-xl flex items-center justify-center">
              {url ? (
                // Sử dụng API tạo QR miễn phí
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`} alt="QR Code" className="w-full h-auto" />
              ) : (
                <div className="w-[250px] h-[250px] bg-gray-200 animate-pulse rounded-lg"></div>
              )}
            </div>
            <p className="text-center text-gray-400 text-sm mt-6">
              Sử dụng camera điện thoại để quét mã QR này và truy cập vào thư mời.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
