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
    ExternalLink,
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

    const handleFilterChange = (newDeptId?: string, newType?: string, newSearch?: string) => {
        const dId = newDeptId !== undefined ? newDeptId : departmentId;
        const fType = newType !== undefined ? newType : fileTypeFilter;
        const sQuery = newSearch !== undefined ? newSearch : search;

        router.get(
            '/documentation',
            {
                search: sQuery || undefined,
                department_id: dId || undefined,
                file_type: fType || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleDocumentClick = (doc: DocumentItem) => {
        if (isMediaFileType(doc.file_type)) {
            setPreviewDoc(doc);
        } else {
            window.open(`/departments/documents/${doc.id}/view`, '_blank');
        }
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
        <div className="p-6 md:p-8 space-y-6 bg-background text-foreground min-h-screen">
            <Head title="Documentation & File Directory - Aero DevPM" />

            {/* Standardized Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-foreground">
                        Documentation & File Directory
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Central registry cataloging all project attachments, department documents, technical specs, and workspace files.
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

            {/* Filter & View Mode Controls (Clean, Spacing & Background Alignment) */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-1">
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                    {/* Search Input */}
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by title, department, author, or extension..."
                            value={search}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSearch(val);
                                handleFilterChange(undefined, undefined, val);
                            }}
                            className="pl-9 h-9.5 text-xs rounded-lg bg-background"
                        />
                    </div>

                    {/* Department Select */}
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                        <select
                            value={departmentId}
                            onChange={(e) => {
                                setDepartmentId(e.target.value);
                                handleFilterChange(e.target.value);
                            }}
                            className="h-9.5 rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground shadow-2xs focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <option value="">All Departments</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name} ({dept.code})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* File Type Filter Pills */}
                    <div className="flex items-center rounded-lg border border-border bg-card/50 p-1">
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
                                className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                                    fileTypeFilter === item.id
                                        ? 'bg-primary text-primary-foreground shadow-2xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* View Switcher */}
                    <div className="flex items-center space-x-1 rounded-lg border border-border bg-card/50 p-1">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`rounded-md p-1.5 transition ${
                                viewMode === 'table'
                                    ? 'bg-primary/10 text-primary shadow-2xs'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                            title="Table View"
                        >
                            <List className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`rounded-md p-1.5 transition ${
                                viewMode === 'grid'
                                    ? 'bg-primary/10 text-primary shadow-2xs'
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
                                                <button
                                                    onClick={() => handleDocumentClick(doc)}
                                                    className="rounded-lg bg-muted p-2 hover:bg-primary/20 transition cursor-pointer"
                                                    title={isMediaFileType(doc.file_type) ? 'Preview Media' : 'Open Document in New Tab'}
                                                >
                                                    {getFileIcon(doc.file_type)}
                                                </button>
                                                <div>
                                                    <button
                                                        onClick={() => handleDocumentClick(doc)}
                                                        className="font-semibold text-foreground hover:text-primary transition text-left cursor-pointer"
                                                    >
                                                        {doc.name}
                                                    </button>
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
                                                {isMediaFileType(doc.file_type) ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setPreviewDoc(doc)}
                                                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                                        title="Preview Media Popup"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </Button>
                                                ) : (
                                                    <a
                                                        href={`/departments/documents/${doc.id}/view`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition"
                                                        title="Open Document in New Tab"
                                                    >
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </a>
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
                                        <button
                                            onClick={() => handleDocumentClick(doc)}
                                            className="rounded-lg bg-muted p-2.5 hover:bg-primary/20 transition cursor-pointer"
                                            title={isMediaFileType(doc.file_type) ? 'Preview Media' : 'Open Document in New Tab'}
                                        >
                                            {getFileIcon(doc.file_type)}
                                        </button>
                                        <div className="min-w-0 flex-1 text-left">
                                            <button
                                                onClick={() => handleDocumentClick(doc)}
                                                className="truncate font-semibold text-foreground hover:text-primary transition block text-left w-full cursor-pointer"
                                            >
                                                {doc.name}
                                            </button>
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
                                {isMediaFileType(doc.file_type) ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPreviewDoc(doc)}
                                        className="h-8 gap-1.5 px-2.5 text-xs font-semibold"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        <span>Preview Media</span>
                                    </Button>
                                ) : (
                                    <a
                                        href={`/departments/documents/${doc.id}/view`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground transition font-semibold"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        <span>Open in New Tab</span>
                                    </a>
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
