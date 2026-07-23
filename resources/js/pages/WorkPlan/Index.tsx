import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    BarChart3,
    Calendar,
    Folder,
    Zap,
    Target,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SprintItem {
    id: number;
    name: string;
    status: string;
    start_date: string;
    end_date: string;
}

interface MilestoneItem {
    id: number;
    name: string;
    status: string;
    due_date: string;
    progress: number;
}

interface ProjectRoadmapItem {
    id: number;
    name: string;
    status: string;
    start_date: string;
    due_date: string;
    progress: number;
    tasks_count: number;
    sprints: SprintItem[];
    milestones: MilestoneItem[];
}

interface WorkPlanProps {
    projects: ProjectRoadmapItem[];
}

export default function WorkPlanIndex({ projects = [] }: WorkPlanProps) {
    const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');

    return (
        <>
            <Head title="Work Plan & Gantt Roadmap - Aero DevPM" />

            <div className="p-6 md:p-8 space-y-6 bg-background text-foreground min-h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                                Work Plan & Roadmap
                            </h1>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                High-density horizontal Gantt timeline plotting workspace projects, sprints, and release milestones.
                            </p>
                        </div>
                    </div>

                    {/* View Controls */}
                    <div className="flex items-center space-x-2">
                        <div className="flex bg-muted/50 p-1 rounded-lg border border-border">
                            <button
                                onClick={() => setViewMode('weekly')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                                    viewMode === 'weekly'
                                        ? 'bg-background shadow-sm text-amber-400 font-semibold'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Weekly View
                            </button>
                            <button
                                onClick={() => setViewMode('monthly')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                                    viewMode === 'monthly'
                                        ? 'bg-background shadow-sm text-amber-400 font-semibold'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Monthly View
                            </button>
                        </div>
                    </div>
                </div>

                {/* Legend Bar */}
                <div className="p-3 bg-card border border-border rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm text-xs">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded bg-primary" />
                            <span className="font-semibold text-foreground">Projects</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded bg-emerald-500" />
                            <span className="font-semibold text-foreground">Active/Future Sprints</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded bg-rose-500" />
                            <span className="font-semibold text-foreground">Release Milestones</span>
                        </div>
                    </div>

                    <span className="text-xs text-muted-foreground font-mono">
                        {projects.length} Active Timelines
                    </span>
                </div>

                {/* Timeline Grid Roadmap */}
                {projects.length === 0 ? (
                    <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-3">
                        <BarChart3 className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                        <h3 className="text-base font-semibold text-foreground">No Projects Available</h3>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                            Create projects and sprints to generate the workspace Gantt roadmap.
                        </p>
                    </div>
                ) : (
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm overflow-x-auto">
                        <div className="space-y-6 min-w-[700px]">
                            {projects.map((project) => (
                                <div key={project.id} className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/60">
                                    {/* Project Header Bar */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Folder className="w-4 h-4 text-primary" />
                                            <Link href={`/projects/${project.id}`} className="font-bold text-sm text-foreground hover:text-primary transition">
                                                {project.name}
                                            </Link>
                                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
                                                {project.progress}% Complete
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-3 text-xs text-muted-foreground font-mono">
                                            <span>📅 {project.start_date} → {project.due_date}</span>
                                        </div>
                                    </div>

                                    {/* Project Main Timeline Bar */}
                                    <div className="space-y-2">
                                        <div className="w-full bg-muted/80 h-4 rounded-lg overflow-hidden border border-border/50 relative">
                                            <div
                                                className="bg-primary h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-bold text-primary-foreground"
                                                style={{ width: `${Math.max(15, project.progress)}%` }}
                                            >
                                                {project.progress}%
                                            </div>
                                        </div>

                                        {/* Sprints Sub-bars */}
                                        {project.sprints.length > 0 && (
                                            <div className="pl-4 space-y-1.5 pt-1">
                                                <div className="text-[10px] uppercase font-bold text-muted-foreground flex items-center space-x-1">
                                                    <Zap className="w-3 h-3 text-emerald-400" />
                                                    <span>Sprints</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {project.sprints.map((sprint) => (
                                                        <div
                                                            key={sprint.id}
                                                            className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                                                                sprint.status === 'active'
                                                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                                                    : 'bg-background border-border/70 text-muted-foreground'
                                                            }`}
                                                        >
                                                            <span className="font-semibold truncate">{sprint.name}</span>
                                                            <span className="text-[10px] font-mono shrink-0 ml-2">{sprint.start_date} → {sprint.end_date}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Milestones Sub-bars */}
                                        {project.milestones.length > 0 && (
                                            <div className="pl-4 space-y-1.5 pt-1">
                                                <div className="text-[10px] uppercase font-bold text-muted-foreground flex items-center space-x-1">
                                                    <Target className="w-3 h-3 text-rose-400" />
                                                    <span>Milestone Gates</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {project.milestones.map((milestone) => (
                                                        <div
                                                            key={milestone.id}
                                                            className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between"
                                                        >
                                                            <span className="font-semibold truncate">{milestone.name}</span>
                                                            <span className="text-[10px] font-mono shrink-0 ml-2">Target: {milestone.due_date}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

WorkPlanIndex.layout = {
    breadcrumbs: [
        { title: 'Projects & Planning', href: '/projects' },
        { title: 'Work Plan', href: '/work-plan' },
    ],
};
