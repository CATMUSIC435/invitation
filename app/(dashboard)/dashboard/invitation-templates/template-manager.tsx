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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 min-h-[80vh]" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>

      <TemplateList />
      <TemplateModal />
    </div>
  );
}
