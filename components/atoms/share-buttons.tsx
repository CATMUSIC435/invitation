'use client';

import { useState, useEffect } from 'react';
import { Facebook, QrCode, Link2, X } from 'lucide-react';

export default function ShareButtons() {
  const [url, setUrl] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
  };

  const copyForTikTok = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      // Tiktok không có API web share link, nên ta copy vào clipboard để người dùng tự dán
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <>
      {/* Fixed Share Buttons */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        
        {/* Facebook Share */}
        <button 
          onClick={shareFacebook}
          className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 hover:shadow-[#1877F2]/50 transition-all duration-300 group relative"
          title="Chia sẻ lên Facebook"
        >
          <Facebook size={22} fill="currentColor" />
          <span className="absolute right-full mr-3 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Facebook
          </span>
        </button>

        {/* TikTok / Copy Link */}
        <button 
          onClick={copyForTikTok}
          className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 group relative border border-white/20"
          title="Copy link cho TikTok"
        >
          <svg viewBox="0 0 448 512" fill="currentColor" className="w-5 h-5">
            <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
          </svg>
          <span className="absolute right-full mr-3 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {copied ? 'Đã copy!' : 'TikTok'}
          </span>
        </button>

        {/* QR Code */}
        <button 
          onClick={() => setShowQR(true)}
          className="w-12 h-12 bg-gradient-to-br from-[#c19d68] to-[#ac8d45] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 hover:shadow-[#c19d68]/50 transition-all duration-300 group relative"
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
