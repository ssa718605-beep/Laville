export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string; // initials or image URL
  color: string; // tailwind color class or hex
  phone?: string;
  joinedDate: string;
}

export interface ReportComment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  tag?: 'feedback' | 'revision' | 'approved' | 'general';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedMemberIds: string[];
  startDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  priority: Priority;
  status: TaskStatus;
  reportLink: string; // Link báo cáo kết quả công việc
  reportNotes?: string; // Ghi chú kết quả công việc
  reportSubmittedAt?: string;
  comments: ReportComment[];
  createdAt: string;
  updatedAt?: string;
}

export type TabType = 'tasks' | 'board' | 'members' | 'reports' | 'comments';

export interface FilterState {
  search: string;
  status: string; // 'all' | TaskStatus
  priority: string; // 'all' | Priority
  assigneeId: string; // 'all' | memberId
  sortBy: 'dueDate' | 'startDate' | 'priority' | 'title';
}
