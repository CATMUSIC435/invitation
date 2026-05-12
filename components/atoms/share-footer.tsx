"use client";

import { useState, useEffect } from 'react';
import { Share2, Facebook, Twitter, Instagram, QrCode, X, Download } from 'lucide-react';

import { QRCodeCanvas } from 'qrcode.react';

export default function ShareFooter() {
  const [showQR, setShowQR] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleDownloadQR = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qr-code.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <>
      <footer className="mt-20 py-8 border-t border-[#c19d68]/20 flex flex-col items-center justify-center gap-6 text-center w-full">
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
            <Share2 size={14} className="text-[#c19d68]" /> Chia sẻ nền tảng
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-[#c19d68]/30 flex items-center justify-center text-[#c19d68] hover:bg-[#c19d68] hover:text-black transition-all hover:scale-110 shadow-[0_0_10px_rgba(193,157,104,0.1)]">
            <Facebook size={18} />
          </a>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-[#c19d68]/30 flex items-center justify-center text-[#c19d68] hover:bg-[#c19d68] hover:text-black transition-all hover:scale-110 shadow-[0_0_10px_rgba(193,157,104,0.1)]">
            <Twitter size={18} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-[#c19d68]/30 flex items-center justify-center text-[#c19d68] hover:bg-[#c19d68] hover:text-black transition-all hover:scale-110 shadow-[0_0_10px_rgba(193,157,104,0.1)]">
            <Instagram size={18} />
          </a>
          <button onClick={() => setShowQR(true)} className="w-10 h-10 rounded-full bg-white/5 border border-[#c19d68]/30 flex items-center justify-center text-[#c19d68] hover:bg-[#c19d68] hover:text-black transition-all hover:scale-110 shadow-[0_0_10px_rgba(193,157,104,0.1)]">
            <QrCode size={18} />
          </button>
        </div>
        <p className="text-gray-600 text-[10px] uppercase tracking-widest mt-2">© 2026 CÔNG TY CỔ PHẦN DXMD VIỆT NAM</p>
      </footer>

      {showQR && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowQR(false)}>
          <div className="bg-[#0a0a0a] border border-[#c19d68]/30 p-8 rounded-2xl max-w-sm w-full shadow-[0_0_50px_rgba(193,157,104,0.15)] relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-[#c19d68] bg-white/5 hover:bg-[#c19d68]/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-[#c19d68] text-center mb-6 uppercase tracking-[0.1em]">Mã QR Chiến Dịch</h3>
            <div className="bg-white p-4 rounded-xl flex items-center justify-center mb-6">
              {url ? (
                <QRCodeCanvas 
                  id="qr-canvas"
                  value={url} 
                  size={250} 
                  level={"H"}
                  includeMargin={true}
                />
              ) : (
                <div className="w-[250px] h-[250px] bg-gray-200 animate-pulse rounded-lg"></div>
              )}
            </div>
            <button 
              onClick={handleDownloadQR}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#c19d68] hover:bg-[#d8b47d] text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(193,157,104,0.3)] active:scale-95 uppercase tracking-wider text-xs"
            >
              <Download size={16} /> Tải mã QR
            </button>
          </div>
        </div>
      )}
    </>
  );
}
