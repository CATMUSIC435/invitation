import { create } from 'zustand';
import { InvitationTemplate } from '@/lib/db/schema';

export type EditingTemplate = Partial<InvitationTemplate> & { bg_file?: string };

interface TemplateState {
  templates: InvitationTemplate[];
  isModalOpen: boolean;
  loading: boolean;
  editingTemplate: EditingTemplate | null;
  bgPreview: string | null;
  draggingElement: 'text' | 'avatar' | null;

  // Actions
  setTemplates: (templates: InvitationTemplate[]) => void;
  openModal: (template?: InvitationTemplate) => void;
  closeModal: () => void;
  setLoading: (loading: boolean) => void;
  handleChange: (key: keyof InvitationTemplate | 'bg_file', value: any) => void;
  setBgPreview: (preview: string | null) => void;
  setDraggingElement: (type: 'text' | 'avatar' | null) => void;
}

export const useTemplateStore = create<TemplateState>((set) => ({
  templates: [],
  isModalOpen: false,
  loading: false,
  editingTemplate: null,
  bgPreview: null,
  draggingElement: null,

  setTemplates: (templates) => set({ templates }),
  
  openModal: (template) => {
    if (template) {
      set({ 
        editingTemplate: { ...template }, 
        bgPreview: template.background_url || null,
        isModalOpen: true 
      });
    } else {
      set({ 
        editingTemplate: {
          slug: '',
          name: '',
          title: '',
          description: '',
          background_url: '',
          text_position_x: 0,
          text_position_y: 600,
          avatar_position_x: 450,
          avatar_position_y: 450,
          has_avatar: true,
          save_user_info: true,
        }, 
        bgPreview: null,
        isModalOpen: true 
      });
    }
  },

  closeModal: () => set({ 
    isModalOpen: false, 
    editingTemplate: null, 
    bgPreview: null,
    draggingElement: null 
  }),

  setLoading: (loading) => set({ loading }),

  handleChange: (key, value) => set((state) => {
    if (!state.editingTemplate) return state;

    const next = { ...state.editingTemplate, [key]: value };
    
    // Auto-generate slug
    if (key === 'name' && (!state.editingTemplate.id || !state.editingTemplate.slug)) {
      const generatedSlug = (value as string)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      next.slug = generatedSlug;
    }

    return { editingTemplate: next };
  }),

  setBgPreview: (bgPreview) => set({ bgPreview }),
  
  setDraggingElement: (draggingElement) => set({ draggingElement })
}));
