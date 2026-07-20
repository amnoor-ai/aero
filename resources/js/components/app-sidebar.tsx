import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    CheckSquare,
    Folder,
    Star,
    Plus,
    ChevronRight,
    Sliders,
} from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import { ProjectDrawer } from '@/components/navigation/ProjectDrawer';
import { useCurrentUrl } from '@/hooks/use-current-url';

export function AppSidebar() {
    const { props } = usePage<any>();
    const { isCurrentUrl } = useCurrentUrl();
    const [isProjectDrawerOpen, setIsProjectDrawerOpen] = useState(false);

    const starredProjects = props.starredProjects || [];
    const allProjects = props.allProjects || starredProjects;

    return (
        <>
            <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen shrink-0 text-slate-300 select-none">
                {/* Brand Header */}
                <div className="p-4 border-b border-slate-800/80">
                    <Link href="/dashboard" className="flex items-center space-x-3 group">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-600/30 group-hover:scale-105 transition">
                            ⚡
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-slate-100 text-base tracking-tight group-hover:text-blue-400 transition">
                                Aero DevPM
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">v1.0 • Core Workspace</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation Sections */}
                <div className="flex-1 overflow-y-auto p-3 space-y-6">
                    {/* WORKSPACE SECTION */}
                    <div className="space-y-1">
                        <div className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                            Workspace
                        </div>
                        <nav className="space-y-1 pt-1">
                            <Link
                                href="/dashboard"
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                                    isCurrentUrl('/dashboard')
                                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold shadow-sm'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                                }`}
                            >
                                <LayoutGrid className="w-4 h-4 text-blue-400" />
                                <span>Dashboard</span>
                            </Link>

                            <Link
                                href="/my-desk"
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                                    isCurrentUrl('/my-desk')
                                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold shadow-sm'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                                }`}
                            >
                                <CheckSquare className="w-4 h-4 text-emerald-400" />
                                <span>My Desk</span>
                            </Link>
                        </nav>
                    </div>

                    {/* PROJECTS SECTION */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between px-3">
                            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                                Starred Projects
                            </span>
                            <button
                                onClick={() => setIsProjectDrawerOpen(true)}
                                className="text-[11px] text-blue-400 hover:text-blue-300 font-medium transition flex items-center"
                            >
                                Browse <ChevronRight className="w-3 h-3 ml-0.5" />
                            </button>
                        </div>

                        <nav className="space-y-1 pt-1">
                            {starredProjects.length > 0 ? (
                                starredProjects.slice(0, 5).map((project: any) => (
                                    <Link
                                        key={project.id}
                                        href={`/projects/${project.id}`}
                                        className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                                            isCurrentUrl(`/projects/${project.id}`)
                                                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold shadow-sm'
                                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                                        }`}
                                    >
                                        <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                                        <span className="truncate">{project.name}</span>
                                    </Link>
                                ))
                            ) : (
                                <Link
                                    href="/projects"
                                    className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition"
                                >
                                    <Folder className="w-4 h-4 text-slate-400" />
                                    <span>All Projects Hub</span>
                                </Link>
                            )}

                            <button
                                onClick={() => setIsProjectDrawerOpen(true)}
                                className="w-full flex items-center space-x-3 px-3 py-2.5 text-xs text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition text-left"
                            >
                                <Plus className="w-4 h-4 text-slate-400" />
                                <span>Projects Drawer</span>
                            </button>
                        </nav>
                    </div>

                    {/* SYSTEM SECTION */}
                    <div className="space-y-1">
                        <div className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                            System
                        </div>
                        <nav className="space-y-1 pt-1">
                            <Link
                                href="/projects"
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                                    isCurrentUrl('/projects')
                                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold shadow-sm'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                                }`}
                            >
                                <Folder className="w-4 h-4 text-indigo-400" />
                                <span>Projects Directory</span>
                            </Link>

                            <Link
                                href="/settings/profile"
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                                    isCurrentUrl('/settings/profile')
                                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold shadow-sm'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                                }`}
                            >
                                <Sliders className="w-4 h-4 text-slate-400" />
                                <span>Settings</span>
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Footer User Profile */}
                <div className="p-3 border-t border-slate-800/80 bg-slate-950">
                    <NavUser />
                </div>
            </aside>

            {/* Global Project Drawer */}
            <ProjectDrawer
                isOpen={isProjectDrawerOpen}
                onClose={() => setIsProjectDrawerOpen(false)}
                projects={allProjects}
            />
        </>
    );
}
