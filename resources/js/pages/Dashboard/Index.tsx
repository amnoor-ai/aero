import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    TrendingUp,
    Folder,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Zap,
    ArrowUpRight,
    Plus,
} from 'lucide-react';

interface Metrics {
    totalProjects: number;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    completionRate: number;
    onTimeRate: number;
    overdueRatio: number;
}

interface DashboardProps {
    metrics: Metrics;
    activeSprint?: any;
    recentProjects: any[];
}

export default function Dashboard({ metrics, activeSprint, recentProjects = [] }: DashboardProps) {
    return (
        <>
            <Head title="Dashboard - Aero DevPM" />

            <div className="p-6 space-y-6 bg-background min-h-screen text-foreground">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Workspace Overview</h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            Execution health, active sprint metrics, and project progress.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Link
                            href="/projects"
                            className="px-4 py-2 bg-primary hover:bg-primary/90 text-xs font-semibold text-primary-foreground rounded-lg shadow-lg shadow-primary/20 transition flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-1.5" /> New Project
                        </Link>
                    </div>
                </div>

                {/* Metric Summary Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Completion Rate */}
                    <div className="p-5 bg-card border border-border rounded-2xl relative overflow-hidden group hover:border-border/80 transition">
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

                    {/* On-Time Rate */}
                    <div className="p-5 bg-card border border-border rounded-2xl relative overflow-hidden group hover:border-border/80 transition">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">On-Time Execution Rate</span>
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline justify-between">
                            <span className="text-3xl font-extrabold text-foreground">{metrics.onTimeRate}%</span>
                            <span className="text-xs text-primary font-medium">On Schedule</span>
                        </div>
                        <div className="mt-3 w-full bg-muted h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-primary h-full rounded-full transition-all duration-500"
                                style={{ width: `${metrics.onTimeRate}%` }}
                            />
                        </div>
                    </div>

                    {/* Overdue Ratio */}
                    <div className="p-5 bg-card border border-border rounded-2xl relative overflow-hidden group hover:border-border/80 transition">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Overdue Tasks Ratio</span>
                            <div className="p-2 rounded-xl bg-destructive/10 text-destructive">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline justify-between">
                            <span className="text-3xl font-extrabold text-foreground">{metrics.overdueRatio}%</span>
                            <span className="text-xs text-destructive font-mono">{metrics.overdueTasks} tasks overdue</span>
                        </div>
                        <div className="mt-3 w-full bg-muted h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-destructive h-full rounded-full transition-all duration-500"
                                style={{ width: `${metrics.overdueRatio}%` }}
                            />
                        </div>
                    </div>

                    {/* Total Projects */}
                    <div className="p-5 bg-card border border-border rounded-2xl relative overflow-hidden group hover:border-border/80 transition">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Active Projects</span>
                            <div className="p-2 rounded-xl bg-accent/10 text-accent-foreground">
                                <Folder className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline justify-between">
                            <span className="text-3xl font-extrabold text-foreground">{metrics.totalProjects}</span>
                            <span className="text-xs text-accent-foreground font-medium">Core Workspace</span>
                        </div>
                        <div className="mt-3 flex items-center text-[11px] text-muted-foreground">
                            <span>Managed in multi-user team</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid: Active Sprint + Projects */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Active Sprint Section */}
                    <div className="lg:col-span-2 p-6 bg-card border border-border rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Zap className="w-5 h-5 text-accent-foreground" />
                                <h2 className="text-base font-bold text-foreground">Active Sprint Status</h2>
                            </div>
                            <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent-foreground border border-accent/30 font-medium">
                                Active Sprint
                            </span>
                        </div>

                        {activeSprint ? (
                            <div className="space-y-4 pt-2">
                                <div>
                                    <h3 className="text-lg font-bold text-primary">{activeSprint.name}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{activeSprint.goal}</p>
                                </div>

                                <div className="p-4 bg-muted/60 rounded-xl border border-border/80 grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Total Tasks</span>
                                        <span className="text-lg font-bold text-foreground">{activeSprint.tasks?.length || 0}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Project</span>
                                        <span className="text-xs font-semibold text-foreground truncate block mt-1">
                                            {activeSprint.project?.name || 'Core'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Ends In</span>
                                        <span className="text-xs font-mono font-bold text-primary block mt-1">11 days</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground text-sm">No active sprint running currently.</div>
                        )}
                    </div>

                    {/* Recent Projects List */}
                    <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-foreground">Recent Projects</h2>
                            <Link href="/projects" className="text-xs text-primary hover:underline flex items-center">
                                View all <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {recentProjects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.id}`}
                                    className="block p-3 bg-muted/60 hover:bg-muted border border-border/80 hover:border-primary/40 rounded-xl transition group"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-sm text-foreground group-hover:text-primary transition">
                                            {project.name}
                                        </span>
                                        <span className="text-[10px] font-mono text-muted-foreground">{project.tasks_count || 0} tasks</span>
                                    </div>

                                    <div className="mt-3 flex items-center space-x-2">
                                        <div className="flex-1 bg-muted h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary h-full rounded-full transition-all duration-300"
                                                style={{ width: `${project.progress || 0}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-mono text-muted-foreground">{project.progress || 0}%</span>
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

Dashboard.layout = () => ({
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
});
