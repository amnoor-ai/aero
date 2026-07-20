import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Folder,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Zap,
    ArrowUpRight,
    Plus,
    PieChart,
} from 'lucide-react';

interface Metrics {
    totalProjects: number;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    completionRate: number;
    onTimeRate: number;
    overdueRatio: number;
    todoCount: number;
    inProgressCount: number;
    inReviewCount: number;
    doneCount: number;
}

interface DashboardProps {
    metrics: Metrics;
    timeframe?: string;
    activeSprint?: any;
    recentProjects: any[];
}

export default function Dashboard({ metrics, timeframe = 'month', activeSprint, recentProjects = [] }: DashboardProps) {
    const handleTimeframeChange = (tf: string) => {
        router.get('/dashboard', { timeframe: tf }, { preserveState: true, replace: true });
    };

    const total = metrics.totalTasks || 1;
    const todoPct = Math.round((metrics.todoCount / total) * 100);
    const inProgressPct = Math.round((metrics.inProgressCount / total) * 100);
    const inReviewPct = Math.round((metrics.inReviewCount / total) * 100);
    const donePct = Math.round((metrics.doneCount / total) * 100);

    return (
        <>
            <Head title="Dashboard - Aero DevPM" />

            <div className="p-6 space-y-6 bg-background min-h-screen text-foreground select-none">
                {/* Header with Timeframe Pills */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-5">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Workspace Overview</h1>

                            <div className="flex bg-card p-1 rounded-full border border-border text-xs">
                                <button
                                    onClick={() => handleTimeframeChange('today')}
                                    className={`px-3 py-1 font-semibold rounded-full transition ${
                                        timeframe === 'today'
                                            ? 'bg-primary text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    Today
                                </button>
                                <button
                                    onClick={() => handleTimeframeChange('week')}
                                    className={`px-3 py-1 font-semibold rounded-full transition ${
                                        timeframe === 'week'
                                            ? 'bg-primary text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    This Week
                                </button>
                                <button
                                    onClick={() => handleTimeframeChange('month')}
                                    className={`px-3 py-1 font-semibold rounded-full transition ${
                                        timeframe === 'month'
                                            ? 'bg-primary text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    This Month
                                </button>
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground mt-1">
                            Execution health, sprint velocity, and active project analytics.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Link
                            href="/projects"
                            className="px-4 py-2 bg-primary hover:bg-primary/90 text-xs font-semibold text-foreground rounded-full shadow-lg shadow-primary/20 transition flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-1.5" /> New Project
                        </Link>
                    </div>
                </div>

                {/* Metric Summary Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 bg-card border border-border rounded-2xl relative overflow-hidden group hover:border-border transition shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Completion Rate</span>
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline justify-between">
                            <span className="text-3xl font-extrabold text-foreground">{metrics.completionRate}%</span>
                            <span className="text-xs text-muted-foreground font-mono">
                                {metrics.completedTasks}/{metrics.totalTasks} tasks
                            </span>
                        </div>
                        <div className="mt-3 w-full bg-muted h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-primary h-full rounded-full transition-all duration-500"
                                style={{ width: `${metrics.completionRate}%` }}
                            />
                        </div>
                    </div>

                    <div className="p-5 bg-card border border-border rounded-2xl relative overflow-hidden group hover:border-border transition shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">On-Time Execution Rate</span>
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline justify-between">
                            <span className="text-3xl font-extrabold text-foreground">{metrics.onTimeRate}%</span>
                            <span className="text-xs text-primary font-semibold">On Schedule</span>
                        </div>
                        <div className="mt-3 w-full bg-muted h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-primary h-full rounded-full transition-all duration-500"
                                style={{ width: `${metrics.onTimeRate}%` }}
                            />
                        </div>
                    </div>

                    <div className="p-5 bg-card border border-border rounded-2xl relative overflow-hidden group hover:border-border transition shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Overdue Tasks Ratio</span>
                            <div className="p-2 rounded-xl bg-destructive/10 text-destructive">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline justify-between">
                            <span className="text-3xl font-extrabold text-foreground">{metrics.overdueRatio}%</span>
                            <span className="text-xs text-destructive font-mono font-bold">{metrics.overdueTasks} tasks overdue</span>
                        </div>
                        <div className="mt-3 w-full bg-muted h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-destructive h-full rounded-full transition-all duration-500"
                                style={{ width: `${metrics.overdueRatio}%` }}
                            />
                        </div>
                    </div>

                    <div className="p-5 bg-card border border-border rounded-2xl relative overflow-hidden group hover:border-border transition shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Active Projects</span>
                            <div className="p-2 rounded-xl bg-accent/10 text-accent-foreground">
                                <Folder className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline justify-between">
                            <span className="text-3xl font-extrabold text-foreground">{metrics.totalProjects}</span>
                            <span className="text-xs text-accent-foreground font-semibold">Core Workspace</span>
                        </div>
                        <div className="mt-3 flex items-center text-[11px] text-muted-foreground">
                            <span>Managed in multi-user team</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="p-6 bg-card border border-border rounded-2xl space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Zap className="w-5 h-5 text-accent-foreground" />
                                    <h2 className="text-base font-bold text-foreground">Active Sprint Status</h2>
                                </div>
                                <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent-foreground border border-accent/30 font-bold">
                                    Active Sprint
                                </span>
                            </div>

                            {activeSprint ? (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-extrabold text-primary">{activeSprint.name}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">{activeSprint.goal}</p>
                                    </div>

                                    <div className="p-4 bg-background/60 rounded-xl border border-border/80 space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground font-medium">Sprint Completion Progress</span>
                                            <span className="text-primary font-mono font-bold">
                                                {activeSprint.tasks ? Math.round((activeSprint.tasks.filter((t: any) => t.board_column?.name === 'Done').length / activeSprint.tasks.length) * 100) : 0}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${activeSprint.tasks ? Math.round((activeSprint.tasks.filter((t: any) => t.board_column?.name === 'Done').length / activeSprint.tasks.length) * 100) : 0}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-4 bg-background/60 rounded-xl border border-border/80 grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <span className="block text-[10px] text-muted-foreground font-bold uppercase">Total Tasks</span>
                                            <span className="text-lg font-bold text-foreground mt-1 block">{activeSprint.tasks?.length || 0}</span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-muted-foreground font-bold uppercase">Project</span>
                                            <span className="text-xs font-semibold text-muted-foreground truncate block mt-1">
                                                {activeSprint.project?.name || 'Core'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-muted-foreground font-bold uppercase">Ends In</span>
                                            <span className="text-xs font-mono font-bold text-primary block mt-1">11 days</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8 text-center text-muted-foreground text-sm">No active sprint running currently.</div>
                            )}
                        </div>

                        <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
                            <div className="flex items-center space-x-2">
                                <PieChart className="w-5 h-5 text-primary" />
                                <h2 className="text-base font-bold text-foreground">Task Status Distribution</h2>
                            </div>

                            <div className="w-full h-3 bg-muted rounded-full overflow-hidden flex">
                                <div className="bg-muted-foreground h-full transition-all duration-300" style={{ width: `${todoPct}%` }} title={`To Do: ${metrics.todoCount}`} />
                                <div className="bg-accent h-full transition-all duration-300" style={{ width: `${inProgressPct}%` }} title={`In Progress: ${metrics.inProgressCount}`} />
                                <div className="bg-accent h-full transition-all duration-300" style={{ width: `${inReviewPct}%` }} title={`In Review: ${metrics.inReviewCount}`} />
                                <div className="bg-primary h-full transition-all duration-300" style={{ width: `${donePct}%` }} title={`Done: ${metrics.doneCount}`} />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                                <div className="flex items-center space-x-2">
                                    <span className="w-3 h-3 rounded-full bg-muted-foreground" />
                                    <span className="text-muted-foreground font-medium">To Do ({metrics.todoCount})</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="w-3 h-3 rounded-full bg-accent" />
                                    <span className="text-muted-foreground font-medium">In Progress ({metrics.inProgressCount})</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="w-3 h-3 rounded-full bg-accent" />
                                    <span className="text-muted-foreground font-medium">In Review ({metrics.inReviewCount})</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="w-3 h-3 rounded-full bg-primary" />
                                    <span className="text-muted-foreground font-medium">Done ({metrics.doneCount})</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-card border border-border rounded-2xl space-y-4 flex flex-col">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-foreground">Recent Projects</h2>
                            <Link href="/projects" className="text-xs text-primary hover:underline flex items-center font-semibold">
                                View all <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                            </Link>
                        </div>

                        <div className="space-y-3 flex-1">
                            {recentProjects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.id}`}
                                    className="block p-4 bg-background/60 hover:bg-background border border-border hover:border-primary/40 rounded-xl transition group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold text-sm text-foreground group-hover:text-primary transition">
                                                {project.name}
                                            </span>
                                            <span
                                                className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                                                    project.status === 'ongoing'
                                                        ? 'bg-primary/10 text-primary border-primary/30'
                                                        : 'bg-accent/10 text-accent-foreground border-accent/30'
                                                }`}
                                            >
                                                {project.status}
                                            </span>
                                        </div>

                                        <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-md border border-border">
                                            {project.tasks_count || 0} tasks
                                        </span>
                                    </div>

                                    <div className="mt-3 flex items-center space-x-2">
                                        <div className="flex-1 bg-muted h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary h-full rounded-full transition-all duration-300"
                                                style={{ width: `${project.progress || 0}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-mono font-bold text-muted-foreground">{project.progress || 0}%</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => page;
