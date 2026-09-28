import React, { useState, useEffect } from 'react';
import { 
  TabType, 
  Task, 
  Member, 
  FilterState, 
  TaskStatus, 
  ReportComment 
} from './types';
import { 
  getStoredTasks, 
  saveTasksToStorage, 
  getStoredMembers, 
  saveMembersToStorage, 
  getStoredActiveMemberId, 
  saveActiveMemberId 
} from './utils';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TaskList } from './components/TaskList';
import { TaskBoard } from './components/TaskBoard';
import { MembersView } from './components/MembersView';
import { ReportsView } from './components/ReportsView';
import { CommentsFeedView } from './components/CommentsFeedView';
import { TaskModal } from './components/TaskModal';
import { MemberModal } from './components/MemberModal';
import { ReportCommentModal } from './components/ReportCommentModal';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => getStoredTasks());
  const [members, setMembers] = useState<Member[]>(() => getStoredMembers());
  const [activeMemberId, setActiveMemberId] = useState<string>(() =>
    getStoredActiveMemberId(getStoredMembers())
  );

  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Filters
  const [filterState, setFilterState] = useState<FilterState>({
    search: '',
    status: 'all',
    priority: 'all',
    assigneeId: 'all',
    sortBy: 'dueDate',
  });

  // Modal States
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReportTask, setSelectedReportTask] = useState<Task | null>(null);

  // Synchronize to localStorage
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  useEffect(() => {
    saveMembersToStorage(members);
  }, [members]);

  useEffect(() => {
    saveActiveMemberId(activeMemberId);
  }, [activeMemberId]);

  // Find active member
  const activeMember = members.find((m) => m.id === activeMemberId) || members[0] || null;

  // Handler: Save Task (Create or Update)
  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'comments' | 'createdAt'> & { id?: string }
  ) => {
    if (taskData.id) {
      // Update existing
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? {
                ...t,
                ...taskData,
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      );
    } else {
      // Create new
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: taskData.title,
        description: taskData.description,
        assignedMemberIds: taskData.assignedMemberIds,
        startDate: taskData.startDate,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        status: taskData.status,
        reportLink: taskData.reportLink,
        reportNotes: taskData.reportNotes,
        reportSubmittedAt: taskData.reportSubmittedAt,
        comments: [],
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  // Handler: Delete Task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedReportTask?.id === taskId) {
      setReportModalOpen(false);
      setSelectedReportTask(null);
    }
  };

  // Handler: Change Task Status
  const handleChangeTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    if (selectedReportTask?.id === taskId) {
      setSelectedReportTask((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Handler: Save Member
  const handleSaveMember = (
    memberData: Omit<Member, 'id' | 'joinedDate'> & { id?: string }
  ) => {
    if (memberData.id) {
      setMembers((prev) =>
        prev.map((m) => (m.id === memberData.id ? { ...m, ...memberData } : m))
      );
    } else {
      const newMember: Member = {
        id: `m-${Date.now()}`,
        name: memberData.name,
        email: memberData.email,
        role: memberData.role,
        department: memberData.department,
        avatar: memberData.avatar,
        color: memberData.color,
        phone: memberData.phone,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      setMembers((prev) => [...prev, newMember]);
      if (!activeMemberId) {
        setActiveMemberId(newMember.id);
      }
    }
  };

  // Handler: Delete Member
  const handleDeleteMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    // Remove member from task assignments
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        assignedMemberIds: t.assignedMemberIds.filter((id) => id !== memberId),
      }))
    );
    if (activeMemberId === memberId) {
      const remaining = members.filter((m) => m.id !== memberId);
      if (remaining.length > 0) {
        setActiveMemberId(remaining[0].id);
      }
    }
  };

  // Handler: Add Comment to Task Report Link
  const handleAddComment = (
    taskId: string,
    content: string,
    tag?: ReportComment['tag']
  ) => {
    const author = activeMember || {
      id: 'guest',
      name: 'Người dùng',
      role: 'Khách',
      avatar: 'U',
    };

    const newComment: ReportComment = {
      id: `c-${Date.now()}`,
      taskId,
      authorId: author.id,
      authorName: author.name,
      authorRole: author.role,
      authorAvatar: author.avatar,
      content,
      createdAt: new Date().toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      tag: tag || 'feedback',
    };

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              comments: [...(t.comments || []), newComment],
            }
          : t
      )
    );

    if (selectedReportTask?.id === taskId) {
      setSelectedReportTask((prev) =>
        prev
          ? {
              ...prev,
              comments: [...(prev.comments || []), newComment],
            }
          : null
      );
    }
  };

  // Handler: Delete Comment
  const handleDeleteComment = (taskId: string, commentId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              comments: (t.comments || []).filter((c) => c.id !== commentId),
            }
          : t
      )
    );

    if (selectedReportTask?.id === taskId) {
      setSelectedReportTask((prev) =>
        prev
          ? {
              ...prev,
              comments: (prev.comments || []).filter((c) => c.id !== commentId),
            }
          : null
      );
    }
  };

  // Handler: Update Report Link & Notes directly from Report Modal
  const handleUpdateReportLink = (
    taskId: string,
    reportLink: string,
    reportNotes?: string
  ) => {
    const now = new Date().toLocaleString('vi-VN');
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              reportLink,
              reportNotes,
              reportSubmittedAt: reportLink ? now : undefined,
              status: t.status === 'todo' ? 'in_progress' : t.status,
            }
          : t
      )
    );

    if (selectedReportTask?.id === taskId) {
      setSelectedReportTask((prev) =>
        prev
          ? {
              ...prev,
              reportLink,
              reportNotes,
              reportSubmittedAt: reportLink ? now : undefined,
            }
          : null
      );
    }
  };

  // Filtered Tasks for Workspace
  const filteredTasks = tasks.filter((t) => {
    if (filterState.search) {
      const q = filterState.search.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchReport = t.reportLink?.toLowerCase().includes(q) || t.reportNotes?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchReport) return false;
    }

    if (filterState.status !== 'all' && t.status !== filterState.status) {
      return false;
    }

    if (filterState.priority !== 'all' && t.priority !== filterState.priority) {
      return false;
    }

    if (filterState.assigneeId !== 'all' && !t.assignedMemberIds?.includes(filterState.assigneeId)) {
      return false;
    }

    return true;
  });

  // Open Report Modal helper
  const handleOpenReportModal = (task: Task) => {
    // get fresh task from current tasks state
    const currentTask = tasks.find((t) => t.id === task.id) || task;
    setSelectedReportTask(currentTask);
    setReportModalOpen(true);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-pink-50/40 text-slate-800">
      
      {/* THANH SLIDE BAR BÊN TRÁI: Các chức năng */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        members={members}
        tasks={tasks}
        activeMember={activeMember}
        onSelectActiveMember={(id) => setActiveMemberId(id)}
        onOpenCreateTaskModal={() => {
          setEditingTask(null);
          setTaskModalOpen(true);
        }}
        onOpenCreateMemberModal={() => {
          setEditingMember(null);
          setMemberModalOpen(true);
        }}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* BÊN PHẢI: KHU VỰC LÀM VIỆC (Workspace) */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        
        {/* Workspace Top Header */}
        <Header
          activeTab={activeTab}
          filterState={filterState}
          setFilterState={setFilterState}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCreateTaskModal={() => {
            setEditingTask(null);
            setTaskModalOpen(true);
          }}
        />

        {/* Workspace Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {activeTab === 'tasks' && (
              <TaskList
                tasks={filteredTasks}
                members={members}
                onOpenReportModal={handleOpenReportModal}
                onEditTask={(task) => {
                  setEditingTask(task);
                  setTaskModalOpen(true);
                }}
                onDeleteTask={handleDeleteTask}
                onChangeTaskStatus={handleChangeTaskStatus}
                onOpenCreateTaskModal={() => {
                  setEditingTask(null);
                  setTaskModalOpen(true);
                }}
              />
            )}

            {activeTab === 'board' && (
              <TaskBoard
                tasks={filteredTasks}
                members={members}
                onOpenReportModal={handleOpenReportModal}
                onEditTask={(task) => {
                  setEditingTask(task);
                  setTaskModalOpen(true);
                }}
                onChangeTaskStatus={handleChangeTaskStatus}
                onOpenCreateTaskModal={() => {
                  setEditingTask(null);
                  setTaskModalOpen(true);
                }}
              />
            )}

            {activeTab === 'members' && (
              <MembersView
                members={members}
                tasks={tasks}
                activeMember={activeMember}
                onSelectActiveMember={(id) => setActiveMemberId(id)}
                onOpenCreateMemberModal={() => {
                  setEditingMember(null);
                  setMemberModalOpen(true);
                }}
                onEditMember={(member) => {
                  setEditingMember(member);
                  setMemberModalOpen(true);
                }}
                onDeleteMember={handleDeleteMember}
                onOpenReportModal={handleOpenReportModal}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsView
                tasks={tasks}
                members={members}
                onOpenReportModal={handleOpenReportModal}
              />
            )}

            {activeTab === 'comments' && (
              <CommentsFeedView
                tasks={tasks}
                members={members}
                onOpenReportModal={handleOpenReportModal}
              />
            )}
          </div>
        </main>

      </div>

      {/* MODAL GIAO VIỆC / SỬA CÔNG VIỆC */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSaveTask={handleSaveTask}
        initialTask={editingTask}
        members={members}
      />

      {/* MODAL THÊM / SỬA THÀNH VIÊN */}
      <MemberModal
        isOpen={memberModalOpen}
        onClose={() => {
          setMemberModalOpen(false);
          setEditingMember(null);
        }}
        onSaveMember={handleSaveMember}
        initialMember={editingMember}
      />

      {/* MODAL CHI TIẾT LINK BÁO CÁO KẾT QUẢ & BÌNH LUẬN (TRỌNG TÂM YÊU CẦU) */}
      <ReportCommentModal
        task={selectedReportTask}
        isOpen={reportModalOpen}
        onClose={() => {
          setReportModalOpen(false);
          setSelectedReportTask(null);
        }}
        members={members}
        activeMember={activeMember}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        onUpdateReportLink={handleUpdateReportLink}
      />

    </div>
  );
}
