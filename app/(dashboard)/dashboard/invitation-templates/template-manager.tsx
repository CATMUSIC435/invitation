'use client';

import { Plus } from 'lucide-react';
import { InvitationTemplate } from '@/lib/db/schema';
import { useEffect } from 'react';
import { useTemplateStore } from './store';
import TemplateList from './components/TemplateList';
import TemplateModal from './components/TemplateModal';

export default function TemplateManager({ initialTemplates }: { initialTemplates: InvitationTemplate[] }) {
  const { setTemplates, openModal } = useTemplateStore();

  useEffect(() => {
    setTemplates(initialTemplates);
  }, [initialTemplates, setTemplates]);

  // Handle global mouse up for the dragger
  const { setDraggingElement } = useTemplateStore();
  const handleMouseUp = () => {
    setDraggingElement(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-[80vh]" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-avo-bold uppercase tracking-wide">
            Mẫu Thư Mời
          </h1>
          <p className="text-gray-400">Quản lý và tạo các mẫu thư mời sự kiện.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#c19d68] text-black px-6 py-3 rounded-full hover:bg-[#ac8d45] transition-colors font-bold shadow-lg"
        >
          <Plus size={20} /> Tạo Mẫu Mới
        </button>
      </div>

      <TemplateList />
      <TemplateModal />
    </div>
  );
}
