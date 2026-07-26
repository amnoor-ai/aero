import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal';
import {
    AlertCircle,
    Calendar,
    Clock,
    CheckCircle2,
    Search,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

interface TaskItem {
    id: number;
    project_id: number;
    title: string;
    description?: string;
    type: 'bug' | 'feature' | 'improvement' | 'task';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    due_date?: string;
    project?: { id: number; name: string };
    board_column_id: number;
    board_column?: { id: number; name: string };
    assignee?: { id: number; name: string; email: string };
    checklists?: any[];
}

interface MyDeskProps {
    tasks: {
        overdue: TaskItem[];
        dueToday: TaskItem[];
        dueTomorrow: TaskItem[];
        upcoming: TaskItem[];
    };
    counts: {
        overdue: number;
        dueToday: number;
        dueTomorrow: number;
        upcoming: number;
    };
    projects: { id: number; name: string }[];
    filters: any;
}

export default function MyDesk({ tasks, counts, projects = [], filters = {} }: MyDeskProps) {
    const { auth } = usePage<any>().props;
    const userName = auth.user.name.split(' ')[0];
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', dateOptions);

    const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [openSections, setOpenSections] = useState({
        overdue: true,
        dueToday: true,
        dueTomorrow: true,
        upcoming: true,
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get('/my-desk', { ...filters, [key]: value }, { preserveState: true, replace: true });
    };

    const openTaskModal = (task: TaskItem) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    return (
        <>
            <Head title="My Desk - Aero DevPM" />

            <div className="p-6 md:p-8 space-y-6 bg-background text-foreground min-h-screen">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">{greeting}, {userName}!</h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            {today} • Here is a summary of your activities and urgent tasks.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={filters.scope || 'me'}
                            onChange={(e) => handleFilterChange('scope', e.target.value)}
                            className="bg-card border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                        >
                            <option value="me">Assigned to Me</option>
                            <option value="all">All Workspace Tasks</option>
                        </select>
                    </div>
                </div>

                {/* Stat Metric Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-card border border-border rounded-xl flex items-center justify-between shadow-2xs">
                        <div>
                            <span className="text-xs font-semibold text-destructive">Overdue</span>
                            <span className="block text-xl font-bold text-foreground mt-0.5">{counts.overdue}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="p-4 bg-card border border-border rounded-xl flex items-center justify-between shadow-2xs">
                        <div>
                            <span className="text-xs font-semibold text-amber-500">Due Today</span>
                            <span className="block text-xl font-bold text-foreground mt-0.5">{counts.dueToday}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="p-4 bg-card border border-border rounded-xl flex items-center justify-between shadow-2xs">
                        <div>
                            <span className="text-xs font-semibold text-primary">Due Tomorrow</span>
                            <span className="block text-xl font-bold text-foreground mt-0.5">{counts.dueTomorrow}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Calendar className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="p-4 bg-card border border-border rounded-xl flex items-center justify-between shadow-2xs">
                        <div>
                            <span className="text-xs font-semibold text-muted-foreground">Upcoming / Backlog</span>
                            <span className="block text-xl font-bold text-foreground mt-0.5">{counts.upcoming}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Inline Filter Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2" />
                        <input
                            type="text"
                            placeholder="Filter activities..."
                            value={filters.search || ''}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full bg-card border border-border rounded-md pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <select
                        value={filters.project_id || ''}
                        onChange={(e) => handleFilterChange('project_id', e.target.value)}
                        className="bg-card border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                    >
                        <option value="">All Projects</option>
                        {projects.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.priority || ''}
                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                        className="bg-card border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                    >
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>

                {/* Timeframe Sections */}
                <div className="space-y-6">
                    {/* Overdue Section */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-destructive" />
                                <span>Overdue Activities ({tasks.overdue.length})</span>
                            </h2>
                            <button
                                onClick={() => toggleSection('overdue')}
                                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium"
                            >
                                {openSections.overdue ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                        </div>

                        {openSections.overdue && (
                            <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
                                {tasks.overdue.length === 0 ? (
                                    <div className="p-4 text-center text-muted-foreground text-xs font-medium">No overdue activities! 🎉</div>
                                ) : (
                                    tasks.overdue.map((task) => (
                                        <div
                                            key={task.id}
                                            onClick={() => openTaskModal(task)}
                                            className="p-3.5 hover:bg-muted/50 cursor-pointer flex items-center justify-between transition-colors group"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                                                        {task.title}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground font-medium">({task.project?.name})</span>
                                                </div>
                                                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                                                    <span className="text-destructive font-mono text-[11px] font-medium">
                                                        Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20">
                                                    {task.priority}
                                                </span>
                                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                                                    {task.board_column?.name || 'To Do'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Today's Section */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-500" />
                                <span>Today's Activities ({tasks.dueToday.length})</span>
                            </h2>
                            <button
                                onClick={() => toggleSection('dueToday')}
                                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium"
                            >
                                {openSections.dueToday ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                        </div>

                        {openSections.dueToday && (
                            <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
                                {tasks.dueToday.length === 0 ? (
                                    <div className="p-4 text-center text-muted-foreground text-xs font-medium">No tasks due today.</div>
                                ) : (
                                    tasks.dueToday.map((task) => (
                                        <div
                                            key={task.id}
                                            onClick={() => openTaskModal(task)}
                                            className="p-3.5 hover:bg-muted/50 cursor-pointer flex items-center justify-between transition-colors group"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                                                        {task.title}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground font-medium">({task.project?.name})</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                    {task.priority}
                                                </span>
                                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                                                    {task.board_column?.name || 'To Do'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Upcoming Section */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>Upcoming & Backlog ({tasks.upcoming.length})</span>
                            </h2>
                            <button
                                onClick={() => toggleSection('upcoming')}
                                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium"
                            >
                                {openSections.upcoming ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                        </div>

                        {openSections.upcoming && (
                            <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
                                {tasks.upcoming.length === 0 ? (
                                    <div className="p-4 text-center text-muted-foreground text-xs font-medium">No upcoming tasks.</div>
                                ) : (
                                    tasks.upcoming.map((task) => (
                                        <div
                                            key={task.id}
                                            onClick={() => openTaskModal(task)}
                                            className="p-3.5 hover:bg-muted/50 cursor-pointer flex items-center justify-between transition-colors group"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                                                        {task.title}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground font-medium">({task.project?.name})</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                                                    {task.board_column?.name || 'Backlog'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <TaskDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                task={selectedTask}
            />
        </>
    );
}

MyDesk.layout = {
    breadcrumbs: [
        {
            title: 'My Desk',
            href: '/my-desk',
        },
    ],
};
