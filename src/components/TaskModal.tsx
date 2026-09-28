import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Link2, AlertCircle, Sparkles, Check } from 'lucide-react';
import { Task, Member, Priority, TaskStatus } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (taskData: Omit<Task, 'id' | 'comments' | 'createdAt'> & { id?: string }) => void;
  initialTask?: Task | null;
  members: Member[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  initialTask,
  members,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedMemberIds, setAssignedMemberIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [reportLink, setReportLink] = useState('');
  const [reportNotes, setReportNotes] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setAssignedMemberIds(initialTask.assignedMemberIds || []);
      setStartDate(initialTask.startDate || '');
      setDueDate(initialTask.dueDate || '');
      setPriority(initialTask.priority);
      setStatus(initialTask.status);
      setReportLink(initialTask.reportLink || '');
      setReportNotes(initialTask.reportNotes || '');
    } else {
      // Defaults for new task
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setTitle('');
      setDescription('');
      setAssignedMemberIds(members.length > 0 ? [members[0].id] : []);
      setStartDate(today);
      setDueDate(nextWeek);
      setPriority('medium');
      setStatus('todo');
      setReportLink('');
      setReportNotes('');
    }
  }, [initialTask, isOpen, members]);

  const toggleAssignee = (memberId: string) => {
    setAssignedMemberIds((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveTask({
      id: initialTask?.id,
      title: title.trim(),
      description: description.trim(),
      assignedMemberIds,
      startDate,
      dueDate,
      priority,
      status,
      reportLink: reportLink.trim(),
      reportNotes: reportNotes.trim(),
      reportSubmittedAt: reportLink.trim()
        ? initialTask?.reportSubmittedAt || new Date().toLocaleString('vi-VN')
        : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-pink-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-100 bg-linear-to-r from-pink-50 via-white to-rose-50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {initialTask ? 'Chỉnh sửa đầu việc' : 'Giao việc mới'}
              </h3>
              <p className="text-xs text-slate-500">
                Thiết lập thông tin công việc, người phụ trách, thời hạn và link báo cáo
              </p>
            </div>
          </div>

          <button
            id="close-task-modal-btn"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-pink-100 hover:text-pink-600 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên đầu việc: <span className="text-rose-500">*</span>
            </label>
            <input
              id="task-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Thiết kế giao diện luồng thanh toán hoặc Lập trình API..."
              className="w-full rounded-xl border border-pink-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mô tả chi tiết công việc:
            </label>
            <textarea
              id="task-description-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Yêu cầu cụ thể, tiêu chí nghiệm thu công việc..."
              className="w-full rounded-xl border border-pink-200 p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
            />
          </div>

          {/* Assign Members (Giao việc cho ai) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Giao việc cho thành viên: <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-1">
              {members.map((member) => {
                const isAssigned = assignedMemberIds.includes(member.id);
                return (
                  <button
                    type="button"
                    key={member.id}
                    onClick={() => toggleAssignee(member.id)}
                    className={`flex items-center justify-between rounded-xl border p-2.5 text-left text-xs transition cursor-pointer ${
                      isAssigned
                        ? 'border-pink-500 bg-pink-50/70 text-pink-900 ring-1 ring-pink-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-pink-200 hover:bg-pink-50/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-linear-to-tr ${member.color} text-xs font-bold text-white shadow-2xs`}
                      >
                        {member.avatar}
                      </div>
                      <div className="truncate">
                        <p className="font-bold truncate">{member.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{member.role}</p>
                      </div>
                    </div>
                    {isAssigned && (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-500 text-white">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {assignedMemberIds.length === 0 && (
              <p className="text-[11px] text-rose-500 mt-1">
                * Vui lòng chọn ít nhất một thành viên phụ trách
              </p>
            )}
          </div>

          {/* Dates: Ngày bắt đầu & Ngày hoàn thành */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ngày bắt đầu: <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="task-start-date-input"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-pink-200 py-2 pl-3 pr-3 text-sm text-slate-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ngày hoàn thành (Hạn chót): <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="task-due-date-input"
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-pink-200 py-2 pl-3 pr-3 text-sm text-slate-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Trạng thái:
              </label>
              <select
                id="task-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full rounded-xl border border-pink-200 bg-white py-2 px-3 text-sm text-slate-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none cursor-pointer"
              >
                <option value="todo">Chưa bắt đầu</option>
                <option value="in_progress">Đang thực hiện</option>
                <option value="review">Chờ duyệt kết quả</option>
                <option value="completed">Đã hoàn thành</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mức độ ưu tiên:
              </label>
              <select
                id="task-priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full rounded-xl border border-pink-200 bg-white py-2 px-3 text-sm text-slate-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none cursor-pointer"
              >
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Ưu tiên cao</option>
                <option value="urgent">Khẩn cấp</option>
              </select>
            </div>
          </div>

          {/* Report Link & Result Notes */}
          <div className="rounded-xl border border-pink-200 bg-pink-50/40 p-3.5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Link2 className="h-4 w-4 text-pink-600" />
              <span>Link báo cáo kết quả công việc</span>
              <span className="text-[10px] font-normal text-slate-500">(cho phép trao đổi bình luận)</span>
            </div>

            <div>
              <input
                id="task-report-link-input"
                type="url"
                value={reportLink}
                onChange={(e) => setReportLink(e.target.value)}
                placeholder="https://docs.google.com/... hoặc link Figma, GitHub..."
                className="w-full rounded-lg border border-pink-200 bg-white py-2 px-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              />
            </div>

            <div>
              <input
                id="task-report-notes-input"
                type="text"
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
                placeholder="Ghi chú kết quả, tài liệu đính kèm..."
                className="w-full rounded-lg border border-pink-200 bg-white py-1.5 px-3 text-xs text-slate-800 placeholder-slate-400 focus:border-pink-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={!title.trim() || assignedMemberIds.length === 0}
              className="rounded-xl bg-linear-to-r from-pink-500 to-rose-600 px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-pink-500/20 hover:from-pink-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {initialTask ? 'Lưu thay đổi' : 'Tạo & Giao việc'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
