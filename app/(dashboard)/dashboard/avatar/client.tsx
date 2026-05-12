"use client";

import { useState } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2, X, Calendar } from 'lucide-react';
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
      const url = await uploadToWordPress(form);
      setFormData(prev => ({ ...prev, image_url: url }));
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
    <div className="w-full relative z-10 text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight uppercase font-avo-bold">Quản lý Mẫu Avatar</h1>
          <p className="text-gray-400 mt-1">Thêm, sửa, xóa các chiến dịch tạo Avatar</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-[#c19d68] to-[#ac8d45] hover:from-[#d4b079] hover:to-[#c19d68] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(193,157,104,0.3)]"
        >
          <Plus size={18} /> Thêm mới
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 text-gray-300 uppercase text-xs tracking-wider border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Ảnh (Frame)</th>
                <th className="px-6 py-4">Chiến dịch (Title)</th>
                <th className="px-6 py-4">Đường dẫn (Slug)</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {templates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    Chưa có chiến dịch nào. Hãy thêm mới!
                  </td>
                </tr>
              ) : templates.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    {t.image_url ? (
                      <img src={t.image_url} alt="frame" className="w-12 h-12 object-cover rounded-md border border-white/10 bg-black" />
                    ) : (
                      <div className="w-12 h-12 bg-white/10 flex items-center justify-center rounded-md text-gray-500"><ImageIcon size={16} /></div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{t.title}</td>
                  <td className="px-6 py-4 text-gray-400">/avatar/{t.slug}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {t.start_date && new Date(t.start_date).toLocaleDateString()} - {t.end_date && new Date(t.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleOpenModal(t)} className="text-[#c19d68] hover:text-[#d4b079] bg-[#c19d68]/10 p-2 rounded-md transition-colors mr-2">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-300 bg-red-400/10 p-2 rounded-md transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
