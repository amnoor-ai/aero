import { router } from '@inertiajs/react';
import { Search, Folder, CheckSquare, LayoutGrid, Activity, Target, BarChart3, Building2, Sliders, FileText } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ProjectItem {
    id: number;
    name: string;
    status: string;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    projects?: ProjectItem[];
}

const systemPages = [
    { title: 'Dashboard Overview', href: '/dashboard', icon: LayoutGrid, group: 'Pages' },
    { title: 'My Desk (Personal Tasks)', href: '/my-desk', icon: CheckSquare, group: 'Pages' },
    { title: 'Documentation & Files Directory', href: '/documentation', icon: FileText, group: 'Pages' },
    { title: 'Tasks Directory', href: '/tasks', icon: CheckSquare, group: 'Pages' },
    { title: 'Projects Hub', href: '/projects', icon: Folder, group: 'Pages' },
    { title: 'Milestones Dashboard', href: '/milestones', icon: Target, group: 'Pages' },
    { title: 'Work Plan (Roadmap)', href: '/work-plan', icon: BarChart3, group: 'Pages' },
    { title: 'Workspace Departments', href: '/departments', icon: Building2, group: 'Pages' },
    { title: 'System Audit Logs', href: '/system/logs', icon: Activity, group: 'System' },
    { title: 'Account Settings', href: '/settings/profile', icon: Sliders, group: 'Settings' },
    { title: 'Security Settings', href: '/settings/security', icon: Sliders, group: 'Settings' },
    { title: 'Appearance Settings', href: '/settings/appearance', icon: Sliders, group: 'Settings' },
    { title: 'Teams Settings', href: '/settings/teams', icon: Sliders, group: 'Settings' },
];

export function CommandPalette({ isOpen, onClose, projects = [] }: CommandPaletteProps) {
    const [query, setQuery] = useState('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();

                if (isOpen) {
                    onClose();
                } else {
                    setQuery('');
                }
            } else if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) {
return null;
}

    const trimmedQuery = query.toLowerCase().trim();

    const filteredPages = systemPages.filter((p) =>
        p.title.toLowerCase().includes(trimmedQuery)
    );

    const filteredProjects = projects.filter((p) =>
        p.name.toLowerCase().includes(trimmedQuery)
    );

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm">
            <div
                className="w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Header */}
                <div className="flex items-center px-4 py-3 border-b border-border">
                    <Search className="w-4 h-4 text-muted-foreground mr-3 shrink-0" />
                    <input
                        type="text"
                        autoFocus
                        placeholder="Search pages, projects, or actions..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-xs"
                    />
                    <kbd className="px-2 py-0.5 text-[10px] text-muted-foreground bg-muted border border-border rounded">
                        ESC
                    </kbd>
                </div>

                {/* Content Items */}
                <div className="max-h-80 overflow-y-auto p-2 space-y-3">
                    {/* Navigation Pages */}
                    {filteredPages.length > 0 && (
                        <div>
                            <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                Navigation & Pages ({filteredPages.length})
                            </div>
                            {filteredPages.map((page) => {
                                const Icon = page.icon;

                                return (
                                    <button
                                        key={page.href}
                                        onClick={() => {
                                            router.visit(page.href);
                                            onClose();
                                        }}
                                        className="w-full flex items-center px-3 py-2 text-xs text-muted-foreground rounded-lg hover:bg-muted/80 hover:text-foreground transition group"
                                    >
                                        <Icon className="w-3.5 h-3.5 text-muted-foreground mr-3 shrink-0 group-hover:text-foreground" />
                                        <span>{page.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Filtered Projects Section */}
                    {filteredProjects.length > 0 && (
                        <div>
                            <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                Projects ({filteredProjects.length})
                            </div>
                            {filteredProjects.map((project) => (
                                <button
                                    key={project.id}
                                    onClick={() => {
                                        router.visit(`/projects/${project.id}`);
                                        onClose();
                                    }}
                                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-muted-foreground rounded-lg hover:bg-muted/80 hover:text-foreground transition group"
                                >
                                    <div className="flex items-center space-x-3 truncate">
                                        <Folder className="w-3.5 h-3.5 text-muted-foreground shrink-0 group-hover:text-foreground" />
                                        <span className="font-medium text-foreground truncate">{project.name}</span>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-muted border border-border text-muted-foreground">
                                        {project.status}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {filteredPages.length === 0 && filteredProjects.length === 0 && (
                        <div className="p-8 text-center text-xs text-muted-foreground">
                            No matching results found for "{query}".
                        </div>
                    )}
                </div>

                {/* Footer hint */}
                <div className="px-4 py-2 border-t border-border bg-muted/20 text-[11px] text-muted-foreground flex items-center justify-between">
                    <span>Press <kbd className="text-foreground font-semibold">ESC</kbd> to exit</span>
                    <span>Global Search</span>
                </div>
            </div>

            {/* Backdrop click dismiss */}
            <div className="fixed inset-0 -z-10" onClick={onClose} />
        </div>
    );
}
