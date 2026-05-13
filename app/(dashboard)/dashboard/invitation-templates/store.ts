import { create } from 'zustand';
import { InvitationTemplate } from '@/lib/db/schema';
import { saveInvitationTemplate, uploadTemplateBackground, deleteInvitationTemplate } from '@/app/actions';

export type EditingTemplate = Partial<InvitationTemplate> & { bg_file?: string };

interface TemplateState {
  templates: InvitationTemplate[];
  isModalOpen: boolean;
  loading: boolean;
  editingTemplate: EditingTemplate | null;
  bgPreview: string | null;
  draggingElement: 'text' | 'avatar' | null;

  // Sync Actions
  setTemplates: (templates: InvitationTemplate[]) => void;
  openModal: (template?: InvitationTemplate) => void;
  closeModal: () => void;
  setLoading: (loading: boolean) => void;
  handleChange: (key: keyof InvitationTemplate | 'bg_file', value: any) => void;
  setBgPreview: (preview: string | null) => void;
  setDraggingElement: (type: 'text' | 'avatar' | null) => void;

  // Async Actions (Network Calls)
  saveTemplate: () => Promise<{ success: boolean; error?: string }>;
  deleteTemplate: (id: number) => Promise<{ success: boolean; error?: string }>;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
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
  
  setDraggingElement: (draggingElement) => set({ draggingElement }),

  saveTemplate: async () => {
    const { editingTemplate } = get();
    if (!editingTemplate || !editingTemplate.slug || !editingTemplate.name) {
      return { success: false, error: 'Vui lòng nhập Tên và Slug' };
    }

    set({ loading: true });
    try {
      let finalBgUrl = editingTemplate.background_url || '';

      if (editingTemplate.bg_file) {
        const uploadRes = await uploadTemplateBackground(editingTemplate.bg_file, editingTemplate.slug);
        if (uploadRes.success && uploadRes.url) {
          finalBgUrl = uploadRes.url;
        } else {
          return { success: false, error: 'Lỗi khi upload ảnh nền lên WordPress. Vui lòng thử lại.' };
        }
      }

      const res = await saveInvitationTemplate({
        id: editingTemplate.id,
        slug: editingTemplate.slug,
        name: editingTemplate.name,
        title: editingTemplate.title || '',
        description: editingTemplate.description || '',
        background_url: finalBgUrl,
        text_position_x: Number(editingTemplate.text_position_x || 0),
        text_position_y: Number(editingTemplate.text_position_y || 0),
        avatar_position_x: Number(editingTemplate.avatar_position_x || 450),
        avatar_position_y: Number(editingTemplate.avatar_position_y || 450),
        has_avatar: !!editingTemplate.has_avatar,
        save_user_info: editingTemplate.save_user_info !== false,
      });

      if (res.success) {
        get().closeModal();
        return { success: true };
      } else {
        return { success: false, error: res.error || 'Có lỗi xảy ra khi lưu' };
      }
    } catch (error) {
      return { success: false, error: 'Lỗi hệ thống' };
    } finally {
      set({ loading: false });
    }
  },

  deleteTemplate: async (id: number) => {
    try {
      const res = await deleteInvitationTemplate(id);
      return res;
    } catch (error) {
      return { success: false, error: 'Lỗi hệ thống' };
    }
  }
}));
