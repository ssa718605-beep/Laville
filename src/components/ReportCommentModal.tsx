import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  MessageSquare, 
  Send, 
  Link2, 
  Calendar, 
  User, 
  AlertCircle, 
  Sparkles, 
  FileCheck2, 
  Edit3, 
  Trash2,
  ThumbsUp,
  Tag
} from 'lucide-react';
import { Task, Member, ReportComment } from '../types';
import { formatDateVN, getStatusInfo, getPriorityInfo, getDomainFromUrl } from '../utils';

interface ReportCommentModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  activeMember: Member | null;
  onAddComment: (taskId: string, content: string, tag: ReportComment['tag']) => void;
  onDeleteComment: (taskId: string, commentId: string) => void;
  onUpdateReportLink: (taskId: string, reportLink: string, reportNotes?: string) => void;
}

export const ReportCommentModal: React.FC<ReportCommentModalProps> = ({
  task,
  isOpen,
  onClose,
  members,
  activeMember,
  onAddComment,
  onDeleteComment,
  onUpdateReportLink,
}) => {
  if (!isOpen || !task) return null;

  const [commentText, setCommentText] = useState('');
  const [selectedTag, setSelectedTag] = useState<ReportComment['tag']>('feedback');
  const [copied, setCopied] = useState(false);

  // Quick edit report link state
  const [isEditingReport, setIsEditingReport] = useState(false);
  const [editLink, setEditLink] = useState(task.reportLink || '');
  const [editNotes, setEditNotes] = useState(task.reportNotes || '');

  const statusInfo = getStatusInfo(task.status);
  const priorityInfo = getPriorityInfo(task.priority);

  const assignedMembers = members.filter((m) => task.assignedMemberIds?.includes(m.id));

  const handleCopyLink = () => {
    if (!task.reportLink) return;
    navigator.clipboard.writeText(task.reportLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveReportLink = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateReportLink(task.id, editLink.trim(), editNotes.trim());
    setIsEditingReport(false);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(task.id, commentText.trim(), selectedTag);
    setCommentText('');
  };

  const getTagBadge = (tag?: ReportComment['tag']) => {
    switch (tag) {
      case 'approved':
        return <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">✅ Đã duyệt</span>;
      case 'revision':
        return <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-800 border border-rose-200">⚠️ Cần chỉnh sửa</span>;
      case 'feedback':
        return <span className="inline-flex items-center gap-1 rounded-md bg-pink-100 px-2 py-0.5 text-[11px] font-semibold text-pink-800 border border-pink-200">💡 Góp ý</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">💬 Trao đổi</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-pink-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-pink-100 bg-linear-to-r from-pink-50/80 via-white to-rose-50/50 p-4 sm:p-6">
          <div className="space-y-1.5 pr-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusInfo.badgeClass}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotClass}`}></span>
                {statusInfo.label}
              </span>
              <span className={`rounded-md px-2 py-0.5 text-xs font-semibold border ${priorityInfo.badgeClass}`}>
                {priorityInfo.label}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {task.title}
            </h3>
          </div>

          <button
            id="close-report-modal-btn"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-pink-100 hover:text-pink-700 transition cursor-pointer"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Task Info Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl bg-pink-50/30 p-3.5 border border-pink-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-pink-500 shrink-0" />
              <div>
                <span className="text-slate-400">Thời gian: </span>
                <span className="font-medium text-slate-800">
                  {formatDateVN(task.startDate)} → {formatDateVN(task.dueDate)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-pink-500 shrink-0" />
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-400">Người thực hiện: </span>
                {assignedMembers.length > 0 ? (
                  assignedMembers.map((m) => (
                    <span
                      key={m.id}
                      className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 font-medium text-slate-700 border border-pink-200 shadow-2xs"
                    >
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full bg-linear-to-tr ${m.color} text-[9px] font-bold text-white`}>
                        {m.avatar}
                      </span>
                      {m.name}
                    </span>
                  ))
                ) : (
                  <span className="italic text-slate-400">Chưa phân công</span>
                )}
              </div>
            </div>
          </div>

          {/* Task Description */}
          {task.description && (
            <div className="text-sm text-slate-700 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
              <p className="font-semibold text-slate-800 mb-1 text-xs uppercase tracking-wider text-pink-600">Mô tả công việc:</p>
              <p className="whitespace-pre-line leading-relaxed">{task.description}</p>
            </div>
          )}

          {/* REPORT LINK SECTION (Trọng tâm yêu cầu) */}
          <div className="rounded-2xl border-2 border-pink-200 bg-linear-to-br from-pink-50/70 via-white to-rose-50/40 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500 text-white shadow-xs">
                  <FileCheck2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    Báo cáo kết quả công việc
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Đường dẫn sản phẩm, tài liệu nghiệm thu hoặc minh chứng kết quả
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditLink(task.reportLink || '');
                  setEditNotes(task.reportNotes || '');
                  setIsEditingReport(!isEditingReport);
                }}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-pink-700 hover:bg-pink-100 border border-pink-200 bg-white transition cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>{isEditingReport ? 'Hủy' : task.reportLink ? 'Cập nhật link' : 'Thêm link báo cáo'}</span>
              </button>
            </div>

            {/* Editing Form */}
            {isEditingReport ? (
              <form onSubmit={handleSaveReportLink} className="space-y-3 bg-white p-4 rounded-xl border border-pink-200 shadow-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Đường dẫn (URL) báo cáo kết quả: <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-500" />
                    <input
                      type="url"
                      required
                      placeholder="https://docs.google.com/... hoặc https://figma.com/..."
                      value={editLink}
                      onChange={(e) => setEditLink(e.target.value)}
                      className="w-full rounded-lg border border-pink-200 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ghi chú tóm tắt kết quả:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tóm tắt kết quả đạt được, số lượng màn hình hoàn thành, checklist..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full rounded-lg border border-pink-200 p-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditingReport(false)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-pink-500 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-pink-600 cursor-pointer"
                  >
                    Lưu link báo cáo
                  </button>
                </div>
              </form>
            ) : task.reportLink ? (
              /* Display Active Link Card */
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl bg-white p-3.5 border border-pink-200 shadow-xs">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600 font-bold">
                      <Link2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-pink-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pink-700 border border-pink-200">
                          {getDomainFromUrl(task.reportLink)}
                        </span>
                        {task.reportSubmittedAt && (
                          <span className="text-[11px] text-slate-400">
                            Nộp lúc: {task.reportSubmittedAt}
                          </span>
                        )}
                      </div>
                      <a
                        href={task.reportLink}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-xs sm:text-sm font-semibold text-pink-600 hover:text-pink-700 hover:underline mt-0.5"
                        title={task.reportLink}
                      >
                        {task.reportLink}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                      title="Sao chép link"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                    </button>

                    <a
                      href={task.reportLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-pink-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-pink-600 transition cursor-pointer"
                    >
                      <span>Mở liên kết</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                {task.reportNotes && (
                  <div className="rounded-xl bg-white/90 p-3 text-xs text-slate-700 border border-pink-100">
                    <span className="font-bold text-pink-700">Ghi chú kết quả: </span>
                    {task.reportNotes}
                  </div>
                )}
              </div>
            ) : (
              /* No Link State */
              <div className="rounded-xl border border-dashed border-pink-300 bg-white/60 p-4 text-center space-y-2">
                <AlertCircle className="mx-auto h-7 w-7 text-pink-400" />
                <p className="text-xs sm:text-sm font-medium text-slate-700">
                  Chưa có link báo cáo kết quả công việc
                </p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Hãy đính kèm link tài liệu Google Docs, Figma, Notion, GitHub hoặc Drive để người duyệt có thể kiểm tra và trao đổi phản hồi.
                </p>
                <button
                  onClick={() => setIsEditingReport(true)}
                  className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-pink-500 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-pink-600 transition cursor-pointer"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  <span>Đính kèm link báo cáo ngay</span>
                </button>
              </div>
            )}
          </div>

          {/* COMMENTS SECTION (Cho phép comment trong link báo cáo) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-pink-500" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  Bình luận & Phản hồi kết quả ({task.comments?.length || 0})
                </h4>
              </div>
              <span className="text-xs text-slate-400">
                Trao đổi trực tiếp về sản phẩm nộp
              </span>
            </div>

            {/* Comment List */}
            <div className="space-y-3">
              {(!task.comments || task.comments.length === 0) ? (
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-6 text-center text-xs sm:text-sm text-slate-400">
                  <MessageSquare className="mx-auto h-6 w-6 text-slate-300 mb-1" />
                  Chưa có nhận xét nào về kết quả công việc này. Hãy để lại góp ý đầu tiên bên dưới!
                </div>
              ) : (
                task.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="group relative rounded-xl border border-pink-100 bg-white p-3.5 shadow-2xs hover:border-pink-200 transition"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-tr from-pink-500 to-rose-600 text-[11px] font-bold text-white shadow-2xs">
                          {comment.authorAvatar || comment.authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">
                              {comment.authorName}
                            </span>
                            {getTagBadge(comment.tag)}
                          </div>
                          <span className="text-[10px] text-pink-600 font-medium">
                            {comment.authorRole}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">
                          {comment.createdAt}
                        </span>

                        <button
                          onClick={() => onDeleteComment(task.id, comment.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                          title="Xóa nhận xét này"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 pl-9 whitespace-pre-line leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Post New Comment Box */}
            <form onSubmit={handleSubmitComment} className="rounded-2xl border border-pink-200 bg-pink-50/40 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-pink-500"></span>
                  Bình luận với tư cách: <strong className="text-slate-800">{activeMember?.name || 'Khách'}</strong>
                </span>

                {/* Quick Tag Selector */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Gắn nhãn:</span>
                  {(['feedback', 'revision', 'approved', 'general'] as const).map((t) => {
                    const isSelected = selectedTag === t;
                    return (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setSelectedTag(t)}
                        className={`rounded-md px-2 py-0.5 text-[10px] font-semibold transition cursor-pointer ${
                          isSelected
                            ? 'bg-pink-500 text-white shadow-2xs'
                            : 'bg-white text-slate-600 hover:bg-pink-100 border border-pink-200'
                        }`}
                      >
                        {t === 'feedback' && 'Góp ý'}
                        {t === 'revision' && 'Cần sửa'}
                        {t === 'approved' && 'Duyệt'}
                        {t === 'general' && 'Chung'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <textarea
                rows={3}
                required
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Nhập nội dung nhận xét về kết quả công việc, góp ý hoàn thiện hoặc thông báo duyệt..."
                className="w-full rounded-xl border border-pink-200 bg-white p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  Nhận xét sẽ được lưu trực tiếp vào kết quả công việc này
                </span>

                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-pink-500 to-rose-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-pink-500/20 hover:from-pink-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Gửi nhận xét</span>
                </button>
              </div>
            </form>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="border-t border-pink-100 bg-slate-50/70 px-4 py-3 sm:px-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );
};
