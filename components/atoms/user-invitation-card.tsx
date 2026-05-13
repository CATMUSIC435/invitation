'use client';

import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import InvitationForm from './invitation-form';
import { InvitationFormData } from '@/lib/store/useInvitationStore';
import LoadingModal from './loading-modal';
import { TransformComponent, TransformWrapper, useControls } from 'react-zoom-pan-pinch';
import { UploadCloud, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { saveInvitation } from '@/app/actions';
import { useInvitationStore } from '@/lib/store/useInvitationStore';
import { InvitationTemplate } from '@/lib/db/schema';
import './index.css';

function toUppercaseValues(obj: InvitationFormData): InvitationFormData {
  return {
    name: obj.name.toUpperCase(),
    title: obj.title.toUpperCase(),
  };
}

export function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

interface UserInvitationCardProps {
  template: InvitationTemplate;
}

export default function UserInvitationCard({ template }: UserInvitationCardProps) {
  const [zoomValue, setZoomValue] = useState(1);
  const [imageStyle, setImageStyle] = useState<React.CSSProperties>({ width: '100%', height: '100%', objectFit: 'cover' });
  const { dataForm, setDataForm, avatarUrl, setAvatarUrl, isPending, setIsPending, isAllow, setIsAllow } = useInvitationStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const isPortrait = img.naturalHeight > img.naturalWidth;
        setImageStyle(isPortrait
          ? { width: '100%', height: 'auto', minHeight: '100%' }
          : { width: 'auto', height: '100%', minWidth: '100%' });
        setAvatarUrl(url);
      };
      img.src = url;
    }
  };

  const isProcessingRef = useRef(false);

  const handleDownload = async () => {
    if (!dataForm.name || !dataForm.title) {
      alert('Vui lòng điền đầy đủ thông tin Họ tên và Chức vụ');
      return;
    }

    if (template.has_avatar && !avatarUrl) {
      alert('Vui lòng tải ảnh đại diện lên');
      return;
    }

    if (isProcessingRef.current || isPending) return;

    isProcessingRef.current = true;
    setIsPending(true);
    try {
      if (!cardRef.current) return;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#0a1520',
        onclone: (doc, el) => {
          if (el) {
            el.style.transform = 'none';
          }
        }
      });

      const base64 = canvas.toDataURL('image/jpeg', 0.95);

      const link = document.createElement('a');
      link.download = `invitation-${dataForm.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      link.href = base64;
      link.click();

      // Chỉ đẩy data (lưu DB & lấy link share) nếu template cho phép
      if (template.save_user_info !== false) {
        const result = await saveInvitation(dataForm.name, dataForm.title, base64);

        if (result.success && result.slug) {
          window.location.href = `/share/${result.slug}`;
        }
      } else {
        // Nếu không lưu, chỉ cần báo thành công hoặc không làm gì (vì đã tự tải xuống rồi)
        alert('Tải ảnh thư mời thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi tải thư mời xuống:', error);
      alert('Có lỗi xảy ra khi tạo ảnh. Vui lòng thử lại.');
    } finally {
      isProcessingRef.current = false;
      setIsPending(false);
      setIsAllow(false);
    }
  };

  const changeValueEvent = (value: InvitationFormData) => {
    const upperValue = toUppercaseValues(value);
    setDataForm(upperValue);
    setIsAllow(true);
  };

  return (
    <TransformWrapper
      ref={transformRef}
      initialScale={1}
      minScale={0.5}
      maxScale={100}
      onZoomStop={(ref) => setZoomValue(ref.state.scale)}
    >
      {() => (
        <div className="mx-auto w-full max-w-6xl py-4">
          <div className="md:w-fit mx-auto">
            <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16 justify-center">

              {/* Form Section */}
              <div className="mx-auto relative w-full max-w-md pt-2">
                <div className="absolute -inset-1 bg-gradient-to-b from-[#0e1e2e]/50 to-[#c19d68]/20 rounded-[2.5rem] blur-xl opacity-70"></div>
                <div className="relative w-full py-6 flex flex-col items-center justify-between rounded-[2rem] px-8 bg-[#0a1520]/95 backdrop-blur-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden min-h-[500px]">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#c19d68]/50 to-transparent"></div>

                  <div className="text-center w-full mb-6">
                    <h3 className="text-xl font-semibold tracking-wide text-white mb-1">Thông tin thư mời</h3>
                    <p className="text-xs text-gray-400">Điền thông tin của bạn vào bên dưới</p>
                  </div>

                  {template.has_avatar && (
                    <>
                      <div
                        className="w-full h-28 mb-4 border-[1.5px] border-dashed border-white/20 rounded-2xl bg-white/5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/10 hover:border-[#c19d68]/50 hover:shadow-[0_0_20px_rgba(193,157,104,0.15)] transition-all duration-300 group"
                        onClick={handleClick}
                      >
                        <div className="p-2 bg-white/5 rounded-full mb-1 group-hover:scale-110 group-hover:bg-[#c19d68]/20 transition-all duration-300">
                          <UploadCloud className="w-6 h-6 text-[#c19d68]" />
                        </div>
                        <p className="text-sm font-medium text-white/70 leading-relaxed">
                          Kéo thả hoặc <span className="text-[#c19d68] font-semibold">Tải ảnh đại diện</span>
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          ref={inputRef}
                          onChange={handleUpload}
                          className="hidden"
                        />
                      </div>
                      <div className="w-full flex justify-center scale-90 mb-4">
                        <Controls />
                      </div>
                    </>
                  )}

                  <div className="w-full">
                    <InvitationForm onCallBack={changeValueEvent} />
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="mx-auto relative group flex flex-col items-center pt-2">
                <div className="absolute -inset-4 bg-gradient-to-b from-[#c19d68]/20 to-transparent rounded-[2rem] blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-700"></div>

                <div className="h-[500px] w-[300px] overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/20 bg-[#0e1e2e] relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                  <div
                    ref={cardRef}
                    className="relative bg-[#0e1e2e] text-center flex flex-col items-center overflow-hidden"
                    style={{
                      width: '900px',
                      height: '1500px',
                      transform: 'scale(0.3333)',
                      transformOrigin: 'top left',
                    }}
                  >
                    <div 
                      className="absolute inset-0 z-10 pointer-events-none bg-center bg-cover bg-no-repeat"
                      style={{
                        backgroundImage: template.background_url ? `url(${template.background_url})` : 'url(/frame.png)'
                      }}
                    />

                    {template.has_avatar && (
                      <div 
                        className="absolute z-0 flex items-center justify-center"
                        style={{
                          top: template.avatar_position_y ? `${template.avatar_position_y}px` : '450px',
                          left: template.avatar_position_x ? `${template.avatar_position_x}px` : '450px',
                          transform: 'translate(-50%, -50%)',
                          width: 'max-content'
                        }}
                      >
                        <div
                          className="w-[360px] h-[360px] rounded-full overflow-hidden bg-[#0a1520] flex items-center justify-center relative mx-auto"
                          style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 4px rgba(255,255,255,0.5)' }}
                        >
                          <TransformComponent wrapperClass="transform-component">
                            <div className="h-[360px] w-[360px] overflow-hidden relative z-0 flex items-center justify-center">
                              {avatarUrl ? (
                                <img
                                  src={avatarUrl}
                                  style={{ ...imageStyle, maxWidth: 'none', maxHeight: 'none' }}
                                  alt="Avatar"
                                />
                              ) : (
                                <div className="text-gray-500 text-lg flex flex-col items-center opacity-40">
                                  <UploadCloud className="w-16 h-16 mb-2" />
                                  <span>Chưa có ảnh</span>
                                </div>
                              )}
                            </div>
                          </TransformComponent>
                        </div>
                      </div>
                    )}

                    <div 
                      className="absolute z-20 flex flex-col items-center justify-center"
                      style={{
                        top: template.text_position_y ? `${template.text_position_y}px` : (template.has_avatar ? '650px' : '400px'),
                        left: template.text_position_x ? `${template.text_position_x}px` : '450px',
                        transform: 'translate(-50%, 0)',
                        width: 'max-content'
                      }}
                    >
                      <h2
                        className="text-4xl font-bold text-white mb-1 uppercase font-avo-bold leading-tight"
                        style={{ textShadow: '0 4px 10px rgba(0,0,0,0.3)', padding: 0, letterSpacing: '3px', fontWeight: 400, lineHeight: 1 }}
                      >
                        {dataForm.name || 'NGUYỄN VĂN A'}
                      </h2>
                      <div>
                        <h3
                          className="text-xl mt-0 font-normal small-text uppercase text-[#e5e5e5] font-avo"
                          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                        >
                          {dataForm.title || 'CHỨC VỤ'}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="w-full relative z-20 mt-8">
                  {isAllow ? (
                    <button
                      onClick={handleDownload}
                      className="group relative overflow-hidden bg-gradient-to-r from-[#c19d68] to-[#ac8d45] text-white font-bold py-4 rounded-xl shadow-[0_10px_30px_rgba(193,157,104,0.3)] hover:shadow-[0_15px_40px_rgba(193,157,104,0.5)] transition-all duration-300 uppercase tracking-widest w-full disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0"
                      disabled={isPending}
                    >
                      <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></div>
                      <span className="relative flex items-center justify-center gap-2">
                        {isPending ? 'Đang xử lý...' : 'Tải Thư Mời'}
                      </span>
                    </button>
                  ) : (
                    <div className="py-4 text-center text-white/30 text-sm border border-white/10 rounded-xl bg-white/5 border-dashed">
                      Hoàn thành form để tải thư mời
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
          <LoadingModal isOpen={isPending} />
        </div>
      )}
    </TransformWrapper>
  );
}

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="flex items-center gap-1 p-1 bg-[#0a1520]/80 backdrop-blur-xl rounded-full border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
      <button
        type="button"
        onClick={() => zoomIn()}
        className="w-11 h-11 flex items-center justify-center rounded-full text-white/60 hover:text-[#c19d68] hover:bg-[#c19d68]/10 active:scale-90 transition-all duration-300"
        title="Phóng to"
      >
        <ZoomIn className="w-5 h-5" strokeWidth={2} />
      </button>
      <div className="w-px h-5 bg-white/10"></div>
      <button
        type="button"
        onClick={() => zoomOut()}
        className="w-11 h-11 flex items-center justify-center rounded-full text-white/60 hover:text-[#c19d68] hover:bg-[#c19d68]/10 active:scale-90 transition-all duration-300"
        title="Thu nhỏ"
      >
        <ZoomOut className="w-5 h-5" strokeWidth={2} />
      </button>
      <div className="w-px h-5 bg-white/10"></div>
      <button
        type="button"
        onClick={() => resetTransform()}
        className="w-11 h-11 flex items-center justify-center rounded-full text-white/60 hover:text-[#c19d68] hover:bg-[#c19d68]/10 active:scale-90 transition-all duration-300"
        title="Đặt lại"
      >
        <RefreshCw className="w-5 h-5" strokeWidth={2} />
      </button>
    </div>
  );
};
