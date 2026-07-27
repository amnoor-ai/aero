import { Head, Link, router } from '@inertiajs/react';
import {
    Folder,
    Search,
    Download,
    Eye,
    Pencil,
    Trash2,
    LayoutGrid,
    List,
    FileText,
    FileImage,
    Video,
    FileCode,
    Building2,
    HardDrive,
    Clock,
    User,
    Filter,
} from 'lucide-react';
import React, { useState } from 'react';
import { DeleteDocumentModal } from '@/components/departments/DeleteDocumentModal';
import type { DocumentItem } from '@/components/departments/MediaPreviewModal';
import {
    MediaPreviewModal,
    isMediaFileType,
    formatUploadedDate,
    formatFileSize,
} from '@/components/departments/MediaPreviewModal';
import { RenameDocumentModal } from '@/components/departments/RenameDocumentModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SimpleEntity {
    id: number;
    name: string;
    code?: string;
}

interface DocumentationStats {
    total_documents: number;
    total_storage: string;
    departments_count: number;
    projects_count: number;
    recent_count: number;
}

interface DocumentationIndexProps {
    documents: {
        data: DocumentItem[];
        current_page: number;
        last_page: number;
        total: number;
    };
    departments: SimpleEntity[];
    projects: SimpleEntity[];
    stats: DocumentationStats;
    filters: {
        search?: string;
        department_id?: string;
        file_type?: string;
    };
}

