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
    LayoutGrid,
    List,
} from 'lucide-react';
import React, { useState } from 'react';
import { CreateDepartmentModal } from '@/components/departments/CreateDepartmentModal';
import { EditDepartmentModal } from '@/components/departments/EditDepartmentModal';
import { Button } from '@/components/ui/button';
import { DataTableHeader } from '@/components/ui/data-table-header';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

export default function DepartmentsIndex({
    departments,
    workspaceUsers = [],
    filters = {},
}: DepartmentsIndexProps) {
    const departmentList = departments.data || [];
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] =
        useState<DepartmentItem | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    const handleSort = (columnKey: string, order: 'asc' | 'desc') => {
        router.get(
            '/departments',
            { ...filters, sort_by: columnKey, order },
            { preserveState: true, replace: true },
        );
    };

    const handleSearch = (query: string) => {
        router.get(
            '/departments',
            { ...filters, search: query },
            { preserveState: true, replace: true },
        );
    };

    const handleStatusFilter = (val: string) => {
        router.get(
            '/departments',
            { ...filters, status: val },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (departmentId: number) => {
        if (confirm('Are you sure you want to delete this department?')) {
            router.delete(`/departments/${departmentId}`);
        }
    };

    return (
        <>
            <Head title="Departments & Org Structure - Aero DevPM" />

            <div className="min-h-screen space-y-6 bg-background p-6 text-foreground md:p-8">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            Departments & Org Structure
                        </h1>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Workspace organizational units, leadership
                            assignments, location management, and mandate
                            documentation.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/departments/documents"
                            className="inline-flex items-center space-x-2 rounded-lg border border-border bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground shadow-xs transition hover:text-foreground"
                        >
                            <Folder className="h-4 w-4 text-primary" />
                            <span>Documents Hub</span>
                        </Link>

                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            className="bg-primary text-xs font-semibold text-primary-foreground shadow-lg"
                        >
                            <Plus className="mr-1.5 h-4 w-4" /> Add Department
                        </Button>
                    </div>
                </div>

                {/* Filter & View Mode Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
                    <div className="flex w-full items-center space-x-3 sm:w-auto">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search departments by name, code, location..."
                                value={filters.search || ''}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full rounded-lg border border-border bg-background py-1.5 pr-3 pl-9 text-xs text-foreground focus:border-primary focus:outline-none"
                            />
                        </div>
                        <span className="hidden text-xs font-medium text-muted-foreground sm:inline-block">
                            {departments.total || 0} Departments
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex rounded-lg border border-border bg-muted/50 p-1">
                            <button
                                onClick={() => handleStatusFilter('')}
                                className={`rounded-md px-3 py-1 text-xs font-semibold transition ${!filters.status ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => handleStatusFilter('active')}
                                className={`rounded-md px-3 py-1 text-xs font-semibold transition ${filters.status === 'active' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => handleStatusFilter('archived')}
                                className={`rounded-md px-3 py-1 text-xs font-semibold transition ${filters.status === 'archived' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Archived
                            </button>
                        </div>

                        <div className="hidden items-center space-x-1 border-l border-border pl-4 sm:flex">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`rounded-md border p-1.5 transition ${viewMode === 'grid' ? 'border-primary/20 bg-primary/10 text-primary' : 'border-border bg-muted/50 text-muted-foreground hover:text-foreground'}`}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`rounded-md border p-1.5 transition ${viewMode === 'table' ? 'border-primary/20 bg-primary/10 text-primary' : 'border-border bg-muted/50 text-muted-foreground hover:text-foreground'}`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Grid or Table */}
                {departmentList.length === 0 ? (
                    <div className="space-y-3 rounded-xl border border-border bg-card p-12 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground">
                            No Departments Found
                        </h3>
                        <p className="mx-auto max-w-sm text-xs text-muted-foreground">
                            No departments match your current filter parameters.
                            Create a department to map out workspace leadership
                            and resources.
                        </p>
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            size="sm"
                            className="mt-2 bg-primary text-primary-foreground"
                        >
                            <Plus className="mr-1.5 h-4 w-4" /> Create
                            Department
                        </Button>
                    </div>
                ) : viewMode === 'grid' ? (
                    /* GRID VIEW */
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {departmentList.map((dept) => (
                                <div
                                    key={dept.id}
                                    onClick={() =>
                                        router.visit(`/departments/${dept.id}`)
                                    }
                                    className="group flex cursor-pointer flex-col justify-between space-y-4 rounded-xl border border-border bg-card p-5 shadow-2xs transition-all duration-200 hover:border-primary/40"
                                >
                                    {/* Card Header */}
                                    <div>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold text-primary">
                                                    {dept.code}
                                                </span>
                                                <h3 className="text-base font-bold text-foreground transition group-hover:text-primary">
                                                    {dept.name}
                                                </h3>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-40"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.visit(
                                                                `/departments/${dept.id}`,
                                                            );
                                                        }}
                                                    >
                                                        <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground" />{' '}
                                                        View Overview
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingDepartment(
                                                                dept,
                                                            );
                                                        }}
                                                    >
                                                        <Pencil className="mr-2 h-3.5 w-3.5 text-muted-foreground" />{' '}
                                                        Edit
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {dept.description && (
                                            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                                {dept.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Stats Badges */}
                                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                                        <div
                                            className="flex items-center space-x-1"
                                            title="Team Members"
                                        >
                                            <Users className="h-3.5 w-3.5 text-blue-400" />
                                            <span className="font-semibold text-foreground">
                                                {dept.members_count}
                                            </span>
                                        </div>
                                        <div
                                            className="flex items-center space-x-1"
                                            title="Active Projects"
                                        >
                                            <Folder className="h-3.5 w-3.5 text-amber-400" />
                                            <span className="font-semibold text-foreground">
                                                {dept.projects_count}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Mandate Attachment Download Strip */}
                                    <div className="pt-2">
                                        {dept.mandate_file_name ? (
                                            <a
                                                href={`/departments/${dept.id}/mandate`}
                                                className="group/btn flex w-full items-center justify-between rounded-xl border border-primary/20 bg-primary/10 p-2.5 text-xs font-medium text-primary transition hover:bg-primary/20"
                                            >
                                                <div className="flex items-center space-x-2 truncate">
                                                    <FileText className="h-4 w-4 shrink-0 text-primary" />
                                                    <span className="truncate">
                                                        {dept.mandate_file_name}
                                                    </span>
                                                </div>
                                                <Download className="ml-1 h-3.5 w-3.5 shrink-0 text-primary transition group-hover/btn:scale-110" />
                                            </a>
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-border p-2 text-center font-mono text-[11px] text-muted-foreground">
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
                    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-muted-foreground">
                                <thead className="border-b border-border bg-muted/50 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                    <tr>
                                        <th className="p-4">
                                            <DataTableHeader
                                                title="Code / Department"
                                                columnKey="name"
                                                currentSortBy={filters.sort_by}
                                                currentOrder={filters.order}
                                                onSort={handleSort}
                                            />
                                        </th>
                                        <th className="p-4 font-semibold">
                                            Director
                                        </th>
                                        <th className="p-4">
                                            <DataTableHeader
                                                title="Location"
                                                columnKey="location"
                                                currentSortBy={filters.sort_by}
                                                currentOrder={filters.order}
                                                onSort={handleSort}
                                            />
                                        </th>
                                        <th className="p-4 font-semibold">
                                            Members
                                        </th>
                                        <th className="p-4 font-semibold">
                                            Projects
                                        </th>
                                        <th className="p-4 font-semibold">
                                            Mandate Document
                                        </th>
                                        <th className="p-4 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {departmentList.map((dept) => (
                                        <tr
                                            key={dept.id}
                                            onClick={() =>
                                                router.visit(
                                                    `/departments/${dept.id}`,
                                                )
                                            }
                                            className="group cursor-pointer transition hover:bg-muted/50"
                                        >
                                            <td className="p-4 font-semibold text-foreground">
                                                <div className="flex items-center space-x-3">
                                                    <span className="rounded border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-[11px] text-primary">
                                                        {dept.code}
                                                    </span>
                                                    <div>
                                                        <span className="font-bold transition group-hover:text-primary">
                                                            {dept.name}
                                                        </span>
                                                        {dept.description && (
                                                            <span className="line-clamp-1 block text-[11px] font-normal text-muted-foreground">
                                                                {
                                                                    dept.description
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4 font-medium text-foreground">
                                                {dept.director ? (
                                                    dept.director.name
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        Unassigned
                                                    </span>
                                                )}
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

                                            <td
                                                className="p-4"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                {dept.mandate_file_name ? (
                                                    <a
                                                        href={`/departments/${dept.id}/mandate`}
                                                        className="inline-flex items-center space-x-1.5 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary transition hover:bg-primary/20"
                                                    >
                                                        <FileText className="h-3 w-3 text-primary" />
                                                        <span className="max-w-[120px] truncate">
                                                            {
                                                                dept.mandate_file_name
                                                            }
                                                        </span>
                                                        <Download className="ml-1 h-3 w-3 text-primary" />
                                                    </a>
                                                ) : (
                                                    <span className="font-mono text-[11px] text-muted-foreground">
                                                        None
                                                    </span>
                                                )}
                                            </td>

                                            <td
                                                className="p-4 text-right"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <button className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-44"
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                router.visit(
                                                                    `/departments/${dept.id}`,
                                                                )
                                                            }
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />{' '}
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                setEditingDepartment(
                                                                    dept,
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />{' '}
                                                            Edit Department
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleDelete(
                                                                    dept.id,
                                                                )
                                                            }
                                                            className="text-destructive focus:bg-destructive/10"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />{' '}
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="border-t border-border/50 bg-muted/20 p-4">
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
