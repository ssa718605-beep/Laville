import { Member, Task, Priority, TaskStatus } from './types';
import { INITIAL_MEMBERS, INITIAL_TASKS } from './mockData';

const TASKS_STORAGE_KEY = 'pinktask_tasks_v1';
const MEMBERS_STORAGE_KEY = 'pinktask_members_v1';
const ACTIVE_USER_STORAGE_KEY = 'pinktask_active_user_v1';

export function getStoredTasks(): Task[] {
  try {
    const data = localStorage.getItem(TASKS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading tasks from storage', e);
  }
  return INITIAL_TASKS;
}

export function saveTasksToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks to storage', e);
  }
}

export function getStoredMembers(): Member[] {
  try {
    const data = localStorage.getItem(MEMBERS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading members from storage', e);
  }
  return INITIAL_MEMBERS;
}

export function saveMembersToStorage(members: Member[]): void {
  try {
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
  } catch (e) {
    console.error('Error saving members to storage', e);
  }
}

export function getStoredActiveMemberId(members: Member[]): string {
  try {
    const stored = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    if (stored && members.some(m => m.id === stored)) {
      return stored;
    }
  } catch (e) {
    console.error('Error reading active member from storage', e);
  }
  return members[0]?.id || 'm-1';
}

export function saveActiveMemberId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_USER_STORAGE_KEY, id);
  } catch (e) {
    console.error('Error saving active member to storage', e);
  }
}

export function formatDateVN(dateStr?: string): string {
  if (!dateStr) return 'Chưa đặt';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('vi-VN');
    }
  } catch {
    // fallback
  }
  return dateStr;
}

export function getDaysRemaining(dueDateStr?: string): { days: number; text: string; isOverdue: boolean } {
  if (!dueDateStr) return { days: 0, text: 'Chưa có hạn', isOverdue: false };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { days: Math.abs(diffDays), text: `Quá hạn ${Math.abs(diffDays)} ngày`, isOverdue: true };
  } else if (diffDays === 0) {
    return { days: 0, text: 'Hôm nay đến hạn', isOverdue: false };
  } else if (diffDays === 1) {
    return { days: 1, text: 'Còn 1 ngày', isOverdue: false };
  }
  return { days: diffDays, text: `Còn ${diffDays} ngày`, isOverdue: false };
}

export function getStatusInfo(status: TaskStatus): {
  label: string;
  badgeClass: string;
  dotClass: string;
} {
  switch (status) {
    case 'todo':
      return {
        label: 'Chưa bắt đầu',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        dotClass: 'bg-slate-400',
      };
    case 'in_progress':
      return {
        label: 'Đang thực hiện',
        badgeClass: 'bg-pink-100/80 text-pink-700 border-pink-200',
        dotClass: 'bg-pink-500 animate-pulse',
      };
    case 'review':
      return {
        label: 'Chờ duyệt kết quả',
        badgeClass: 'bg-amber-100/90 text-amber-800 border-amber-200',
        dotClass: 'bg-amber-500',
      };
    case 'completed':
      return {
        label: 'Đã hoàn thành',
        badgeClass: 'bg-emerald-100/90 text-emerald-800 border-emerald-200',
        dotClass: 'bg-emerald-500',
      };
    default:
      return {
        label: status,
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        dotClass: 'bg-slate-400',
      };
  }
}

export function getPriorityInfo(priority: Priority): {
  label: string;
  badgeClass: string;
} {
  switch (priority) {
    case 'urgent':
      return {
        label: 'Khẩn cấp',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-200 font-semibold',
      };
    case 'high':
      return {
        label: 'Ưu tiên cao',
        badgeClass: 'bg-pink-100 text-pink-800 border-pink-200',
      };
    case 'medium':
      return {
        label: 'Trung bình',
        badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
      };
    case 'low':
      return {
        label: 'Thấp',
        badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
      };
    default:
      return {
        label: priority,
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      };
  }
}

export function getDomainFromUrl(urlStr: string): string {
  try {
    if (!urlStr) return '';
    const cleanUrl = urlStr.startsWith('http') ? urlStr : `https://${urlStr}`;
    const parsed = new URL(cleanUrl);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return 'Liên kết ngoài';
  }
}
