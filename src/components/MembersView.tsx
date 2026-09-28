import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  Briefcase, 
  Building, 
  CheckCircle2, 
  Clock, 
  Edit2, 
  Trash2, 
  Search,
  FileCheck2,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Member, Task } from '../types';
import { formatDateVN } from '../utils';

interface MembersViewProps {
  members: Member[];
  tasks: Task[];
  activeMember: Member | null;
  onSelectActiveMember: (memberId: string) => void;
  onOpenCreateMemberModal: () => void;
  onEditMember: (member: Member) => void;
  onDeleteMember: (memberId: string) => void;
  onOpenReportModal: (task: Task) => void;
}

export const MembersView: React.FC<MembersViewProps> = ({
  members,
  tasks,
  activeMember,
  onSelectActiveMember,
  onOpenCreateMemberModal,
  onEditMember,
  onDeleteMember,
  onOpenReportModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-linear-to-r from-pink-500 via-rose-500 to-pink-600 p-6 text-white shadow-md shadow-pink-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            <h3 className="text-xl font-bold">Đội ngũ & Thành viên ({members.length})</h3>
          </div>
          <p className="text-xs sm:text-sm text-pink-100 max-w-xl">
            Quản lý danh sách nhân sự, phân công đầu việc, theo dõi tiến độ hoàn thành và phân quyền nhận xét báo cáo kết quả.
          </p>
        </div>

        <button
          onClick={onOpenCreateMemberModal}
          className="self-start sm:self-center inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-pink-600 shadow-md hover:bg-pink-50 active:scale-95 transition cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>Thêm thành viên</span>
        </button>
      </div>

      {/* Member Search Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, chức danh, phòng ban..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-pink-200 bg-white py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Hiển thị: <strong>{filteredMembers.length}</strong> / {members.length} thành viên
        </span>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredMembers.map((member) => {
          const memberTasks = tasks.filter((t) => t.assignedMemberIds?.includes(member.id));
          const completedTasks = memberTasks.filter((t) => t.status === 'completed');
          const inProgressTasks = memberTasks.filter((t) => t.status === 'in_progress' || t.status === 'review');
          const completionRate = memberTasks.length > 0 ? Math.round((completedTasks.length / memberTasks.length) * 100) : 0;
          const isActive = activeMember?.id === member.id;

          return (
            <div
              key={member.id}
              className={`flex flex-col rounded-2xl border bg-white p-5 shadow-2xs hover:shadow-md transition duration-200 ${
                isActive ? 'border-pink-500 ring-2 ring-pink-400/30' : 'border-pink-100 hover:border-pink-200'
              }`}
            >
              {/* Card Top: Avatar & Details & Actions */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-tr ${member.color} text-base font-bold text-white shadow-md shadow-pink-500/20`}
                  >
                    {member.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">{member.name}</h4>
                      {isActive && (
                        <span className="rounded-md bg-pink-100 px-1.5 py-0.5 text-[10px] font-bold text-pink-700">
                          Bạn
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-pink-600">{member.role}</p>
                    <p className="text-[11px] text-slate-400">{member.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditMember(member)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-pink-50 hover:text-pink-600 transition cursor-pointer"
                    title="Chỉnh sửa thông tin"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Bạn có chắc chắn muốn xóa thành viên "${member.name}" không?`)) {
                        onDeleteMember(member.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                    title="Xóa thành viên"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Contact info */}
              <div className="mt-4 space-y-1.5 text-xs text-slate-500 bg-pink-50/30 p-2.5 rounded-xl border border-pink-100/60">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-pink-400" />
                  <span className="truncate">{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-pink-400" />
                    <span>{member.phone}</span>
                  </div>
                )}
              </div>

              {/* Task Workload & Progress */}
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Khối lượng công việc:</span>
                  <span className="font-bold text-pink-600">{memberTasks.length} đầu việc</span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Hoàn thành: {completedTasks.length}/{memberTasks.length}</span>
                    <span className="font-bold text-slate-700">{completionRate}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-pink-100">
                    <div
                      className="h-full bg-linear-to-r from-pink-500 to-rose-600 rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Assigned Tasks preview */}
              <div className="mt-4 flex-1 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Công việc đang phụ trách ({memberTasks.length}):
                </p>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {memberTasks.length === 0 ? (
                    <p className="text-xs italic text-slate-400 py-1">Hiện chưa được giao việc nào.</p>
                  ) : (
                    memberTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => onOpenReportModal(t)}
                        className="flex items-center justify-between rounded-lg p-2 text-xs bg-slate-50 hover:bg-pink-50 border border-slate-100 hover:border-pink-200 transition cursor-pointer"
                      >
                        <span className="truncate font-medium text-slate-700 max-w-[190px]">
                          {t.title}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          {t.reportLink && <FileCheck2 className="h-3 w-3 text-pink-500" />}
                          <span className="text-[10px] text-slate-400">{formatDateVN(t.dueDate)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Switch persona button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onSelectActiveMember(member.id)}
                  className={`w-full py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-pink-100 text-pink-700 border border-pink-200'
                      : 'border border-slate-200 text-slate-600 hover:border-pink-300 hover:bg-pink-50'
                  }`}
                >
                  {isActive ? '✓ Đang là tài khoản hiện tại' : 'Thao tác với tư cách thành viên này'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
