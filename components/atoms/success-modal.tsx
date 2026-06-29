"use client";

import { X, Download } from "lucide-react";

interface SuccessModalProps {
  showPopup: boolean;
  setShowPopup: (show: boolean) => void;
  generatedImage: string | null;
  fileName?: string;
}

export default function SuccessModal({ showPopup, setShowPopup, generatedImage, fileName }: SuccessModalProps) {
  if (!showPopup || !generatedImage) return null;

  const handleDownload = async () => {
    // Thử sử dụng Web Share API (đặc biệt hữu ích cho iOS để lưu thẳng vào Ảnh)
    if (navigator.share && generatedImage) {
      try {
        const res = await fetch(generatedImage);
        const blob = await res.blob();
        const file = new File([blob], fileName || "avatar.jpg", { type: "image/jpeg" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Avatar',
          });
          setShowPopup(false);
          return;
        }
      } catch (error) {
        console.error("Lỗi khi chia sẻ/lưu ảnh:", error);
      }
    }

    // Fallback: Tải xuống thông thường cho PC / Android
    const link = document.createElement('a');
    link.href = generatedImage!;
    link.download = fileName || "avatar.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowPopup(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-all">
      <div className="bg-white/10 border border-[#c19d68]/30 p-6 md:p-10 rounded-3xl max-w-lg w-full shadow-[0_0_50px_rgba(193,157,104,0.15)] relative animate-in fade-in zoom-in duration-300 backdrop-blur-md">
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-[#c19d68] bg-white/5 hover:bg-[#c19d68]/10 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-4">
          <img src="/fireworks.png" alt="Fireworks" className="w-16 h-16 object-contain animate-bounce" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-[#c19d68] mb-6 text-center uppercase tracking-[0.1em]">Hoàn tất tạo ảnh!</h3>

        <div className="bg-black rounded-xl overflow-hidden mb-8 flex justify-center p-4 border border-[#c19d68]/10 relative group">
          <img src={generatedImage} alt="Generated" className="max-h-[50vh] object-contain rounded-lg shadow-2xl" />
          {/* Mẹo cho người dùng iOS */}
          <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none opacity-70">
            <span className="bg-black/80 text-white text-[10px] px-3 py-1.5 rounded-full border border-white/10">
              Mẹo: Có thể ấn giữ ảnh để lưu
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => setShowPopup(false)}
            className="px-6 py-3 text-gray-400 hover:text-white font-medium hover:bg-white/5 rounded-xl transition-colors uppercase tracking-widest text-xs"
          >
            Chỉnh sửa lại
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-[#c19d68] hover:bg-[#d8b47d] text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(193,157,104,0.3)] active:scale-95 uppercase tracking-wider text-xs"
          >
            <Download size={18} />
            <span>Lưu / Tải ảnh</span>
          </button>
        </div>
      </div>
    </div>
  );
}
