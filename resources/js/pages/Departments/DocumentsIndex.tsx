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
    ArrowLeft,
    FileText,
    FileImage,
    Video,
    FileCode,
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

interface DepartmentSimple {
    id: number;
    name: string;
    code: string;
}

interface DocumentsIndexProps {
    documents: {
        data: DocumentItem[];
        current_page: number;
        last_page: number;
        total: number;
    };
    departments: DepartmentSimple[];
    filters: {
        search?: string;
        department_id?: string;
    };
}

export default function DocumentsIndex({
    documents,
    departments = [],
    filters = {},
}: DocumentsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [departmentId, setDepartmentId] = useState(
        filters.department_id || '',
    );
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    // Modals
    const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
    const [renameDoc, setRenameDoc] = useState<DocumentItem | null>(null);
    const [deleteDoc, setDeleteDoc] = useState<DocumentItem | null>(null);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/departments/documents',
            { search, department_id: departmentId },
            { preserveState: true, replace: true },
        );
    };

    const handleDepartmentChange = (deptId: string) => {
        setDepartmentId(deptId);
        router.get(
            '/departments/documents',
            { search, department_id: deptId },
            { preserveState: true, replace: true },
        );
    };

    const handleViewDocument = (doc: DocumentItem) => {
        if (isMediaFileType(doc.file_type)) {
            setPreviewDoc(doc);
        } else {
            window.open(`/departments/documents/${doc.id}/view`, '_blank');
        }
    };

    const getFileIcon = (fileType?: string | null) => {
        if (!fileType) {
            return <FileText className="h-4 w-4 text-primary" />;
        }

        const ext = fileType.toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
            return <FileImage className="h-4 w-4 text-emerald-500" />;
        }

        if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) {
            return <Video className="h-4 w-4 text-purple-500" />;
        }

        if (['pdf'].includes(ext)) {
            return <FileText className="h-4 w-4 text-rose-500" />;
        }

        return <FileCode className="h-4 w-4 text-blue-500" />;
    };

    return (
        <>
            <Head title="Global Documents Directory - Aero DevPM" />

            <div className="min-h-screen space-y-6 bg-background p-6 text-foreground md:p-8">
                {/* Back navigation */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/departments"
                        className="group inline-flex items-center text-xs font-semibold text-muted-foreground transition hover:text-foreground"
                    >
                        <ArrowLeft className="mr-1.5 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Departments
                    </Link>
                </div>

                {/* Page Title & Controls Header outside container */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <div className="flex items-center space-x-2">
                            <Folder className="h-6 w-6 text-primary" />
                            <h1 className="text-xl font-bold tracking-tight text-foreground">
                                Global Documents Hub
                            </h1>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Central repository of all organizational files and
                            documentation across all departments.
                        </p>
                    </div>

                    {/* Controls: Search, Dept Filter, View Switcher */}
                    <div className="flex flex-wrap items-center gap-3">
                        <form
                            onSubmit={handleSearchSubmit}
                            className="relative"
                        >
                            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search documents..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-9 w-48 pl-9 text-xs sm:w-64"
                            />
                        </form>

                        <select
                            value={departmentId}
                            onChange={(e) =>
                                handleDepartmentChange(e.target.value)
                            }
                            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                        >
                            <option value="">All Departments</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.code} - {dept.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex items-center rounded-lg border border-border bg-muted p-1">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`rounded-md p-1.5 transition ${viewMode === 'table' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                                title="Table View"
                            >
                                <List className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`rounded-md p-1.5 transition ${viewMode === 'grid' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                                title="Grid View"
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Container */}
                <div className="rounded-xl border border-border bg-card p-6">
                    {documents.data.length === 0 ? (
                        <div className="space-y-3 py-12 text-center">
                            <Folder className="mx-auto h-10 w-10 text-muted-foreground/40" />
                            <p className="text-xs font-medium text-muted-foreground">
                                No documents found matching your filter
                                criteria.
                            </p>
                        </div>
                    ) : viewMode === 'table' ? (
                        /* Table View */
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-border text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                                        <th className="pr-4 pb-3">Name</th>
                                        <th className="px-4 pb-3">
                                            Department
                                        </th>
                                        <th className="px-4 pb-3">Type</th>
                                        <th className="px-4 pb-3">
                                            Date Uploaded
                                        </th>
                                        <th className="pb-3 pl-4 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60">
                                    {documents.data.map((doc) => (
                                        <tr
                                            key={doc.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <td className="py-3 pr-4 font-medium text-foreground">
                                                <div className="flex items-center space-x-3">
                                                    <div className="rounded-lg border border-border bg-muted p-2">
                                                        {getFileIcon(
                                                            doc.file_type,
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="block max-w-xs truncate font-semibold text-foreground sm:max-w-sm">
                                                            {doc.name}
                                                        </span>
                                                        <span className="block text-[10px] text-muted-foreground">
                                                            {formatFileSize(
                                                                doc.file_size,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {doc.department && (
                                                    <Link
                                                        href={`/departments/${doc.department.id}`}
                                                        className="inline-flex items-center gap-1.5 font-semibold text-foreground transition hover:text-primary"
                                                    >
                                                        <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                                                            {
                                                                doc.department
                                                                    .code
                                                            }
                                                        </span>
                                                        <span className="max-w-[120px] truncate">
                                                            {
                                                                doc.department
                                                                    .name
                                                            }
                                                        </span>
                                                    </Link>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="rounded-md border border-border/80 bg-muted px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground uppercase">
                                                    {doc.file_type || 'FILE'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground">
                                                {formatUploadedDate(
                                                    doc.created_at,
                                                )}
                                            </td>
                                            <td className="py-3 pl-4 text-right">
                                                <div className="flex items-center justify-end space-x-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleViewDocument(
                                                                doc,
                                                            )
                                                        }
                                                        title="View / Open document"
                                                        className="h-8 px-2 text-xs"
                                                    >
                                                        <Eye className="mr-1 h-3.5 w-3.5" />{' '}
                                                        View
                                                    </Button>
                                                    <a
                                                        href={`/departments/documents/${doc.id}/download`}
                                                        download
                                                        className="inline-flex"
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            title="Download file"
                                                            className="h-8 px-2 text-xs"
                                                        >
                                                            <Download className="mr-1 h-3.5 w-3.5 text-primary" />{' '}
                                                            Download
                                                        </Button>
                                                    </a>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            setRenameDoc(doc)
                                                        }
                                                        title="Rename document title"
                                                        className="h-8 px-2 text-xs"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            setDeleteDoc(doc)
                                                        }
                                                        title="Delete document"
                                                        className="h-8 px-2 text-xs text-destructive hover:text-destructive"
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
                    ) : (
                        /* Grid View */
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {documents.data.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="group flex flex-col justify-between space-y-3 rounded-xl border border-border bg-muted/30 p-4 shadow-2xs transition hover:border-primary/40"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div className="rounded-xl border border-border bg-background p-3 shadow-2xs">
                                                {getFileIcon(doc.file_type)}
                                            </div>
                                            {doc.department && (
                                                <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                                                    {doc.department.code}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="line-clamp-2 text-xs font-bold text-foreground transition-colors group-hover:text-primary">
                                                {doc.name}
                                            </h4>
                                            <p className="mt-0.5 text-[10px] text-muted-foreground">
                                                {formatFileSize(doc.file_size)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-border/60 pt-2 text-xs">
                                        <span className="text-[10px] text-muted-foreground">
                                            {formatUploadedDate(doc.created_at)}
                                        </span>
                                        <div className="flex items-center space-x-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleViewDocument(doc)
                                                }
                                                className="h-7 w-7 p-0"
                                                title="View"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                            </Button>
                                            <a
                                                href={`/departments/documents/${doc.id}/download`}
                                                download
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0 text-primary"
                                                    title="Download"
                                                >
                                                    <Download className="h-3.5 w-3.5" />
                                                </Button>
                                            </a>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setRenameDoc(doc)
                                                }
                                                className="h-7 w-7 p-0"
                                                title="Rename"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setDeleteDoc(doc)
                                                }
                                                className="h-7 w-7 p-0 text-destructive"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Document Modals */}
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
        </>
    );
}

DocumentsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Departments',
            href: '/departments',
        },
        {
            title: 'Global Documents',
            href: '#',
        },
    ],
};
