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

        <div className="bg-black rounded-xl overflow-hidden mb-8 flex justify-center p-4 border border-[#c19d68]/10">
          <img src={generatedImage} alt="Generated" className="max-h-[50vh] object-contain rounded-lg shadow-2xl" />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => setShowPopup(false)}
            className="px-6 py-3 text-gray-400 hover:text-white font-medium hover:bg-white/5 rounded-xl transition-colors uppercase tracking-widest text-xs"
          >
            Chỉnh sửa lại
          </button>
          <a
            href={generatedImage}
            download={fileName || "merged-avatar.jpg"}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-[#c19d68] hover:bg-[#d8b47d] text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(193,157,104,0.3)] active:scale-95 uppercase tracking-wider text-xs"
            onClick={() => setShowPopup(false)}
          >
            <Download size={18} />
            <span>Tải ảnh xuống</span>
          </a>
        </div>
      </div>
    </div>
  );
}