export default function DocumentationIndex({
    documents,
    departments = [],
    stats,
    filters = {},
}: DocumentationIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [departmentId, setDepartmentId] = useState(
        filters.department_id || '',
    );
    const [fileTypeFilter, setFileTypeFilter] = useState(
        filters.file_type || '',
    );
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    // Modal States
    const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
    const [renameDoc, setRenameDoc] = useState<DocumentItem | null>(null);
    const [deleteDoc, setDeleteDoc] = useState<DocumentItem | null>(null);

    const handleFilterChange = (newDeptId?: string, newType?: string) => {
        const dId = newDeptId !== undefined ? newDeptId : departmentId;
        const fType = newType !== undefined ? newType : fileTypeFilter;

        router.get(
            '/documentation',
            {
                search,
                department_id: dId || undefined,
                file_type: fType || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange();
    };

    const getFileIcon = (fileType: string | null) => {
        const type = (fileType || '').toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(type)) {
            return <FileImage className="h-4 w-4 text-emerald-400" />;
        }
        if (['mp4', 'webm', 'mov', 'avi'].includes(type)) {
            return <Video className="h-4 w-4 text-indigo-400" />;
        }
        if (['js', 'ts', 'tsx', 'jsx', 'json', 'html', 'css', 'py', 'php'].includes(type)) {
            return <FileCode className="h-4 w-4 text-amber-400" />;
        }
        if (type === 'pdf') {
            return <FileText className="h-4 w-4 text-rose-400" />;
        }
        return <FileText className="h-4 w-4 text-sky-400" />;
    };

    return (
        <div className="space-y-6 pb-12">
            <Head title="Documentation & File Directory - Aero DevPM" />

            {/* Header Title Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground">
                        <FileText className="h-7 w-7 text-primary" />
                        <span>Documentation & File Directory</span>
                    </h1>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Central registry cataloging all project attachments, department mandates, technical specs, and workspace files.
                    </p>
                </div>
            </div>

            {/* Stat Cards Overview */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-border bg-card/60 p-4 backdrop-blur-xs">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="block text-[11px] font-semibold text-muted-foreground uppercase">
                                Total Files
                            </span>
                            <span className="text-xl font-bold text-foreground">
                                {stats?.total_documents ?? documents.total}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card/60 p-4 backdrop-blur-xs">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-400">
                            <HardDrive className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="block text-[11px] font-semibold text-muted-foreground uppercase">
                                Storage Used
                            </span>
                            <span className="text-xl font-bold text-foreground">
                                {stats?.total_storage ?? '0 B'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card/60 p-4 backdrop-blur-xs">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-indigo-500/10 p-2.5 text-indigo-400">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="block text-[11px] font-semibold text-muted-foreground uppercase">
                                Departments
                            </span>
                            <span className="text-xl font-bold text-foreground">
                                {stats?.departments_count ?? departments.length}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card/60 p-4 backdrop-blur-xs">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-400">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="block text-[11px] font-semibold text-muted-foreground uppercase">
                                Added This Week
                            </span>
                            <span className="text-xl font-bold text-foreground">
                                {stats?.recent_count ?? 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter & View Mode Controls */}
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search documents by name or extension..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 text-xs"
                        />
                    </div>
                    <Button type="submit" variant="secondary" size="sm" className="h-9 px-3 text-xs">
                        Search
                    </Button>
                </form>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Department Select */}
                    <div className="flex items-center space-x-1">
                        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                        <select
                            value={departmentId}
                            onChange={(e) => {
                                setDepartmentId(e.target.value);
                                handleFilterChange(e.target.value);
                            }}
                            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <option value="">All Departments</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name} ({dept.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* File Type Filter Pills */}
                    <div className="flex items-center rounded-lg border border-border bg-muted/40 p-1">
                        {[
                            { id: '', label: 'All' },
                            { id: 'pdf', label: 'PDFs' },
                            { id: 'docs', label: 'Docs' },
                            { id: 'images', label: 'Images' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setFileTypeFilter(item.id);
                                    handleFilterChange(undefined, item.id);
                                }}
                                className={`rounded px-2.5 py-1 text-[11px] font-semibold transition ${
                                    fileTypeFilter === item.id
                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* View Switcher */}
                    <div className="flex items-center space-x-1 rounded-lg border border-border bg-muted/40 p-1">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`rounded p-1 transition ${
                                viewMode === 'table'
                                    ? 'bg-card text-foreground shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                            title="Table View"
                        >
                            <List className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`rounded p-1 transition ${
                                viewMode === 'grid'
                                    ? 'bg-card text-foreground shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                            title="Grid View"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Document Content List */}
            {documents.data.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-card/30 p-12 text-center">
                    <Folder className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-3 text-base font-semibold text-foreground">No Documents Found</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {search || departmentId || fileTypeFilter
                            ? 'Try adjusting your search criteria or department filter.'
                            : 'No workspace documents have been uploaded yet.'}
                    </p>
                </div>
            ) : viewMode === 'table' ? (
                /* Table View */
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-border bg-muted/50 font-semibold text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3">Document Name</th>
                                    <th className="px-4 py-3">Location / Scope</th>
                                    <th className="px-4 py-3">Uploaded / Installed</th>
                                    <th className="px-4 py-3">Author</th>
                                    <th className="px-4 py-3">Size</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {documents.data.map((doc) => (
                                    <tr key={doc.id} className="group transition hover:bg-muted/30">
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center space-x-3">
                                                <div className="rounded-lg bg-muted p-2">
                                                    {getFileIcon(doc.file_type)}
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-foreground group-hover:text-primary transition">
                                                        {doc.name}
                                                    </span>
                                                    <span className="ml-2 rounded bg-muted/80 px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground font-mono">
                                                        .{doc.file_type}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {doc.department ? (
                                                <Link
                                                    href={`/departments/${doc.department.id}`}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary hover:underline"
                                                >
                                                    <Building2 className="h-3 w-3" />
                                                    <span>{doc.department.name}</span>
                                                </Link>
                                            ) : (
                                                <span className="text-muted-foreground italic">Global</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-muted-foreground">
                                            <div className="flex items-center space-x-1.5">
                                                <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                                                <span>{formatUploadedDate(doc.created_at)}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {doc.uploaded_by ? (
                                                <div className="flex items-center space-x-1.5 text-foreground">
                                                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="font-medium">{doc.uploaded_by.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">System</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-muted-foreground font-mono">
                                            {formatFileSize(doc.file_size)}
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                {isMediaFileType(doc.file_type) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setPreviewDoc(doc)}
                                                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                                        title="Preview Media"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}

                                                <a
                                                    href={`/departments/documents/${doc.id}/download`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition"
                                                    title="Download File"
                                                >
                                                    <Download className="h-3.5 w-3.5" />
                                                </a>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setRenameDoc(doc)}
                                                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                                    title="Rename"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setDeleteDoc(doc)}
                                                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Grid View */
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {documents.data.map((doc) => (
                        <div
                            key={doc.id}
                            className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-xs transition hover:border-primary/50"
                        >
                            <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="rounded-lg bg-muted p-2.5">
                                            {getFileIcon(doc.file_type)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="truncate font-semibold text-foreground group-hover:text-primary transition">
                                                {doc.name}
                                            </h4>
                                            <span className="text-[10px] font-mono uppercase text-muted-foreground">
                                                .{doc.file_type} • {formatFileSize(doc.file_size)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5 pt-1 text-xs">
                                    {doc.department && (
                                        <div className="flex items-center justify-between text-muted-foreground">
                                            <span>Department:</span>
                                            <Link
                                                href={`/departments/${doc.department.id}`}
                                                className="font-medium text-primary hover:underline"
                                            >
                                                {doc.department.name}
                                            </Link>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-muted-foreground">
                                        <span>Uploaded:</span>
                                        <span>{formatUploadedDate(doc.created_at)}</span>
                                    </div>

                                    {doc.uploaded_by && (
                                        <div className="flex items-center justify-between text-muted-foreground">
                                            <span>Author:</span>
                                            <span className="font-medium text-foreground">{doc.uploaded_by.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-end space-x-1 border-t border-border/60 pt-3">
                                {isMediaFileType(doc.file_type) && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPreviewDoc(doc)}
                                        className="h-8 gap-1.5 px-2.5 text-xs"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        <span>Preview</span>
                                    </Button>
                                )}

                                <a
                                    href={`/departments/documents/${doc.id}/download`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground transition"
                                >
                                    <Download className="h-3.5 w-3.5" />
                                    <span>Download</span>
                                </a>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setRenameDoc(doc)}
                                    className="h-8 p-2 text-muted-foreground hover:text-foreground"
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeleteDoc(doc)}
                                    className="h-8 p-2 text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {documents.last_page > 1 && (
                <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs text-muted-foreground">
                        Page {documents.current_page} of {documents.last_page} ({documents.total} total items)
                    </span>
                    <div className="flex items-center space-x-2">
                        {documents.current_page > 1 && (
                            <Link
                                href={`/documentation?page=${documents.current_page - 1}`}
                                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition"
                            >
                                Previous
                            </Link>
                        )}
                        {documents.current_page < documents.last_page && (
                            <Link
                                href={`/documentation?page=${documents.current_page + 1}`}
                                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition"
                            >
                                Next
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Modals */}
            <MediaPreviewModal
                document={previewDoc}
                isOpen={!!previewDoc}
                onClose={() => setPreviewDoc(null)}
            />

            <RenameDocumentModal
                document={renameDoc}
                isOpen={!!renameDoc}
                onClose={() => setRenameDoc(null)}
            />

            <DeleteDocumentModal
                document={deleteDoc}
                isOpen={!!deleteDoc}
                onClose={() => setDeleteDoc(null)}
            />
        </div>
    );
}

DocumentationIndex.layout = {
    breadcrumbs: [
        {
            title: 'Workspace',
            href: '/dashboard',
        },
        {
            title: 'Documentation',
            href: '/documentation',
        },
    ],
};
