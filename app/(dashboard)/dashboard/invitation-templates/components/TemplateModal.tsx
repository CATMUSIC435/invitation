'use client';

import { useTemplateStore } from '../store';
import TemplateForm from './TemplateForm';
import TemplatePreview from './TemplatePreview';

export default function TemplateModal() {
  const { isModalOpen } = useTemplateStore();

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#050a10]/80 backdrop-blur-sm"></div>

      {/* Modal content */}
      <div className="relative bg-[#0e1e2e] rounded-2xl w-full max-w-6xl shadow-2xl border border-white/10 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
        <TemplateForm />
        <TemplatePreview />
      </div>
    </div>
  );
}
