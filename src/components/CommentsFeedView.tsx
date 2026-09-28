import React, { useState } from 'react';
import { MessageSquareText, ExternalLink, Tag, Calendar, User, FileCheck2, ArrowRight } from 'lucide-react';
import { Task, Member, ReportComment } from '../types';
import { formatDateVN, getDomainFromUrl } from '../utils';

interface CommentsFeedViewProps {
  tasks: Task[];
  members: Member[];
  onOpenReportModal: (task: Task) => void;
}

export const CommentsFeedView: React.FC<CommentsFeedViewProps> = ({
  tasks,
  members,
  onOpenReportModal,
}) => {
  const [filterTag, setFilterTag] = useState<string>('all');

  // Flatten comments with task context
  const allComments: { comment: ReportComment; task: Task }[] = [];
  tasks.forEach((task) => {
    task.comments?.forEach((comment) => {
      allComments.push({ comment, task });
    });
  });

  // Sort descending by creation date if possible
  allComments.sort((a, b) => b.comment.createdAt.localeCompare(a.comment.createdAt));

  const filteredComments = allComments.filter(({ comment }) => {
    if (filterTag === 'all') return true;
    return comment.tag === filterTag;
  });

  const getTagBadge = (tag?: ReportComment['tag']) => {
    switch (tag) {
      case 'approved':
        return <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">✅ Đã duyệt</span>;
      case 'revision':
        return <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 border border-rose-200">⚠️ Cần chỉnh sửa</span>;
      case 'feedback':
        return <span className="rounded-md bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-800 border border-pink-200">💡 Góp ý</span>;
      default:
        return <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">💬 Trao đổi</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-white border border-pink-100 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-5 w-5 text-pink-500" />
            <h3 className="text-lg font-bold text-slate-900">
              Nhật ký thảo luận & Nhận xét kết quả ({allComments.length})
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp toàn bộ phản hồi, đánh giá và trao đổi trực tiếp trên các link báo cáo công việc.
          </p>
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'feedback', label: '💡 Góp ý' },
            { id: 'revision', label: '⚠️ Cần sửa' },
            { id: 'approved', label: '✅ Đã duyệt' },
            { id: 'general', label: '💬 Trao đổi' },
          ].map((tag) => (
            <button
              key={tag.id}
              onClick={() => setFilterTag(tag.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                filterTag === tag.id
                  ? 'bg-pink-500 text-white shadow-2xs'
                  : 'bg-pink-50 text-slate-600 hover:bg-pink-100'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feed list */}
      <div className="space-y-3">
        {filteredComments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-pink-200 bg-white p-12 text-center text-slate-400">
            <MessageSquareText className="mx-auto h-8 w-8 text-pink-300 mb-2" />
            Chưa có nhận xét nào trong danh mục này.
          </div>
        ) : (
          filteredComments.map(({ comment, task }) => (
            <div
              key={comment.id}
              className="rounded-2xl border border-pink-100 bg-white p-4 sm:p-5 shadow-2xs hover:border-pink-300 transition space-y-3"
            >
              {/* Task reference line */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-50 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Công việc:</span>
                  <button
                    onClick={() => onOpenReportModal(task)}
                    className="text-xs sm:text-sm font-bold text-slate-900 hover:text-pink-600 hover:underline cursor-pointer"
                  >
                    {task.title}
                  </button>
                </div>

                {task.reportLink && (
                  <div className="flex items-center gap-1.5 text-xs text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200">
                    <FileCheck2 className="h-3 w-3" />
                    <span>{getDomainFromUrl(task.reportLink)}</span>
                  </div>
                )}
              </div>

              {/* Author and tag */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-tr from-pink-500 to-rose-600 text-xs font-bold text-white shadow-xs">
                    {comment.authorAvatar || comment.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-800">{comment.authorName}</span>
                      {getTagBadge(comment.tag)}
                    </div>
                    <span className="text-[11px] text-pink-600">{comment.authorRole}</span>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400">{comment.createdAt}</span>
              </div>

              {/* Comment text */}
              <div className="rounded-xl bg-slate-50/80 p-3 text-xs sm:text-sm text-slate-700 leading-relaxed pl-4 border-l-2 border-pink-400">
                {comment.content}
              </div>

              {/* Bottom jump action */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => onOpenReportModal(task)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-700 cursor-pointer"
                >
                  <span>Mở báo cáo công việc & phản hồi</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
