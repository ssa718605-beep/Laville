import React from 'react';
import { 
  Search, 
  Menu, 
  Plus, 
  Filter, 
  SlidersHorizontal,
  X
} from 'lucide-react';
import { TabType, FilterState } from '../types';

interface HeaderProps {
  activeTab: TabType;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  onOpenMobileSidebar: () => void;
  onOpenCreateTaskModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  filterState,
  setFilterState,
  onOpenMobileSidebar,
  onOpenCreateTaskModal,
}) => {
  const getTabHeading = () => {
    switch (activeTab) {
      case 'tasks':
        return {
          title: 'Danh sách công việc',
          subtitle: 'Giao việc, theo dõi ngày bắt đầu - hoàn thành và link báo cáo',
        };
      case 'board':
        return {
          title: 'Bảng tiến độ công việc',
          subtitle: 'Theo dõi luồng thực hiện từ Chưa bắt đầu đến Hoàn thành',
        };
      case 'members':
        return {
          title: 'Quản lý thành viên',
          subtitle: 'Phân quyền, khối lượng công việc và đội ngũ thực hiện',
        };
      case 'reports':
        return {
          title: 'Báo cáo kết quả công việc',
          subtitle: 'Truy cập link kết quả, tài liệu minh chứng và đánh giá',
        };
      case 'comments':
        return {
          title: 'Thảo luận báo cáo & Nhận xét',
          subtitle: 'Tất cả góp ý, phản hồi trực tiếp trên link báo cáo công việc',
        };
      default:
        return {
          title: 'Quản lý công việc',
          subtitle: 'Không gian làm việc nhóm',
        };
    }
  };

  const { title, subtitle } = getTabHeading();

  return (
    <header className="sticky top-0 z-30 flex flex-col gap-3 border-b border-pink-100 bg-white/90 backdrop-blur-md px-4 py-3 sm:px-6 lg:px-8 shadow-2xs">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            id="mobile-sidebar-toggle-btn"
            onClick={onOpenMobileSidebar}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-pink-200 text-pink-600 hover:bg-pink-50 lg:hidden cursor-pointer"
            aria-label="Mở menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
            <p className="hidden sm:block text-xs sm:text-sm text-slate-500 font-normal">{subtitle}</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="header-create-task-btn"
            onClick={onOpenCreateTaskModal}
            className="flex items-center gap-1.5 rounded-xl bg-pink-500 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-pink-600 active:scale-95 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Giao việc mới</span>
            <span className="sm:hidden">Giao việc</span>
          </button>
        </div>
      </div>

      {/* Global Search & Filters (Shown on tasks, board, and reports) */}
      {(activeTab === 'tasks' || activeTab === 'board' || activeTab === 'reports') && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400" />
            <input
              id="search-tasks-input"
              type="text"
              placeholder="Tìm kiếm công việc, mô tả, báo cáo..."
              value={filterState.search}
              onChange={(e) => setFilterState((prev) => ({ ...prev, search: e.target.value }))}
              className="w-full rounded-xl border border-pink-200 bg-pink-50/40 py-1.5 pl-9 pr-8 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-200 transition"
            />
            {filterState.search && (
              <button
                onClick={() => setFilterState((prev) => ({ ...prev, search: '' }))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <select
              id="filter-status-select"
              value={filterState.status}
              onChange={(e) => setFilterState((prev) => ({ ...prev, status: e.target.value }))}
              className="rounded-lg border border-pink-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-pink-300 focus:border-pink-500 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="todo">Chưa bắt đầu</option>
              <option value="in_progress">Đang thực hiện</option>
              <option value="review">Chờ duyệt kết quả</option>
              <option value="completed">Đã hoàn thành</option>
            </select>

            <select
              id="filter-priority-select"
              value={filterState.priority}
              onChange={(e) => setFilterState((prev) => ({ ...prev, priority: e.target.value }))}
              className="rounded-lg border border-pink-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-pink-300 focus:border-pink-500 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả ưu tiên</option>
              <option value="urgent">Khẩn cấp</option>
              <option value="high">Ưu tiên cao</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
};
