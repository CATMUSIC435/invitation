'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addInvitationAction, updateInvitationAction, deleteInvitationAction } from './actions';
import { Plus, Edit2, Trash2, Check, X, RefreshCw } from 'lucide-react';

type Invitation = {
  id: number;
  slug: string;
  name: string;
  title: string;
  image_url: string | null;
  created_at: Date | null;
};

export default function AdminTable({ data }: { data: Invitation[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', title: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', title: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleEdit = (inv: Invitation) => {
    setEditingId(inv.id);
    setEditForm({ name: inv.name, title: inv.title });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id: number) => {
    if (!editForm.name || !editForm.title) return alert('Vui lòng điền đủ thông tin');
    setIsLoading(true);
    await updateInvitationAction(id, editForm.name, editForm.title);
    setEditingId(null);
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa thư mời này không?')) {
      setIsLoading(true);
      await deleteInvitationAction(id);
      setIsLoading(false);
    }
  };

  const handleSaveAdd = async () => {
    if (!addForm.name || !addForm.title) return alert('Vui lòng điền đủ thông tin');
    setIsLoading(true);
    await addInvitationAction(addForm.name, addForm.title);
    setIsAdding(false);
    setAddForm({ name: '', title: '' });
    setIsLoading(false);
  };

  return (
    <div className="bg-[#0a1520] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-[#162a40]/50 backdrop-blur-md">
        <h3 className="text-white font-bold text-sm uppercase tracking-wider">Quản lý Dữ liệu</h3>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
          <button 
            onClick={() => {
              setIsLoading(true);
              router.refresh();
              setTimeout(() => setIsLoading(false), 500);
            }}
            className="flex items-center gap-2 bg-[#1a2d42] hover:bg-[#233a54] text-gray-300 text-sm px-3 sm:px-4 py-2 font-medium transition-all rounded-lg border border-white/10"
            disabled={isLoading}
            title="Tải lại dữ liệu"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Tải lại</span>
          </button>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#c19d68] to-[#ac8d45] hover:from-[#d3b27d] hover:to-[#c19d68] text-white text-sm px-3 sm:px-4 py-2 font-bold transition-all rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            disabled={isLoading}
          >
            {isAdding ? <><X size={16}/> Hủy</> : <><Plus size={16}/> Thêm mới</>}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-[#1a2d42] text-gray-400 uppercase text-xs border-b border-white/10">
            <tr>
              <th className="px-4 py-3 font-semibold w-16 text-center">ID</th>
              <th className="px-4 py-3 font-semibold">Họ và tên</th>
              <th className="px-4 py-3 font-semibold">Chức vụ</th>
              <th className="px-4 py-3 font-semibold text-center">Ảnh</th>
              <th className="px-4 py-3 font-semibold">Ngày tạo</th>
              <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isAdding && (
              <tr className="bg-[#c19d68]/10">
                <td className="px-4 py-3 text-center text-xs text-[#c19d68] font-bold">Mới</td>
                <td className="px-4 py-3">
                  <input 
                    type="text" 
                    value={addForm.name} 
                    onChange={e => setAddForm({...addForm, name: e.target.value})}
                    placeholder="Họ và tên..."
                    className="w-full bg-[#0a1520] border border-white/20 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#c19d68] focus:ring-1 focus:ring-[#c19d68]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input 
                    type="text" 
                    value={addForm.title} 
                    onChange={e => setAddForm({...addForm, title: e.target.value})}
                    placeholder="Chức vụ..."
                    className="w-full bg-[#0a1520] border border-white/20 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#c19d68] focus:ring-1 focus:ring-[#c19d68]"
                  />
                </td>
                <td className="px-4 py-3 text-center text-xs text-gray-500">-</td>
                <td className="px-4 py-3 text-xs text-gray-500">-</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={handleSaveAdd} disabled={isLoading} className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 px-3 py-1.5 rounded-md font-medium text-xs transition-colors">
                    <Check size={14}/> Lưu
                  </button>
                </td>
              </tr>
            )}

            {currentData.length === 0 && !isAdding ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500 italic">
                  Chưa có dữ liệu nào.
                </td>
              </tr>
            ) : (
              currentData.map((invitation) => (
                <tr key={invitation.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-4 py-3 text-center text-xs text-gray-500">{invitation.id}</td>
                  <td className="px-4 py-3 font-medium text-white">
                    {editingId === invitation.id ? (
                      <input 
                        type="text" 
                        value={editForm.name} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                        className="w-full bg-[#0a1520] border border-[#c19d68] rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c19d68]"
                      />
                    ) : (
                      invitation.name
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === invitation.id ? (
                      <input 
                        type="text" 
                        value={editForm.title} 
                        onChange={e => setEditForm({...editForm, title: e.target.value})}
                        className="w-full bg-[#0a1520] border border-[#c19d68] rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c19d68]"
                      />
                    ) : (
                      invitation.title
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {invitation.image_url ? (
                      <a 
                        href={invitation.image_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-[#c19d68]/10 text-[#c19d68] hover:bg-[#c19d68]/20 text-xs font-medium transition-colors"
                      >
                        Xem ảnh
                      </a>
                    ) : (
                      <span className="text-gray-500 text-xs italic">Trống</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {invitation.created_at ? new Date(invitation.created_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : ''}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      {editingId === invitation.id ? (
                        <>
                          <button onClick={() => handleSaveEdit(invitation.id)} disabled={isLoading} className="p-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/40 rounded-md transition-colors" title="Lưu">
                            <Check size={16} />
                          </button>
                          <button onClick={handleCancelEdit} disabled={isLoading} className="p-1.5 bg-gray-500/20 text-gray-400 hover:bg-gray-500/40 rounded-md transition-colors" title="Hủy">
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(invitation)} disabled={isLoading} className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/30 rounded-md transition-colors" title="Sửa">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(invitation.id)} disabled={isLoading} className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/30 rounded-md transition-colors" title="Xóa">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-[#0e1e2e]">
          <div className="text-sm text-gray-400">
            Hiển thị <span className="text-white font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="text-white font-medium">{Math.min(currentPage * itemsPerPage, data.length)}</span> trong số <span className="text-white font-medium">{data.length}</span> kết quả
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 rounded-md text-gray-300 transition-colors"
            >
              Trước
            </button>
            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md text-sm transition-colors ${currentPage === i + 1 ? 'bg-[#c19d68] text-[#0a1520] font-bold' : 'text-gray-400 hover:bg-white/5'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 rounded-md text-gray-300 transition-colors"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
