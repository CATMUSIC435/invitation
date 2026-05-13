'use client';

import Link from 'next/link';
import { Edit, ExternalLink, Trash2 } from 'lucide-react';
import { deleteInvitationTemplate } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useTemplateStore } from '../store';

export default function TemplateList() {
  const router = useRouter();
  const { templates, openModal } = useTemplateStore();

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

  return (
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
                      onClick={() => openModal(template)}
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
  );
}
