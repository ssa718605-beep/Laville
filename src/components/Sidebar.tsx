import React from 'react';
import { 
  CheckSquare, 
  Users, 
  FileText, 
  Kanban, 
  MessageSquareText, 
  Plus, 
  UserCheck, 
  Sparkles,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { TabType, Member, Task } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  members: Member[];
  tasks: Task[];
  activeMember: Member | null;
  onSelectActiveMember: (memberId: string) => void;
  onOpenCreateTaskModal: () => void;
  onOpenCreateMemberModal: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  members,
  tasks,
  activeMember,
  onSelectActiveMember,
  onOpenCreateTaskModal,
  onOpenCreateMemberModal,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const reportedTasksCount = tasks.filter(t => Boolean(t.reportLink && t.reportLink.trim())).length;
  const totalCommentsCount = tasks.reduce((sum, t) => sum + (t.comments?.length || 0), 0);
  const pendingTasksCount = tasks.filter(t => t.status !== 'completed').length;

  const navItems = [
    {
      id: 'tasks' as TabType,
      label: 'Danh sách công việc',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined,
      badgeColor: 'bg-pink-100 text-pink-700',
    },
    {
      id: 'board' as TabType,
      label: 'Bảng tiến độ (Kanban)',
      icon: Kanban,
      badge: `${tasks.length}`,
      badgeColor: 'bg-slate-100 text-slate-600',
    },
    {
      id: 'members' as TabType,
      label: 'Quản lý thành viên',
      icon: Users,
      badge: `${members.length}`,
      badgeColor: 'bg-pink-100 text-pink-700',
    },
    {
      id: 'reports' as TabType,
      label: 'Báo cáo & Kết quả',
      icon: FileText,
      badge: `${reportedTasksCount}/${tasks.length}`,
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'comments' as TabType,
      label: 'Bình luận báo cáo',
      icon: MessageSquareText,
      badge: `${totalCommentsCount}`,
      badgeColor: 'bg-rose-100 text-rose-700',
    },
  ];

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          id="sidebar-backdrop"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-white border-r border-pink-200 shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* App Logo & Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-pink-100 bg-linear-to-r from-pink-50/70 to-rose-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-pink-500 to-rose-600 text-white shadow-md shadow-pink-500/25">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold text-slate-800 tracking-tight">PinkTask</h1>
                <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-semibold text-pink-700 border border-pink-200">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Quản lý công việc & nhóm</p>
            </div>
          </div>

          <button
            id="close-mobile-sidebar-btn"
            onClick={() => setIsMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-pink-100 hover:text-pink-600 lg:hidden"
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-pink-100 space-y-2">
          <button
            id="sidebar-create-task-btn"
            onClick={() => {
              onOpenCreateTaskModal();
              if (isMobileOpen) setIsMobileOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-pink-500 to-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-pink-500/20 hover:from-pink-600 hover:to-rose-700 active:scale-[0.98] transition cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Giao việc mới</span>
          </button>
        </div>

        {/* Navigation Features (Slide bar bên trái) */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-pink-600/80">
            Chức năng chính
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-pink-500 text-white shadow-md shadow-pink-500/25 font-semibold'
                    : 'text-slate-600 hover:bg-pink-50 hover:text-pink-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-5 w-5 transition ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-pink-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-5 px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-pink-600/80">
            Thao tác nhanh
          </div>

          <button
            id="sidebar-add-member-action-btn"
            onClick={() => {
              onOpenCreateMemberModal();
              if (isMobileOpen) setIsMobileOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-pink-50 hover:text-pink-700 transition cursor-pointer"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-100 text-pink-700">
              <Plus className="h-4 w-4" />
            </div>
            <span>Thêm thành viên mới</span>
          </button>
        </div>

        {/* Active User Switcher (Persona) at Footer */}
        <div className="p-4 border-t border-pink-100 bg-pink-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5 text-pink-600" />
              Tài khoản thao tác:
            </span>
          </div>

          <div className="relative">
            <select
              id="active-user-select"
              value={activeMember?.id || ''}
              onChange={(e) => onSelectActiveMember(e.target.value)}
              className="w-full appearance-none rounded-xl border border-pink-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-slate-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 shadow-xs cursor-pointer"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - ({m.role})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-pink-500">
              <ChevronRight className="h-4 w-4 rotate-90" />
            </div>
          </div>

          {activeMember && (
            <div className="mt-2.5 flex items-center gap-2.5 rounded-lg bg-white p-2 border border-pink-100 shadow-2xs">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-tr ${activeMember.color} text-xs font-bold text-white shadow-xs`}
              >
                {activeMember.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-800">{activeMember.name}</p>
                <p className="truncate text-[11px] text-pink-600">{activeMember.role}</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
