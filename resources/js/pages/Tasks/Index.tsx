import { Head, router } from '@inertiajs/react';
import {
    Search,
    Download,
    Filter,
    Folder,
    Sparkles,
    Plus,
    CheckCircle2,
    Target,
    Eye,
    Pencil,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import { CreateTaskWizardModal } from '@/components/tasks/CreateTaskWizardModal';
import { DeleteTaskConfirmModal } from '@/components/tasks/DeleteTaskConfirmModal';
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal';
import { Button } from '@/components/ui/button';
import { ColumnVisibilityPopover } from '@/components/ui/column-visibility-popover';
import type { ColumnDefinition } from '@/components/ui/column-visibility-popover';
import { DataTableHeader } from '@/components/ui/data-table-header';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PaginationBar } from '@/components/ui/pagination-bar';

interface TaskDirectoryProps {
    tasks: {
        data: any[];
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        links: any[];
    };
    projects: { id: number; name: string }[];
    departments: { id: number; name: string }[];
    users: { id: number; name: string }[];
    milestones?: { id: number; name: string; project_id: number }[];
    boardColumns?: { id: number; name: string; project_id: number }[];
    filters: any;
}

export default function TasksIndex({
    tasks,
    projects = [],
    departments = [],
    users = [],
    milestones = [],
    boardColumns = [],
    filters = {},
}: TaskDirectoryProps) {
    const [selectedTask, setSelectedTask] = useState<any | null>(null);
    const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Column Visibility State
    const [columns, setColumns] = useState<ColumnDefinition[]>([
        { key: 'id', label: 'Task ID', visible: true },
        { key: 'title', label: 'Title & Summary', visible: true },
        { key: 'project', label: 'Project', visible: true },
        { key: 'status', label: 'Status', visible: true },
        { key: 'priority', label: 'Priority', visible: true },
        { key: 'assignee', label: 'Assignee', visible: true },
        { key: 'due_date', label: 'Due Date', visible: true },
    ]);

    const isVisible = (key: string) => {
        const col = columns.find((c) => c.key === key);

        return col ? col.visible : true;
    };

    const handleToggleColumn = (key: string) => {
        setColumns((prev) =>
            prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c))
        );
    };

    const handleHideColumn = (key: string) => {
        setColumns((prev) =>
            prev.map((c) => (c.key === key ? { ...c, visible: false } : c))
        );
    };

    const handleResetColumns = () => {
        setColumns((prev) => prev.map((c) => ({ ...c, visible: true })));
    };

    // Sorting & Filtering Handlers
    const handleSort = (columnKey: string, order: 'asc' | 'desc') => {
        router.get(
            '/tasks',
            { ...filters, sort_by: columnKey, order },
            { preserveState: true, replace: true }
        );
    };

    const handleSearch = (query: string) => {
        router.get('/tasks', { ...filters, search: query }, { preserveState: true, replace: true });
    };

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };

        if (!value) {
delete newFilters[key];
}

        router.get('/tasks', newFilters, { preserveState: true, replace: true });
    };

    const handleClearFilters = () => {
        router.get('/tasks', {}, { preserveState: true, replace: true });
    };

    // Export CSV URL Generator
    const getExportCsvUrl = () => {
        const params = new URLSearchParams(filters).toString();

        return `/tasks/export-csv${params ? `?${params}` : ''}`;
    };

    const formatPriorityBadge = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'urgent':
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">Urgent</span>;
            case 'high':
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">High</span>;
            case 'medium':
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">Medium</span>;
            default:
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-muted text-muted-foreground border border-border">Low</span>;
        }
    };

    const handleQuickStatusChange = (taskId: number, newColumnId: number) => {
        router.patch(`/tasks/${taskId}`, { board_column_id: newColumnId }, { preserveScroll: true });
    };

    const handleConfirmDeleteTask = () => {
        if (!taskToDelete) {
return;
}

        setIsDeleting(true);
        router.delete(`/tasks/${taskToDelete.id}`, {
            onSuccess: () => {
                setIsDeleting(false);
                setTaskToDelete(null);
            },
            onError: () => setIsDeleting(false),
        });
    };

    const completedTasksCount = tasks.data.filter(
        (t) => t.board_column?.name?.toLowerCase() === 'done' || t.boardColumn?.name?.toLowerCase() === 'done'
    ).length;
    const progressPercent = tasks.data.length > 0 ? Math.round((completedTasksCount / tasks.data.length) * 100) : 0;

    return (
        <>
            <Head title="Tasks Directory & Master Grid - Aero DevPM" />

            <div className="p-6 md:p-8 space-y-6 bg-background text-foreground min-h-screen">
                {/* Header (Clean title layout without icons) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center space-x-2">
                            <span>Tasks Directory</span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                                {tasks.total} Total
                            </span>
                        </h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            Master data grid to search, sort, filter, track execution, and export tasks.
                        </p>
                    </div>

                    <div className="flex items-center space-x-2.5">
                        <a href={getExportCsvUrl()} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="text-xs font-semibold h-9 border-border">
                                <Download className="w-4 h-4 mr-1.5 text-muted-foreground" /> Export CSV
                            </Button>
                        </a>

                        <Button
                            onClick={() => setIsCreateWizardOpen(true)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold h-9 px-4 shadow-md shadow-primary/20"
                        >
                            <Plus className="w-4 h-4 mr-1.5" /> Add Task
                        </Button>
                    </div>
                </div>

                {/* Progress Tracking Bar ("Keep Track of Tasks Done") */}
                <div className="p-4 rounded-xl border border-border bg-card/60 space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span className="font-bold text-foreground">Tasks Done Progress</span>
                            <span className="text-muted-foreground">
                                ({completedTasksCount} of {tasks.data.length} tasks on this page completed)
                            </span>
                        </div>
                        <span className="font-extrabold text-primary">{progressPercent}% Completed</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500 rounded-full"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* Filter Toolbar & Column Manager */}
                <div className="py-1 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by task title or ID..."
                                value={filters.search || ''}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full h-9.5 bg-background border border-input rounded-lg pl-9 pr-3 text-xs text-foreground shadow-2xs focus:outline-none focus:border-primary"
                            />
                        </div>

                        {/* Advanced Filters Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 text-xs font-medium border-border">
                                    <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                                    <span>Filters</span>
                                    {Object.keys(filters).length > 0 && (
                                        <span className="ml-1.5 w-2 h-2 rounded-full bg-primary" />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="start" className="w-80 space-y-4 p-4">
                                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                    <h4 className="font-bold text-xs">Filter Tasks</h4>
                                    <button
                                        onClick={handleClearFilters}
                                        className="text-[11px] text-muted-foreground hover:text-foreground font-medium"
                                    >
                                        Clear All
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-muted-foreground">Project</label>
                                        <select
                                            value={filters.project_id || ''}
                                            onChange={(e) => handleFilterChange('project_id', e.target.value)}
                                            className="w-full h-8 rounded border border-input bg-background text-xs px-2"
                                        >
                                            <option value="">All Projects</option>
                                            {projects.map((p) => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-muted-foreground">Priority</label>
                                        <select
                                            value={filters.priority || ''}
                                            onChange={(e) => handleFilterChange('priority', e.target.value)}
                                            className="w-full h-8 rounded border border-input bg-background text-xs px-2"
                                        >
                                            <option value="">All Priorities</option>
                                            <option value="urgent">Urgent</option>
                                            <option value="high">High</option>
                                            <option value="medium">Medium</option>
                                            <option value="low">Low</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-muted-foreground">Assignee</label>
                                        <select
                                            value={filters.assignee_id || ''}
                                            onChange={(e) => handleFilterChange('assignee_id', e.target.value)}
                                            className="w-full h-8 rounded border border-input bg-background text-xs px-2"
                                        >
                                            <option value="">All Assignees</option>
                                            {users.map((u) => (
                                                <option key={u.id} value={u.id}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex items-center space-x-2">
                        <ColumnVisibilityPopover
                            columns={columns}
                            onToggleColumn={handleToggleColumn}
                            onResetColumns={handleResetColumns}
                        />
                    </div>
                </div>

                {/* Master Data Grid Table */}
                {tasks.data.length === 0 ? (
                    <div className="bg-card border border-border rounded-xl p-12 text-center space-y-3">
                        <Sparkles className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                        <h3 className="text-base font-semibold text-foreground">No Tasks Found</h3>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                            No workspace tasks match your current filter parameters.
                        </p>
                    </div>
                ) : (
                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-muted/40 border-b border-border/70 text-muted-foreground font-semibold">
                                        {isVisible('id') && (
                                            <th className="p-3.5 pl-4">
                                                <DataTableHeader
                                                    title="Task ID"
                                                    columnKey="id"
                                                    currentSortBy={filters.sort_by}
                                                    currentOrder={filters.order}
                                                    onSort={handleSort}
                                                    onHideColumn={handleHideColumn}
                                                />
                                            </th>
                                        )}
                                        {isVisible('title') && (
                                            <th className="p-3.5">
                                                <DataTableHeader
                                                    title="Title & Summary"
                                                    columnKey="title"
                                                    currentSortBy={filters.sort_by}
                                                    currentOrder={filters.order}
                                                    onSort={handleSort}
                                                    onHideColumn={handleHideColumn}
                                                />
                                            </th>
                                        )}
                                        {isVisible('project') && (
                                            <th className="p-3.5">
                                                <DataTableHeader
                                                    title="Project"
                                                    columnKey="project"
                                                    currentSortBy={filters.sort_by}
                                                    currentOrder={filters.order}
                                                    onSort={handleSort}
                                                    onHideColumn={handleHideColumn}
                                                />
                                            </th>
                                        )}
                                        {isVisible('status') && (
                                            <th className="p-3.5">
                                                <DataTableHeader
                                                    title="Status"
                                                    columnKey="status"
                                                    currentSortBy={filters.sort_by}
                                                    currentOrder={filters.order}
                                                    onSort={handleSort}
                                                    onHideColumn={handleHideColumn}
                                                />
                                            </th>
                                        )}
                                        {isVisible('priority') && (
                                            <th className="p-3.5">
                                                <DataTableHeader
                                                    title="Priority"
                                                    columnKey="priority"
                                                    currentSortBy={filters.sort_by}
                                                    currentOrder={filters.order}
                                                    onSort={handleSort}
                                                    onHideColumn={handleHideColumn}
                                                />
                                            </th>
                                        )}
                                        {isVisible('assignee') && (
                                            <th className="p-3.5">Assignee</th>
                                        )}
                                        {isVisible('due_date') && (
                                            <th className="p-3.5">
                                                <DataTableHeader
                                                    title="Due Date"
                                                    columnKey="due_date"
                                                    currentSortBy={filters.sort_by}
                                                    currentOrder={filters.order}
                                                    onSort={handleSort}
                                                    onHideColumn={handleHideColumn}
                                                />
                                            </th>
                                        )}
                                        <th className="p-3.5 pr-4 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-border/50">
                                    {tasks.data.map((task) => (
                                        <tr
                                            key={task.id}
                                            onClick={() => setSelectedTask(task)}
                                            className="hover:bg-muted/30 transition cursor-pointer group"
                                        >
                                            {isVisible('id') && (
                                                <td className="p-3.5 pl-4 font-mono font-bold text-muted-foreground group-hover:text-primary">
                                                    #{task.id}
                                                </td>
                                            )}

                                            {isVisible('title') && (
                                                <td className="p-3.5 font-semibold text-foreground max-w-xs truncate">
                                                    {task.title}
                                                </td>
                                            )}

                                            {isVisible('project') && (
                                                <td className="p-3.5">
                                                    <div className="space-y-1">
                                                        {task.project ? (
                                                            <span className="inline-flex items-center text-xs font-medium text-foreground">
                                                                <Folder className="w-3 h-3 mr-1.5 text-amber-400 shrink-0" />
                                                                <span className="truncate max-w-[120px]">{task.project.name}</span>
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted-foreground">—</span>
                                                        )}
                                                        {task.milestone && (
                                                            <div className="flex items-center text-[10px] text-primary font-semibold">
                                                                <Target className="w-2.5 h-2.5 mr-1 text-primary shrink-0" />
                                                                <span className="truncate max-w-[120px]">{task.milestone.name}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            )}

                                            {isVisible('status') && (
                                                <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                                                    <select
                                                        value={task.board_column_id || ''}
                                                        onChange={(e) => handleQuickStatusChange(task.id, Number(e.target.value))}
                                                        className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-muted text-foreground border border-border focus:outline-none focus:border-primary cursor-pointer hover:border-primary/50"
                                                    >
                                                        {(boardColumns.length > 0 ? boardColumns : [
                                                            { id: 1, name: 'Backlog' },
                                                            { id: 2, name: 'To Do' },
                                                            { id: 3, name: 'In Progress' },
                                                            { id: 4, name: 'In Review' },
                                                            { id: 5, name: 'Done' },
                                                        ]).map((col) => (
                                                            <option key={col.id} value={col.id}>
                                                                {col.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            )}

                                            {isVisible('priority') && (
                                                <td className="p-3.5">
                                                    {formatPriorityBadge(task.priority)}
                                                </td>
                                            )}

                                            {isVisible('assignee') && (
                                                <td className="p-3.5">
                                                    {task.assignee ? (
                                                        <span className="inline-flex items-center space-x-1.5 text-xs text-foreground">
                                                            <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                                                                {task.assignee.name.charAt(0)}
                                                             </div>
                                                            <span className="truncate max-w-[100px]">{task.assignee.name}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground italic text-[11px]">Unassigned</span>
                                                    )}
                                                </td>
                                            )}

                                            {isVisible('due_date') && (
                                                <td className="p-3.5 text-xs text-muted-foreground">
                                                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No Due Date'}
                                                </td>
                                            )}

                                            <td className="p-3.5 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end space-x-1">
                                                    <button
                                                        title="View Details"
                                                        onClick={() => setSelectedTask(task)}
                                                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        title="Edit Task"
                                                        onClick={() => setSelectedTask(task)}
                                                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        title="Delete Task"
                                                        onClick={() => setTaskToDelete(task)}
                                                        className="p-1.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 border-t border-border/50 bg-muted/20">
                            <PaginationBar pagination={tasks} />
                        </div>
                    </div>
                )}
            </div>

            {/* Task Detail Modal */}
            <TaskDetailModal
                task={selectedTask}
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                columns={boardColumns}
                users={users}
            />

            {/* Create Task Wizard Modal */}
            <CreateTaskWizardModal
                isOpen={isCreateWizardOpen}
                onClose={() => setIsCreateWizardOpen(false)}
                projects={projects}
                departments={departments}
                users={users}
                milestones={milestones}
                boardColumns={boardColumns}
            />

            {/* Delete Confirmation Modal */}
            <DeleteTaskConfirmModal
                isOpen={!!taskToDelete}
                onClose={() => setTaskToDelete(null)}
                onConfirm={handleConfirmDeleteTask}
                taskTitle={taskToDelete?.title}
                isDeleting={isDeleting}
            />
        </>
    );
}

TasksIndex.layout = {
    breadcrumbs: [
        { title: 'Projects & Planning', href: '/projects' },
        { title: 'Tasks Directory', href: '/tasks' },
    ],
};
