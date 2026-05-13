'use client';

import React from 'react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import { UploadCloud, ZoomIn, ZoomOut, RefreshCw, Download, Loader2 } from 'lucide-react';
import InvitationForm from './invitation-form';
import { InvitationTemplate } from '@/lib/db/schema';
import LoadingModal from './loading-modal';
import { useInvitationCard } from './useInvitationCard';

export default function UserInvitationCard({ template }: { template: InvitationTemplate }) {
  const { state, refs, actions } = useInvitationCard(template);
  const { dataForm, avatarUrl, isAllow, isPending, bgImage, isLoaded, bgDimensions, imageStyle } = state;
  const { cardRef, transformRef, inputRef } = refs;
  const { handleUpload, handleClick, handleDownload, changeValueEvent, setZoomValue } = actions;

  // Tính toán kích thước preview linh hoạt
  const isHorizontal = bgDimensions.width > bgDimensions.height;
  const PREVIEW_WIDTH = isHorizontal ? 500 : 300;
  const PREVIEW_HEIGHT = (PREVIEW_WIDTH * bgDimensions.height) / bgDimensions.width;
  const scale = PREVIEW_WIDTH / bgDimensions.width;

  const renderContent = () => (
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
                <InvitationForm onCallBack={changeValueEvent} hasCompany={template.has_company ?? true} />
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="mx-auto relative group flex flex-col items-center pt-2 max-w-full">
            <div className="absolute -inset-4 bg-gradient-to-b from-[#c19d68]/20 to-transparent rounded-[2rem] blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-700"></div>

            <div
              className="overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/20 bg-[#0e1e2e] relative z-10 transition-transform duration-500 group-hover:-translate-y-2 max-w-[90vw]"
              style={{ width: `${PREVIEW_WIDTH}px`, height: `${PREVIEW_HEIGHT}px` }}
            >
              <div
                ref={cardRef}
                className="relative bg-[#0e1e2e] text-center flex flex-col items-center overflow-hidden"
                style={{
                  width: `${bgDimensions.width}px`,
                  height: `${bgDimensions.height}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                }}
              >
                {bgImage ? (
                  <img
                    src={bgImage}
                    alt="Background"
                    className="absolute inset-0 z-10 pointer-events-none w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center bg-[#162a40]">
                    <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
                  </div>
                )}

                {isLoaded && template.has_avatar && (
                  <div
                    className="absolute z-0 flex items-center justify-center transition-opacity duration-300"
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

                {isLoaded && (
                  <div
                    className="absolute z-20 flex flex-col items-center justify-center transition-opacity duration-300"
                    style={{
                      top: template.text_position_y ? `${template.text_position_y}px` : '650px',
                      left: template.text_position_x ? `${template.text_position_x}px` : '450px',
                      transform: 'translate(-50%, 0)',
                      width: 'max-content'
                    }}
                  >
                    <h2
                      className="text-4xl font-bold text-white mb-1 leading-tight"
                      style={{ fontFamily: '"Times New Roman", Times, serif', textShadow: '0 4px 10px rgba(0,0,0,0.3)', padding: 0, letterSpacing: '3px', fontWeight: 600, lineHeight: 1 }}
                    >
                      {dataForm?.name || 'NGUYỄN VĂN A'}
                    </h2>
                    <div className="">
                      <h3
                        className="text-xl mt-1 font-normal small-text text-[#e5e5e5] text-center"
                        style={{ fontFamily: '"Times New Roman", Times, serif', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                      >
                        {(dataForm?.title || 'CHỨC VỤ').split('\n').map((line, index) => (
                          <div key={index}>{line}</div>
                        ))}
                      </h3>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="w-full relative z-20 mt-8">
              {isAllow ? (
                <button
                  onClick={handleDownload}
                  className="group relative overflow-hidden bg-gradient-to-r from-[#c19d68] to-[#ac8d45] text-white font-bold py-4 rounded-xl shadow-[0_10px_30px_rgba(193,157,104,0.3)] hover:shadow-[0_15px_40px_rgba(193,157,104,0.5)] transition-all duration-300 uppercase tracking-widest w-full disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0"
                  disabled={isPending || !bgImage}
                >
                  <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {isPending ? 'Đang xử lý...' : (!bgImage ? 'Đang tải ảnh gốc...' : 'Tải Thư Mời')}
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
  );

  if (!template.has_avatar) {
    return renderContent();
  }

  return (
    <TransformWrapper
      ref={transformRef}
      initialScale={1}
      minScale={0.5}
      maxScale={100}
      onZoomStop={(ref) => setZoomValue(ref.state.scale)}
    >
      {() => renderContent()}
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
