import { router } from '@inertiajs/react';
import {
    X,
    Plus,
    Send,
    Trash2,
    FileText,
    ExternalLink,
    UploadCloud,
    Loader2,
    Eye,
    Pencil,
    Check,
    Calendar,
    User as UserIcon,
    Tag,
    Clock,
    CheckCircle2,
    MessageSquare,
    Paperclip,
    Hash,
    Sparkles,
    Bookmark,
    Info,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { isMediaFileType, MediaPreviewModal } from '@/components/departments/MediaPreviewModal';
import { DeleteTaskConfirmModal } from '@/components/tasks/DeleteTaskConfirmModal';
import { Button } from '@/components/ui/button';

interface UserItem {
    id: number;
    name: string;
    email?: string;
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

interface TaskDocumentItem {
    id?: number;
    name: string;
    size: string;
    type: string;
    date: string;
    file_path?: string;
}

interface TaskData {
    id: number;
    project_id: number;
    board_column_id: number;
    board_column?: { id: number; name: string };
    boardColumn?: { id: number; name: string };
    title: string;
    description?: string;
    type: 'bug' | 'feature' | 'improvement' | 'task' | 'activity';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    story_points?: number;
    assignee?: UserItem;
    assignee_id?: number;
    due_date?: string;
    updated_at?: string;
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
    const formatDateForInput = (dateStr?: string) => {
        if (!dateStr) {
            return '';
        }

        const match = dateStr.match(/^(\d{4}-\d{2}-\d{2})/);

        return match ? match[1] : '';
    };

    const [activeTab, setActiveTab] = useState<'checklist' | 'comments' | 'documents'>('checklist');
    const [newChecklistTitle, setNewChecklistTitle] = useState('');
    const [checklistName, setChecklistName] = useState('Default Checklist');
    const [checklistDescription, setChecklistDescription] = useState('');
    const [newCommentContent, setNewCommentContent] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleText, setTitleText] = useState('');
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [descriptionText, setDescriptionText] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUploadingDoc, setIsUploadingDoc] = useState(false);

    // Document State
    const [editingDocIdx, setEditingDocIdx] = useState<number | null>(null);
    const [editingDocName, setEditingDocName] = useState<string>('');
    const [selectedMediaDoc, setSelectedMediaDoc] = useState<any | null>(null);
    const [isMediaModalOpen, setIsMediaModalOpen] = useState<boolean>(false);

    const [uploadedDocsList, setUploadedDocsList] = useState<TaskDocumentItem[]>([
        {
            id: 1,
            name: 'Task_Specification_v1.0.pdf',
            size: '2.4 MB',
            type: 'PDF',
            date: 'Yesterday',
            file_path: 'department-documents/Task_Specification_v1.0.pdf',
        },
        {
            id: 2,
            name: 'Architecture_Diagram.png',
            size: '1.8 MB',
            type: 'PNG',
            date: 'Just now',
            file_path: 'department-documents/Architecture_Diagram.png',
        },
    ]);

    const [prevTaskKey, setPrevTaskKey] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>(formatDateForInput(task?.due_date));
    const [assigneeId, setAssigneeId] = useState<string>(task?.assignee_id ? String(task.assignee_id) : '');
    const [priority, setPriority] = useState<string>(task?.priority || 'medium');
    const [statusId, setStatusId] = useState<number>(task?.board_column_id || task?.board_column?.id || task?.boardColumn?.id || 1);
    const [storyPoints, setStoryPoints] = useState<string>(task?.story_points ? String(task.story_points) : '');
    const [taskType, setTaskType] = useState<string>(task?.type || 'task');
    const [localChecklists, setLocalChecklists] = useState<ChecklistItem[]>(task?.checklists || []);
    const [localComments, setLocalComments] = useState<CommentItem[]>(task?.comments || []);

    const taskKey = task ? `${task.id}-${task.updated_at || ''}-${(task.checklists || []).length}-${(task.comments || []).length}` : '';

    if (taskKey !== prevTaskKey) {
        setPrevTaskKey(taskKey);
        setDueDate(formatDateForInput(task?.due_date));
        setAssigneeId(task?.assignee_id ? String(task.assignee_id) : '');
        setPriority(task?.priority || 'medium');
        setStatusId(task?.board_column_id || task?.board_column?.id || task?.boardColumn?.id || 1);
        setDescriptionText(task?.description || '');
        setTitleText(task?.title || '');
        setStoryPoints(task?.story_points ? String(task.story_points) : '');
        setTaskType(task?.type || 'task');
        setLocalChecklists(task?.checklists || []);
        setLocalComments(task?.comments || []);
    }

    if (!isOpen || !task) {
        return null;
    }

    const activeColumns = columns.length > 0 ? columns : [
        { id: 1, name: 'To Do' },
        { id: 2, name: 'In Progress' },
        { id: 3, name: 'Review' },
        { id: 4, name: 'Done' },
    ];

    // Realtime Optimistic Title Save
    const handleSaveTitle = () => {
        if (!titleText.trim()) {
            return;
        }

        setIsEditingTitle(false);
        toast.success('Title updated');
        router.patch(`/tasks/${task.id}`, { title: titleText }, { preserveScroll: true, preserveState: true });
    };

    // Realtime Optimistic Description Save
    const handleSaveDescription = () => {
        setIsEditingDescription(false);
        toast.success('Description updated');
        router.patch(`/tasks/${task.id}`, { description: descriptionText }, { preserveScroll: true, preserveState: true });
    };

    const handleStatusChange = (newColId: number) => {
        setStatusId(newColId);
        router.patch(`/tasks/${task.id}`, { board_column_id: newColId }, { preserveScroll: true, preserveState: true });
    };

    const handlePriorityChange = (newPriority: string) => {
        setPriority(newPriority);
        router.patch(`/tasks/${task.id}`, { priority: newPriority }, { preserveScroll: true, preserveState: true });
    };

    const handleAssigneeChange = (newAssigneeId: string) => {
        setAssigneeId(newAssigneeId);
        router.patch(`/tasks/${task.id}`, { assignee_id: newAssigneeId || null }, { preserveScroll: true, preserveState: true });
    };

    const handleDueDateChange = (newDueDate: string) => {
        setDueDate(newDueDate);
        router.patch(`/tasks/${task.id}`, { due_date: newDueDate || null }, { preserveScroll: true, preserveState: true });
    };

    const handleStoryPointsChange = (val: string) => {
        setStoryPoints(val);
        const points = val ? parseInt(val, 10) : null;
        router.patch(`/tasks/${task.id}`, { story_points: points }, { preserveScroll: true, preserveState: true });
    };

    const handleTypeChange = (newType: string) => {
        setTaskType(newType);
        router.patch(`/tasks/${task.id}`, { type: newType }, { preserveScroll: true, preserveState: true });
    };

    // Realtime Optimistic Checklist Handlers
    const handleAddChecklist = (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }

        if (!newChecklistTitle.trim()) {
            return;
        }

        const title = newChecklistTitle.trim();
        const tempItem: ChecklistItem = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            title,
            is_completed: false,
        };

        setLocalChecklists((prev) => [...prev, tempItem]);
        setNewChecklistTitle('');
        toast.success('Checklist item added');

        router.post(`/tasks/${task.id}/checklists`, { title }, { preserveScroll: true, preserveState: true });
    };

    const handleToggleChecklist = (checklistId: number) => {
        setLocalChecklists((prev) =>
            prev.map((c) => (c.id === checklistId ? { ...c, is_completed: !c.is_completed } : c))
        );

        if (checklistId > 1000000000) {
            return;
        }

        router.patch(`/checklists/${checklistId}/toggle`, {}, { preserveScroll: true, preserveState: true });
    };

    const handleDeleteChecklist = (checklistId: number, e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }

        setLocalChecklists((prev) => prev.filter((c) => c.id !== checklistId));
        toast.success('Checklist item removed');

        if (checklistId > 1000000000) {
            return;
        }

        router.delete(`/checklists/${checklistId}`, { preserveScroll: true, preserveState: true });
    };

    const handleApplyTemplate = (templateName: string) => {
        const templates: Record<string, string[]> = {
            qa: ['Write unit & integration tests', 'Pass code linting & type checks', 'Staging deployment test', 'PO sign-off & approval'],
            feature: ['UI/UX design review', 'API integration', 'Cross-browser testing', 'Update user documentation'],
            bug: ['Reproduce issue locally', 'Identify root cause', 'Apply bug fix', 'Verify regression suite'],
        };

        const items = templates[templateName] || templates.qa;

        items.forEach((title) => {
            const tempItem: ChecklistItem = {
                id: Date.now() + Math.floor(Math.random() * 10000),
                title,
                is_completed: false,
            };
            setLocalChecklists((prev) => [...prev, tempItem]);
            router.post(`/tasks/${task.id}/checklists`, { title }, { preserveScroll: true, preserveState: true });
        });

        toast.success(`Applied template: ${templateName.toUpperCase()}`);
    };

    // Realtime Optimistic Comment Posting
    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newCommentContent.trim()) {
            return;
        }

        const content = newCommentContent.trim();
        const tempComment: CommentItem = {
            id: Date.now(),
            content,
            created_at: new Date().toISOString(),
            user: { id: 0, name: 'You' },
        };

        setLocalComments((prev) => [tempComment, ...prev]);
        setNewCommentContent('');
        toast.success('Comment posted');

        router.post(`/tasks/${task.id}/comments`, { content }, { preserveScroll: true, preserveState: true });
    };

    const handleConfirmDelete = () => {
        setIsDeleting(true);
        router.delete(`/tasks/${task.id}`, {
            onSuccess: () => {
                setIsDeleting(false);
                setIsDeleteModalOpen(false);
                toast.success(`Task #${task.id} deleted`);
                onClose();
            },
            onError: () => setIsDeleting(false),
        });
    };

    // Document Handlers: View (Media Pop-up vs New Tab for Docs), Rename, Delete
    const handleViewDocument = (doc: TaskDocumentItem) => {
        const ext = doc.type.toLowerCase().trim();

        if (isMediaFileType(ext)) {
            // Media files: Open pop-up preview modal
            setSelectedMediaDoc({
                id: doc.id || 1,
                department_id: 1,
                name: doc.name,
                file_path: doc.file_path || `department-documents/${doc.name}`,
                file_type: doc.type,
                file_size: 1024 * 1024,
                created_at: doc.date,
            });
            setIsMediaModalOpen(true);
        } else {
            // PDFs & other docs: Open in new tab with downloadable view link
            const viewUrl = doc.id
                ? `/departments/documents/${doc.id}/view`
                : `/departments/documents`;
            window.open(viewUrl, '_blank', 'noopener,noreferrer');
        }
    };

    const handleStartRenameDoc = (idx: number, currentName: string) => {
        setEditingDocIdx(idx);
        setEditingDocName(currentName);
    };

    const handleSaveRenameDoc = (idx: number, doc: TaskDocumentItem) => {
        if (!editingDocName.trim()) {
            setEditingDocIdx(null);

            return;
        }

        const newName = editingDocName.trim();

        setUploadedDocsList((prev) =>
            prev.map((d, i) => (i === idx ? { ...d, name: newName } : d))
        );
        setEditingDocIdx(null);
        toast.success(`Document renamed to "${newName}"`);

        if (doc.id) {
            router.patch(`/departments/documents/${doc.id}`, { name: newName }, { preserveScroll: true });
        }
    };

    const handleDeleteDoc = (idx: number, doc: TaskDocumentItem) => {
        setUploadedDocsList((prev) => prev.filter((_, i) => i !== idx));
        toast.success(`Document "${doc.name}" deleted`);

        if (doc.id) {
            router.delete(`/departments/documents/${doc.id}`, { preserveScroll: true });
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file || !task) {
            return;
        }

        setIsUploadingDoc(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name);

        router.post(`/tasks/${task.id}/documents`, formData, {
            preserveScroll: true,
            onStart: () => setIsUploadingDoc(true),
            onFinish: () => setIsUploadingDoc(false),
            onSuccess: () => {
                setIsUploadingDoc(false);
                const fileExt = file.name.split('.').pop()?.toUpperCase() || 'FILE';
                const fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
                const newDoc: TaskDocumentItem = {
                    name: file.name,
                    size: fileSize,
                    type: fileExt,
                    date: 'Just now',
                    file_path: `department-documents/${file.name}`,
                };
                setUploadedDocsList((prev) => [newDoc, ...prev]);
                toast.success(`"${file.name}" uploaded & attached to TASK-${task.id}!`);
            },
            onError: () => {
                setIsUploadingDoc(false);
                toast.error('Failed to upload file. Please try again.');
            },
        });
    };

    const completedChecklistsCount = localChecklists.filter((c) => c.is_completed).length;
    const totalChecklistsCount = localChecklists.length;
    const checklistProgressPercent = totalChecklistsCount > 0
        ? Math.round((completedChecklistsCount / totalChecklistsCount) * 100)
        : 0;

    return (
        <>
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
                <div
                    className="w-full max-w-4xl max-h-[92vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto text-foreground"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* 1. Header: Task Details (ID, Type, Project) & Action Buttons */}
                    <div className="px-6 py-4 border-b border-border/80 flex items-center justify-between bg-muted/20 gap-4">
                        <div className="flex items-center space-x-2 min-w-0">
                            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border flex items-center gap-1">
                                <Hash className="w-3 h-3" />
                                TASK-{task.id}
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            {/* Type Switcher Badge */}
                            <select
                                value={taskType}
                                onChange={(e) => handleTypeChange(e.target.value)}
                                className="text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded-md px-2.5 py-1 cursor-pointer focus:outline-none"
                            >
                                <option value="task">Task</option>
                                <option value="feature">Feature</option>
                                <option value="bug">Bug Fix</option>
                                <option value="improvement">Improvement</option>
                                <option value="activity">Activity</option>
                            </select>
                        </div>

                        {/* Top Right Actions */}
                        <div className="flex items-center space-x-2 shrink-0">
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="px-3 py-1.5 text-xs font-semibold text-rose-500 border border-rose-500/30 hover:bg-rose-500/10 rounded-lg transition inline-flex items-center shadow-xs"
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                            </button>

                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 flex-1 overflow-y-auto max-h-[75vh] space-y-6">
                        {/* 2. Task Title (With Realtime Inline Editing) */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Task Title</label>
                                {!isEditingTitle && (
                                    <button
                                        onClick={() => setIsEditingTitle(true)}
                                        className="text-xs text-primary font-semibold hover:underline flex items-center space-x-1"
                                    >
                                        <Pencil className="w-3 h-3" />
                                        <span>Edit Title</span>
                                    </button>
                                )}
                            </div>

                            {isEditingTitle ? (
                                <div className="flex items-center space-x-2 mt-1">
                                    <input
                                        type="text"
                                        value={titleText}
                                        onChange={(e) => setTitleText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSaveTitle();
                                            } else if (e.key === 'Escape') {
                                                setIsEditingTitle(false);
                                                setTitleText(task.title);
                                            }
                                        }}
                                        autoFocus
                                        className="flex-1 h-9 px-3 bg-background border border-primary rounded-lg text-base font-bold text-foreground focus:outline-none shadow-sm"
                                        placeholder="Task title..."
                                    />
                                    <Button
                                        size="sm"
                                        onClick={handleSaveTitle}
                                        className="h-9 px-3 bg-primary text-primary-foreground font-bold text-xs shrink-0"
                                    >
                                        <Check className="w-4 h-4 mr-1" /> Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditingTitle(false);
                                            setTitleText(task.title);
                                        }}
                                        className="h-9 px-3 text-xs shrink-0"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <h2
                                    onClick={() => setIsEditingTitle(true)}
                                    className="text-xl font-bold text-foreground hover:text-primary transition cursor-pointer leading-tight"
                                >
                                    {titleText || task.title}
                                </h2>
                            )}
                        </div>

                        {/* 3. Task Description (Right below Task Title) */}
                        <div className="space-y-2 pt-2 border-t border-border/60">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center space-x-1.5">
                                    <FileText className="w-3.5 h-3.5 text-primary" />
                                    <span>Task Description</span>
                                </h3>
                                <button
                                    onClick={() => setIsEditingDescription(!isEditingDescription)}
                                    className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
                                >
                                    <Pencil className="w-3 h-3" />
                                    <span>{isEditingDescription ? 'Cancel' : 'Edit Description'}</span>
                                </button>
                            </div>

                            {isEditingDescription ? (
                                <div className="space-y-2">
                                    <textarea
                                        rows={5}
                                        value={descriptionText}
                                        onChange={(e) => setDescriptionText(e.target.value)}
                                        className="w-full p-3 bg-background border border-primary rounded-xl text-xs text-foreground focus:outline-none resize-y shadow-inner"
                                        placeholder="Enter detailed instructions, acceptance criteria, or specification..."
                                    />
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-muted-foreground">Changes save instantly without page refresh</span>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setIsEditingDescription(false);
                                                    setDescriptionText(task.description || '');
                                                }}
                                                className="text-xs"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleSaveDescription}
                                                className="bg-primary text-primary-foreground text-xs font-bold h-8 px-4"
                                            >
                                                Save Description
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => setIsEditingDescription(true)}
                                    className="p-4 bg-muted/20 border border-border/60 hover:border-primary/40 rounded-xl text-xs text-foreground leading-relaxed whitespace-pre-wrap cursor-pointer transition shadow-2xs"
                                >
                                    {descriptionText || (
                                        <span className="text-muted-foreground italic flex items-center space-x-1">
                                            <span>No description provided yet. Click here to add detailed instructions...</span>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 4. Status & Rest of Metadata Fields (Status, Priority, Assignee, Due Date, Story Points) */}
                        <div className="p-4 border border-border/80 bg-muted/10 rounded-xl grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                            {/* Status Switcher */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-muted-foreground flex items-center space-x-1">
                                    <Tag className="w-3 h-3 text-muted-foreground" />
                                    <span>Status</span>
                                </label>
                                <select
                                    value={statusId}
                                    onChange={(e) => handleStatusChange(Number(e.target.value))}
                                    className="w-full h-8 px-2 bg-background border border-input rounded-lg text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition"
                                >
                                    {activeColumns.map((col) => (
                                        <option key={col.id} value={col.id}>
                                            {col.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Priority Switcher */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-muted-foreground flex items-center space-x-1">
                                    <Sparkles className="w-3 h-3 text-amber-400" />
                                    <span>Priority</span>
                                </label>
                                <select
                                    value={priority}
                                    onChange={(e) => handlePriorityChange(e.target.value)}
                                    className="w-full h-8 px-2 bg-background border border-input rounded-lg text-xs font-semibold text-foreground uppercase focus:outline-none focus:border-primary transition"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>

                            {/* Assignee Switcher */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-muted-foreground flex items-center space-x-1">
                                    <UserIcon className="w-3 h-3 text-muted-foreground" />
                                    <span>Assignee</span>
                                </label>
                                <select
                                    value={assigneeId}
                                    onChange={(e) => handleAssigneeChange(e.target.value)}
                                    className="w-full h-8 px-2 bg-background border border-input rounded-lg text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition"
                                >
                                    <option value="">Unassigned</option>
                                    {users.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Due Date Picker */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-muted-foreground flex items-center space-x-1">
                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                    <span>Due Date</span>
                                </label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => handleDueDateChange(e.target.value)}
                                    className="w-full h-8 px-2 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:border-primary transition"
                                />
                            </div>

                            {/* Story Points Picker */}
                            <div className="space-y-1 col-span-2 sm:col-span-1">
                                <label className="text-[11px] font-semibold text-muted-foreground flex items-center space-x-1">
                                    <Clock className="w-3 h-3 text-muted-foreground" />
                                    <span>Story Points</span>
                                </label>
                                <select
                                    value={storyPoints}
                                    onChange={(e) => handleStoryPointsChange(e.target.value)}
                                    className="w-full h-8 px-2 bg-background border border-input rounded-lg text-xs font-semibold text-foreground focus:outline-none focus:border-primary transition"
                                >
                                    <option value="">Unestimated</option>
                                    <option value="1">1 Point</option>
                                    <option value="2">2 Points</option>
                                    <option value="3">3 Points</option>
                                    <option value="5">5 Points</option>
                                    <option value="8">8 Points</option>
                                    <option value="13">13 Points</option>
                                </select>
                            </div>
                        </div>

                        {/* Navigation Tabs Header */}
                        <div className="border-b border-border/80 flex items-center space-x-6 bg-muted/10 text-xs font-semibold pt-2">
                            <button
                                onClick={() => setActiveTab('checklist')}
                                className={`py-2.5 border-b-2 transition-colors flex items-center space-x-1.5 ${
                                    activeTab === 'checklist'
                                        ? 'border-primary text-primary font-bold'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Checklist</span>
                                {totalChecklistsCount > 0 && (
                                    <span className="px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[10px]">
                                        {completedChecklistsCount}/{totalChecklistsCount}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('comments')}
                                className={`py-2.5 border-b-2 transition-colors flex items-center space-x-1.5 ${
                                    activeTab === 'comments'
                                        ? 'border-primary text-primary font-bold'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Comments</span>
                                {localComments.length > 0 && (
                                    <span className="px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[10px]">
                                        {localComments.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('documents')}
                                className={`py-2.5 border-b-2 transition-colors flex items-center space-x-1.5 ${
                                    activeTab === 'documents'
                                        ? 'border-primary text-primary font-bold'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <Paperclip className="w-3.5 h-3.5" />
                                <span>Attached Documents</span>
                            </button>
                        </div>

                        {/* TAB CONTENT */}

                        {/* TAB 1: CHECKLIST */}
                        {activeTab === 'checklist' && (
                            <div className="p-4 bg-muted/10 border border-border/80 rounded-2xl space-y-5 animate-in fade-in duration-150">
                                {/* Checklist Metadata Header */}
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-bold text-foreground block">
                                            Checklist Name <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={checklistName}
                                            onChange={(e) => setChecklistName(e.target.value)}
                                            placeholder="Enter checklist name"
                                            className="w-full mt-1.5 h-9 px-3 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none focus:border-primary transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-foreground block">Checklist Description</label>
                                        <textarea
                                            rows={2}
                                            value={checklistDescription}
                                            onChange={(e) => setChecklistDescription(e.target.value)}
                                            placeholder="Give the checklist a simple description"
                                            className="w-full mt-1.5 p-3 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none focus:border-primary resize-none transition"
                                        />
                                    </div>
                                </div>

                                {/* Checklist Items Header & Progress */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-1.5">
                                            <h4 className="text-xs font-bold text-foreground">Checklist Items</h4>
                                            <Info className="w-3.5 h-3.5 text-muted-foreground" />
                                        </div>
                                        {totalChecklistsCount > 0 && (
                                            <span className="text-xs font-bold text-primary">
                                                {completedChecklistsCount} / {totalChecklistsCount} Completed ({checklistProgressPercent}%)
                                            </span>
                                        )}
                                    </div>

                                    {totalChecklistsCount > 0 && (
                                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all duration-300 rounded-full"
                                                style={{ width: `${checklistProgressPercent}%` }}
                                            />
                                        </div>
                                    )}

                                    {/* Items List */}
                                    <div className="space-y-2">
                                        {localChecklists.length === 0 ? (
                                            <div className="p-4 border border-dashed border-border/80 rounded-xl text-center text-xs text-muted-foreground italic">
                                                No items in this checklist yet. Add an item below!
                                            </div>
                                        ) : (
                                            localChecklists.map((item) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => handleToggleChecklist(item.id)}
                                                    className="flex items-center justify-between p-3 bg-background border border-border/80 rounded-xl hover:border-primary/50 cursor-pointer transition group"
                                                >
                                                    <div className="flex items-center space-x-3 min-w-0">
                                                        <div
                                                            className={`w-4 h-4 rounded flex items-center justify-center border transition shrink-0 ${
                                                                item.is_completed
                                                                    ? 'bg-primary border-primary text-primary-foreground'
                                                                    : 'border-input bg-background'
                                                            }`}
                                                        >
                                                            {item.is_completed && <Check className="w-3 h-3 stroke-[3]" />}
                                                        </div>
                                                        <span
                                                            className={`text-xs font-medium ${
                                                                item.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'
                                                            }`}
                                                        >
                                                            {item.title}
                                                        </span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleDeleteChecklist(item.id, e)}
                                                        className="p-1 text-muted-foreground hover:text-rose-500 rounded transition"
                                                        title="Delete item"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Add an item input */}
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={newChecklistTitle}
                                                onChange={(e) => setNewChecklistTitle(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddChecklist();
                                                    }
                                                }}
                                                placeholder="Add an item"
                                                className="flex-1 h-9 px-3 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => handleAddChecklist()}
                                                className="h-9 px-3 text-xs font-bold bg-primary text-primary-foreground"
                                            >
                                                <Plus className="w-4 h-4 mr-1" /> Add
                                            </Button>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground pl-1">Press Enter to add to the list.</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            type="button"
                                            onClick={() => toast.success('Checklist structure saved!')}
                                            className="h-9 px-4 bg-primary text-primary-foreground text-xs font-bold shadow-sm"
                                        >
                                            Save Checklist
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => toast.success('Checklist saved as template!')}
                                            className="h-9 px-3 text-xs font-semibold border-border flex items-center space-x-1.5"
                                        >
                                            <Bookmark className="w-3.5 h-3.5" />
                                            <span>Save as Template</span>
                                        </Button>
                                    </div>

                                    {/* Template presets */}
                                    <div className="flex items-center space-x-2">
                                        <span className="text-[11px] font-bold text-muted-foreground">Templates:</span>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleApplyTemplate('qa')}
                                            className="h-8 text-[11px] font-semibold"
                                        >
                                            QA Checklist
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleApplyTemplate('feature')}
                                            className="h-8 text-[11px] font-semibold"
                                        >
                                            Feature Specs
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleApplyTemplate('bug')}
                                            className="h-8 text-[11px] font-semibold"
                                        >
                                            Bug Verification
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: COMMENTS */}
                        {activeTab === 'comments' && (
                            <div className="space-y-6 animate-in fade-in duration-150">
                                {/* Add Comment Form */}
                                <form onSubmit={handleAddComment} className="space-y-2">
                                    <label className="text-xs font-bold text-foreground block uppercase tracking-wider">Add Comment</label>
                                    <textarea
                                        rows={3}
                                        value={newCommentContent}
                                        onChange={(e) => setNewCommentContent(e.target.value)}
                                        placeholder="Type your comment or update for team members..."
                                        className="w-full p-3 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none focus:border-primary resize-y"
                                    />
                                    <div className="flex justify-end">
                                        <Button type="submit" className="bg-primary text-primary-foreground text-xs font-bold h-8 px-4">
                                            <Send className="w-3.5 h-3.5 mr-1.5" /> Post Comment
                                        </Button>
                                    </div>
                                </form>

                                {/* Comments Stream */}
                                <div className="space-y-3 pt-2">
                                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Comment History</h4>
                                    {localComments.length === 0 ? (
                                        <p className="text-xs text-muted-foreground italic p-4 bg-muted/20 rounded-xl text-center border border-border/40">
                                            No comments yet. Leave a comment above to update the team!
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {localComments.map((comment) => (
                                                <div key={comment.id} className="p-3.5 bg-muted/20 border border-border/60 rounded-xl space-y-1.5">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-[10px]">
                                                                {(comment.user?.name || 'U').charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="font-bold text-foreground">{comment.user?.name || 'User'}</span>
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground">
                                                            {new Date(comment.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground whitespace-pre-wrap pl-7">{comment.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB 3: ATTACHED DOCUMENTS (With Delete, Rename, View Media Pop-up vs PDF/Doc New Tab) */}
                        {activeTab === 'documents' && (
                            <div className="space-y-6 animate-in fade-in duration-150">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Attached Files & Documents</h3>
                                        <p className="text-[11px] text-muted-foreground">Upload, view, rename, or delete files attached to this task.</p>
                                    </div>
                                    <a
                                        href="/departments/documents"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-primary hover:underline flex items-center space-x-1"
                                    >
                                        <span>Document Hub</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>

                                {/* Drag & Drop / File Upload Form */}
                                <div className="p-6 border-2 border-dashed border-primary/30 hover:border-primary bg-primary/5 rounded-xl text-center space-y-3 transition">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary w-12 h-12 flex items-center justify-center mx-auto border border-primary/20">
                                        {isUploadingDoc ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <UploadCloud className="w-6 h-6" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-foreground">
                                            {isUploadingDoc ? 'Uploading document...' : 'Click to select or drag and drop files here'}
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">
                                            PDF, DOCX, XLSX, Images, or ZIP files up to 50MB
                                        </p>
                                    </div>

                                    <div className="pt-2">
                                        <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold rounded-lg shadow-sm transition">
                                            {isUploadingDoc ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    <span>Uploading File...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4 mr-1.5" />
                                                    <span>Choose File to Upload</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                disabled={isUploadingDoc}
                                                className="hidden"
                                                onChange={handleFileUpload}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Documents List with View, Rename & Delete Actions */}
                                <div className="space-y-3 pt-2">
                                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Task Documents Directory</h4>
                                    <div className="space-y-2">
                                        {uploadedDocsList.length === 0 ? (
                                            <div className="p-4 border border-dashed border-border/80 rounded-xl text-center text-xs text-muted-foreground italic">
                                                No documents attached to this task yet.
                                            </div>
                                        ) : (
                                            uploadedDocsList.map((doc, idx) => (
                                                <div key={idx} className="p-3 bg-muted/20 border border-border/60 rounded-xl flex items-center justify-between hover:border-primary/50 transition gap-3">
                                                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                                                        <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
                                                            <FileText className="w-4 h-4" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            {editingDocIdx === idx ? (
                                                                <div className="flex items-center space-x-2">
                                                                    <input
                                                                        type="text"
                                                                        value={editingDocName}
                                                                        onChange={(e) => setEditingDocName(e.target.value)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                handleSaveRenameDoc(idx, doc);
                                                                            } else if (e.key === 'Escape') {
                                                                                setEditingDocIdx(null);
                                                                            }
                                                                        }}
                                                                        autoFocus
                                                                        className="flex-1 h-7 px-2 bg-background border border-primary rounded text-xs text-foreground focus:outline-none"
                                                                    />
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleSaveRenameDoc(idx, doc)}
                                                                        className="h-7 px-2 text-[11px] font-bold bg-primary text-primary-foreground shrink-0"
                                                                    >
                                                                        <Check className="w-3 h-3" />
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() => setEditingDocIdx(null)}
                                                                        className="h-7 px-2 text-[11px] shrink-0"
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <h5 className="text-xs font-bold text-foreground truncate">
                                                                    {doc.name}
                                                                </h5>
                                                            )}
                                                            <span className="text-[10px] text-muted-foreground block mt-0.5">
                                                                {doc.type} • {doc.size} • Attached {doc.date}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Document Action Controls (View, Rename, Delete) */}
                                                    <div className="flex items-center space-x-1.5 shrink-0">
                                                        {/* View Action: Media pop-up or PDF/Doc New Tab */}
                                                        {isMediaFileType(doc.type) ? (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleViewDocument(doc)}
                                                                className="h-7 text-[11px] font-semibold border-border"
                                                                title="View image/video preview pop-up"
                                                            >
                                                                <Eye className="w-3 h-3 mr-1 text-primary" /> View Preview
                                                            </Button>
                                                        ) : (
                                                            <a
                                                                href={doc.id ? `/departments/documents/${doc.id}/view` : `/departments/documents`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-7 text-[11px] font-semibold border-border"
                                                                    title="Open document in new tab with download link"
                                                                >
                                                                    <ExternalLink className="w-3 h-3 mr-1 text-primary" /> Open New Tab
                                                                </Button>
                                                            </a>
                                                        )}

                                                        {/* Rename Action */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleStartRenameDoc(idx, doc.name)}
                                                            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition"
                                                            title="Rename document"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </button>

                                                        {/* Delete Action */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteDoc(idx, doc)}
                                                            className="p-1.5 rounded text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition"
                                                            title="Delete document"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Media Pop-up Preview Modal */}
            <MediaPreviewModal
                isOpen={isMediaModalOpen}
                onClose={() => setIsMediaModalOpen(false)}
                document={selectedMediaDoc}
            />

            {/* Delete Task Confirmation Modal */}
            <DeleteTaskConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                taskTitle={task.title}
                isDeleting={isDeleting}
            />
        </>
    );
}
