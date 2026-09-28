import React from 'react';
import { 
  Plus, 
  Calendar, 
  MessageSquare, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft, 
  FileCheck2, 
  Link2 
} from 'lucide-react';
import { Task, Member, TaskStatus } from '../types';
import { formatDateVN, getPriorityInfo, getDomainFromUrl } from '../utils';

interface TaskBoardProps {
  tasks: Task[];
  members: Member[];
  onOpenReportModal: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onChangeTaskStatus: (taskId: string, status: TaskStatus) => void;
  onOpenCreateTaskModal: () => void;
}

const COLUMNS: { id: TaskStatus; title: string; color: string; dot: string }[] = [
  { id: 'todo', title: 'Chưa bắt đầu', color: 'border-slate-200 bg-slate-50/70', dot: 'bg-slate-400' },
  { id: 'in_progress', title: 'Đang thực hiện', color: 'border-pink-200 bg-pink-50/50', dot: 'bg-pink-500' },
  { id: 'review', title: 'Chờ duyệt kết quả', color: 'border-amber-200 bg-amber-50/50', dot: 'bg-amber-500' },
  { id: 'completed', title: 'Đã hoàn thành', color: 'border-emerald-200 bg-emerald-50/50', dot: 'bg-emerald-500' },
];

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  members,
  onOpenReportModal,
  onEditTask,
  onChangeTaskStatus,
  onOpenCreateTaskModal,
}) => {
  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'todo') return 'in_progress';
    if (current === 'in_progress') return 'review';
    if (current === 'review') return 'completed';
    return null;
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'completed') return 'review';
    if (current === 'review') return 'in_progress';
    if (current === 'in_progress') return 'todo';
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className={`flex flex-col rounded-2xl border ${col.color} p-3.5 shadow-2xs min-h-[500px]`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-pink-100 mb-3">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
                <h3 className="text-sm font-bold text-slate-800">{col.title}</h3>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-600 shadow-2xs border border-pink-100">
                  {columnTasks.length}
                </span>
              </div>

              {col.id === 'todo' && (
                <button
                  onClick={onOpenCreateTaskModal}
                  className="rounded-lg p-1 text-pink-600 hover:bg-white transition cursor-pointer"
                  title="Thêm nhanh công việc"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Cards in Column */}
            <div className="space-y-3 flex-1">
              {columnTasks.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-pink-200/80 bg-white/40 text-xs text-slate-400 text-center px-4">
                  Không có công việc ở trạng thái này
                </div>
              ) : (
                columnTasks.map((task) => {
                  const priorityInfo = getPriorityInfo(task.priority);
                  const assignedMembers = members.filter((m) => task.assignedMemberIds?.includes(m.id));
                  const hasReport = Boolean(task.reportLink && task.reportLink.trim());
                  const commentsCount = task.comments?.length || 0;
                  const nextStatus = getNextStatus(task.status);
                  const prevStatus = getPrevStatus(task.status);

                  return (
                    <div
                      key={task.id}
                      className="rounded-xl border border-pink-100 bg-white p-3.5 shadow-xs hover:border-pink-300 hover:shadow-md transition space-y-2.5"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between">
                        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${priorityInfo.badgeClass}`}>
                          {priorityInfo.label}
                        </span>

                        {commentsCount > 0 && (
                          <button
                            onClick={() => onOpenReportModal(task)}
                            className="flex items-center gap-1 rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-bold text-pink-700 border border-pink-200 cursor-pointer"
                          >
                            <MessageSquare className="h-3 w-3 text-pink-500" />
                            <span>{commentsCount}</span>
                          </button>
                        )}
                      </div>

                      {/* Title */}
                      <h4
                        onClick={() => onOpenReportModal(task)}
                        className="text-xs sm:text-sm font-bold text-slate-900 hover:text-pink-600 transition cursor-pointer leading-snug"
                      >
                        {task.title}
                      </h4>

                      {/* Report Link Pill */}
                      {hasReport ? (
                        <button
                          onClick={() => onOpenReportModal(task)}
                          className="flex items-center justify-between w-full rounded-lg bg-pink-50/70 p-2 text-[11px] font-semibold text-pink-700 border border-pink-200 hover:bg-pink-100 transition cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <FileCheck2 className="h-3.5 w-3.5 text-pink-600 shrink-0" />
                            <span className="truncate">{getDomainFromUrl(task.reportLink)}</span>
                          </div>
                          <ExternalLink className="h-3 w-3 text-pink-500 shrink-0" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenReportModal(task)}
                          className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-pink-600 cursor-pointer"
                        >
                          <Link2 className="h-3 w-3" />
                          <span>Chưa nộp link báo cáo</span>
                        </button>
                      )}

                      {/* Assignees & Due Date */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                        <div className="flex -space-x-1">
                          {assignedMembers.map((m) => (
                            <div
                              key={m.id}
                              title={m.name}
                              className={`flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-tr ${m.color} text-[9px] font-bold text-white ring-1 ring-white`}
                            >
                              {m.avatar}
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-1 text-slate-500">
                          <Calendar className="h-3 w-3 text-pink-500" />
                          <span>{formatDateVN(task.dueDate)}</span>
                        </div>
                      </div>

                      {/* Quick Move State Buttons */}
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        {prevStatus ? (
                          <button
                            onClick={() => onChangeTaskStatus(task.id, prevStatus)}
                            className="inline-flex items-center text-slate-400 hover:text-pink-600 cursor-pointer"
                            title="Quay lại trạng thái trước"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            <span>Lùi</span>
                          </button>
                        ) : <span />}

                        {nextStatus && (
                          <button
                            onClick={() => onChangeTaskStatus(task.id, nextStatus)}
                            className="inline-flex items-center gap-0.5 rounded-md bg-pink-100 px-2 py-1 font-bold text-pink-700 hover:bg-pink-200 transition cursor-pointer"
                          >
                            <span>Tiếp tục</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
};
