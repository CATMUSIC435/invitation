'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSocialDataAction, deleteSocialDataAction } from './actions';
import { Plus, Edit2, Trash2, Check, X, RefreshCw } from 'lucide-react';

export default function SocialTable({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<any>({ key: 'scraped_data:new_user', username: '', platform: 'tiktok', views: 0, likes: 0, comments: 0, shares: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(initialData.length / itemsPerPage);
  const currentData = initialData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleEdit = (item: any) => {
    setEditingKey(item.key);
    const data = item.data?.result?.data || {};
    setEditForm({ 
      username: data.username || data.nickname || '',
      platform: item.data?.result?.platform || 'tiktok',
      views: data.views || 0,
      likes: data.likes || 0,
      comments: data.comments || 0,
      shares: data.shares || 0,
      rawItem: item
    });
  };

  const handleSaveEdit = async () => {
    if (!editForm.username) return alert('Vui lòng điền đủ thông tin');
    setIsLoading(true);
    
    // Merge new values into raw object
    const updatedRaw = { ...editForm.rawItem.data };
    if (!updatedRaw.result) updatedRaw.result = { data: {} };
    if (!updatedRaw.result.data) updatedRaw.result.data = {};
    
    updatedRaw.result.platform = editForm.platform;
    updatedRaw.result.data.username = editForm.username;
    updatedRaw.result.data.views = editForm.views.toString();
    updatedRaw.result.data.likes = editForm.likes.toString();
    updatedRaw.result.data.comments = editForm.comments.toString();
    updatedRaw.result.data.shares = editForm.shares.toString();

    await saveSocialDataAction(editingKey!, updatedRaw);
    setEditingKey(null);
    setIsLoading(false);
  };

  const handleDelete = async (key: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
      setIsLoading(true);
      await deleteSocialDataAction(key);
      setIsLoading(false);
    }
  };

  const handleSaveAdd = async () => {
    if (!addForm.username || !addForm.key) return alert('Vui lòng điền đủ thông tin');
    setIsLoading(true);
    
    const newRecord = {
      url: `https://example.com/@${addForm.username}`,
      result: {
        platform: addForm.platform,
        data: {
          username: addForm.username,
          views: addForm.views.toString(),
          likes: addForm.likes.toString(),
          comments: addForm.comments.toString(),
          shares: addForm.shares.toString(),
          cover: ""
        }
      }
    };

    await saveSocialDataAction(addForm.key, newRecord);
    setIsAdding(false);
    setAddForm({ key: `scraped_data:new_${Date.now()}`, username: '', platform: 'tiktok', views: 0, likes: 0, comments: 0, shares: 0 });
    setIsLoading(false);
  };

  return (
    <div className="bg-[#0a1520] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-[#162a40]/50 backdrop-blur-md">
        <h3 className="text-white font-bold text-sm uppercase tracking-wider">Quản lý Dữ liệu MXH</h3>
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
              <th className="px-4 py-3 font-semibold">Key / Redis</th>
              <th className="px-4 py-3 font-semibold">Username</th>
              <th className="px-4 py-3 font-semibold">Nền tảng</th>
              <th className="px-4 py-3 font-semibold">Views</th>
              <th className="px-4 py-3 font-semibold">Likes</th>
              <th className="px-4 py-3 font-semibold">Comments</th>
              <th className="px-4 py-3 font-semibold">Shares</th>
              <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isAdding && (
              <tr className="bg-[#c19d68]/10">
                <td className="px-4 py-3">
                  <input 
                    type="text" 
                    value={addForm.key} 
                    onChange={e => setAddForm({...addForm, key: e.target.value})}
                    placeholder="scraped_data:xxx"
                    className="w-full bg-[#0a1520] border border-white/20 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#c19d68] focus:ring-1 focus:ring-[#c19d68]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input 
                    type="text" 
                    value={addForm.username} 
                    onChange={e => setAddForm({...addForm, username: e.target.value})}
                    placeholder="Username..."
                    className="w-full bg-[#0a1520] border border-white/20 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#c19d68] focus:ring-1 focus:ring-[#c19d68]"
                  />
                </td>
                <td className="px-4 py-3">
                  <select 
                    value={addForm.platform} 
                    onChange={e => setAddForm({...addForm, platform: e.target.value})}
                    className="w-full bg-[#0a1520] border border-white/20 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#c19d68] focus:ring-1 focus:ring-[#c19d68]"
                  >
                    <option value="tiktok">TikTok</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input 
                    type="number" 
                    value={addForm.views} 
                    onChange={e => setAddForm({...addForm, views: parseInt(e.target.value) || 0})}
                    className="w-full bg-[#0a1520] border border-white/20 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#c19d68] focus:ring-1 focus:ring-[#c19d68]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input 
                    type="number" 
                    value={addForm.likes} 
                    onChange={e => setAddForm({...addForm, likes: parseInt(e.target.value) || 0})}
                    className="w-full bg-[#0a1520] border border-white/20 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#c19d68] focus:ring-1 focus:ring-[#c19d68]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input 
                    type="number" 
                    value={addForm.comments} 
                    onChange={e => setAddForm({...addForm, comments: parseInt(e.target.value) || 0})}
                    className="w-full bg-[#0a1520] border border-white/20 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#c19d68] focus:ring-1 focus:ring-[#c19d68]"
                  />
                </td>
                <td className="px-4 py-3">
                  <input 
                    type="number" 
                    value={addForm.shares} 
                    onChange={e => setAddForm({...addForm, shares: parseInt(e.target.value) || 0})}
                    className="w-full bg-[#0a1520] border border-white/20 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#c19d68] focus:ring-1 focus:ring-[#c19d68]"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={handleSaveAdd} disabled={isLoading} className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 px-3 py-1.5 rounded-md font-medium text-xs transition-colors">
                    <Check size={14}/> Lưu
                  </button>
                </td>
              </tr>
            )}

            {currentData.length === 0 && !isAdding ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500 italic">
                  Chưa có dữ liệu MXH nào.
                </td>
              </tr>
            ) : (
              currentData.map((item) => {
                const data = item.data?.result?.data || {};
                const isEditing = editingKey === item.key;

                return (
                  <tr key={item.key} className="hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-3 text-xs text-gray-400 font-mono truncate max-w-[120px]" title={item.key}>{item.key}</td>
                    
                    <td className="px-4 py-3 font-medium text-white">
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editForm.username} 
                          onChange={e => setEditForm({...editForm, username: e.target.value})}
                          className="w-full bg-[#0a1520] border border-[#c19d68] rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c19d68]"
                        />
                      ) : (
                        data.username || data.nickname || 'N/A'
                      )}
                    </td>

                    <td className="px-4 py-3 text-xs">
                      {isEditing ? (
                        <select 
                          value={editForm.platform} 
                          onChange={e => setEditForm({...editForm, platform: e.target.value})}
                          className="w-full bg-[#0a1520] border border-[#c19d68] rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c19d68]"
                        >
                          <option value="tiktok">TikTok</option>
                          <option value="facebook">Facebook</option>
                        </select>
                      ) : (
                        item.data?.result?.platform || 'N/A'
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={editForm.views} 
                          onChange={e => setEditForm({...editForm, views: parseInt(e.target.value) || 0})}
                          className="w-full bg-[#0a1520] border border-[#c19d68] rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c19d68]"
                        />
                      ) : (
                        new Intl.NumberFormat('vi-VN').format(data.views || 0)
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={editForm.likes} 
                          onChange={e => setEditForm({...editForm, likes: parseInt(e.target.value) || 0})}
                          className="w-full bg-[#0a1520] border border-[#c19d68] rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c19d68]"
                        />
                      ) : (
                        new Intl.NumberFormat('vi-VN').format(data.likes || 0)
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={editForm.comments} 
                          onChange={e => setEditForm({...editForm, comments: parseInt(e.target.value) || 0})}
                          className="w-full bg-[#0a1520] border border-[#c19d68] rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c19d68]"
                        />
                      ) : (
                        new Intl.NumberFormat('vi-VN').format(data.comments || 0)
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input 
                          type="number" 
                          value={editForm.shares} 
                          onChange={e => setEditForm({...editForm, shares: parseInt(e.target.value) || 0})}
                          className="w-full bg-[#0a1520] border border-[#c19d68] rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c19d68]"
                        />
                      ) : (
                        new Intl.NumberFormat('vi-VN').format(data.shares || 0)
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        {isEditing ? (
                          <>
                            <button onClick={handleSaveEdit} disabled={isLoading} className="p-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/40 rounded-md transition-colors" title="Lưu">
                              <Check size={16} />
                            </button>
                            <button onClick={() => setEditingKey(null)} disabled={isLoading} className="p-1.5 bg-gray-500/20 text-gray-400 hover:bg-gray-500/40 rounded-md transition-colors" title="Hủy">
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEdit(item)} disabled={isLoading} className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/30 rounded-md transition-colors" title="Sửa">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(item.key)} disabled={isLoading} className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/30 rounded-md transition-colors" title="Xóa">
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-[#0e1e2e]">
          <div className="text-sm text-gray-400">
            Hiển thị <span className="text-white font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="text-white font-medium">{Math.min(currentPage * itemsPerPage, initialData.length)}</span> trong số <span className="text-white font-medium">{initialData.length}</span> kết quả
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
