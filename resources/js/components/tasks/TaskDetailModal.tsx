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
    Pencil,
    Paperclip,
    ClipboardList,
    ChevronDown,
    Tag,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    board_column?: { id: number; name: string };
    boardColumn?: { id: number; name: string };
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
    const [activeTab, setActiveTab] = useState<'tasks' | 'checklist' | 'comments' | 'activity'>('tasks');
    const [newChecklistTitle, setNewChecklistTitle] = useState('');
    const [newCommentContent, setNewCommentContent] = useState('');
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [descriptionText, setDescriptionText] = useState('');
    const [tags, setTags] = useState<string[]>(['frontend', 'v2-api']);
    const [newTag, setNewTag] = useState('');
    const [isAddingSubtask, setIsAddingSubtask] = useState(false);
    const [subtaskTitle, setSubtaskTitle] = useState('');

    if (!isOpen || !task) return null;

    const defaultColumns = [
        { id: 1, name: 'Backlog' },
        { id: 2, name: 'To Do' },
        { id: 3, name: 'In Progress' },
        { id: 4, name: 'In Review' },
        { id: 5, name: 'Done' },
    ];

    const currentColumnName = task.board_column?.name || task.boardColumn?.name || 'To Do';

    const activeColumns = columns && columns.length > 0
        ? columns
        : (task.board_column_id
            ? [
                { id: task.board_column_id, name: currentColumnName },
                ...defaultColumns.filter(c => c.id !== task.board_column_id)
              ]
            : defaultColumns);

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

    const handleAddTag = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTag.trim()) return;
        if (!tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
        }
        setNewTag('');
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const handleAddSubtask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subtaskTitle.trim()) return;
        router.post(`/tasks/${task.id}/checklists`, { title: subtaskTitle }, {
            preserveScroll: true,
            onSuccess: () => {
                setSubtaskTitle('');
                setIsAddingSubtask(false);
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
            <div
                className="w-full max-w-5xl lg:max-w-6xl max-h-[92vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top Breadcrumb & Actions Bar */}
                <div className="px-4 sm:px-6 py-3 border-b border-border/80 flex flex-wrap items-center justify-between gap-3 bg-background/80">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground font-medium">
                        <span>Activities</span>
                        <span>&gt;</span>
                        <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-xs">{task.title}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleDeleteTask}
                            className="px-3 py-1 text-xs font-semibold text-rose-400 border border-rose-500/40 hover:bg-rose-500/10 rounded-lg transition inline-flex items-center"
                        >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                        </button>

                        <button
                            onClick={() => {
                                setDescriptionText(task.description || '');
                                setIsEditingDescription(true);
                            }}
                            className="px-3 py-1 text-xs font-semibold text-muted-foreground border border-border hover:text-foreground hover:bg-muted/50 rounded-lg transition inline-flex items-center"
                        >
                            <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                        </button>

                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Main 2-Column Responsive Body */}
                <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
                    {/* LEFT MAIN PANE (~65% Width) */}
                    <div className="flex-1 p-4 sm:p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-border/80 min-w-0">
                        {/* Title Header */}
                        <div className="flex items-start space-x-3">
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                                <ClipboardList className="w-6 h-6" />
                            </div>
                            <div className="space-y-1 min-w-0 flex-1">
                                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground leading-snug">
                                    {task.title}
                                </h1>
                                <span className="text-xs font-mono text-muted-foreground block">
                                    TASK-{task.id}
                                </span>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-2 bg-background/40 border border-border/60 rounded-xl p-4">
                            <div className="flex items-center justify-between text-xs font-bold text-foreground">
                                <span>Description</span>
                                {!isEditingDescription && (
                                    <button
                                        onClick={() => {
                                            setDescriptionText(task.description || '');
                                            setIsEditingDescription(true);
                                        }}
                                        className="text-primary hover:underline text-xs font-medium inline-flex items-center"
                                    >
                                        <Pencil className="w-3 h-3 mr-1" /> Edit
                                    </button>
                                )}
                            </div>

                            {isEditingDescription ? (
                                <div className="space-y-2 pt-1">
                                    <textarea
                                        rows={4}
                                        value={descriptionText}
                                        onChange={(e) => setDescriptionText(e.target.value)}
                                        className="w-full bg-background border border-input rounded-lg p-3 text-xs text-foreground focus:outline-none focus:border-ring"
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
                                            Save Description
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                    {task.description || <span className="italic">No description provided for this task.</span>}
                                </p>
                            )}
                        </div>

                        {/* Interactive Sub-Tabs */}
                        <div className="space-y-4 pt-2">
                            <div className="flex flex-wrap border-b border-border text-xs font-semibold gap-x-6 gap-y-2">
                                <button
                                    onClick={() => setActiveTab('tasks')}
                                    className={`pb-3 transition border-b-2 flex items-center space-x-1.5 ${
                                        activeTab === 'tasks'
                                            ? 'border-primary text-primary font-bold'
                                            : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <span>Tasks</span>
                                    <span className="px-1.5 py-0.5 rounded-full bg-muted text-[10px] font-mono">
                                        {task.checklists?.length || 0}
                                    </span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('checklist')}
                                    className={`pb-3 transition border-b-2 flex items-center space-x-1.5 ${
                                        activeTab === 'checklist'
                                            ? 'border-primary text-primary font-bold'
                                            : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <span>Checklist</span>
                                    <span className="px-1.5 py-0.5 rounded-full bg-muted text-[10px] font-mono">
                                        {task.checklists?.filter((c) => c.is_completed).length || 0}/
                                        {task.checklists?.length || 0}
                                    </span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('comments')}
                                    className={`pb-3 transition border-b-2 flex items-center space-x-1.5 ${
                                        activeTab === 'comments'
                                            ? 'border-primary text-primary font-bold'
                                            : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <span>Comments</span>
                                    <span className="px-1.5 py-0.5 rounded-full bg-muted text-[10px] font-mono">
                                        {task.comments?.length || 0}
                                    </span>
                                </button>
                            </div>

                            {/* TAB CONTENT: TASKS TABLE */}
                            {activeTab === 'tasks' && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs font-bold text-foreground">Sub-Tasks</span>
                                            <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-mono">
                                                {task.checklists?.length || 0}
                                            </span>
                                        </div>

                                        <Button
                                            onClick={() => setIsAddingSubtask(!isAddingSubtask)}
                                            size="sm"
                                            className="bg-primary text-primary-foreground text-xs h-8"
                                        >
                                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Task
                                        </Button>
                                    </div>

                                    {isAddingSubtask && (
                                        <form onSubmit={handleAddSubtask} className="flex gap-2 p-3 bg-muted/30 border border-border rounded-xl">
                                            <Input
                                                type="text"
                                                placeholder="Sub-task name..."
                                                value={subtaskTitle}
                                                onChange={(e) => setSubtaskTitle(e.target.value)}
                                                className="flex-1 text-xs bg-background"
                                                autoFocus
                                            />
                                            <Button type="submit" size="sm" className="bg-primary text-xs">
                                                Save
                                            </Button>
                                        </form>
                                    )}

                                    <div className="bg-background/60 border border-border rounded-xl overflow-hidden shadow-sm">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-xs text-muted-foreground">
                                                <thead className="bg-muted/50 text-[10px] uppercase font-bold tracking-wider border-b border-border">
                                                    <tr>
                                                        <th className="p-3">Task</th>
                                                        <th className="p-3">Assignee</th>
                                                        <th className="p-3">Due Date</th>
                                                        <th className="p-3 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border">
                                                    {(!task.checklists || task.checklists.length === 0) ? (
                                                        <tr>
                                                            <td colSpan={4} className="p-6 text-center text-muted-foreground italic">
                                                                No sub-tasks available
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        task.checklists.map((item) => (
                                                            <tr key={item.id} className="hover:bg-muted/40 transition">
                                                                <td className="p-3 font-semibold text-foreground flex items-center space-x-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={item.is_completed}
                                                                        onChange={() => handleToggleChecklist(item.id)}
                                                                        className="w-3.5 h-3.5 rounded accent-primary bg-background border-input cursor-pointer"
                                                                    />
                                                                    <span className={item.is_completed ? 'line-through text-muted-foreground' : ''}>
                                                                        {item.title}
                                                                    </span>
                                                                </td>
                                                                <td className="p-3 text-foreground font-medium">
                                                                    {task.assignee ? task.assignee.name : 'Unassigned'}
                                                                </td>
                                                                <td className="p-3 font-mono text-[11px]">
                                                                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : '—'}
                                                                </td>
                                                                <td className="p-3 text-right">
                                                                    <button
                                                                        onClick={() => handleToggleChecklist(item.id)}
                                                                        className="text-primary hover:underline text-[11px] font-semibold"
                                                                    >
                                                                        {item.is_completed ? 'Reopen' : 'Done'}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB CONTENT: CHECKLIST */}
                            {activeTab === 'checklist' && (
                                <div className="space-y-3">
                                    <form onSubmit={handleAddChecklist} className="flex space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Add sub-task checklist item..."
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
                                                className="flex items-center space-x-3 p-2.5 bg-background/40 border border-border/60 rounded-xl cursor-pointer hover:border-border transition"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={item.is_completed}
                                                    readOnly
                                                    className="w-4 h-4 rounded accent-primary bg-background border-input cursor-pointer"
                                                />
                                                <span
                                                    className={`text-xs ${
                                                        item.is_completed ? 'line-through text-muted-foreground' : 'text-foreground font-medium'
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
                                            placeholder="Write a team comment..."
                                            value={newCommentContent}
                                            onChange={(e) => setNewCommentContent(e.target.value)}
                                            className="w-full bg-background border border-input rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-ring"
                                        />
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-xs text-primary-foreground font-semibold rounded-lg transition flex items-center shadow-sm"
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

                    {/* RIGHT METADATA SIDEBAR (~35% Width) */}
                    <div className="w-full lg:w-80 p-4 sm:p-6 bg-background/60 space-y-6 shrink-0">
                        {/* Details Panel */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
                                Details
                            </h3>

                            {/* Status */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Status</label>
                                <select
                                    value={task.board_column_id || activeColumns[0]?.id}
                                    onChange={(e) => handleStatusChange(Number(e.target.value))}
                                    className="w-full bg-card border border-input rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-ring font-medium"
                                >
                                    {activeColumns.map((col) => (
                                        <option key={col.id} value={col.id}>
                                            ● {col.name}
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
                                    className="w-full bg-card border border-input rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-ring capitalize font-medium"
                                >
                                    <option value="low">● Low</option>
                                    <option value="medium">● Medium</option>
                                    <option value="high">● High</option>
                                    <option value="urgent">● Urgent</option>
                                </select>
                            </div>

                            {/* Assigned To */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Assigned To</label>
                                <select
                                    value={task.assignee_id || ''}
                                    onChange={(e) => handleAssigneeChange(e.target.value)}
                                    className="w-full bg-card border border-input rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-ring font-medium"
                                >
                                    <option value="">Unassigned</option>
                                    {users.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            SA {u.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Followed By */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Followed By</label>
                                <select
                                    className="w-full bg-card border border-input rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-ring font-medium"
                                    defaultValue=""
                                >
                                    <option value="">No followers</option>
                                    {users.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Dates */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Dates</label>
                                <input
                                    type="date"
                                    value={task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''}
                                    onChange={(e) => router.patch(`/tasks/${task.id}`, { due_date: e.target.value }, { preserveScroll: true })}
                                    className="w-full bg-card border border-input rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-ring font-mono"
                                />
                            </div>

                            {/* Tags Section */}
                            <div className="space-y-2 pt-1">
                                <label className="text-xs font-medium text-muted-foreground block">Tags</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {tags.map((t) => (
                                        <span
                                            key={t}
                                            onClick={() => handleRemoveTag(t)}
                                            className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-semibold cursor-pointer hover:bg-rose-500/20 hover:text-rose-400 transition"
                                            title="Click to remove tag"
                                        >
                                            #{t} ×
                                        </span>
                                    ))}
                                </div>

                                <form onSubmit={handleAddTag} className="flex gap-2 pt-1">
                                    <input
                                        type="text"
                                        placeholder="Add tag..."
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        className="flex-1 bg-card border border-input rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-ring"
                                    />
                                    <Button type="submit" size="sm" variant="outline" className="text-xs h-8">
                                        Add
                                    </Button>
                                </form>
                            </div>

                            {/* Git Reference */}
                            {task.git_branch && (
                                <div className="space-y-1.5 pt-1">
                                    <label className="text-xs font-medium text-muted-foreground flex items-center">
                                        <GitBranch className="w-3.5 h-3.5 mr-1 text-primary" /> Git Branch
                                    </label>
                                    <div className="px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-mono text-primary truncate">
                                        {task.git_branch}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Documents Dropzone */}
                        <div className="space-y-3 pt-2 border-t border-border/60">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Documents
                            </h3>
                            <div className="border border-dashed border-border/80 rounded-2xl p-6 text-center space-y-2 bg-card/40 hover:bg-card/70 transition cursor-pointer">
                                <div className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground/60">
                                    <Paperclip className="w-5 h-5" />
                                </div>
                                <h4 className="text-xs font-semibold text-foreground">No Attachments Available yet.</h4>
                                <p className="text-[10px] text-muted-foreground">Drag & drop files or click to upload</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

