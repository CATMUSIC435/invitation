'use client';

import { UploadCloud } from 'lucide-react';
import { useTemplateStore } from '../store';
import { uploadTemplateBackground, saveInvitationTemplate } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function TemplateForm() {
  const router = useRouter();
  const { editingTemplate, loading, setLoading, handleChange, closeModal, setBgPreview } = useTemplateStore();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate || !editingTemplate.slug || !editingTemplate.name) {
      alert('Vui lòng nhập Tên và Slug');
      return;
    }

    setLoading(true);
    try {
      let finalBgUrl = editingTemplate.background_url || '';

      if (editingTemplate.bg_file) {
        const uploadRes = await uploadTemplateBackground(editingTemplate.bg_file, editingTemplate.slug);
        if (uploadRes.success && uploadRes.url) {
          finalBgUrl = uploadRes.url;
        } else {
          alert('Lỗi khi upload ảnh nền lên WordPress. Sẽ dùng URL cũ hoặc để trống.');
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
        alert('Lưu mẫu thư mời thành công!');
        closeModal();
        router.refresh();
      } else {
        alert(res.error || 'Có lỗi xảy ra khi lưu');
      }
    } catch (error) {
      alert('Lỗi hệ thống');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleChange('bg_file', base64String);
        setBgPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!editingTemplate) return null;

  return (
    <div className="w-full md:w-1/2 p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/10">
      <h2 className="text-xl font-bold text-white mb-6">
        {editingTemplate.id ? 'Sửa Mẫu Thư Mời' : 'Thêm Mẫu Mới'}
      </h2>
      
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tên Template (Nội bộ)</label>
          <input 
            type="text" 
            required
            className="w-full bg-white/5 border border-white/10 text-white p-2.5 rounded-lg focus:border-[#c19d68] outline-none"
            value={editingTemplate.name || ''}
            onChange={e => handleChange('name', e.target.value)}
            placeholder="VD: Sự kiện Tết 2027"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Slug (Đường dẫn /invitations/slug)</label>
          <input 
            type="text" 
            required
            className="w-full bg-white/5 border border-white/10 text-white p-2.5 rounded-lg focus:border-[#c19d68] outline-none"
            value={editingTemplate.slug || ''}
            onChange={e => handleChange('slug', e.target.value)}
            placeholder="VD: tet-2027"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tiêu đề hiển thị (H1)</label>
          <input 
            type="text" 
            className="w-full bg-white/5 border border-white/10 text-white p-2.5 rounded-lg focus:border-[#c19d68] outline-none"
            value={editingTemplate.title || ''}
            onChange={e => handleChange('title', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Mô tả phụ</label>
          <textarea 
            rows={2}
            className="w-full bg-white/5 border border-white/10 text-white p-2.5 rounded-lg focus:border-[#c19d68] outline-none"
            value={editingTemplate.description || ''}
            onChange={e => handleChange('description', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Ảnh nền (Tải lên WordPress)</label>
          <div className="flex gap-2">
            <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white p-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shrink-0">
              <UploadCloud size={18} /> Tải ảnh lên
              <input 
                type="file" 
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <input 
              type="text" 
              className="w-full bg-white/5 border border-white/10 text-gray-400 p-2.5 rounded-lg outline-none cursor-not-allowed"
              value={editingTemplate.background_url || ''}
              readOnly
              placeholder="URL sẽ tự động cập nhật sau khi tải ảnh"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input 
            type="checkbox" 
            id="has_avatar"
            checked={!!editingTemplate.has_avatar}
            onChange={e => handleChange('has_avatar', e.target.checked)}
            className="w-4 h-4 accent-[#c19d68]"
          />
          <label htmlFor="has_avatar" className="font-medium text-gray-300 cursor-pointer">
            Cho phép hiển thị/Tải ảnh đại diện (Avatar)
          </label>
        </div>

        <div className="flex items-center gap-3 pt-1 pb-4">
          <input 
            type="checkbox" 
            id="save_user_info"
            checked={editingTemplate.save_user_info !== false}
            onChange={e => handleChange('save_user_info', e.target.checked)}
            className="w-4 h-4 accent-[#c19d68]"
          />
          <label htmlFor="save_user_info" className="font-medium text-gray-300 cursor-pointer">
            Lưu trữ thông tin người dùng (Lên Database)
          </label>
        </div>

        <div className="flex gap-4 pt-4 border-t border-white/10">
          <button 
            type="button" 
            onClick={closeModal}
            className="flex-1 bg-white/5 text-white font-semibold py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            Hủy
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-[#c19d68] to-[#ac8d45] text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Đang lưu...' : 'Lưu Template'}
          </button>
        </div>
      </form>
    </div>
  );
}
