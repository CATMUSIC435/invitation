"use client";

import { useState } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2, X, Calendar, RefreshCw } from 'lucide-react';
import { createAvatarTemplate, updateAvatarTemplate, deleteAvatarTemplate, uploadToWordPress } from './actions';

export default function AvatarAdminClient({ initialTemplates }: { initialTemplates: any[] }) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    image_url: '',
    start_date: '',
    end_date: '',
  });

  const handleOpenModal = (template: any = null) => {
    if (template) {
      setEditingId(template.id);
      setFormData({
        slug: template.slug,
        title: template.title,
        content: template.content || '',
        image_url: template.image_url || '',
        start_date: template.start_date ? new Date(template.start_date).toISOString().slice(0, 16) : '',
        end_date: template.end_date ? new Date(template.end_date).toISOString().slice(0, 16) : '',
      });
    } else {
      setEditingId(null);
      setFormData({ slug: '', title: '', content: '', image_url: '', start_date: '', end_date: '' });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const result = await uploadToWordPress(form);
      if (result.error) {
        alert("Lỗi tải ảnh: " + result.error);
        return;
      }
      setFormData(prev => ({ ...prev, image_url: result.url }));
      alert("Tải ảnh thành công!");
    } catch (error: any) {
      alert("Lỗi tải ảnh: " + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateAvatarTemplate(editingId, formData);
        alert("Cập nhật thành công!");
      } else {
        await createAvatarTemplate(formData);
        alert("Thêm mới thành công!");
      }
      setIsModalOpen(false);
      window.location.reload(); // Quick refresh to get new data
    } catch (error: any) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa chiến dịch này?")) {
      try {
        await deleteAvatarTemplate(id);
        setTemplates(templates.filter(t => t.id !== id));
        alert("Xóa thành công!");
      } catch (error: any) {
        alert("Lỗi xóa: " + error.message);
      }
    }
  };

  return (
    <div className="bg-[#0a1520] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative z-10 w-full">
      <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-[#162a40]/50 backdrop-blur-md">
        <h3 className="text-white font-bold text-sm uppercase tracking-wider">Quản lý Mẫu Avatar</h3>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-[#1a2d42] hover:bg-[#233a54] text-gray-300 text-sm px-3 sm:px-4 py-2 font-medium transition-all rounded-lg border border-white/10"
            title="Tải lại dữ liệu"
          >
            <RefreshCw size={16} />
            <span className="hidden sm:inline">Tải lại</span>
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-[#c19d68] to-[#ac8d45] hover:from-[#d3b27d] hover:to-[#c19d68] text-white text-sm px-3 sm:px-4 py-2 font-bold transition-all rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={16} /> Thêm mới
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-[#1a2d42] text-gray-400 uppercase text-xs border-b border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold text-center w-16">ID</th>
              <th className="px-4 py-3 font-semibold text-center">Ảnh (Frame)</th>
              <th className="px-4 py-3 font-semibold">Chiến dịch (Title)</th>
              <th className="px-4 py-3 font-semibold">Đường dẫn (Slug)</th>
              <th className="px-4 py-3 font-semibold">Thời gian</th>
              <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
              {templates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500 italic">
                    Chưa có dữ liệu nào.
                  </td>
                </tr>
              ) : templates.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-4 py-3 text-center text-xs text-gray-500">{t.id}</td>
                  <td className="px-4 py-3 text-center">
                    {t.image_url ? (
                      <a href={t.image_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-[#c19d68]/10 text-[#c19d68] hover:bg-[#c19d68]/20 text-xs font-medium transition-colors">
                        Xem ảnh
                      </a>
                    ) : (
                      <span className="text-gray-500 text-xs italic">Trống</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{t.title}</td>
                  <td className="px-4 py-3">/avatar/{t.slug}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {t.start_date && new Date(t.start_date).toLocaleDateString()} - {t.end_date && new Date(t.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(t)} className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/30 rounded-md transition-colors" title="Sửa">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/30 rounded-md transition-colors" title="Xóa">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1e2e] border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Cập nhật chiến dịch' : 'Thêm chiến dịch mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="avatarForm" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <label className="text-sm font-medium text-gray-300">Tên chiến dịch (Title) *</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#162a40] border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c19d68]/50" placeholder="VD: Symlife 2026" />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <label className="text-sm font-medium text-gray-300">Đường dẫn (Slug) *</label>
                    <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-[#162a40] border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c19d68]/50" placeholder="VD: symlife" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Nội dung / Mô tả</label>
                  <textarea rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-[#162a40] border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c19d68]/50" placeholder="Mô tả chiến dịch..."></textarea>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-1"><Calendar size={14}/> Bắt đầu</label>
                    <input type="datetime-local" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full bg-[#162a40] border border-white/10 text-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c19d68]/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-1"><Calendar size={14}/> Kết thúc</label>
                    <input type="datetime-local" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} className="w-full bg-[#162a40] border border-white/10 text-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c19d68]/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Ảnh Frame (Khung nền)</label>
                  <div className="flex items-center gap-4">
                    {formData.image_url && (
                      <img src={formData.image_url} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-white/20" />
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:bg-white/5 hover:border-white/40 transition-colors">
                        {uploadingImage ? (
                          <div className="flex flex-col items-center text-[#c19d68]">
                            <Loader2 className="animate-spin mb-2" size={24} />
                            <span className="text-sm">Đang tải lên WP...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-gray-400">
                            <ImageIcon className="mb-2" size={24} />
                            <span className="text-sm">Click để chọn ảnh tải lên WordPress</span>
                          </div>
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                    </label>
                  </div>
                  <input type="text" value={formData.image_url} readOnly className="w-full mt-2 bg-transparent border-none text-xs text-gray-500 focus:outline-none" placeholder="Link ảnh WP sẽ xuất hiện ở đây..." />
                </div>
              </form>
            </div>
            <div className="p-5 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                Hủy
              </button>
              <button type="submit" form="avatarForm" disabled={isSubmitting || uploadingImage} className="px-5 py-2.5 bg-[#c19d68] hover:bg-[#d4b079] text-white rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg">
                {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                {editingId ? 'Lưu thay đổi' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
