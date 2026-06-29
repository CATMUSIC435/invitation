"use client";

import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { Upload, Image as ImageIcon, SlidersHorizontal, UserCircle, RotateCcw, ZoomIn, Sparkles } from "lucide-react";
import ShareFooter from '@/components/atoms/share-footer';
import TopBranding from '@/components/atoms/top-branding';
import SuccessModal from '@/components/atoms/success-modal';
import { getProxyImage } from '@/app/actions';

export default function AvatarMergeEditor({ initialTemplate }: { initialTemplate?: { title?: string; content?: string; image?: string; slug?: string } | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frameSrc, setFrameSrc] = useState<string | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [frameImg, setFrameImg] = useState<HTMLImageElement | null>(null);
  const [avatarImg, setAvatarImg] = useState<HTMLImageElement | null>(null);

  // Popup states
  const [showPopup, setShowPopup] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // JSON content
  const [jsonContent, setJsonContent] = useState<{ title?: string; content?: string; image?: string } | null>(initialTemplate || null);

  // Transformation states
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [scale, setScale] = useState(50); // 0 to 100, maps to 0.1 to 3x
  const [rotation, setRotation] = useState(0); // -180 to 180

  // Pointer drag and pinch state
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const activePointers = useRef<{ [pointerId: number]: { x: number; y: number } }>({});
  const initialPinchDistance = useRef<number | null>(null);
  const initialPinchScale = useRef<number>(50);

  // Handle file uploads
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, type: "frame" | "avatar") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        if (type === "frame") {
          setFrameSrc(src);
          setFrameImg(img);
        } else {
          setAvatarSrc(src);
          setAvatarImg(img);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Handle initial template loading
  useEffect(() => {
    if (initialTemplate && initialTemplate.image) {
      const loadInitialImage = async () => {
        try {
          const proxyUrl = initialTemplate.image!;
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            setFrameSrc(proxyUrl);
            setFrameImg(img);
          };
          img.src = proxyUrl;
        } catch (error) {
          console.error("Failed to load template image via proxy", error);
        }
      };
      loadInitialImage();
    }
  }, [initialTemplate]);

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (frameImg) {
      canvas.width = frameImg.width;
      canvas.height = frameImg.height;

      // Fill white background for JPEG compression
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (avatarImg) {
        ctx.save();

        // Calculate mapped values
        const mappedScale = 0.1 + (scale / 100) * 2.9; // 0.1 to 3.0
        const avatarWidth = avatarImg.width * mappedScale;
        const avatarHeight = avatarImg.height * mappedScale;

        const mappedX = (x / 100) * canvas.width;
        const mappedY = (y / 100) * canvas.height;

        // Move to the position, rotate, then draw
        ctx.translate(mappedX, mappedY);
        ctx.rotate((rotation * Math.PI) / 180);

        // Draw avatar first (underneath the frame)
        ctx.drawImage(
          avatarImg,
          -avatarWidth / 2,
          -avatarHeight / 2,
          avatarWidth,
          avatarHeight
        );

        ctx.restore();
      }

      // Draw frame as overlay (on top of avatar)
      ctx.drawImage(frameImg, 0, 0);

    } else {
      // Default placeholder canvas if no frame
      canvas.width = 800;
      canvas.height = 800;
      ctx.fillStyle = "#1e1e2e"; // Dark slate
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#a6adc8";
      ctx.font = "24px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Please upload a Frame Image or JSON file", canvas.width / 2, canvas.height / 2);
    }
  }, [frameImg, avatarImg, x, y, scale, rotation]);

  // Pointer events for drag to pan and pinch to zoom
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!avatarImg) return;
    
    activePointers.current[e.pointerId] = { x: e.clientX, y: e.clientY };
    const pointers = Object.values(activePointers.current);

    if (pointers.length === 1) {
      isDragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
    } else if (pointers.length === 2) {
      isDragging.current = false;
      const dist = Math.hypot(pointers[0].x - pointers[1].x, pointers[0].y - pointers[1].y);
      initialPinchDistance.current = dist;
      initialPinchScale.current = scale;
    }
    
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!avatarImg || !canvasRef.current || !frameImg) return;
    
    if (activePointers.current[e.pointerId]) {
      activePointers.current[e.pointerId] = { x: e.clientX, y: e.clientY };
    }

    const pointers = Object.values(activePointers.current);

    if (pointers.length === 1 && isDragging.current) {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;

      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasRef.current.width / rect.width;
      const scaleY = canvasRef.current.height / rect.height;

      const dxCanvas = dx * scaleX;
      const dyCanvas = dy * scaleY;

      const dxPercent = (dxCanvas / canvasRef.current.width) * 100;
      const dyPercent = (dyCanvas / canvasRef.current.height) * 100;

      setX(prev => prev + dxPercent);
      setY(prev => prev + dyPercent);

      lastPos.current = { x: e.clientX, y: e.clientY };
    } else if (pointers.length === 2 && initialPinchDistance.current !== null && initialPinchDistance.current > 0) {
      const dist = Math.hypot(pointers[0].x - pointers[1].x, pointers[0].y - pointers[1].y);
      const scaleFactor = dist / initialPinchDistance.current;
      
      const prevMappedScale = 0.1 + (initialPinchScale.current / 100) * 2.9;
      const newMappedScale = prevMappedScale * scaleFactor;
      
      let newScaleState = ((newMappedScale - 0.1) / 2.9) * 100;
      newScaleState = Math.min(100, Math.max(0, newScaleState));
      
      setScale(newScaleState);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    delete activePointers.current[e.pointerId];
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    const pointers = Object.values(activePointers.current);
    if (pointers.length < 2) {
      initialPinchDistance.current = null;
    }
    if (pointers.length === 1) {
      isDragging.current = true;
      lastPos.current = { x: pointers[0].x, y: pointers[0].y };
    } else if (pointers.length === 0) {
      isDragging.current = false;
    }
  };

  // Wheel event for zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      if (!avatarImg) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -2 : 2;
      setScale(prev => Math.min(100, Math.max(0, prev + delta)));
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [avatarImg]);

  const handleGenerate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!frameImg) {
      alert("Please upload a frame image first.");
      return;
    }

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setGeneratedImage(dataUrl);
    setShowPopup(true);
  };

  const resetAdjustments = () => {
    setX(50);
    setY(50);
    setScale(50);
    setRotation(0);
  };

  return (
    <div className="min-h-screen bg-transparent px-4 md:px-8 font-sans flex flex-col  ">

      {/* Top Branding */}
      <TopBranding />

      {/* Popup Modal */}
      <SuccessModal
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        generatedImage={generatedImage}
        fileName={initialTemplate?.slug ? `${initialTemplate.slug}-${Math.random().toString(36).substring(2, 8)}.jpg` : "avatar.jpg"}
      />

      <div className="max-w-6xl mx-auto space-y-8 w-full">

        {/* Header */}
        <header className="flex flex-col items-center justify-center gap-4 pb-8 border-b border-[#c19d68]/20 text-center">
          {jsonContent && (jsonContent.title || jsonContent.content) && (
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-[0.1em] text-white uppercase">
                {jsonContent.title && jsonContent.title}
              </h1>
              <p className="text-gray-400 mt-3 text-xs md:text-sm font-light  tracking-[0.15em]">
                {jsonContent.content && jsonContent.content}
              </p>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-8">

            {/* Upload Section */}
            <div className="bg-white/10 border border-[#c19d68]/20 p-6 md:p-8 rounded-2xl shadow-xl backdrop-blur-md">
              <h2 className="flex items-center gap-3 text-sm font-bold text-white mb-6 uppercase tracking-widest">
                <Upload size={18} className="text-[#c19d68]" />
                Tải lên
              </h2>

              <div className="space-y-6">
                {/* Avatar Upload */}
                <div>
                  <label className="block text-xs font-light uppercase tracking-widest text-gray-400 mb-3">Ảnh Avatar (Nằm dưới)</label>
                  <label className="flex flex-col items-center justify-center gap-3 w-full p-6 border border-dashed border-[#c19d68]/30 rounded-xl hover:border-[#c19d68] hover:bg-[#c19d68]/5 transition-all cursor-pointer group bg-black/50">
                    <UserCircle size={24} className="text-gray-600 group-hover:text-[#c19d68] transition-colors" />
                    <span className="text-xs font-medium uppercase tracking-widest text-gray-400 group-hover:text-[#c19d68] transition-colors text-center">
                      {avatarSrc ? "Thay đổi Avatar" : "Chọn Avatar"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "avatar")}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Adjustments Section */}
            <div className={`bg-white/10 border border-[#c19d68]/20 p-6 md:p-8 rounded-2xl shadow-xl backdrop-blur-md transition-opacity duration-300 ${(!frameImg || !avatarImg) ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="flex items-center gap-3 text-sm font-bold text-white uppercase tracking-widest">
                  <SlidersHorizontal size={18} className="text-[#c19d68]" />
                  Điều chỉnh
                </h2>
                <button
                  onClick={resetAdjustments}
                  className="p-2 hover:bg-[#c19d68]/10 rounded-full text-gray-500 hover:text-[#c19d68] transition-colors"
                  title="Reset adjustments"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
              <p className="text-[11px] text-gray-500 mb-8 font-light tracking-wide leading-relaxed">
                Mẹo: Bạn có thể kéo thả trực tiếp trên ảnh để di chuyển, và dùng con lăn chuột hoặc dùng hai ngón tay để phóng to/thu nhỏ.
              </p>

              <div className="space-y-8">
                {/* Scale */}
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-light tracking-widest">
                    <span className="text-gray-400 flex items-center gap-2 uppercase"><ZoomIn size={14} className="text-[#c19d68]" /> Phóng to</span>
                    <span className="text-white font-medium">{scale}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#c19d68]"
                  />
                </div>

                {/* Rotation */}
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-light tracking-widest">
                    <span className="text-gray-400 flex items-center gap-2 uppercase"><RotateCcw size={14} className="text-[#c19d68]" /> Xoay</span>
                    <span className="text-white font-medium">{rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#c19d68]"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!frameImg}
              className="flex w-full justify-center items-center gap-3 px-8 py-4 bg-[#c19d68] hover:bg-[#d8b47d] disabled:bg-[#0a0a0a] disabled:text-gray-600 disabled:border-gray-800 disabled:border disabled:shadow-none text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(193,157,104,0.3)] active:scale-95 uppercase tracking-widest text-sm"
            >
              <Sparkles size={18} />
              <span>Tạo ảnh</span>
            </button>

          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex-1 bg-black/60 border border-[#c19d68]/20 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] relative min-h-[500px] flex items-center justify-center p-4 md:p-8">
              {/* Background grid pattern for transparency look */}
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
              </div>

              <div className="relative w-full h-full flex items-center justify-center overflow-auto rounded-xl touch-none">
                <canvas
                  ref={canvasRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className={`max-w-full max-h-full object-contain shadow-2xl rounded-sm transition-transform duration-100 ${avatarImg ? 'cursor-move' : ''}`}
                  style={{
                    boxShadow: frameImg ? '0 25px 50px -12px rgba(193, 157, 104, 0.1)' : 'none'
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer / Share */}
      <ShareFooter />
    </div>
  );
}

