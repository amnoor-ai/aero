import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { KanbanBoard } from '@/components/board/KanbanBoard';
import {
    Folder,
    Star,
    LayoutGrid,
    ListFilter,
    Users,
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

            <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                <Folder className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h1 className="text-xl font-extrabold text-white">{project.name}</h1>
                                    <span
                                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                            project.status === 'ongoing'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                        }`}
                                    >
                                        {project.status}
                                    </span>
                                </div>
                                {project.description && (
                                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">{project.description}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleToggleStar}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition flex items-center ${
                                    project.is_starred
                                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                                }`}
                            >
                                <Star className={`w-3.5 h-3.5 mr-1.5 ${project.is_starred ? 'fill-amber-400' : ''}`} />
                                {project.is_starred ? 'Starred' : 'Star Project'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-800/80">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium">Overall Project Progress</span>
                            <span className="font-mono text-blue-400 font-bold">{stats.progress}% Completed</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                            <div
                                className="bg-blue-500 h-full rounded-full transition-all duration-500 shadow-md shadow-blue-500/20"
                                style={{ width: `${stats.progress}%` }}
                            />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
                                <span className="block text-[10px] text-slate-500 font-bold uppercase">Total Tasks</span>
                                <span className="text-base font-extrabold text-slate-200 mt-0.5 block">{stats.total}</span>
                            </div>
                            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
                                <span className="block text-[10px] text-slate-400 font-bold uppercase">To Do</span>
                                <span className="text-base font-extrabold text-slate-300 mt-0.5 block">{stats.todo}</span>
                            </div>
                            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
                                <span className="block text-[10px] text-amber-400 font-bold uppercase">In Progress</span>
                                <span className="text-base font-extrabold text-amber-300 mt-0.5 block">{stats.inProgress}</span>
                            </div>
                            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
                                <span className="block text-[10px] text-purple-400 font-bold uppercase">In Review</span>
                                <span className="text-base font-extrabold text-purple-300 mt-0.5 block">{stats.inReview}</span>
                            </div>
                            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center col-span-2 sm:col-span-1">
                                <span className="block text-[10px] text-emerald-400 font-bold uppercase">Completed</span>
                                <span className="text-base font-extrabold text-emerald-300 mt-0.5 block">{stats.completed}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex border-b border-slate-800 text-sm font-medium">
                    <button
                        onClick={() => setActiveTab('board')}
                        className={`pb-3 px-4 transition border-b-2 flex items-center space-x-2 ${
                            activeTab === 'board'
                                ? 'border-blue-500 text-blue-400 font-semibold'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        <span>Board (Kanban)</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('list')}
                        className={`pb-3 px-4 transition border-b-2 flex items-center space-x-2 ${
                            activeTab === 'list'
                                ? 'border-blue-500 text-blue-400 font-semibold'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <ListFilter className="w-4 h-4" />
                        <span>List View</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('team')}
                        className={`pb-3 px-4 transition border-b-2 flex items-center space-x-2 ${
                            activeTab === 'team'
                                ? 'border-blue-500 text-blue-400 font-semibold'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        <span>Team ({project.members?.length || 0})</span>
                    </button>
                </div>

                {activeTab === 'board' && (
                    <KanbanBoard
                        projectId={project.id}
                        columns={project.board_columns || []}
                        users={workspaceUsers}
                    />
                )}

                {activeTab === 'list' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-sm">
                        Dense list view rendering tasks...
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 max-w-xl">
                        <h3 className="text-sm font-bold text-white">Project Members & Permissions</h3>
                        <div className="divide-y divide-slate-800">
                            {project.members?.map((member: any) => (
                                <div key={member.id} className="py-3 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-sm text-slate-200 block">{member.name}</span>
                                            <span className="text-xs text-slate-500">{member.email}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono uppercase text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/30">
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

ProjectShow.layout = (page: React.ReactNode) => page;
