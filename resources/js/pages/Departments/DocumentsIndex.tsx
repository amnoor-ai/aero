import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Folder,
    Search,
    Filter,
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    MediaPreviewModal,
    DocumentItem,
    isMediaFileType,
    formatUploadedDate,
    formatFileSize,
} from '@/components/departments/MediaPreviewModal';
import { RenameDocumentModal } from '@/components/departments/RenameDocumentModal';
import { DeleteDocumentModal } from '@/components/departments/DeleteDocumentModal';

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

export default function DocumentsIndex({ documents, departments = [], filters = {} }: DocumentsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [departmentId, setDepartmentId] = useState(filters.department_id || '');
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
            { preserveState: true, replace: true }
        );
    };

    const handleDepartmentChange = (deptId: string) => {
        setDepartmentId(deptId);
        router.get(
            '/departments/documents',
            { search, department_id: deptId },
            { preserveState: true, replace: true }
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
        if (!fileType) return <FileText className="w-4 h-4 text-primary" />;
        const ext = fileType.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
            return <FileImage className="w-4 h-4 text-emerald-500" />;
        }
        if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) {
            return <Video className="w-4 h-4 text-purple-500" />;
        }
        if (['pdf'].includes(ext)) {
            return <FileText className="w-4 h-4 text-rose-500" />;
        }
        return <FileCode className="w-4 h-4 text-blue-500" />;
    };

    return (
        <>
            <Head title="Global Documents Directory - Aero DevPM" />

            <div className="p-6 md:p-8 space-y-6 bg-background text-foreground min-h-screen">
                {/* Back navigation */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/departments"
                        className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
                        Back to Departments
                    </Link>
                </div>

                {/* Page Title & Controls Header outside container */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center space-x-2">
                            <Folder className="w-6 h-6 text-primary" />
                            <h1 className="text-xl font-bold tracking-tight text-foreground">Global Documents Hub</h1>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Central repository of all organizational files and documentation across all departments.
                        </p>
                    </div>

                    {/* Controls: Search, Dept Filter, View Switcher */}
                    <div className="flex flex-wrap items-center gap-3">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search documents..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 h-9 text-xs w-48 sm:w-64"
                            />
                        </form>

                        <select
                            value={departmentId}
                            onChange={(e) => handleDepartmentChange(e.target.value)}
                            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="">All Departments</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.code} - {dept.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex items-center bg-muted rounded-lg p-1 border border-border">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-1.5 rounded-md transition ${viewMode === 'table' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                                title="Table View"
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                                title="Grid View"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Container */}
                <div className="bg-card border border-border rounded-xl p-6">
                    {documents.data.length === 0 ? (
                        <div className="text-center py-12 space-y-3">
                            <Folder className="w-10 h-10 mx-auto text-muted-foreground/40" />
                            <p className="text-xs text-muted-foreground font-medium">No documents found matching your filter criteria.</p>
                        </div>
                    ) : viewMode === 'table' ? (
                        /* Table View */
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-border text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
                                        <th className="pb-3 pr-4">Name</th>
                                        <th className="pb-3 px-4">Department</th>
                                        <th className="pb-3 px-4">Type</th>
                                        <th className="pb-3 px-4">Date Uploaded</th>
                                        <th className="pb-3 pl-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60">
                                    {documents.data.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="py-3 pr-4 font-medium text-foreground">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 rounded-lg bg-muted border border-border">
                                                        {getFileIcon(doc.file_type)}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-foreground block truncate max-w-xs sm:max-w-sm">
                                                            {doc.name}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground block">{formatFileSize(doc.file_size)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                {doc.department && (
                                                    <Link
                                                        href={`/departments/${doc.department.id}`}
                                                        className="inline-flex items-center gap-1.5 hover:text-primary font-semibold text-foreground transition"
                                                    >
                                                        <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono text-[10px] font-bold border border-primary/20">
                                                            {doc.department.code}
                                                        </span>
                                                        <span className="truncate max-w-[120px]">{doc.department.name}</span>
                                                    </Link>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[10px] font-bold uppercase border border-border/80">
                                                    {doc.file_type || 'FILE'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-muted-foreground text-xs">
                                                {formatUploadedDate(doc.created_at)}
                                            </td>
                                            <td className="py-3 pl-4 text-right">
                                                <div className="flex items-center justify-end space-x-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewDocument(doc)}
                                                        title="View / Open document"
                                                        className="h-8 px-2 text-xs"
                                                    >
                                                        <Eye className="w-3.5 h-3.5 mr-1" /> View
                                                    </Button>
                                                    <a href={`/departments/documents/${doc.id}/download`} download className="inline-flex">
                                                        <Button variant="ghost" size="sm" title="Download file" className="h-8 px-2 text-xs">
                                                            <Download className="w-3.5 h-3.5 mr-1 text-primary" /> Download
                                                        </Button>
                                                    </a>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setRenameDoc(doc)}
                                                        title="Rename document title"
                                                        className="h-8 px-2 text-xs"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setDeleteDoc(doc)}
                                                        title="Delete document"
                                                        className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {documents.data.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="bg-muted/30 border border-border hover:border-primary/40 rounded-xl p-4 transition flex flex-col justify-between space-y-3 group shadow-2xs"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div className="p-3 rounded-xl bg-background border border-border shadow-2xs">
                                                {getFileIcon(doc.file_type)}
                                            </div>
                                            {doc.department && (
                                                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono text-[10px] font-bold border border-primary/20">
                                                    {doc.department.code}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                                {doc.name}
                                            </h4>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">{formatFileSize(doc.file_size)}</p>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                                        <span className="text-[10px] text-muted-foreground">{formatUploadedDate(doc.created_at)}</span>
                                        <div className="flex items-center space-x-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewDocument(doc)}
                                                className="h-7 w-7 p-0"
                                                title="View"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </Button>
                                            <a href={`/departments/documents/${doc.id}/download`} download>
                                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-primary" title="Download">
                                                    <Download className="w-3.5 h-3.5" />
                                                </Button>
                                            </a>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setRenameDoc(doc)}
                                                className="h-7 w-7 p-0"
                                                title="Rename"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeleteDoc(doc)}
                                                className="h-7 w-7 p-0 text-destructive"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
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
