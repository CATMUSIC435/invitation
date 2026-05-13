'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Edit, ExternalLink, X, Move, Trash2, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { saveInvitationTemplate, deleteInvitationTemplate, uploadTemplateBackground } from '@/app/actions';
import { InvitationTemplate } from '@/lib/db/schema';
import { useRouter } from 'next/navigation';

export default function TemplateManager({ initialTemplates }: { initialTemplates: InvitationTemplate[] }) {
  const router = useRouter();
  const [templates, setTemplates] = useState<InvitationTemplate[]>(initialTemplates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<InvitationTemplate> & { bg_file?: string }>((null as any));
  const [bgPreview, setBgPreview] = useState<string | null>(null);

  // Default values for new template
  const defaultValues = {
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
  };

  const handleOpenModal = (template?: InvitationTemplate) => {
    if (template) {
      setEditingTemplate({ ...template });
      setBgPreview(template.background_url || null);
    } else {
      setEditingTemplate({ ...defaultValues });
      setBgPreview(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTemplate(null as any);
    setBgPreview(null);
  };

  const handleChange = (key: keyof InvitationTemplate | 'bg_file', value: any) => {
    if (editingTemplate) {
      setEditingTemplate((prev) => {
        const next = { ...prev, [key]: value };
        // Auto-generate slug if name changes and we are creating a new template (no id) 
        // OR if slug is currently empty
        if (key === 'name' && (!prev.id || !prev.slug)) {
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
        return next;
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate || !editingTemplate.slug || !editingTemplate.name) {
      alert('Vui lòng nhập Tên và Slug');
      return;
    }

    setLoading(true);
    try {
      let finalBgUrl = editingTemplate.background_url || '';

      // Upload image if a new file was selected
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
        save_user_info: editingTemplate.save_user_info !== false, // Default to true
      });

      if (res.success) {
        alert('Lưu mẫu thư mời thành công!');
        handleCloseModal();
        router.refresh(); // Refresh server component data
      } else {
        alert(res.error || 'Có lỗi xảy ra khi lưu');
      }
    } catch (error) {
      alert('Lỗi hệ thống');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa mẫu này không?')) {
      const res = await deleteInvitationTemplate(id);
      if (res.success) {
        alert('Xóa thành công');
        router.refresh();
      } else {
        alert(res.error || 'Có lỗi xảy ra khi xóa');
      }
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

  // Draggable logic for preview
  const previewRef = useRef<HTMLDivElement>(null);
  const [draggingElement, setDraggingElement] = useState<'text' | 'avatar' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });

  const scaleFactor = 3.75; // Actual image is 900x1500, preview is 240x400

  const handleMouseDown = (e: React.MouseEvent, type: 'text' | 'avatar') => {
    setDraggingElement(type);
    setDragStart({ x: e.clientX, y: e.clientY });
    if (type === 'text') {
      setInitialPos({ 
        x: (editingTemplate?.text_position_x || 450) / scaleFactor, 
        y: (editingTemplate?.text_position_y || 650) / scaleFactor 
      });
    } else {
      setInitialPos({ 
        x: (editingTemplate?.avatar_position_x || 450) / scaleFactor, 
        y: (editingTemplate?.avatar_position_y || 450) / scaleFactor 
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingElement) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    // Calculate new position in preview coordinates
    let newX = initialPos.x + dx;
    let newY = initialPos.y + dy;

    if (draggingElement === 'text') {
      handleChange('text_position_x', Math.round(newX * scaleFactor));
      handleChange('text_position_y', Math.round(newY * scaleFactor));
    } else if (draggingElement === 'avatar') {
      handleChange('avatar_position_x', Math.round(newX * scaleFactor));
      handleChange('avatar_position_y', Math.round(newY * scaleFactor));
    }
  };

  const handleMouseUp = () => {
    setDraggingElement(null);
  };

  // If initialTemplates change from server, update local state
  useEffect(() => {
    setTemplates(initialTemplates);
  }, [initialTemplates]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Quản lý Mẫu Thư Mời</h1>
          <p className="text-gray-400 text-sm">Danh sách các mẫu thư mời được tạo để người dùng sử dụng.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#c19d68] hover:bg-[#a68656] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Tạo Mẫu Mới
        </button>
      </div>

      <div className="bg-[#0e1e2e] border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 font-semibold text-gray-300">Tên Mẫu</th>
                <th className="p-4 font-semibold text-gray-300">Slug / Đường dẫn</th>
                <th className="p-4 font-semibold text-gray-300">Avatar</th>
                <th className="p-4 font-semibold text-gray-300">Ngày tạo</th>
                <th className="p-4 font-semibold text-gray-300 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {templates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Chưa có mẫu thư mời nào. Hãy tạo một mẫu mới.
                  </td>
                </tr>
              ) : (
                templates.map(template => (
                  <tr key={template.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium text-white">{template.name}</td>
                    <td className="p-4 text-gray-400">
                      <span className="bg-black/30 px-2 py-1 rounded text-sm">/{template.slug}</span>
                    </td>
                    <td className="p-4 text-gray-400">
                      {template.has_avatar ? (
                        <span className="text-green-400 text-sm">Có bật</span>
                      ) : (
                        <span className="text-red-400 text-sm">Đã tắt</span>
                      )}
                      <br/>
                      {template.save_user_info !== false ? (
                        <span className="text-blue-400 text-xs">Lưu data</span>
                      ) : (
                        <span className="text-yellow-400 text-xs">Không lưu</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(template.created_at || '').toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4 flex gap-3 justify-end">
                      <Link 
                        href={`/invitations/${template.slug}`}
                        target="_blank"
                        className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors"
                        title="Xem trang hiển thị"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <button 
                        onClick={() => handleOpenModal(template)}
                        className="text-gray-400 hover:text-[#c19d68] bg-white/5 hover:bg-[#c19d68]/10 p-2 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(template.id)}
                        className="text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-400/10 p-2 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div 
            className="bg-gradient-to-br from-[#0e1e2e] to-[#0a1520] border border-[#c19d68]/20 rounded-2xl w-full max-w-4xl flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.5)] relative my-8"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Left: Form */}
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
                    checked={editingTemplate.save_user_info !== false} // Default is true
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
                    onClick={handleCloseModal}
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

            {/* Right: Draggable Preview */}
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
                        transform: 'translate(-50%, -50%)', // Center perfectly at X, Y
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

                  {/* Draggable Text Block */}
                  <div 
                    className="absolute z-20 flex flex-col items-center justify-center cursor-move group"
                    style={{
                      top: `${editingTemplate.text_position_y || 650}px`,
                      left: `${editingTemplate.text_position_x || 450}px`,
                      transform: 'translate(-50%, 0)', // Center horizontally at X
                      width: 'max-content'
                    }}
                    onMouseDown={(e) => handleMouseDown(e, 'text')}
                  >
                    {/* Helper background for drag area (doesn't affect layout) */}
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
          </div>
        </div>
      )}
    </div>
  );
}
