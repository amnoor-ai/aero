import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Building2,
    Search,
    Plus,
    MoreVertical,
    Users,
    Folder,
    FileText,
    Download,
    Pencil,
    Trash2,
    Eye,
    MapPin,
    LayoutGrid,
    List,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { CreateDepartmentModal } from '@/components/departments/CreateDepartmentModal';
import { EditDepartmentModal } from '@/components/departments/EditDepartmentModal';
import { DataTableHeader } from '@/components/ui/data-table-header';
import { PaginationBar } from '@/components/ui/pagination-bar';

interface DepartmentItem {
    id: number;
    name: string;
    code: string;
    slug: string;
    description: string | null;
    director_id: number | null;
    director?: { id: number; name: string; email: string };
    location: string | null;
    mandate_file_path: string | null;
    mandate_file_name: string | null;
    status: string;
    members_count: number;
    projects_count: number;
}

interface DepartmentsIndexProps {
    departments: {
        data: DepartmentItem[];
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        links: any[];
    };
    workspaceUsers: any[];
    filters: any;
}

export default function DepartmentsIndex({ departments, workspaceUsers = [], filters = {} }: DepartmentsIndexProps) {
    const departmentList = departments.data || [];
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<DepartmentItem | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    const handleSort = (columnKey: string, order: 'asc' | 'desc') => {
        router.get('/departments', { ...filters, sort_by: columnKey, order }, { preserveState: true, replace: true });
    };

    const handleSearch = (query: string) => {
        router.get('/departments', { ...filters, search: query }, { preserveState: true, replace: true });
    };

    const handleStatusFilter = (val: string) => {
        router.get('/departments', { ...filters, status: val }, { preserveState: true, replace: true });
    };

    const handleDelete = (departmentId: number) => {
        if (confirm('Are you sure you want to delete this department?')) {
            router.delete(`/departments/${departmentId}`);
        }
    };

    return (
        <>
            <Head title="Departments & Org Structure - Aero DevPM" />

            <div className="p-6 md:p-8 space-y-6 bg-background text-foreground min-h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            Departments & Org Structure
                        </h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            Workspace organizational units, leadership assignments, location management, and mandate documentation.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/departments/documents"
                            className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold border border-border transition shadow-xs"
                        >
                            <Folder className="w-4 h-4 text-primary" />
                            <span>Documents Hub</span>
                        </Link>

                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            className="bg-primary text-primary-foreground font-semibold text-xs shadow-lg"
                        >
                            <Plus className="w-4 h-4 mr-1.5" /> Add Department
                        </Button>
                    </div>
                </div>

                {/* Filter & View Mode Bar */}
                <div className="p-3 bg-card border border-border rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-72">
                            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                            <input
                                type="text"
                                placeholder="Search departments by name, code, location..."
                                value={filters.search || ''}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                            />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium hidden sm:inline-block">
                            {departments.total || 0} Departments
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex bg-muted/50 p-1 rounded-lg border border-border">
                            <button
                                onClick={() => handleStatusFilter('')}
                                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${!filters.status ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => handleStatusFilter('active')}
                                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${filters.status === 'active' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => handleStatusFilter('archived')}
                                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${filters.status === 'archived' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Archived
                            </button>
                        </div>

                        <div className="hidden sm:flex items-center space-x-1 border-l border-border pl-4">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-md border transition ${viewMode === 'grid' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted/50 text-muted-foreground hover:text-foreground border-border'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-1.5 rounded-md border transition ${viewMode === 'table' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted/50 text-muted-foreground hover:text-foreground border-border'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Grid or Table */}
                {departmentList.length === 0 ? (
                    <div className="bg-card border border-border rounded-xl p-12 text-center space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground">No Departments Found</h3>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                            No departments match your current filter parameters. Create a department to map out workspace leadership and resources.
                        </p>
                        <Button onClick={() => setIsCreateOpen(true)} size="sm" className="bg-primary text-primary-foreground mt-2">
                            <Plus className="w-4 h-4 mr-1.5" /> Create Department
                        </Button>
                    </div>
                ) : viewMode === 'grid' ? (
                    /* GRID VIEW */
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {departmentList.map((dept) => (
                                <div
                                    key={dept.id}
                                    onClick={() => router.visit(`/departments/${dept.id}`)}
                                    className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 cursor-pointer transition-all duration-200 group flex flex-col justify-between space-y-4 shadow-2xs"
                                >
                                    {/* Card Header */}
                                    <div>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold border border-primary/20">
                                                    {dept.code}
                                                </span>
                                                <h3 className="font-bold text-foreground text-base group-hover:text-primary transition">
                                                    {dept.name}
                                                </h3>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.visit(`/departments/${dept.id}`); }}>
                                                        <Eye className="w-3.5 h-3.5 mr-2 text-muted-foreground" /> View Overview
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingDepartment(dept); }}>
                                                        <Pencil className="w-3.5 h-3.5 mr-2 text-muted-foreground" /> Edit
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {dept.description && (
                                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                                                {dept.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Stats Badges */}
                                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                                        <div className="flex items-center space-x-1" title="Team Members">
                                            <Users className="w-3.5 h-3.5 text-blue-400" />
                                            <span className="font-semibold text-foreground">{dept.members_count}</span>
                                        </div>
                                        <div className="flex items-center space-x-1" title="Active Projects">
                                            <Folder className="w-3.5 h-3.5 text-amber-400" />
                                            <span className="font-semibold text-foreground">{dept.projects_count}</span>
                                        </div>
                                    </div>

                                    {/* Mandate Attachment Download Strip */}
                                    <div className="pt-2">
                                        {dept.mandate_file_name ? (
                                            <a
                                                href={`/departments/${dept.id}/mandate`}
                                                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary transition group/btn text-xs font-medium"
                                            >
                                                <div className="flex items-center space-x-2 truncate">
                                                    <FileText className="w-4 h-4 text-primary shrink-0" />
                                                    <span className="truncate">{dept.mandate_file_name}</span>
                                                </div>
                                                <Download className="w-3.5 h-3.5 text-primary group-hover/btn:scale-110 transition shrink-0 ml-1" />
                                            </a>
                                        ) : (
                                            <div className="p-2 text-center rounded-xl border border-dashed border-border text-[11px] text-muted-foreground font-mono">
                                                No Mandate Attached
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <PaginationBar pagination={departments} />
                    </div>
                ) : (
                    /* TABLE VIEW */
                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-muted-foreground">
                                <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
                                    <tr>
                                        <th className="p-4">
                                            <DataTableHeader title="Code / Department" columnKey="name" currentSortBy={filters.sort_by} currentOrder={filters.order} onSort={handleSort} />
                                        </th>
                                        <th className="p-4 font-semibold">Director</th>
                                        <th className="p-4">
                                            <DataTableHeader title="Location" columnKey="location" currentSortBy={filters.sort_by} currentOrder={filters.order} onSort={handleSort} />
                                        </th>
                                        <th className="p-4 font-semibold">Members</th>
                                        <th className="p-4 font-semibold">Projects</th>
                                        <th className="p-4 font-semibold">Mandate Document</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {departmentList.map((dept) => (
                                        <tr
                                            key={dept.id}
                                            onClick={() => router.visit(`/departments/${dept.id}`)}
                                            className="hover:bg-muted/50 cursor-pointer transition group"
                                        >
                                            <td className="p-4 font-semibold text-foreground">
                                                <div className="flex items-center space-x-3">
                                                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-[11px] border border-primary/20">
                                                        {dept.code}
                                                    </span>
                                                    <div>
                                                        <span className="group-hover:text-primary transition font-bold">{dept.name}</span>
                                                        {dept.description && (
                                                            <span className="block text-[11px] text-muted-foreground font-normal line-clamp-1">
                                                                {dept.description}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4 text-foreground font-medium">
                                                {dept.director ? dept.director.name : <span className="text-muted-foreground">Unassigned</span>}
                                            </td>

                                            <td className="p-4 text-muted-foreground">
                                                {dept.location || '—'}
                                            </td>

                                            <td className="p-4 font-semibold text-foreground">
                                                {dept.members_count}
                                            </td>

                                            <td className="p-4 font-semibold text-foreground">
                                                {dept.projects_count}
                                            </td>

                                            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                                {dept.mandate_file_name ? (
                                                    <a
                                                        href={`/departments/${dept.id}/mandate`}
                                                        className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-[11px] font-medium border border-primary/20 transition"
                                                    >
                                                        <FileText className="w-3 h-3 text-primary" />
                                                        <span className="truncate max-w-[120px]">{dept.mandate_file_name}</span>
                                                        <Download className="w-3 h-3 text-primary ml-1" />
                                                    </a>
                                                ) : (
                                                    <span className="text-[11px] text-muted-foreground font-mono">None</span>
                                                )}
                                            </td>

                                            <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44">
                                                        <DropdownMenuItem onClick={() => router.visit(`/departments/${dept.id}`)}>
                                                            <Eye className="w-4 h-4 mr-2" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setEditingDepartment(dept)}>
                                                            <Pencil className="w-4 h-4 mr-2" /> Edit Department
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(dept.id)} className="text-destructive focus:bg-destructive/10">
                                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-border/50 bg-muted/20">
                            <PaginationBar pagination={departments} />
                        </div>
                    </div>
                )}
            </div>

            {/* Create Department Modal */}
            <CreateDepartmentModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                workspaceUsers={workspaceUsers}
            />

            {/* Edit Department Modal */}
            <EditDepartmentModal
                isOpen={!!editingDepartment}
                onClose={() => setEditingDepartment(null)}
                department={editingDepartment}
                workspaceUsers={workspaceUsers}
            />
        </>
    );
}

DepartmentsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Departments',
            href: '/departments',
        },
    ],
};
