import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { X, Search, Star, Folder, ChevronRight, Plus } from 'lucide-react';

interface Project {
    id: number;
    name: string;
    description?: string;
    status: string;
    is_starred: boolean;
    progress?: number;
    tasks_count?: number;
}

interface ProjectDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    projects: Project[];
    onToggleStar?: (id: number) => void;
}

export function ProjectDrawer({ isOpen, onClose, projects = [], onToggleStar }: ProjectDrawerProps) {
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState<'all' | 'starred'>('all');

    if (!isOpen) return null;

    const filtered = projects.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesTab = tab === 'all' || p.is_starred;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
                <div className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Folder className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold text-foreground">Projects Directory</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Search & Tabs */}
                    <div className="p-4 border-b border-border/80 space-y-3">
                        <div className="relative">
                            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                            <input
                                type="text"
                                placeholder="Filter projects..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-background border border-input rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring"
                            />
                        </div>

                        <div className="flex bg-background p-1 rounded-lg border border-input text-xs">
                            <button
                                onClick={() => setTab('all')}
                                className={`flex-1 py-1.5 font-medium rounded-md transition ${
                                    tab === 'all' ? 'bg-muted text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                All Projects ({projects.length})
                            </button>
                            <button
                                onClick={() => setTab('starred')}
                                className={`flex-1 py-1.5 font-medium rounded-md transition ${
                                    tab === 'starred' ? 'bg-muted text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Starred ({projects.filter((p) => p.is_starred).length})
                            </button>
                        </div>
                    </div>

                    {/* Project List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {filtered.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No projects match your search criteria.
                            </div>
                        ) : (
                            filtered.map((project) => (
                                <div
                                    key={project.id}
                                    className="p-3 bg-background/60 border border-border/80 hover:border-primary/50 rounded-xl transition group flex items-start justify-between"
                                >
                                    <div
                                        className="flex-1 cursor-pointer pr-2"
                                        onClick={() => {
                                            router.visit(`/projects/${project.id}`);
                                            onClose();
                                        }}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold text-sm text-foreground group-hover:text-primary transition">
                                                {project.name}
                                            </span>
                                            <span
                                                className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${
                                                    project.status === 'ongoing'
                                                        ? 'bg-primary/10 text-primary border-primary/30'
                                                        : project.status === 'planned'
                                                        ? 'bg-accent/10 text-accent-foreground border-accent/30'
                                                        : 'bg-muted text-muted-foreground border-border'
                                                }`}
                                            >
                                                {project.status}
                                            </span>
                                        </div>

                                        {project.description && (
                                            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                                {project.description}
                                            </p>
                                        )}

                                        {/* Progress Bar */}
                                        <div className="mt-3 flex items-center space-x-2">
                                            <div className="flex-1 bg-muted h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-primary h-full rounded-full transition-all duration-300"
                                                    style={{ width: `${project.progress || 0}%` }}
                                                />
                                            </div>
                                            <span className="text-[11px] font-mono text-muted-foreground">
                                                {project.progress || 0}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Star Button */}
                                    <button
                                        onClick={() => onToggleStar && onToggleStar(project.id)}
                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-accent-foreground hover:bg-muted transition"
                                        title={project.is_starred ? 'Unstar project' : 'Star project'}
                                    >
                                        <Star
                                            className={`w-4 h-4 ${
                                                project.is_starred ? 'fill-accent-foreground text-accent-foreground' : ''
                                            }`}
                                        />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-border bg-background/80 flex items-center justify-between">
                        <Link
                            href="/projects"
                            onClick={onClose}
                            className="text-xs text-muted-foreground hover:text-primary transition flex items-center"
                        >
                            Open Full Projects Hub <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Backdrop Dismiss */}
            <div className="fixed inset-0 -z-10" onClick={onClose} />
        </div>
    );
}
