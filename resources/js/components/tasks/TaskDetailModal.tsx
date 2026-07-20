import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    X,
    CheckSquare,
    MessageSquare,
    Clock,
    GitBranch,
    User,
    Calendar,
    AlertCircle,
    Plus,
    Send,
    Trash2,
} from 'lucide-react';

interface UserItem {
    id: number;
    name: string;
    email: string;
}

interface ChecklistItem {
    id: number;
    title: string;
    is_completed: boolean;
}

interface CommentItem {
    id: number;
    content: string;
    user?: UserItem;
    created_at: string;
}

interface TaskData {
    id: number;
    project_id: number;
    board_column_id: number;
    title: string;
    description?: string;
    type: 'bug' | 'feature' | 'improvement' | 'task';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    story_points?: number;
    assignee?: UserItem;
    assignee_id?: number;
    due_date?: string;
    git_branch?: string;
    checklists?: ChecklistItem[];
    comments?: CommentItem[];
    activities?: any[];
}

interface TaskDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: TaskData | null;
    columns?: { id: number; name: string }[];
    users?: UserItem[];
}

export function TaskDetailModal({ isOpen, onClose, task, columns = [], users = [] }: TaskDetailModalProps) {
    const [activeTab, setActiveTab] = useState<'checklist' | 'comments' | 'activity'>('checklist');
    const [newChecklistTitle, setNewChecklistTitle] = useState('');
    const [newCommentContent, setNewCommentContent] = useState('');
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [descriptionText, setDescriptionText] = useState('');

    if (!isOpen || !task) return null;

    const handleStatusChange = (columnId: number) => {
        router.patch(`/tasks/${task.id}`, { board_column_id: columnId }, { preserveScroll: true });
    };

    const handlePriorityChange = (priority: string) => {
        router.patch(`/tasks/${task.id}`, { priority }, { preserveScroll: true });
    };

    const handleAssigneeChange = (assigneeId: number | string) => {
        router.patch(`/tasks/${task.id}`, { assignee_id: assigneeId || null }, { preserveScroll: true });
    };

    const handleAddChecklist = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChecklistTitle.trim()) return;
        router.post(`/tasks/${task.id}/checklists`, { title: newChecklistTitle }, {
            preserveScroll: true,
            onSuccess: () => setNewChecklistTitle(''),
        });
    };

    const handleToggleChecklist = (checklistId: number) => {
        router.patch(`/checklists/${checklistId}/toggle`, {}, { preserveScroll: true });
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommentContent.trim()) return;
        router.post(`/tasks/${task.id}/comments`, { content: newCommentContent }, {
            preserveScroll: true,
            onSuccess: () => setNewCommentContent(''),
        });
    };

    const handleSaveDescription = () => {
        router.patch(`/tasks/${task.id}`, { description: descriptionText }, {
            preserveScroll: true,
            onSuccess: () => setIsEditingDescription(false),
        });
    };

    const handleDeleteTask = () => {
        if (confirm('Are you sure you want to delete this task?')) {
            router.delete(`/tasks/${task.id}`);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
                className="w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-background/60">
                    <div className="flex items-center space-x-3">
                        <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                                task.type === 'bug'
                                    ? 'bg-destructive/10 text-destructive border-destructive/30'
                                    : task.type === 'feature'
                                    ? 'bg-primary/10 text-primary border-primary/30'
                                    : 'bg-accent/10 text-accent-foreground border-accent/30'
                            }`}
                        >
                            {task.type}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">TASK-{task.id}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleDeleteTask}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition"
                            title="Delete Task"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Main Body (2 Columns) */}
                <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
                    {/* LEFT MAIN PANE */}
                    <div className="flex-1 p-6 space-y-6 border-r border-border/80">
                        {/* Title */}
                        <div>
                            <h1 className="text-xl font-bold text-foreground">{task.title}</h1>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                                <span>Description</span>
                                {!isEditingDescription && (
                                    <button
                                        onClick={() => {
                                            setDescriptionText(task.description || '');
                                            setIsEditingDescription(true);
                                        }}
                                        className="text-primary hover:underline"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>

                            {isEditingDescription ? (
                                <div className="space-y-2">
                                    <textarea
                                        rows={4}
                                        value={descriptionText}
                                        onChange={(e) => setDescriptionText(e.target.value)}
                                        className="w-full bg-background border border-input rounded-lg p-3 text-sm text-foreground focus:outline-none focus:border-ring"
                                        placeholder="Add task description..."
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => setIsEditingDescription(false)}
                                            className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveDescription}
                                            className="px-3 py-1 bg-primary hover:bg-primary/90 text-xs font-medium text-primary-foreground rounded-md transition"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 bg-background/60 rounded-xl border border-border text-sm text-foreground min-h-[70px] whitespace-pre-wrap">
                                    {task.description || <span className="text-muted-foreground italic">No description provided.</span>}
                                </div>
                            )}
                        </div>

                        {/* Sub-tabs: Checklist / Comments / Activity */}
                        <div className="space-y-4 pt-2">
                            <div className="flex border-b border-border text-sm">
                                <button
                                    onClick={() => setActiveTab('checklist')}
                                    className={`pb-2 px-3 font-medium transition border-b-2 flex items-center space-x-2 ${
                                        activeTab === 'checklist'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <CheckSquare className="w-4 h-4" />
                                    <span>Checklist ({task.checklists?.length || 0})</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('comments')}
                                    className={`pb-2 px-3 font-medium transition border-b-2 flex items-center space-x-2 ${
                                        activeTab === 'comments'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    <span>Comments ({task.comments?.length || 0})</span>
                                </button>
                            </div>

                            {/* TAB CONTENT: CHECKLIST */}
                            {activeTab === 'checklist' && (
                                <div className="space-y-3">
                                    <form onSubmit={handleAddChecklist} className="flex space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Add sub-task item..."
                                            value={newChecklistTitle}
                                            onChange={(e) => setNewChecklistTitle(e.target.value)}
                                            className="flex-1 bg-background border border-input rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-ring"
                                        />
                                        <button
                                            type="submit"
                                            className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-xs text-primary-foreground font-medium rounded-lg transition flex items-center"
                                        >
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add
                                        </button>
                                    </form>

                                    <div className="space-y-1.5">
                                        {task.checklists?.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => handleToggleChecklist(item.id)}
                                                className="flex items-center space-x-3 p-2 bg-background/40 border border-border/60 rounded-lg cursor-pointer hover:border-border transition"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={item.is_completed}
                                                    readOnly
                                                    className="w-4 h-4 rounded accent-primary bg-background border-input cursor-pointer"
                                                />
                                                <span
                                                    className={`text-xs ${
                                                        item.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'
                                                    }`}
                                                >
                                                    {item.title}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB CONTENT: COMMENTS */}
                            {activeTab === 'comments' && (
                                <div className="space-y-4">
                                    <form onSubmit={handleAddComment} className="space-y-2">
                                        <textarea
                                            rows={2}
                                            placeholder="Write a comment..."
                                            value={newCommentContent}
                                            onChange={(e) => setNewCommentContent(e.target.value)}
                                            className="w-full bg-background border border-input rounded-lg p-2.5 text-xs text-foreground focus:outline-none focus:border-ring"
                                        />
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-xs text-primary-foreground font-medium rounded-lg transition flex items-center"
                                            >
                                                <Send className="w-3.5 h-3.5 mr-1.5" /> Post Comment
                                            </button>
                                        </div>
                                    </form>

                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                        {task.comments?.map((comment) => (
                                            <div key={comment.id} className="p-3 bg-background/60 border border-border/80 rounded-xl space-y-1">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-semibold text-foreground">{comment.user?.name || 'Teammate'}</span>
                                                    <span className="text-muted-foreground text-[10px]">
                                                        {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-foreground">{comment.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT METADATA SIDEBAR */}
                    <div className="w-full md:w-72 p-6 bg-background/40 space-y-5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Task Details</h3>

                        {/* Status Column */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Status Column</label>
                            <select
                                value={task.board_column_id}
                                onChange={(e) => handleStatusChange(Number(e.target.value))}
                                className="w-full bg-card border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-ring"
                            >
                                {columns.map((col) => (
                                    <option key={col.id} value={col.id}>
                                        {col.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Priority */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Priority</label>
                            <select
                                value={task.priority}
                                onChange={(e) => handlePriorityChange(e.target.value)}
                                className="w-full bg-card border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-ring capitalize"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        {/* Assignee */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Assignee</label>
                            <select
                                value={task.assignee_id || ''}
                                onChange={(e) => handleAssigneeChange(e.target.value)}
                                className="w-full bg-card border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-ring"
                            >
                                <option value="">Unassigned</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Story Points */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Story Points</label>
                            <input
                                type="number"
                                min="0"
                                value={task.story_points || ''}
                                onChange={(e) => router.patch(`/tasks/${task.id}`, { story_points: e.target.value }, { preserveScroll: true })}
                                placeholder="e.g. 3"
                                className="w-full bg-card border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-ring"
                            />
                        </div>

                        {/* Due Date */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Due Date</label>
                            <input
                                type="date"
                                value={task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''}
                                onChange={(e) => router.patch(`/tasks/${task.id}`, { due_date: e.target.value }, { preserveScroll: true })}
                                className="w-full bg-card border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-ring"
                            />
                        </div>

                        {/* Git Branch */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground flex items-center">
                                <GitBranch className="w-3.5 h-3.5 mr-1 text-primary" /> Git Reference
                            </label>
                            <input
                                type="text"
                                value={task.git_branch || ''}
                                onChange={(e) => router.patch(`/tasks/${task.id}`, { git_branch: e.target.value }, { preserveScroll: true })}
                                placeholder="feat/auth-service"
                                className="w-full bg-card border border-input rounded-lg px-3 py-2 text-xs text-mono text-primary focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
