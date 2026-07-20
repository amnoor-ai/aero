import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Folder,
    Search,
    Star,
    Plus,
    ChevronRight,
} from 'lucide-react';

interface ProjectItem {
    id: number;
    name: string;
    description?: string;
    status: 'planned' | 'ongoing' | 'completed' | 'archived';
    is_starred: boolean;
    progress: number;
    tasks_count: number;
    lead?: { name: string };
    members?: any[];
}

interface ProjectsIndexProps {
    projects: ProjectItem[];
    filters: any;
}

export default function ProjectsIndex({ projects = [], filters = {} }: ProjectsIndexProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('ongoing');

    const handleSearch = (query: string) => {
        router.get('/projects', { ...filters, search: query }, { preserveState: true, replace: true });
    };

    const handleStatusFilter = (val: string) => {
        router.get('/projects', { ...filters, status: val }, { preserveState: true, replace: true });
    };

    const handleToggleStar = (e: React.MouseEvent, projectId: number) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(`/projects/${projectId}/toggle-star`, {}, { preserveScroll: true });
    };

    const handleCreateProject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        router.post(
            '/projects',
            { name, description, status },
            {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    setName('');
                    setDescription('');
                },
            }
        );
    };

    return (
        <>
            <Head title="Projects Directory - Aero DevPM" />

            <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Projects Directory</h1>
                        <p className="text-xs text-slate-400 mt-1">
                            Overview of all active workspace projects, progress, and team assignments.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg shadow-lg shadow-blue-600/20 transition flex items-center self-start"
                    >
                        <Plus className="w-4 h-4 mr-1.5" /> Create Project
                    </button>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                            type="text"
                            placeholder="Search projects by name..."
                            value={filters.search || ''}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <select
                        value={filters.status || ''}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="planned">Planned</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                                <tr>
                                    <th className="p-4">Project Name</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Lead</th>
                                    <th className="p-4">Progress</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {projects.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-500">
                                            No projects found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    projects.map((project) => (
                                        <tr
                                            key={project.id}
                                            onClick={() => router.visit(`/projects/${project.id}`)}
                                            className="hover:bg-slate-800/40 cursor-pointer transition group"
                                        >
                                            <td className="p-4 font-semibold text-slate-200 group-hover:text-blue-400 transition">
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={(e) => handleToggleStar(e, project.id)}
                                                        className="text-slate-600 hover:text-amber-400 transition"
                                                    >
                                                        <Star
                                                            className={`w-4 h-4 ${
                                                                project.is_starred ? 'fill-amber-400 text-amber-400' : ''
                                                            }`}
                                                        />
                                                    </button>
                                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                                        <Folder className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <span>{project.name}</span>
                                                        {project.description && (
                                                            <span className="block text-[11px] text-slate-500 font-normal line-clamp-1">
                                                                {project.description}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <span
                                                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                                                        project.status === 'ongoing'
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                            : project.status === 'planned'
                                                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                                            : 'bg-slate-800 text-slate-400 border-slate-700'
                                                    }`}
                                                >
                                                    {project.status}
                                                </span>
                                            </td>

                                            <td className="p-4 text-slate-300">
                                                {project.lead?.name || 'Unassigned'}
                                            </td>

                                            <td className="p-4 w-48">
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-blue-500 h-full rounded-full transition-all duration-300"
                                                            style={{ width: `${project.progress || 0}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[11px] font-mono text-slate-400">
                                                        {project.progress || 0}%
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="p-4 text-right">
                                                <ChevronRight className="w-4 h-4 ml-auto text-slate-500 group-hover:text-blue-400 transition" />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold text-white">Create New Project</h2>

                        <form onSubmit={handleCreateProject} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Payment Gateway Integration"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    placeholder="Short summary of project goals..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Initial Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                                >
                                    <option value="planned">Planned</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg shadow-md shadow-blue-600/20"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

ProjectsIndex.layout = (page: React.ReactNode) => page;
