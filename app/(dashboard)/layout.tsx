'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Trophy, Ticket, LogOut, ChevronLeft, ChevronRight, Menu, X, Palette } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Thư mời', href: '/dashboard', icon: Ticket },
    { name: 'Mẫu Thư mời', href: '/dashboard/invitation-templates', icon: Palette },
    { name: 'Quản lý Avatar', href: '/dashboard/avatar', icon: Users },
    { name: 'Dữ liệu MXH (Upstash)', href: '/dashboard/social', icon: Users },
  ];

  return (
    <section className="flex min-h-screen bg-[#0a1520] text-gray-100 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`bg-[#0e1e2e] border-r border-white/10 flex flex-col shrink-0 fixed h-full z-40 transition-all duration-300 
        ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} 
        md:translate-x-0 ${isCollapsed ? 'md:w-20' : 'md:w-64'}`
      }>
        <div className="p-6 border-b border-white/10 flex items-center justify-between relative">
          <span className={`text-2xl font-bold text-[#c19d68] uppercase tracking-wider font-avo-bold whitespace-nowrap ${isCollapsed ? 'hidden md:block md:text-xl md:mx-auto' : ''}`}>
            {isCollapsed ? 'FN' : 'FENICA'}
          </span>
          
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden md:flex absolute -right-3 top-7 bg-[#162a40] text-white p-1 rounded-full border border-white/10 hover:bg-[#c19d68] transition-colors z-20 shadow-lg">
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
          
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-3">
          <div className={`text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-3 ${isCollapsed ? 'md:hidden' : ''}`}>Quản trị</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                title={item.name}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center ${isCollapsed ? 'md:justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors font-medium text-sm ${isActive ? 'bg-[#c19d68]/20 text-[#c19d68]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon size={20} className="shrink-0" />
                <span className={`whitespace-nowrap truncate ${isCollapsed ? 'md:hidden' : ''}`}>{item.name}</span>
              </Link>
            )
          })}

          <div className={`text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-3 mt-6 ${isCollapsed ? 'md:hidden' : ''}`}>Public</div>
          <Link 
            href="/ranking"
            title="Bảng xếp hạng"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center ${isCollapsed ? 'md:justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors font-medium text-sm text-gray-400 hover:text-white hover:bg-white/5 ${isCollapsed ? 'md:mt-6' : ''}`}
          >
            <Trophy size={20} className="shrink-0" />
            <span className={`whitespace-nowrap ${isCollapsed ? 'md:hidden' : ''}`}>Bảng xếp hạng</span>
          </Link>
          <Link 
            href="/"
            title="Trang tạo thẻ"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center ${isCollapsed ? 'md:justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors font-medium text-sm text-gray-400 hover:text-white hover:bg-white/5`}
          >
            <LayoutDashboard size={20} className="shrink-0" />
            <span className={`whitespace-nowrap ${isCollapsed ? 'md:hidden' : ''}`}>Trang tạo thẻ</span>
          </Link>
        </div>
        <div className="p-4 border-t border-white/10">
          <Link 
            href="/"
            title="Thoát"
            className={`flex items-center ${isCollapsed ? 'md:justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors font-medium text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10`}
          >
            <LogOut size={20} className="shrink-0" />
            <span className={`whitespace-nowrap ${isCollapsed ? 'md:hidden' : ''}`}>Thoát</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col min-h-screen min-w-0 relative z-0 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <header className="md:hidden border-b border-white/10 bg-[#0e1e2e] p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#c19d68] to-[#ac8d45] flex items-center justify-center font-bold text-white shadow-lg">F</div>
            <span className="text-xl font-bold text-[#c19d68] uppercase tracking-wider font-avo-bold">FENICA</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-400 hover:text-white p-1">
            <Menu size={24} />
          </button>
        </header>
        <div className="flex-1 p-3 sm:p-4 lg:p-8 relative min-w-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c19d68]/5 rounded-full blur-3xl pointer-events-none"></div>
          {children}
        </div>
      </main>
    </section>
  );
}
