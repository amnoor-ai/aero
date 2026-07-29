import { Head, router } from '@inertiajs/react';
import {
    FileText,
    MessageSquare,
    Pencil,
    Plus,
    Target,
    Folder,
    Calendar,
    Search,
    Filter,
    List,
    Grid,
    FolderPlus,
    Upload,
    Clock,
    CheckSquare,
    Key,
    Copy,
    Eye,
    EyeOff,
    Send,
    CheckCircle2,
    SlidersHorizontal,
    Image,
    Link as LinkIcon,
    FileCode,
    Download,
    Trash2,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { isMediaFileType, MediaPreviewModal  } from '@/components/departments/MediaPreviewModal';
import type {DocumentItem} from '@/components/departments/MediaPreviewModal';
import { CreateFolderModal } from '@/components/projects/CreateFolderModal';
import { CreateTaskWizardModal } from '@/components/tasks/CreateTaskWizardModal';
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

interface ProjectProps {
    project: any;
    stats: {
        total: number;
        todo: number;
        inProgress: number;
        inReview: number;
        completed: number;
        progress: number;
    };
}

type TabType = 'tasks' | 'discussions' | 'milestones' | 'timeline' | 'team' | 'files' | 'credentials';

interface CredentialItem {
    id: number;
    key: string;
    value: string;
    environment: string;
}

export default function ProjectShow({ project, stats }: ProjectProps) {
    const [activeTab, setActiveTab] = useState<TabType>('tasks');
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<any | null>(null);

    const [isEditInfoOpen, setIsEditInfoOpen] = useState(false);
    const [editName, setEditName] = useState(project.name);
    const [editDescription, setEditDescription] = useState(project.description || '');

    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [statusValue, setStatusValue] = useState(project.status);

    // Discussions State
    const [discussionTab, setDiscussionTab] = useState<'media' | 'documents' | 'links'>('media');
    const [commentText, setCommentText] = useState('');
    const [commentsList, setCommentsList] = useState<any[]>(project.comments || []);

    // Files Tab State
    const [fileViewMode, setFileViewMode] = useState<'grid' | 'list'>('grid');
    const [fileTypeFilter, setFileTypeFilter] = useState('all');
    const [fileSearchQuery, setFileSearchQuery] = useState('');
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [foldersList, setFoldersList] = useState<string[]>(['Design Assets', 'API Specs', 'Database Backups']);
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const [previewDocument, setPreviewDocument] = useState<DocumentItem | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Tasks Table View & Filter State
    const [taskViewMode, setTaskViewMode] = useState<'list' | 'grouped'>('list');
    const [taskSearchQuery, setTaskSearchQuery] = useState('');

    // Credentials State
    const [visibleSecretIds, setVisibleSecretIds] = useState<number[]>([]);
    const [credentialsList, setCredentialsList] = useState<CredentialItem[]>([
        { id: 1, key: 'STAGING_API_URL', value: 'https://staging-api.aero.internal/v1', environment: 'Staging' },
        { id: 2, key: 'ZKTECO_DEVICE_KEY', value: 'zk_live_99834110823491', environment: 'Production' },
        { id: 3, key: 'DATABASE_REPLICA_PORT', value: 'postgres://admin:pass@10.0.4.12:5432/db', environment: 'Staging' },
    ]);
    const [newCredKey, setNewCredKey] = useState('');
    const [newCredValue, setNewCredValue] = useState('');
    const [isAddCredOpen, setIsAddCredOpen] = useState(false);

    // Calculate Days to Deadline
    const calculateDaysRemaining = () => {
        if (!project.due_date) {
            return 273;
        }

        const target = new Date(project.due_date);
        const today = new Date();
        const diffTime = target.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > 0 ? diffDays : 0;
    };

    const daysToDeadline = calculateDaysRemaining();

    // Use direct project.tasks (fallback to boardColumns if empty)
    const allProjectTasks = (project.tasks && project.tasks.length > 0)
        ? project.tasks
        : (project.boardColumns || []).flatMap((col: any) =>
            (col.tasks || []).map((t: any) => ({
                ...t,
                boardColumn: col,
            }))
        );

    const filteredTasks = allProjectTasks.filter((t: any) =>
        t.title.toLowerCase().includes(taskSearchQuery.toLowerCase())
    );

    const columnsToGroup = (project.boardColumns && project.boardColumns.length > 0)
        ? project.boardColumns
        : [
            { id: 1, name: 'Backlog' },
            { id: 2, name: 'To Do' },
            { id: 3, name: 'In Progress' },
            { id: 4, name: 'In Review' },
            { id: 5, name: 'Done' },
        ];

    // Project Documents
    const projectDocuments: DocumentItem[] = (project.documents || []).map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        file_path: doc.file_path,
        file_size: doc.file_size,
        file_type: doc.file_type || '',
        formatted_size: doc.formatted_size || '0 B',
        created_at: doc.created_at || '',
        view_url: `/project-documents/${doc.id}/view`,
        download_url: `/project-documents/${doc.id}/download`,
        folder_name: doc.folder_name,
    }));

    // Realtime Filtered Project Documents for Files Tab
    const filteredProjectDocuments = projectDocuments.filter((doc) => {
        if (fileSearchQuery && !doc.name.toLowerCase().includes(fileSearchQuery.toLowerCase())) {
            return false;
        }

        if (selectedFolder && doc.folder_name !== selectedFolder) {
            return false;
        }

        if (fileTypeFilter === 'media') {
            return isMediaFileType(doc.file_type, doc.name);
        }

        if (fileTypeFilter === 'documents') {
            return !isMediaFileType(doc.file_type, doc.name);
        }

        return true;
    });

    const mediaDocuments = projectDocuments.filter((d) => isMediaFileType(d.file_type, d.name));
    const nonMediaDocuments = projectDocuments.filter((d) => !isMediaFileType(d.file_type, d.name));

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        if (selectedFolder) {
            formData.append('folder_name', selectedFolder);
        }

        router.post(`/projects/${project.id}/documents`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`File "${file.name}" uploaded successfully!`);

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            onError: (err) => {
                toast.error(err.file || 'Failed to upload file.');
            },
        });
    };

    const handleDeleteDocument = (docId: number) => {
        if (!confirm('Are you sure you want to delete this document?')) {
            return;
        }

        router.delete(`/project-documents/${docId}`, {
            preserveScroll: true,
            onSuccess: () => toast.success('Document deleted successfully.'),
        });
    };

    const handleViewDocument = (doc: DocumentItem) => {
        if (isMediaFileType(doc.file_type, doc.name)) {
            setPreviewDocument(doc);
        } else {
            window.open(doc.view_url, '_blank');
        }
    };

    const handleEditInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(
            `/projects/${project.id}`,
            { name: editName, description: editDescription },
            {
                preserveScroll: true,
                onSuccess: () => setIsEditInfoOpen(false),
            }
        );
    };

    const handleUpdateStatusSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(
            `/projects/${project.id}`,
            { status: statusValue },
            {
                preserveScroll: true,
                onSuccess: () => setIsStatusOpen(false),
            }
        );
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();

        if (!commentText.trim()) {
            return;
        }

        const newComment = {
            id: Date.now(),
            content: commentText.trim(),
            user: { name: 'Current User' },
            created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setCommentsList([...commentsList, newComment]);
        setCommentText('');
    };

    const handleAddCredential = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newCredKey.trim() || !newCredValue.trim()) {
            return;
        }

        setCredentialsList([
            ...credentialsList,
            {
                id: Date.now(),
                key: newCredKey.trim().toUpperCase(),
                value: newCredValue.trim(),
                environment: 'Production',
            },
        ]);
        setNewCredKey('');
        setNewCredValue('');
        setIsAddCredOpen(false);
    };

    const toggleSecretVisibility = (id: number) => {
        setVisibleSecretIds((prev) =>
            prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
        );
    };

    const formatStatusBadge = (statusName?: string) => {
        const lower = (statusName || 'todo').toLowerCase();

        if (lower.includes('done') || lower.includes('complete')) {
            return <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Completed</span>;
        }

        if (lower.includes('progress')) {
            return <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">In Progress</span>;
        }

        if (lower.includes('review')) {
            return <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30">Lead Review</span>;
        }

        if (lower.includes('backlog')) {
            return <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-500/10 text-slate-400 border border-slate-500/30">Backlog</span>;
        }

        return <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-muted text-muted-foreground border border-border">Todo</span>;
    };

    const renderTaskRow = (t: any) => {
        const checklistsCount = t.checklists?.length || 0;
        const completedChecklists = t.checklists?.filter((c: any) => c.is_completed)?.length || 0;

        return (
            <tr
                key={t.id}
                onClick={() => setSelectedTaskForDetail(t)}
                className="hover:bg-muted/40 cursor-pointer transition"
            >
                <td className="p-3.5 font-semibold text-foreground">
                    <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-muted-foreground">#{t.id}</span>
                        <span className="truncate max-w-xs">{t.title}</span>
                    </div>
                </td>

                <td className="p-3.5">
                    {t.assignee ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">
                                {t.assignee.name?.[0] || 'U'}
                            </div>
                            <span className="text-foreground text-xs">{t.assignee.name}</span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground text-xs italic">Unassigned</span>
                    )}
                </td>

                <td className="p-3.5 text-xs text-muted-foreground">
                    {checklistsCount > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-muted text-foreground text-[10px] font-mono">
                            {completedChecklists}/{checklistsCount} Done
                        </span>
                    ) : (
                        <span className="text-[11px] text-muted-foreground">No Checklist</span>
                    )}
                </td>

                <td className="p-3.5 text-xs">
                    <span className="text-[11px] text-muted-foreground font-medium">No Stage</span>
                </td>

                <td className="p-3.5 text-xs">
                    <div className="flex items-center space-x-1.5 text-muted-foreground font-mono text-[11px]">
                        <Calendar className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span>{t.due_date || 'No Date'}</span>
                    </div>
                </td>

                <td className="p-3.5">
                    {formatStatusBadge(t.board_column?.name || t.boardColumn?.name)}
                </td>
            </tr>
        );
    };

    return (
        <>
            <Head title={`${project.name} - Aero DevPM`} />

            {/* Hidden File Input for Uploads */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
            />

            <div className="p-6 md:p-8 space-y-6 bg-background text-foreground min-h-screen">
                {/* 1. Hero Header */}
                <div className="space-y-4 border-b border-border/60 pb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                                <div className="p-2.5 bg-primary/10 text-primary rounded-xl border border-primary/20">
                                    <Folder className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-mono text-muted-foreground block">
                                        Started {project.start_date || '28-04-26'}
                                    </span>
                                    <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center space-x-2">
                                        <span>{project.name}</span>
                                        <Dialog open={isEditInfoOpen} onOpenChange={setIsEditInfoOpen}>
                                            <DialogTrigger asChild>
                                                <button className="p-1 text-muted-foreground hover:text-foreground rounded transition">
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <form onSubmit={handleEditInfoSubmit}>
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Project Details</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4">
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold">Project Name</label>
                                                            <Input value={editName} onChange={(e) => setEditName(e.target.value)} required />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold">Description</label>
                                                            <textarea
                                                                className="w-full p-3 rounded-xl border border-input bg-background text-xs min-h-[100px]"
                                                                value={editDescription}
                                                                onChange={(e) => setEditDescription(e.target.value)}
                                                            />
                                                        </div>
                                                        <Button type="submit" className="w-full h-9 bg-primary text-xs font-bold">Save Changes</Button>
                                                    </div>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </h1>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 text-xs">
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                    {project.status}
                                </span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground font-medium">
                                    Project progress • <strong className="text-foreground">{stats.completed} of {stats.total} tasks done</strong>
                                </span>
                            </div>
                        </div>

                        {/* Top Actions & Deadline Badge */}
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center space-x-2">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <button className="px-3 py-1.5 bg-card border border-border hover:bg-muted text-foreground text-xs font-semibold rounded-lg transition flex items-center">
                                            <FileText className="w-3.5 h-3.5 mr-1.5" /> Project brief
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent className="w-[400px] sm:w-[540px]">
                                        <SheetHeader>
                                            <SheetTitle>Project Brief</SheetTitle>
                                        </SheetHeader>
                                        <div className="mt-6 space-y-6">
                                            <div>
                                                <h3 className="font-semibold text-lg">{project.name}</h3>
                                                <p className="text-sm text-muted-foreground mt-2">{project.description || 'No detailed description.'}</p>
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
                                    <DialogTrigger asChild>
                                        <button className="px-3 py-1.5 bg-card border border-border hover:bg-muted text-foreground text-xs font-semibold rounded-lg transition flex items-center">
                                            <Pencil className="w-3.5 h-3.5 mr-1.5" /> Update Status
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <form onSubmit={handleUpdateStatusSubmit}>
                                            <DialogHeader>
                                                <DialogTitle>Update Status</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <select
                                                    className="w-full p-2.5 bg-background border border-input rounded-xl text-xs font-semibold text-foreground"
                                                    value={statusValue}
                                                    onChange={(e) => setStatusValue(e.target.value)}
                                                >
                                                    <option value="draft">Draft</option>
                                                    <option value="planned">Planned</option>
                                                    <option value="ongoing">Ongoing</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="archived">Archived</option>
                                                </select>
                                                <Button type="submit" className="w-full h-9 bg-primary text-xs font-bold">Update Status</Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="text-xs text-muted-foreground font-mono font-medium">
                                <strong>{daysToDeadline} days to deadline</strong> • <span className="text-primary font-bold">{stats.progress}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${stats.progress}%` }}
                        />
                    </div>
                </div>

                {/* 2. Metric Cards Grid (5 Cards) */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-3.5 rounded-xl border border-border bg-card/60 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
                            <span>Total tasks</span>
                            <CheckSquare className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <p className="text-xl font-bold text-foreground">{stats.total}</p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-card/60 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
                            <span>To do / Blocked</span>
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                        </div>
                        <p className="text-xl font-bold text-foreground">{stats.todo}</p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-card/60 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
                            <span>In progress</span>
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <p className="text-xl font-bold text-foreground">{stats.inProgress}</p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-card/60 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
                            <span>In review</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                        </div>
                        <p className="text-xl font-bold text-foreground">{stats.inReview}</p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-card/60 space-y-1 col-span-2 sm:col-span-1">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
                            <span>Completed</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <p className="text-xl font-bold text-foreground">{stats.completed}</p>
                    </div>
                </div>

                {/* 3. Tabbed Navigation */}
                <div className="flex flex-wrap border-b border-border text-xs font-semibold gap-x-6 gap-y-2 pt-2">
                    {[
                        { key: 'tasks', label: `Tasks (${allProjectTasks.length})` },
                        { key: 'discussions', label: 'Discussions' },
                        { key: 'milestones', label: 'Milestones' },
                        { key: 'timeline', label: 'Timeline' },
                        { key: 'team', label: `Team (${project.members?.length || 0})` },
                        { key: 'files', label: `Files (${projectDocuments.length})` },
                        { key: 'credentials', label: 'Credentials' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as TabType)}
                            className={`pb-3 transition border-b-2 ${
                                activeTab === tab.key
                                    ? 'border-primary text-primary font-bold'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* TAB 1: Tasks Tab */}
                {activeTab === 'tasks' && (
                    <div className="space-y-4">
                        {/* Header & Controls Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="text-sm font-bold text-foreground">Project Tasks</h2>

                            <div className="flex flex-wrap items-center gap-2">
                                <div className="relative">
                                    <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Search Tasks"
                                        value={taskSearchQuery}
                                        onChange={(e) => setTaskSearchQuery(e.target.value)}
                                        className="h-8 pl-8 pr-3 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:border-primary w-44"
                                    />
                                </div>

                                <Button variant="outline" size="sm" className="h-8 text-xs font-semibold border-border">
                                    <Filter className="w-3 h-3 mr-1" /> Filter
                                </Button>

                                <div className="flex bg-muted/40 border border-border p-0.5 rounded-lg">
                                    <button
                                        onClick={() => setTaskViewMode('list')}
                                        title="List View"
                                        className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1 ${taskViewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        <List className="w-3.5 h-3.5" />
                                        <span>List</span>
                                    </button>
                                    <button
                                        onClick={() => setTaskViewMode('grouped')}
                                        title="Grouped by Status View"
                                        className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1 ${taskViewMode === 'grouped' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        <SlidersHorizontal className="w-3.5 h-3.5" />
                                        <span>Grouped</span>
                                    </button>
                                </div>

                                <Button
                                    onClick={() => setIsCreateTaskOpen(true)}
                                    className="h-8 px-3.5 bg-primary text-primary-foreground text-xs font-bold shadow-xs"
                                >
                                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Task
                                </Button>
                            </div>
                        </div>

                        {/* Tasks Display Mode */}
                        {taskViewMode === 'list' ? (
                            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xs">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs text-muted-foreground">
                                        <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
                                            <tr>
                                                <th className="p-3.5">Tasks</th>
                                                <th className="p-3.5">Assignee</th>
                                                <th className="p-3.5">Checklist</th>
                                                <th className="p-3.5">Stages</th>
                                                <th className="p-3.5">Due Date</th>
                                                <th className="p-3.5">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/60">
                                            {filteredTasks.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="p-8 text-center text-muted-foreground italic">
                                                        No tasks found matching your search. Click "+ Add Task" to create one.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredTasks.map((t: any) => renderTaskRow(t))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {columnsToGroup.map((col: any) => {
                                    const colTasks = filteredTasks.filter((t: any) => {
                                        const statusName = t.board_column?.name || t.boardColumn?.name || 'To Do';

                                        return statusName.toLowerCase() === col.name.toLowerCase();
                                    });

                                    if (colTasks.length === 0 && taskSearchQuery) {
                                        return null;
                                    }

                                    return (
                                        <div key={col.id || col.name} className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xs">
                                            <div className="p-3 bg-muted/20 border-b border-border flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    {formatStatusBadge(col.name)}
                                                    <span className="text-xs font-bold text-foreground font-mono">({colTasks.length})</span>
                                                </div>
                                            </div>
                                            {colTasks.length === 0 ? (
                                                <div className="p-4 text-xs text-muted-foreground italic">No tasks in {col.name}</div>
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left text-xs text-muted-foreground">
                                                        <thead className="bg-muted/10 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
                                                            <tr>
                                                                <th className="p-3.5">Tasks</th>
                                                                <th className="p-3.5">Assignee</th>
                                                                <th className="p-3.5">Checklist</th>
                                                                <th className="p-3.5">Stages</th>
                                                                <th className="p-3.5">Due Date</th>
                                                                <th className="p-3.5">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-border/60">
                                                            {colTasks.map((t: any) => renderTaskRow(t))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: Rich Discussions Split-Panel View */}
                {activeTab === 'discussions' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[600px] border border-border rounded-2xl bg-card overflow-hidden">
                        {/* Left Panel: Project Team Members */}
                        <div className="lg:col-span-3 border-r border-border p-4 bg-muted/10 flex flex-col space-y-3">
                            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Project Team Members</h3>
                            <div className="flex-1 overflow-y-auto space-y-2">
                                {(project.members && project.members.length > 0) ? (
                                    project.members.map((m: any) => (
                                        <div key={m.id} className="p-2.5 rounded-xl border border-border/60 bg-background flex items-center space-x-2.5">
                                            <div className="relative">
                                                <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                                                    {m.name?.[0] || 'M'}
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 absolute bottom-0 right-0 border border-background" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold text-foreground truncate">{m.name}</p>
                                                <p className="text-[10px] text-muted-foreground capitalize">{m.pivot?.role || 'Member'}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground italic p-2">No team members assigned.</p>
                                )}
                            </div>
                        </div>

                        {/* Center Panel: Active Discussion Thread */}
                        <div className="lg:col-span-6 flex flex-col h-full bg-card">
                            <div className="p-3 border-b border-border bg-muted/20 flex items-center justify-between">
                                <div>
                                    <h4 className="text-xs font-bold text-foreground">{project.name} Project Discussion</h4>
                                    <p className="text-[10px] text-muted-foreground">General team discussion thread</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                <div className="text-center">
                                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                                        Jul 29, 2026
                                    </span>
                                </div>

                                {commentsList.length === 0 ? (
                                    <div className="p-8 text-center space-y-2">
                                        <MessageSquare className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                                        <p className="text-xs text-muted-foreground">No messages yet. Start the conversation!</p>
                                    </div>
                                ) : (
                                    commentsList.map((c) => (
                                        <div key={c.id} className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-1">
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className="font-bold text-foreground">{c.user?.name || 'Team Member'}</span>
                                                <span className="text-muted-foreground font-mono text-[10px]">{c.created_at}</span>
                                            </div>
                                            <p className="text-xs text-foreground leading-relaxed">{c.content}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            <form onSubmit={handleAddComment} className="p-3 border-t border-border flex items-center gap-2 bg-muted/10">
                                <input
                                    type="text"
                                    placeholder="Type a message or drop project updates..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    className="flex-1 h-9 px-3 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                                />
                                <Button type="submit" size="sm" className="h-9 px-3 bg-primary text-primary-foreground font-bold text-xs">
                                    <Send className="w-3.5 h-3.5 mr-1" /> Send
                                </Button>
                            </form>
                        </div>

                        {/* Right Panel: Media, Documents & Links Drawer */}
                        <div className="lg:col-span-3 border-l border-border p-4 bg-muted/10 flex flex-col space-y-3">
                            <div className="flex bg-muted p-1 rounded-lg border border-border">
                                <button
                                    onClick={() => setDiscussionTab('media')}
                                    className={`flex-1 py-1 text-[11px] font-bold rounded-md transition ${discussionTab === 'media' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                                >
                                    Media ({mediaDocuments.length})
                                </button>
                                <button
                                    onClick={() => setDiscussionTab('documents')}
                                    className={`flex-1 py-1 text-[11px] font-bold rounded-md transition ${discussionTab === 'documents' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                                >
                                    Docs ({nonMediaDocuments.length})
                                </button>
                                <button
                                    onClick={() => setDiscussionTab('links')}
                                    className={`flex-1 py-1 text-[11px] font-bold rounded-md transition ${discussionTab === 'links' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                                >
                                    Links
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-2">
                                {discussionTab === 'media' && (
                                    mediaDocuments.length === 0 ? (
                                        <div className="p-8 text-center space-y-2">
                                            <Image className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                                            <p className="text-xs text-muted-foreground italic">No images shared yet</p>
                                        </div>
                                    ) : (
                                        mediaDocuments.map((doc) => (
                                            <div
                                                key={doc.id}
                                                onClick={() => handleViewDocument(doc)}
                                                className="p-2 border border-border/80 rounded-xl bg-card hover:border-primary/50 cursor-pointer flex items-center space-x-2 transition"
                                            >
                                                <Image className="w-4 h-4 text-primary shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-bold text-foreground truncate">{doc.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{doc.formatted_size}</p>
                                                </div>
                                            </div>
                                        ))
                                    )
                                )}

                                {discussionTab === 'documents' && (
                                    nonMediaDocuments.length === 0 ? (
                                        <div className="p-8 text-center space-y-2">
                                            <FileCode className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                                            <p className="text-xs text-muted-foreground italic">No documents attached</p>
                                        </div>
                                    ) : (
                                        nonMediaDocuments.map((doc) => (
                                            <div
                                                key={doc.id}
                                                onClick={() => handleViewDocument(doc)}
                                                className="p-2 border border-border/80 rounded-xl bg-card hover:border-primary/50 cursor-pointer flex items-center space-x-2 transition"
                                            >
                                                <FileCode className="w-4 h-4 text-amber-500 shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-bold text-foreground truncate">{doc.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{doc.formatted_size}</p>
                                                </div>
                                            </div>
                                        ))
                                    )
                                )}

                                {discussionTab === 'links' && (
                                    <div className="p-8 text-center space-y-2">
                                        <LinkIcon className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                                        <p className="text-xs text-muted-foreground italic">No shared web links</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: Milestones Tab */}
                {activeTab === 'milestones' && (
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
                        <div className="flex items-center space-x-2">
                            <Target className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-foreground">Project Milestones</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">Deliverables and target dates for this project.</p>
                    </div>
                )}

                {/* TAB 4: Timeline Tab */}
                {activeTab === 'timeline' && (
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
                        <h3 className="font-bold text-foreground">Project Timeline & Execution Roadmap</h3>
                        <p className="text-xs text-muted-foreground">Progress track: {stats.progress}% complete across all project tasks.</p>
                    </div>
                )}

                {/* TAB 5: Team Tab */}
                {activeTab === 'team' && (
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                        <h3 className="font-bold text-foreground text-sm">Assigned Project Members ({project.members?.length || 0})</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {(project.members || []).map((m: any) => (
                                <div key={m.id} className="p-3 border border-border/80 rounded-xl bg-muted/20 flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                                        {m.name?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-foreground">{m.name}</p>
                                        <p className="text-[10px] text-muted-foreground">{m.email || 'Team Member'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 6: Enhanced Files Tab with Functional File Upload & Realtime Search/Folder Filter */}
                {activeTab === 'files' && (
                    <div className="space-y-4">
                        {/* Files Toolbar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center space-x-2">
                                <Button
                                    onClick={() => setIsCreateFolderOpen(true)}
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs font-bold border-border"
                                >
                                    <FolderPlus className="w-3.5 h-3.5 mr-1 text-primary" /> New folder
                                </Button>

                                <select
                                    value={fileTypeFilter}
                                    onChange={(e) => setFileTypeFilter(e.target.value)}
                                    className="h-8 px-2 bg-background border border-input rounded-lg text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                                >
                                    <option value="all">Files Type (All)</option>
                                    <option value="media">Media (Images/Videos)</option>
                                    <option value="documents">Documents (PDFs/Docs)</option>
                                </select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Search files..."
                                        value={fileSearchQuery}
                                        onChange={(e) => setFileSearchQuery(e.target.value)}
                                        className="h-8 pl-8 pr-3 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:border-primary w-44"
                                    />
                                </div>

                                <div className="flex bg-muted/40 border border-border p-0.5 rounded-lg">
                                    <button
                                        onClick={() => setFileViewMode('list')}
                                        className={`p-1.5 rounded ${fileViewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                                    >
                                        <List className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => setFileViewMode('grid')}
                                        className={`p-1.5 rounded ${fileViewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                                    >
                                        <Grid className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    size="sm"
                                    className="h-8 px-3.5 bg-primary text-primary-foreground text-xs font-bold shadow-xs"
                                >
                                    <Upload className="w-3.5 h-3.5 mr-1" /> Upload
                                </Button>
                            </div>
                        </div>

                        {/* Folders & Uploaded Files List/Grid */}
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Folders</h4>
                                    {selectedFolder && (
                                        <button
                                            onClick={() => setSelectedFolder(null)}
                                            className="text-xs font-bold text-primary hover:underline"
                                        >
                                            Show All Folders ({projectDocuments.length} files)
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {foldersList.map((fName, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedFolder(selectedFolder === fName ? null : fName)}
                                            className={`p-3 border rounded-xl transition flex items-center justify-between cursor-pointer ${
                                                selectedFolder === fName
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-border/80 bg-card hover:border-primary/40 text-foreground'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-2.5 min-w-0">
                                                <Folder className="w-4 h-4 text-primary shrink-0" />
                                                <span className="text-xs font-bold truncate">{fName}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Files Section */}
                            <div>
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                    Uploaded Files ({filteredProjectDocuments.length}) {selectedFolder ? `in "${selectedFolder}"` : ''}
                                </h4>

                                {filteredProjectDocuments.length === 0 ? (
                                    <div className="bg-card border border-border rounded-2xl p-10 text-center space-y-2">
                                        <Folder className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                                        <p className="text-xs text-muted-foreground">
                                            {fileSearchQuery
                                                ? `No files match "${fileSearchQuery}".`
                                                : selectedFolder
                                                    ? `No files uploaded in folder "${selectedFolder}".`
                                                    : 'No files uploaded yet. Click "Upload" above to add documents or images.'}
                                        </p>
                                    </div>
                                ) : (
                                    fileViewMode === 'grid' ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {filteredProjectDocuments.map((doc) => (
                                                <div key={doc.id} className="p-3 border border-border/80 rounded-2xl bg-card hover:border-primary/40 transition flex flex-col justify-between space-y-3">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                                            {isMediaFileType(doc.file_type, doc.name) ? (
                                                                <Image className="w-5 h-5 text-primary" />
                                                            ) : (
                                                                <FileCode className="w-5 h-5 text-amber-500" />
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteDocument(doc.id)}
                                                            className="p-1 rounded text-muted-foreground hover:text-rose-500 transition"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs font-bold text-foreground truncate" title={doc.name}>{doc.name}</p>
                                                        <p className="text-[10px] text-muted-foreground mt-0.5">{doc.formatted_size}</p>
                                                    </div>

                                                    <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                                                        <button
                                                            onClick={() => handleViewDocument(doc)}
                                                            className="text-primary text-[11px] font-bold hover:underline flex items-center"
                                                        >
                                                            <Eye className="w-3 h-3 mr-1" /> View
                                                        </button>
                                                        <a
                                                            href={doc.download_url}
                                                            download
                                                            className="text-muted-foreground hover:text-foreground text-[11px] font-bold flex items-center"
                                                        >
                                                            <Download className="w-3 h-3 mr-1" /> Download
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xs">
                                            <table className="w-full text-left text-xs text-muted-foreground">
                                                <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
                                                    <tr>
                                                        <th className="p-3.5">Document Name</th>
                                                        <th className="p-3.5">Size</th>
                                                        <th className="p-3.5">Uploaded</th>
                                                        <th className="p-3.5 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border/60">
                                                    {filteredProjectDocuments.map((doc) => (
                                                        <tr key={doc.id} className="hover:bg-muted/30 transition">
                                                            <td className="p-3.5 font-bold text-foreground flex items-center space-x-2">
                                                                {isMediaFileType(doc.file_type, doc.name) ? (
                                                                    <Image className="w-4 h-4 text-primary shrink-0" />
                                                                ) : (
                                                                    <FileCode className="w-4 h-4 text-amber-500 shrink-0" />
                                                                )}
                                                                <span className="truncate max-w-xs">{doc.name}</span>
                                                            </td>
                                                            <td className="p-3.5 font-mono text-xs">{doc.formatted_size}</td>
                                                            <td className="p-3.5 text-xs">{doc.created_at || 'Just now'}</td>
                                                            <td className="p-3.5 text-right">
                                                                <div className="flex items-center justify-end space-x-2">
                                                                    <button
                                                                        onClick={() => handleViewDocument(doc)}
                                                                        className="p-1.5 rounded bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-bold text-[11px] transition"
                                                                    >
                                                                        View
                                                                    </button>
                                                                    <a
                                                                        href={doc.download_url}
                                                                        download
                                                                        className="p-1.5 rounded bg-muted text-foreground hover:bg-muted/80 font-bold text-[11px] transition"
                                                                    >
                                                                        Download
                                                                    </a>
                                                                    <button
                                                                        onClick={() => handleDeleteDocument(doc.id)}
                                                                        className="p-1.5 text-muted-foreground hover:text-rose-500 transition"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 7: Credentials Tab */}
                {activeTab === 'credentials' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                    <Key className="w-4 h-4 text-primary" />
                                    <span>Project Access Credentials & Secrets</span>
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Secure storage for API keys, database connection strings, and staging endpoints.
                                </p>
                            </div>

                            <Dialog open={isAddCredOpen} onOpenChange={setIsAddCredOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="h-8 px-3.5 bg-primary text-primary-foreground text-xs font-bold">
                                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Credential
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <form onSubmit={handleAddCredential}>
                                        <DialogHeader>
                                            <DialogTitle>Add Secret Credential</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div>
                                                <label className="text-xs font-bold">Key / Variable Name</label>
                                                <Input
                                                    placeholder="e.g. STAGING_API_KEY"
                                                    value={newCredKey}
                                                    onChange={(e) => setNewCredKey(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold">Value / Secret Token</label>
                                                <Input
                                                    placeholder="e.g. secret_token_xyz123"
                                                    value={newCredValue}
                                                    onChange={(e) => setNewCredValue(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <Button type="submit" className="w-full h-9 bg-primary text-xs font-bold">Save Credential</Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xs">
                            <table className="w-full text-left text-xs text-muted-foreground">
                                <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
                                    <tr>
                                        <th className="p-3.5">Variable Name</th>
                                        <th className="p-3.5">Secret Value</th>
                                        <th className="p-3.5">Environment</th>
                                        <th className="p-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60">
                                    {credentialsList.map((c) => {
                                        const isVisible = visibleSecretIds.includes(c.id);

                                        return (
                                            <tr key={c.id} className="hover:bg-muted/30 transition">
                                                <td className="p-3.5 font-mono font-bold text-foreground">{c.key}</td>
                                                <td className="p-3.5 font-mono text-xs">
                                                    {isVisible ? (
                                                        <span className="text-foreground bg-muted/40 px-2 py-0.5 rounded border border-border">{c.value}</span>
                                                    ) : (
                                                        <span className="text-muted-foreground">••••••••••••••••</span>
                                                    )}
                                                </td>
                                                <td className="p-3.5">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                                                        {c.environment}
                                                    </span>
                                                </td>
                                                <td className="p-3.5 text-right">
                                                    <div className="flex items-center justify-end space-x-1">
                                                        <button
                                                            onClick={() => toggleSecretVisibility(c.id)}
                                                            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition"
                                                        >
                                                            {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                        </button>
                                                        <button
                                                            onClick={() => navigator.clipboard.writeText(c.value)}
                                                            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition"
                                                        >
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Task Modal (Pre-selected for this Project) */}
            <CreateTaskWizardModal
                isOpen={isCreateTaskOpen}
                onClose={() => setIsCreateTaskOpen(false)}
                defaultProjectId={project.id}
                projects={[{ id: project.id, name: project.name }]}
                users={project.members || []}
            />

            {/* Create Folder Modal */}
            <CreateFolderModal
                isOpen={isCreateFolderOpen}
                onClose={() => setIsCreateFolderOpen(false)}
                onCreateFolder={(fName) => setFoldersList([...foldersList, fName])}
            />

            {/* Task Detail Modal */}
            <TaskDetailModal
                isOpen={!!selectedTaskForDetail}
                onClose={() => setSelectedTaskForDetail(null)}
                task={selectedTaskForDetail}
            />

            {/* Media Preview Modal */}
            <MediaPreviewModal
                isOpen={!!previewDocument}
                onClose={() => setPreviewDocument(null)}
                document={previewDocument}
            />
        </>
    );
}

ProjectShow.layout = {
    breadcrumbs: [
        {
            title: 'Projects',
            href: '/projects',
        },
        {
            title: 'Project Details',
            href: '#',
        },
    ],
};
