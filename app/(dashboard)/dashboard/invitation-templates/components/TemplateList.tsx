'use client';

import Link from 'next/link';
import { Edit, ExternalLink, Trash2, Mail, Plus, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTemplateStore } from '../store';

export default function TemplateList() {
  const router = useRouter();
  const { templates, openModal, deleteTemplate } = useTemplateStore();

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa mẫu này không?')) {
      const res = await deleteTemplate(id);
      if (res.success) {
        alert('Xóa thành công');
        router.refresh();
      } else {
        alert(res.error || 'Có lỗi xảy ra khi xóa');
      }
    }
  };

  return (
    <div className="bg-[#0a1520] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative z-10 w-full">
      <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-[#162a40]/50 backdrop-blur-md">
        <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
          <Mail className="text-[#c19d68]" size={18} />
          Quản lý Mẫu Thư Mời
        </h3>
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
            onClick={() => openModal()}
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
              <th className="px-4 py-3 font-semibold text-center">Ảnh nền</th>
              <th className="px-4 py-3 font-semibold">Tên Mẫu</th>
              <th className="px-4 py-3 font-semibold">Đường dẫn (Slug)</th>
              <th className="px-4 py-3 font-semibold">Cấu hình</th>
              <th className="px-4 py-3 font-semibold">Thời gian</th>
              <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {templates.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500 italic">
                  Chưa có dữ liệu nào.
                </td>
              </tr>
            ) : (
              templates.map(template => (
                <tr key={template.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-4 py-3 text-center text-xs text-gray-500">{template.id}</td>
                  <td className="px-4 py-3 text-center">
                    {template.background_url ? (
                      <a href={template.background_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-[#c19d68]/10 text-[#c19d68] hover:bg-[#c19d68]/20 text-xs font-medium transition-colors">
                        Xem ảnh
                      </a>
                    ) : (
                      <span className="text-gray-500 text-xs italic">Trống</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{template.name}</td>
                  <td className="px-4 py-3">/invitations/{template.slug}</td>
                  <td className="px-4 py-3 text-gray-400">
                    <div className="flex gap-2 items-center">
                      {template.has_avatar ? (
                        <span className="text-green-400/90 bg-green-400/10 px-2 py-0.5 rounded text-xs">Avatar: Bật</span>
                      ) : (
                        <span className="text-red-400/90 bg-red-400/10 px-2 py-0.5 rounded text-xs">Avatar: Tắt</span>
                      )}
                      {template.save_user_info !== false ? (
                        <span className="text-blue-400/90 bg-blue-400/10 px-2 py-0.5 rounded text-xs">Lưu Data</span>
                      ) : (
                        <span className="text-yellow-400/90 bg-yellow-400/10 px-2 py-0.5 rounded text-xs">Không lưu</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(template.created_at || '').toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/invitations/${template.slug}`}
                        target="_blank"
                        className="p-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/30 rounded-md transition-colors"
                        title="Xem trang hiển thị"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <button 
                        onClick={() => openModal(template)}
                        className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/30 rounded-md transition-colors"
                        title="Sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(template.id)}
                        className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/30 rounded-md transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
