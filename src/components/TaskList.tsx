import React from 'react';
import { 
  Calendar, 
  ExternalLink, 
  MessageSquare, 
  Edit, 
  Trash2, 
  FileCheck2, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  Plus,
  Link2,
  Users
} from 'lucide-react';
import { Task, Member, TaskStatus } from '../types';
import { formatDateVN, getDaysRemaining, getStatusInfo, getPriorityInfo, getDomainFromUrl } from '../utils';

interface TaskListProps {
  tasks: Task[];
  members: Member[];
  onOpenReportModal: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onChangeTaskStatus: (taskId: string, status: TaskStatus) => void;
  onOpenCreateTaskModal: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  members,
  onOpenReportModal,
  onEditTask,
  onDeleteTask,
  onChangeTaskStatus,
  onOpenCreateTaskModal,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pink-200 bg-white p-12 text-center shadow-xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-500 mb-3">
          <FileCheck2 className="h-7 w-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Không tìm thấy công việc nào</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          Không có công việc phù hợp với bộ lọc hiện tại hoặc chưa có công việc nào được tạo.
        </p>
        <button
          onClick={onOpenCreateTaskModal}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-pink-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-pink-600 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo công việc đầu tiên</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const statusInfo = getStatusInfo(task.status);
        const priorityInfo = getPriorityInfo(task.priority);
        const daysInfo = getDaysRemaining(task.dueDate);
        const assignedMembers = members.filter((m) => task.assignedMemberIds?.includes(m.id));
        const hasReport = Boolean(task.reportLink && task.reportLink.trim());
        const commentsCount = task.comments?.length || 0;

        return (
          <div
            key={task.id}
            className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-pink-100 bg-white p-4 sm:p-5 shadow-2xs hover:border-pink-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Left Info: Title, Priority, Status, Description */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Dropdown */}
                  <select
                    value={task.status}
                    onChange={(e) => onChangeTaskStatus(task.id, e.target.value as TaskStatus)}
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold cursor-pointer transition focus:outline-none ${statusInfo.badgeClass}`}
                  >
                    <option value="todo">⚪ Chưa bắt đầu</option>
                    <option value="in_progress">🟡 Đang thực hiện</option>
                    <option value="review">🟠 Chờ duyệt kết quả</option>
                    <option value="completed">🟢 Đã hoàn thành</option>
                  </select>

                  {/* Priority */}
                  <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${priorityInfo.badgeClass}`}>
                    {priorityInfo.label}
                  </span>

                  {/* Overdue Warning */}
                  {daysInfo.isOverdue && task.status !== 'completed' && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 text-[11px] font-bold text-rose-700 animate-pulse">
                      <AlertTriangle className="h-3 w-3" />
                      {daysInfo.text}
                    </span>
                  )}
                </div>

                <div>
                  <h4
                    onClick={() => onOpenReportModal(task)}
                    className="text-base font-bold text-slate-900 hover:text-pink-600 transition cursor-pointer"
                  >
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Meta details: Assigned members & Dates */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                  {/* Assignees */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">Giao cho:</span>
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {assignedMembers.length > 0 ? (
                        assignedMembers.map((m) => (
                          <div
                            key={m.id}
                            title={`${m.name} (${m.role})`}
                            className={`flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-tr ${m.color} text-[10px] font-bold text-white ring-2 ring-white shadow-2xs`}
                          >
                            {m.avatar}
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">Chưa giao</span>
                      )}
                    </div>
                    {assignedMembers.length > 0 && (
                      <span className="font-semibold text-slate-700 ml-1 text-[11px]">
                        {assignedMembers.map((m) => m.name).join(', ')}
                      </span>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-pink-500" />
                    <span>
                      {formatDateVN(task.startDate)} → <strong className="text-slate-800">{formatDateVN(task.dueDate)}</strong>
                    </span>
                    {!daysInfo.isOverdue && task.status !== 'completed' && (
                      <span className="text-[11px] text-pink-600 font-medium ml-1">
                        ({daysInfo.text})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Report Link & Comments Interactive Controls */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-pink-50">
                
                {/* Report Link Pill */}
                {hasReport ? (
                  <button
                    onClick={() => onOpenReportModal(task)}
                    className="flex items-center gap-2 rounded-xl border border-pink-200 bg-pink-50/70 hover:bg-pink-100/80 px-3 py-2 text-xs font-semibold text-pink-800 transition cursor-pointer shadow-2xs group/report"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-md bg-pink-500 text-white shadow-2xs">
                      <FileCheck2 className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1">
                        <span>Link báo cáo</span>
                        <ExternalLink className="h-3 w-3 text-pink-600" />
                      </div>
                      <span className="text-[10px] text-pink-600 font-normal truncate max-w-[120px] block">
                        {getDomainFromUrl(task.reportLink)}
                      </span>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenReportModal(task)}
                    className="flex items-center gap-1.5 rounded-xl border border-dashed border-pink-300 bg-white hover:bg-pink-50/60 px-3 py-2 text-xs font-semibold text-pink-600 transition cursor-pointer"
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    <span>Nộp link báo cáo</span>
                  </button>
                )}

                {/* Comments Trigger Button */}
                <button
                  onClick={() => onOpenReportModal(task)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition cursor-pointer ${
                    commentsCount > 0
                      ? 'border-pink-200 bg-white text-pink-700 hover:bg-pink-50 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                  title="Xem và gửi bình luận kết quả"
                >
                  <MessageSquare className={`h-3.5 w-3.5 ${commentsCount > 0 ? 'text-pink-500' : 'text-slate-400'}`} />
                  <span>{commentsCount > 0 ? `${commentsCount} bình luận` : 'Bình luận'}</span>
                </button>

                {/* Edit & Delete Action icons */}
                <div className="flex items-center gap-1 ml-auto sm:ml-0">
                  <button
                    onClick={() => onEditTask(task)}
                    className="p-2 rounded-lg text-slate-400 hover:bg-pink-50 hover:text-pink-600 transition cursor-pointer"
                    title="Chỉnh sửa công việc"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Bạn có chắc chắn muốn xóa công việc "${task.title}" không?`)) {
                        onDeleteTask(task.id);
                      }
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                    title="Xóa công việc"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};
