'use client';

import { Move } from 'lucide-react';
import { useRef } from 'react';
import { useTemplateStore } from '../store';

export default function TemplatePreview() {
  const { editingTemplate, bgPreview, draggingElement, setDraggingElement, handleChange } = useTemplateStore();
  const previewRef = useRef<HTMLDivElement>(null);

  const scaleFactor = 3.75; // Actual image is 900x1500, preview is 240x400

  const handleMouseDown = (e: React.MouseEvent, type: 'text' | 'avatar') => {
    setDraggingElement(type);
    
    // We can't use React state for dragStart and initialPos smoothly without re-renders causing lag,
    // so we can use a ref or data attributes. Let's use data attributes on the preview container.
    if (previewRef.current) {
      previewRef.current.dataset.dragStartX = e.clientX.toString();
      previewRef.current.dataset.dragStartY = e.clientY.toString();
      
      if (type === 'text') {
        previewRef.current.dataset.initialX = ((editingTemplate?.text_position_x || 450) / scaleFactor).toString();
        previewRef.current.dataset.initialY = ((editingTemplate?.text_position_y || 650) / scaleFactor).toString();
      } else {
        previewRef.current.dataset.initialX = ((editingTemplate?.avatar_position_x || 450) / scaleFactor).toString();
        previewRef.current.dataset.initialY = ((editingTemplate?.avatar_position_y || 450) / scaleFactor).toString();
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingElement || !previewRef.current) return;
    
    const dragStartX = parseFloat(previewRef.current.dataset.dragStartX || '0');
    const dragStartY = parseFloat(previewRef.current.dataset.dragStartY || '0');
    const initialX = parseFloat(previewRef.current.dataset.initialX || '0');
    const initialY = parseFloat(previewRef.current.dataset.initialY || '0');

    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    
    let newX = initialX + dx;
    let newY = initialY + dy;

    if (draggingElement === 'text') {
      handleChange('text_position_x', Math.round(newX * scaleFactor));
      handleChange('text_position_y', Math.round(newY * scaleFactor));
    } else if (draggingElement === 'avatar') {
      handleChange('avatar_position_x', Math.round(newX * scaleFactor));
      handleChange('avatar_position_y', Math.round(newY * scaleFactor));
    }
  };

  if (!editingTemplate) return null;

  return (
    <div className="w-full md:w-1/2 p-6 md:p-8 bg-black/40 rounded-r-2xl flex flex-col items-center justify-center border-l border-white/5">
      <h3 className="text-white font-medium mb-2 w-full text-center text-sm">Kéo thả để điều chỉnh vị trí</h3>
      <div className="flex gap-4 mb-6">
        <p className="text-xs text-[#c19d68] font-mono bg-[#c19d68]/10 px-3 py-1 rounded-full border border-[#c19d68]/20">
          Text: {editingTemplate.text_position_x}px, {editingTemplate.text_position_y}px
        </p>
        <p className="text-xs text-[#c19d68] font-mono bg-[#c19d68]/10 px-3 py-1 rounded-full border border-[#c19d68]/20">
          Avatar: {editingTemplate.avatar_position_x || 450}px, {editingTemplate.avatar_position_y || 450}px
        </p>
      </div>
      
      <div className="relative border border-dashed border-[#c19d68]/40 rounded-xl bg-white/5 shadow-inner overflow-hidden w-[240px] h-[400px]">
        <div 
          ref={previewRef}
          className="absolute top-0 left-0 origin-top-left overflow-hidden"
          style={{
            width: '900px',
            height: '1500px',
            transform: 'scale(0.26666667)', // 240 / 900
          }}
          onMouseMove={handleMouseMove}
        >
          <div 
            className="absolute inset-0 z-10 pointer-events-none bg-center bg-cover bg-no-repeat"
            style={{
              backgroundImage: bgPreview ? `url(${bgPreview})` : 'url(/frame.png)',
            }}
          />

          {editingTemplate.has_avatar && (
            <div 
              className="absolute z-0 flex flex-col items-center justify-center cursor-move group"
              style={{
                top: `${editingTemplate.avatar_position_y || 450}px`,
                left: `${editingTemplate.avatar_position_x || 450}px`,
                transform: 'translate(-50%, -50%)',
                width: 'max-content'
              }}
              onMouseDown={(e) => handleMouseDown(e, 'avatar')}
            >
              <div className="absolute -inset-4 rounded-full border-2 border-transparent group-hover:border-[#c19d68]/50 group-hover:bg-white/10 transition-colors pointer-events-none"></div>
              <div className="absolute -top-12 bg-[#c19d68] text-black text-xl px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity shadow-lg font-bold">
                <Move size={24} /> Kéo Avatar
              </div>
              <div className="w-[360px] h-[360px] rounded-full bg-[#0a1520]/80 backdrop-blur border-[12px] border-white/30 flex items-center justify-center text-3xl text-white/50 shadow-inner">
                Avatar
              </div>
            </div>
          )}

          <div 
            className="absolute z-20 flex flex-col items-center justify-center cursor-move group"
            style={{
              top: `${editingTemplate.text_position_y || 650}px`,
              left: `${editingTemplate.text_position_x || 450}px`,
              transform: 'translate(-50%, 0)',
              width: 'max-content'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'text')}
          >
            <div className="absolute -inset-6 rounded-2xl border-2 border-transparent group-hover:border-[#c19d68]/50 group-hover:bg-white/10 transition-colors pointer-events-none"></div>

            <div className="absolute -top-12 bg-[#c19d68] text-black text-xl px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity shadow-lg font-bold">
              <Move size={24} /> Kéo Text
            </div>
            <h2
              className="text-4xl font-bold text-white mb-1 uppercase font-avo-bold leading-tight pointer-events-none"
              style={{ textShadow: '0 4px 10px rgba(0,0,0,0.3)', padding: 0, letterSpacing: '3px', fontWeight: 400, lineHeight: 1 }}
            >
              NGUYỄN VĂN A
            </h2>
            <div className="pointer-events-none">
              <h3
                className="text-xl mt-0 font-normal small-text uppercase text-[#e5e5e5] font-avo"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
              >
                CHỨC VỤ
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
