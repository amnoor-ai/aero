import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Search, Folder, CheckSquare, Plus, ArrowRight } from 'lucide-react';

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

    if (!isOpen) return null;

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Header */}
                <div className="flex items-center px-4 py-3 border-b border-slate-800">
                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                    <input
                        type="text"
                        autoFocus
                        placeholder="Search tasks, projects, or actions... (Ctrl+K)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
                    />
                    <kbd className="px-2 py-0.5 text-xs text-slate-400 bg-slate-800 border border-slate-700 rounded shadow-sm">
                        ESC
                    </kbd>
                </div>

                {/* Content Items */}
                <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                    {/* Quick Navigation Section */}
                    <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Quick Views
                    </div>
                    
                    <button
                        onClick={() => { router.visit('/dashboard'); onClose(); }}
                        className="w-full flex items-center px-3 py-2 text-sm text-slate-300 rounded-lg hover:bg-slate-800/80 hover:text-white transition group"
                    >
                        <Folder className="w-4 h-4 text-blue-400 mr-3" />
                        <span>Dashboard Overview</span>
                        <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-slate-400" />
                    </button>

                    <button
                        onClick={() => { router.visit('/my-desk'); onClose(); }}
                        className="w-full flex items-center px-3 py-2 text-sm text-slate-300 rounded-lg hover:bg-slate-800/80 hover:text-white transition group"
                    >
                        <CheckSquare className="w-4 h-4 text-amber-400 mr-3" />
                        <span>My Desk (Personal Tasks)</span>
                        <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-slate-400" />
                    </button>

                    <button
                        onClick={() => { router.visit('/projects'); onClose(); }}
                        className="w-full flex items-center px-3 py-2 text-sm text-slate-300 rounded-lg hover:bg-slate-800/80 hover:text-white transition group"
                    >
                        <Plus className="w-4 h-4 text-emerald-400 mr-3" />
                        <span>All Projects Hub</span>
                        <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-slate-400" />
                    </button>

                    {/* Filtered Projects Section */}
                    {filteredProjects.length > 0 && (
                        <>
                            <div className="px-2 pt-3 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Projects ({filteredProjects.length})
                            </div>
                            {filteredProjects.map((project) => (
                                <button
                                    key={project.id}
                                    onClick={() => { router.visit(`/projects/${project.id}`); onClose(); }}
                                    className="w-full flex items-center px-3 py-2 text-sm text-slate-300 rounded-lg hover:bg-slate-800/80 hover:text-white transition group"
                                >
                                    <Folder className="w-4 h-4 text-slate-400 mr-3 group-hover:text-blue-400" />
                                    <span className="font-medium">{project.name}</span>
                                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                                        {project.status}
                                    </span>
                                </button>
                            ))}
                        </>
                    )}
                </div>

                {/* Footer hint */}
                <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-500 flex items-center justify-between">
                    <span>Press <kbd className="text-slate-400">ESC</kbd> to close</span>
                    <span>Aero Command Center</span>
                </div>
            </div>
            
            {/* Backdrop click dismiss */}
            <div className="fixed inset-0 -z-10" onClick={onClose} />
        </div>
    );
}
