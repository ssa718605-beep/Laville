import React, { useState } from 'react';
import { 
  FileCheck2, 
  ExternalLink, 
  MessageSquare, 
  Link2, 
  Calendar, 
  AlertCircle, 
  Search,
  CheckCircle2,
  Clock,
  Send,
  Sparkles
} from 'lucide-react';
import { Task, Member } from '../types';
import { formatDateVN, getDomainFromUrl, getStatusInfo } from '../utils';

interface ReportsViewProps {
  tasks: Task[];
  members: Member[];
  onOpenReportModal: (task: Task) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  tasks,
  members,
  onOpenReportModal,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'submitted' | 'missing'>('all');

  const tasksWithReport = tasks.filter((t) => Boolean(t.reportLink && t.reportLink.trim()));
  const tasksWithoutReport = tasks.filter((t) => !Boolean(t.reportLink && t.reportLink.trim()));
  const totalComments = tasks.reduce((sum, t) => sum + (t.comments?.length || 0), 0);

  const displayedTasks = tasks.filter((t) => {
    if (filterType === 'submitted') return Boolean(t.reportLink && t.reportLink.trim());
    if (filterType === 'missing') return !Boolean(t.reportLink && t.reportLink.trim());
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng đầu việc</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{tasks.length}</span>
            <span className="text-xs text-slate-500">công việc</span>
          </div>
        </div>

        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đã nộp link báo cáo</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <FileCheck2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">{tasksWithReport.length}</span>
            <span className="text-xs text-slate-500">/ {tasks.length} ({tasks.length ? Math.round((tasksWithReport.length / tasks.length) * 100) : 0}%)</span>
          </div>
        </div>

        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chưa có link kết quả</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600">{tasksWithoutReport.length}</span>
            <span className="text-xs text-slate-500">đầu việc cần nộp</span>
          </div>
        </div>

        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bình luận trao đổi</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600">{totalComments}</span>
            <span className="text-xs text-slate-500">lượt góp ý & duyệt</span>
          </div>
        </div>

      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
            filterType === 'all'
              ? 'bg-pink-500 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-pink-50 border border-pink-200'
          }`}
        >
          Tất cả công việc ({tasks.length})
        </button>

        <button
          onClick={() => setFilterType('submitted')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
            filterType === 'submitted'
              ? 'bg-pink-500 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-pink-50 border border-pink-200'
          }`}
        >
          Đã có link báo cáo ({tasksWithReport.length})
        </button>

        <button
          onClick={() => setFilterType('missing')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
            filterType === 'missing'
              ? 'bg-pink-500 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-pink-50 border border-pink-200'
          }`}
        >
          Chưa nộp link báo cáo ({tasksWithoutReport.length})
        </button>
      </div>

      {/* Reports Table/Cards */}
      <div className="space-y-3">
        {displayedTasks.map((task) => {
          const assignedMembers = members.filter((m) => task.assignedMemberIds?.includes(m.id));
          const hasReport = Boolean(task.reportLink && task.reportLink.trim());
          const commentsCount = task.comments?.length || 0;
          const statusInfo = getStatusInfo(task.status);

          return (
            <div
              key={task.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl border border-pink-100 bg-white p-4 sm:p-5 shadow-2xs hover:border-pink-300 transition"
            >
              {/* Task info */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusInfo.badgeClass}`}>
                    {statusInfo.label}
                  </span>
                  <span className="text-xs text-slate-400">
                    Thời gian: {formatDateVN(task.startDate)} → {formatDateVN(task.dueDate)}
                  </span>
                </div>

                <h4
                  onClick={() => onOpenReportModal(task)}
                  className="text-base font-bold text-slate-900 hover:text-pink-600 transition cursor-pointer"
                >
                  {task.title}
                </h4>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="text-slate-400">Người thực hiện:</span>
                  <div className="flex items-center gap-1">
                    {assignedMembers.map((m) => (
                      <span key={m.id} className="font-semibold text-slate-700">
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Report Link details */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                {hasReport ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-700">
                        {getDomainFromUrl(task.reportLink)}
                      </span>
                      {task.reportSubmittedAt && (
                        <span className="text-[11px] text-slate-400">Nộp: {task.reportSubmittedAt}</span>
                      )}
                    </div>
                    <a
                      href={task.reportLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:underline"
                    >
                      <span className="truncate max-w-[200px]">{task.reportLink}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  </div>
                ) : (
                  <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 font-medium flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Chưa nộp link báo cáo
                  </span>
                )}

                {/* Open Comment & Feedback Drawer button */}
                <button
                  onClick={() => onOpenReportModal(task)}
                  className="inline-flex items-center gap-2 rounded-xl bg-pink-500 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-pink-600 active:scale-95 transition cursor-pointer shrink-0"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>
                    {commentsCount > 0 ? `Bình luận (${commentsCount})` : 'Nhận xét báo cáo'}
                  </span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
