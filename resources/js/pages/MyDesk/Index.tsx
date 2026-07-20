import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
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

            <div className="p-6 space-y-6 bg-background min-h-screen text-foreground">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Desk</h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            Your personalized task command center grouped by deadline urgency.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <select
                            value={filters.scope || 'me'}
                            onChange={(e) => handleFilterChange('scope', e.target.value)}
                            className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-ring"
                        >
                            <option value="me">Assigned to Me</option>
                            <option value="all">All Workspace Tasks</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-2xl flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-destructive">Overdue</span>
                            <span className="block text-2xl font-extrabold text-foreground mt-1">{counts.overdue}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-destructive/20 text-destructive">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="p-4 bg-accent/10 border border-accent/30 rounded-2xl flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-accent-foreground">Due Today</span>
                            <span className="block text-2xl font-extrabold text-foreground mt-1">{counts.dueToday}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-accent/20 text-accent-foreground">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="p-4 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-primary">Due Tomorrow</span>
                            <span className="block text-2xl font-extrabold text-foreground mt-1">{counts.dueTomorrow}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-blue-500/20 text-primary">
                            <Calendar className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="p-4 bg-card border border-border rounded-2xl flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-muted-foreground">Upcoming / Backlog</span>
                            <span className="block text-2xl font-extrabold text-foreground mt-1">{counts.upcoming}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-muted text-muted-foreground">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-card border border-border rounded-2xl flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                        <input
                            type="text"
                            placeholder="Filter activities..."
                            value={filters.search || ''}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-ring"
                        />
                    </div>

                    <select
                        value={filters.project_id || ''}
                        onChange={(e) => handleFilterChange('project_id', e.target.value)}
                        className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-ring"
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
                        className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-ring"
                    >
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>

                <div className="space-y-4">
                    <div className="bg-card border border-destructive/30 rounded-2xl overflow-hidden">
                        <button
                            onClick={() => toggleSection('overdue')}
                            className="w-full px-5 py-3.5 bg-destructive/10 hover:bg-destructive/20 flex items-center justify-between transition text-destructive font-semibold text-sm"
                        >
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="w-4 h-4 text-destructive" />
                                <span>Overdue Activities ({tasks.overdue.length})</span>
                            </div>
                            {openSections.overdue ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {openSections.overdue && (
                            <div className="divide-y divide-slate-800/60">
                                {tasks.overdue.length === 0 ? (
                                    <div className="p-4 text-center text-muted-foreground text-xs">No overdue activities! 🎉</div>
                                ) : (
                                    tasks.overdue.map((task) => (
                                        <div
                                            key={task.id}
                                            onClick={() => openTaskModal(task)}
                                            className="p-4 hover:bg-muted/40 cursor-pointer flex items-center justify-between transition group"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-semibold text-sm text-foreground group-hover:text-primary transition">
                                                        {task.title}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">({task.project?.name})</span>
                                                </div>
                                                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                                                    <span className="text-destructive font-mono text-[11px]">
                                                        Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/30">
                                                    {task.priority}
                                                </span>
                                                <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                                                    {task.board_column?.name || 'To Do'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                        <button
                            onClick={() => toggleSection('dueToday')}
                            className="w-full px-5 py-3.5 bg-background/60 hover:bg-muted/40 flex items-center justify-between transition text-accent-foreground font-semibold text-sm"
                        >
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-accent-foreground" />
                                <span>Today's Activities ({tasks.dueToday.length})</span>
                            </div>
                            {openSections.dueToday ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {openSections.dueToday && (
                            <div className="divide-y divide-slate-800/60">
                                {tasks.dueToday.length === 0 ? (
                                    <div className="p-4 text-center text-muted-foreground text-xs">No tasks due today.</div>
                                ) : (
                                    tasks.dueToday.map((task) => (
                                        <div
                                            key={task.id}
                                            onClick={() => openTaskModal(task)}
                                            className="p-4 hover:bg-muted/40 cursor-pointer flex items-center justify-between transition group"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-semibold text-sm text-foreground group-hover:text-primary transition">
                                                        {task.title}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">({task.project?.name})</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-accent/10 text-accent-foreground border border-accent/30">
                                                    {task.priority}
                                                </span>
                                                <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                                                    {task.board_column?.name || 'To Do'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                        <button
                            onClick={() => toggleSection('upcoming')}
                            className="w-full px-5 py-3.5 bg-background/60 hover:bg-muted/40 flex items-center justify-between transition text-muted-foreground font-semibold text-sm"
                        >
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>Upcoming & Backlog ({tasks.upcoming.length})</span>
                            </div>
                            {openSections.upcoming ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {openSections.upcoming && (
                            <div className="divide-y divide-slate-800/60">
                                {tasks.upcoming.length === 0 ? (
                                    <div className="p-4 text-center text-muted-foreground text-xs">No upcoming tasks.</div>
                                ) : (
                                    tasks.upcoming.map((task) => (
                                        <div
                                            key={task.id}
                                            onClick={() => openTaskModal(task)}
                                            className="p-4 hover:bg-muted/40 cursor-pointer flex items-center justify-between transition group"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-semibold text-sm text-foreground group-hover:text-primary transition">
                                                        {task.title}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">({task.project?.name})</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
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

MyDesk.layout = (page: React.ReactNode) => page;
