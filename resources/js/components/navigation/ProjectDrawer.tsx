import { Link, router } from '@inertiajs/react';
import { X, Search, Star, Folder, ChevronRight } from 'lucide-react';
import { useState } from 'react';

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

export function ProjectDrawer({
    isOpen,
    onClose,
    projects = [],
    onToggleStar,
}: ProjectDrawerProps) {
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState<'all' | 'starred'>('all');

    if (!isOpen) {
        return null;
    }

    const filtered = projects.filter((p) => {
        const matchesSearch = p.name
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesTab = tab === 'all' || p.is_starred;

        return matchesSearch && matchesTab;
    });

    return (
        <div className="fixed inset-0 z-50 animate-in overflow-hidden bg-black/60 backdrop-blur-sm duration-200 fade-in">
            <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
                <div className="flex w-screen max-w-md flex-col border-l border-border bg-card shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border p-4">
                        <div className="flex items-center space-x-2">
                            <Folder className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold text-foreground">
                                Projects Directory
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Search & Tabs */}
                    <div className="space-y-3 border-b border-border/80 p-4">
                        <div className="relative">
                            <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Filter projects..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-input bg-background py-2 pr-4 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
                            />
                        </div>

                        <div className="flex rounded-lg border border-input bg-background p-1 text-xs">
                            <button
                                onClick={() => setTab('all')}
                                className={`flex-1 rounded-md py-1.5 font-medium transition ${
                                    tab === 'all'
                                        ? 'bg-muted text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                All Projects ({projects.length})
                            </button>
                            <button
                                onClick={() => setTab('starred')}
                                className={`flex-1 rounded-md py-1.5 font-medium transition ${
                                    tab === 'starred'
                                        ? 'bg-muted text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Starred (
                                {projects.filter((p) => p.is_starred).length})
                            </button>
                        </div>
                    </div>

                    {/* Project List */}
                    <div className="flex-1 space-y-2 overflow-y-auto p-4">
                        {filtered.length === 0 ? (
                            <div className="py-8 text-center text-sm text-muted-foreground">
                                No projects match your search criteria.
                            </div>
                        ) : (
                            filtered.map((project) => (
                                <div
                                    key={project.id}
                                    className="group flex items-start justify-between rounded-xl border border-border/80 bg-background/60 p-3 transition hover:border-primary/50"
                                >
                                    <div
                                        className="flex-1 cursor-pointer pr-2"
                                        onClick={() => {
                                            router.visit(
                                                `/projects/${project.id}`,
                                            );
                                            onClose();
                                        }}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-semibold text-foreground transition group-hover:text-primary">
                                                {project.name}
                                            </span>
                                            <span
                                                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                                                    project.status === 'ongoing'
                                                        ? 'border-primary/30 bg-primary/10 text-primary'
                                                        : project.status ===
                                                            'planned'
                                                          ? 'border-accent/30 bg-accent/10 text-accent-foreground'
                                                          : 'border-border bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                {project.status}
                                            </span>
                                        </div>

                                        {project.description && (
                                            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                                {project.description}
                                            </p>
                                        )}

                                        {/* Progress Bar */}
                                        <div className="mt-3 flex items-center space-x-2">
                                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="h-full rounded-full bg-primary transition-all duration-300"
                                                    style={{
                                                        width: `${project.progress || 0}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="font-mono text-[11px] text-muted-foreground">
                                                {project.progress || 0}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Star Button */}
                                    <button
                                        onClick={() =>
                                            onToggleStar &&
                                            onToggleStar(project.id)
                                        }
                                        className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-accent-foreground"
                                        title={
                                            project.is_starred
                                                ? 'Unstar project'
                                                : 'Star project'
                                        }
                                    >
                                        <Star
                                            className={`h-4 w-4 ${
                                                project.is_starred
                                                    ? 'fill-accent-foreground text-accent-foreground'
                                                    : ''
                                            }`}
                                        />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-border bg-background/80 p-4">
                        <Link
                            href="/projects"
                            onClick={onClose}
                            className="flex items-center text-xs text-muted-foreground transition hover:text-primary"
                        >
                            Open Full Projects Hub{' '}
                            <ChevronRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Backdrop Dismiss */}
            <div className="fixed inset-0 -z-10" onClick={onClose} />
        </div>
    );
}
