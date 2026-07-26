import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    CheckSquare,
    Search,
    Download,
    Filter,
    Folder,
    User as UserIcon,
    Calendar,
    Sparkles,
    AlertCircle,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableHeader } from '@/components/ui/data-table-header';
import { ColumnVisibilityPopover, ColumnDefinition } from '@/components/ui/column-visibility-popover';
import { PaginationBar } from '@/components/ui/pagination-bar';
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
    filters: any;
}

export default function TasksIndex({
    tasks,
    projects = [],
    departments = [],
    users = [],
    filters = {},
}: TaskDirectoryProps) {
    const [selectedTask, setSelectedTask] = useState<any | null>(null);

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
        if (!value) delete newFilters[key];
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

    return (
        <>
            <Head title="Tasks Directory & Master Grid - Aero DevPM" />

            <div className="p-6 md:p-8 space-y-6 bg-background text-foreground min-h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            Tasks Directory
                        </h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            Master data grid to search, sort, filter, and export all workspace tasks.
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <a href={getExportCsvUrl()} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="text-xs font-semibold h-9 border-border">
                                <Download className="w-4 h-4 mr-1.5 text-primary" /> Export to CSV
                            </Button>
                        </a>
                    </div>
                </div>

                {/* Filter Toolbar & Column Manager */}
                <div className="p-3 bg-card border border-border rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                            <input
                                type="text"
                                placeholder="Search by task title or ID..."
                                value={filters.search || ''}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
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
                                            <th className="p-3.5 pr-4">
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
                                                    {task.project ? (
                                                        <span className="inline-flex items-center text-xs font-medium text-foreground">
                                                            <Folder className="w-3 h-3 mr-1.5 text-amber-400 shrink-0" />
                                                            <span className="truncate max-w-[120px]">{task.project.name}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">—</span>
                                                    )}
                                                </td>
                                            )}

                                            {isVisible('status') && (
                                                <td className="p-3.5">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-muted text-foreground border border-border">
                                                        {task.boardColumn?.name || 'To Do'}
                                                    </span>
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
                                                <td className="p-3.5 pr-4 text-xs font-mono text-muted-foreground">
                                                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No Due Date'}
                                                </td>
                                            )}
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
