import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    CheckSquare,
    Folder,
    Star,
    Plus,
    Search,
    ChevronRight,
    Sliders,
    Zap,
} from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { ProjectDrawer } from '@/components/navigation/ProjectDrawer';
import { useCurrentUrl } from '@/hooks/use-current-url';

export function AppSidebar() {
    const { props } = usePage<any>();
    const { isCurrentUrl } = useCurrentUrl();

    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [isProjectDrawerOpen, setIsProjectDrawerOpen] = useState(false);

    const starredProjects = props.starredProjects || [];
    const allProjects = props.allProjects || starredProjects;

    return (
        <>
            <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen shrink-0 text-sidebar-foreground select-none">
                {/* Brand Header */}
                <div className="p-4 border-b border-sidebar-border/80 space-y-3">
                    <Link href="/dashboard" className="flex items-center space-x-3 group">
                        <div className="w-9 h-9 rounded-xl bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-extrabold text-xl shadow-lg shadow-sidebar-primary/30 group-hover:scale-105 transition">
                            ⚡
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-sidebar-foreground text-base tracking-tight group-hover:text-sidebar-primary transition">
                                Aero DevPM
                            </span>
                            <span className="text-[10px] text-sidebar-foreground/70 font-mono">v1.0 • Core Workspace</span>
                        </div>
                    </Link>

                    {/* Global Ctrl+K Search Trigger */}
                    <button
                        onClick={() => setIsCommandPaletteOpen(true)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-sidebar-accent border border-sidebar-border hover:border-sidebar-border/80 rounded-xl text-xs text-sidebar-accent-foreground hover:text-sidebar-foreground transition group"
                    >
                        <span className="flex items-center">
                            <Search className="w-3.5 h-3.5 mr-2 text-sidebar-accent-foreground group-hover:text-sidebar-primary" />
                            Search...
                        </span>
                        <kbd className="px-1.5 py-0.5 text-[10px] bg-sidebar-accent border border-sidebar-border text-sidebar-accent-foreground rounded font-mono">
                            Ctrl K
                        </kbd>
                    </button>
                </div>

                {/* Navigation Sections */}
                <div className="flex-1 overflow-y-auto p-3 space-y-6">
                    {/* WORKSPACE SECTION */}
                    <div className="space-y-1">
                        <div className="px-3 text-[10px] font-bold tracking-wider text-sidebar-foreground/70 uppercase">
                            Workspace
                        </div>
                        <nav className="space-y-1 pt-1">
                            <Link
                                href="/dashboard"
                                className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                    isCurrentUrl('/dashboard')
                                        ? 'bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/20 font-semibold'
                                        : 'text-sidebar-accent-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent'
                                }`}
                            >
                                <LayoutGrid className="w-4 h-4 text-sidebar-primary" />
                                <span>Dashboard</span>
                            </Link>

                            <Link
                                href="/my-desk"
                                className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                    isCurrentUrl('/my-desk')
                                        ? 'bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/20 font-semibold'
                                        : 'text-sidebar-accent-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent'
                                }`}
                            >
                                <CheckSquare className="w-4 h-4 text-sidebar-primary" />
                                <span>My Desk</span>
                            </Link>
                        </nav>
                    </div>

                    {/* PROJECTS SECTION */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between px-3">
                            <span className="text-[10px] font-bold tracking-wider text-sidebar-foreground/70 uppercase">
                                Starred Projects
                            </span>
                            <button
                                onClick={() => setIsProjectDrawerOpen(true)}
                                className="text-[11px] text-sidebar-primary hover:text-sidebar-primary/80 font-medium transition flex items-center"
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
                                        className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                            isCurrentUrl(`/projects/${project.id}`)
                                                ? 'bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/20 font-semibold'
                                                : 'text-sidebar-accent-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent'
                                        }`}
                                    >
                                        <Folder className="w-4 h-4 text-sidebar-primary shrink-0" />
                                        <span className="truncate">{project.name}</span>
                                    </Link>
                                ))
                            ) : (
                                <Link
                                    href="/projects"
                                    className="flex items-center space-x-3 px-3 py-2 rounded-xl text-xs text-sidebar-accent-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition"
                                >
                                    <Folder className="w-4 h-4 text-sidebar-accent-foreground" />
                                    <span>All Projects Hub</span>
                                </Link>
                            )}

                            <button
                                onClick={() => setIsProjectDrawerOpen(true)}
                                className="w-full flex items-center space-x-3 px-3 py-2 text-xs text-sidebar-accent-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-xl transition text-left"
                            >
                                <Plus className="w-4 h-4 text-sidebar-accent-foreground" />
                                <span>Projects Drawer</span>
                            </button>
                        </nav>
                    </div>

                    {/* SYSTEM SECTION */}
                    <div className="space-y-1">
                        <div className="px-3 text-[10px] font-bold tracking-wider text-sidebar-foreground/70 uppercase">
                            System
                        </div>
                        <nav className="space-y-1 pt-1">
                            <Link
                                href="/projects"
                                className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                    isCurrentUrl('/projects')
                                        ? 'bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/20 font-semibold'
                                        : 'text-sidebar-accent-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent'
                                }`}
                            >
                                <Folder className="w-4 h-4 text-sidebar-primary" />
                                <span>Projects Directory</span>
                            </Link>

                            <Link
                                href="/settings/profile"
                                className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                                    isCurrentUrl('/settings/profile')
                                        ? 'bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/20 font-semibold'
                                        : 'text-sidebar-accent-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent'
                                }`}
                            >
                                <Sliders className="w-4 h-4 text-sidebar-accent-foreground" />
                                <span>Settings</span>
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Footer User Profile */}
                <div className="p-3 border-t border-sidebar-border/80 bg-sidebar">
                    <NavUser />
                </div>
            </aside>

            {/* Global Modals & Drawers */}
            <CommandPalette
                isOpen={isCommandPaletteOpen}
                onClose={() => setIsCommandPaletteOpen(false)}
                projects={allProjects}
            />

            <ProjectDrawer
                isOpen={isProjectDrawerOpen}
                onClose={() => setIsProjectDrawerOpen(false)}
                projects={allProjects}
            />
        </>
    );
}
