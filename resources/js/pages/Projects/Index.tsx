import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Folder,
    Search,
    Star,
    Plus,
    MoreVertical,
    Users,
    LayoutGrid,
    List,
    Pencil,
    Trash2,
    Eye,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableHeader } from '@/components/ui/data-table-header';
import { PaginationBar } from '@/components/ui/pagination-bar';
import { CreateProjectWizardModal } from '@/components/projects/CreateProjectWizardModal';

interface ProjectItem {
    id: number;
    name: string;
    description?: string;
    status: 'draft' | 'planned' | 'ongoing' | 'completed' | 'archived';
    is_starred: boolean;
    progress: number;
    tasks_count: number;
    budget?: number;
    tags?: string[];
    lead?: { name: string };
    department?: { name: string; code: string };
    members?: any[];
}

interface ProjectsIndexProps {
    projects: {
        data: ProjectItem[];
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        links: any[];
    };
    departments?: any[];
    workspaceUsers?: any[];
    filters: any;
}

export default function ProjectsIndex({ projects, departments = [], workspaceUsers = [], filters = {} }: ProjectsIndexProps) {
    const projectList = projects.data || [];
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

    const handleSort = (columnKey: string, order: 'asc' | 'desc') => {
        router.get('/projects', { ...filters, sort_by: columnKey, order }, { preserveState: true, replace: true });
    };

    return (
        <>
            <Head title="Projects Directory - Aero DevPM" />

            <div className="p-6 md:p-8 space-y-6 bg-background text-foreground">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">Projects Directory</h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            Overview of all active workspace projects, progress, and team assignments.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2 bg-primary hover:bg-primary/90 text-xs font-semibold text-primary-foreground rounded-lg shadow-xs transition-all flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-1.5" /> Create Project
                        </button>
                    </div>
                </div>

                <div className="p-3 bg-card border border-border rounded-xl flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                            <input
                                type="text"
                                placeholder="Search projects by name..."
                                value={filters.search || ''}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                            />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium hidden sm:inline-block">
                            {projects.total || 0} projects
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex bg-muted/50 p-1 rounded-lg border border-border">
                            <button
                                onClick={() => handleStatusFilter('')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition ${!filters.status ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => handleStatusFilter('favorites')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition flex items-center ${filters.status === 'favorites' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <Star className="w-3 h-3 mr-1" /> Favorites
                            </button>
                            <button
                                onClick={() => handleStatusFilter('archived')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition ${filters.status === 'archived' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Archived
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-muted-foreground">
                            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
                                <tr>
                                    <th className="p-4">
                                        <DataTableHeader title="Name" columnKey="name" currentSortBy={filters.sort_by} currentOrder={filters.order} onSort={handleSort} />
                                    </th>
                                    <th className="p-4">
                                        <DataTableHeader title="Status" columnKey="status" currentSortBy={filters.sort_by} currentOrder={filters.order} onSort={handleSort} />
                                    </th>
                                    <th className="p-4 font-semibold">Members</th>
                                    <th className="p-4 font-semibold">Progress</th>
                                    <th className="p-4">
                                        <DataTableHeader title="Last modified" columnKey="updated_at" currentSortBy={filters.sort_by} currentOrder={filters.order} onSort={handleSort} />
                                    </th>
                                    <th className="p-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {projectList.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                            No projects found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    projectList.map((project) => (
                                        <tr
                                            key={project.id}
                                            onClick={() => router.visit(`/projects/${project.id}`)}
                                            className="hover:bg-muted/50 cursor-pointer transition group"
                                        >
                                            <td className="p-4 font-semibold text-foreground group-hover:text-primary transition">
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={(e) => handleToggleStar(e, project.id)}
                                                        className="text-muted-foreground hover:text-amber-400 transition"
                                                    >
                                                        <Star
                                                            className={`w-4 h-4 ${
                                                                project.is_starred ? 'fill-amber-400 text-amber-400' : ''
                                                            }`}
                                                        />
                                                    </button>
                                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                        <Folder className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <span>{project.name}</span>
                                                        {project.description && (
                                                            <span className="block text-[11px] text-muted-foreground font-normal line-clamp-1">
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
                                                            : 'bg-muted text-muted-foreground border-border'
                                                    }`}
                                                >
                                                    {project.status}
                                                </span>
                                            </td>

                                            <td className="p-4 text-muted-foreground">
                                                <div className="flex items-center space-x-1.5">
                                                    <Users className="w-3.5 h-3.5" />
                                                    <span className="font-medium text-foreground">{project.members?.length || 1}</span>
                                                </div>
                                            </td>

                                            <td className="p-4 w-48">
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex-1 bg-muted h-1 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-primary h-full rounded-full transition-all duration-300"
                                                            style={{ width: `${project.progress || 0}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[11px] font-mono font-medium text-foreground">
                                                        {project.progress || 0}%
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="p-4 text-muted-foreground text-[11px]">
                                                {new Date().toLocaleDateString('en-GB')}
                                            </td>

                                            <td className="p-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button 
                                                            className="p-1 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.visit(`/projects/${project.id}`);
                                                            }}
                                                        >
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // Future: edit project logic
                                                            }}
                                                        >
                                                            <Pencil className="w-4 h-4 mr-2" />
                                                            Edit Project
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="text-destructive focus:bg-destructive/10"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // Future: delete project logic
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-border/50 bg-muted/20">
                        <PaginationBar pagination={projects} />
                    </div>
                </div>
            </div>

            <CreateProjectWizardModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                departments={departments}
                workspaceUsers={workspaceUsers}
            />
        </>
    );
}

ProjectsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Projects',
            href: '/projects',
        },
    ],
};
