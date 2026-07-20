import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { KanbanBoard } from '@/components/board/KanbanBoard';
import {
    Folder,
    Star,
    LayoutGrid,
    ListFilter,
    Calendar,
    Users,
    Sliders,
    Plus,
    CheckCircle2,
    Clock,
    AlertCircle,
} from 'lucide-react';

interface ProjectProps {
    project: any;
    workspaceUsers: any[];
    stats: {
        total: number;
        todo: number;
        inProgress: number;
        inReview: number;
        completed: number;
        progress: number;
    };
}

export default function ProjectShow({ project, workspaceUsers = [], stats }: ProjectProps) {
    const [activeTab, setActiveTab] = useState<'board' | 'list' | 'timeline' | 'team'>('board');

    const handleToggleStar = () => {
        router.post(`/projects/${project.id}/toggle-star`, {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title={`${project.name} - Aero DevPM`} />

            <div className="p-6 space-y-6 bg-background min-h-screen text-foreground">
                {/* Project Header Bar (Inspired by Idaara Screenshot) */}
                <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                <Folder className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h1 className="text-xl font-extrabold text-foreground">{project.name}</h1>
                                    <span
                                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                            project.status === 'ongoing'
                                                ? 'bg-primary/10 text-primary border-primary/30'
                                                : 'bg-accent/10 text-accent-foreground border-accent/30'
                                        }`}
                                    >
                                        {project.status}
                                    </span>
                                </div>
                                {project.description && (
                                    <p className="text-xs text-muted-foreground mt-1 max-w-2xl">{project.description}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleToggleStar}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition flex items-center ${
                                    project.is_starred
                                        ? 'bg-accent/10 border-accent/30 text-accent-foreground'
                                        : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <Star className={`w-3.5 h-3.5 mr-1.5 ${project.is_starred ? 'fill-accent-foreground' : ''}`} />
                                {project.is_starred ? 'Starred' : 'Star Project'}
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar & Stat Counter Strip */}
                    <div className="space-y-3 pt-2 border-t border-border/80">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-medium">Overall Project Progress</span>
                            <span className="font-mono text-primary font-bold">{stats.progress}% Completed</span>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden border border-border">
                            <div
                                className="bg-primary h-full rounded-full transition-all duration-500 shadow-md shadow-primary/20"
                                style={{ width: `${stats.progress}%` }}
                            />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                            <div className="p-3 bg-muted/60 rounded-xl border border-border/80 text-center">
                                <span className="block text-[10px] text-muted-foreground font-bold uppercase">Total Tasks</span>
                                <span className="text-base font-extrabold text-foreground mt-0.5 block">{stats.total}</span>
                            </div>
                            <div className="p-3 bg-muted/60 rounded-xl border border-border/80 text-center">
                                <span className="block text-[10px] text-muted-foreground font-bold uppercase">To Do</span>
                                <span className="text-base font-extrabold text-foreground mt-0.5 block">{stats.todo}</span>
                            </div>
                            <div className="p-3 bg-muted/60 rounded-xl border border-border/80 text-center">
                                <span className="block text-[10px] text-primary font-bold uppercase">In Progress</span>
                                <span className="text-base font-extrabold text-primary mt-0.5 block">{stats.inProgress}</span>
                            </div>
                            <div className="p-3 bg-muted/60 rounded-xl border border-border/80 text-center">
                                <span className="block text-[10px] text-accent-foreground font-bold uppercase">In Review</span>
                                <span className="text-base font-extrabold text-accent-foreground mt-0.5 block">{stats.inReview}</span>
                            </div>
                            <div className="p-3 bg-muted/60 rounded-xl border border-border/80 text-center col-span-2 sm:col-span-1">
                                <span className="block text-[10px] text-primary font-bold uppercase">Completed</span>
                                <span className="text-base font-extrabold text-primary mt-0.5 block">{stats.completed}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex border-b border-border text-sm font-medium">
                    <button
                        onClick={() => setActiveTab('board')}
                        className={`pb-3 px-4 transition border-b-2 flex items-center space-x-2 ${
                            activeTab === 'board'
                                ? 'border-primary text-primary font-semibold'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        <span>Board (Kanban)</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('list')}
                        className={`pb-3 px-4 transition border-b-2 flex items-center space-x-2 ${
                            activeTab === 'list'
                                ? 'border-primary text-primary font-semibold'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <ListFilter className="w-4 h-4" />
                        <span>List View</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('team')}
                        className={`pb-3 px-4 transition border-b-2 flex items-center space-x-2 ${
                            activeTab === 'team'
                                ? 'border-primary text-primary font-semibold'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        <span>Team ({project.members?.length || 0})</span>
                    </button>
                </div>

                {/* Active Tab View Content */}
                {activeTab === 'board' && (
                    <KanbanBoard
                        projectId={project.id}
                        columns={project.board_columns || []}
                        users={workspaceUsers}
                    />
                )}

                {activeTab === 'list' && (
                    <div className="bg-card border border-border rounded-2xl p-6 text-center text-muted-foreground text-sm">
                        Dense list view rendering tasks...
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="p-6 bg-card border border-border rounded-2xl space-y-4 max-w-xl">
                        <h3 className="text-sm font-bold text-foreground">Project Members & Permissions</h3>
                        <div className="divide-y divide-border">
                            {project.members?.map((member: any) => (
                                <div key={member.id} className="py-3 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground text-xs">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-sm text-foreground block">{member.name}</span>
                                            <span className="text-xs text-muted-foreground">{member.email}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono uppercase text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/30">
                                        {member.pivot?.role || 'contributor'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

ProjectShow.layout = (page: any) => ({
    breadcrumbs: [
        { title: 'Projects', href: '/projects' },
        { title: page.props.project.name, href: `/projects/${page.props.project.id}` },
    ],
});
