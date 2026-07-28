import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Download,
    FileText,
    Folder,
    MapPin,
    Pencil,
    ChevronRight,
    Plus,
    Trash2,
    UserPlus,
    LayoutGrid,
    List,
    Eye,
    Upload,
    FileCode,
    FileImage,
    Video,
} from 'lucide-react';
import React, { useState } from 'react';
import { DeleteDocumentModal } from '@/components/departments/DeleteDocumentModal';
import { EditDepartmentModal } from '@/components/departments/EditDepartmentModal';
import type { DocumentItem } from '@/components/departments/MediaPreviewModal';
import {
    MediaPreviewModal,
    isMediaFileType,
    formatUploadedDate,
    formatFileSize,
} from '@/components/departments/MediaPreviewModal';
import { RenameDocumentModal } from '@/components/departments/RenameDocumentModal';
import { UploadDepartmentDocModal } from '@/components/departments/UploadDepartmentDocModal';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

interface UserItem {
    id: number;
    name: string;
    email: string;
}

interface ProjectItem {
    id: number;
    name: string;
    description: string | null;
    status: string;
    progress?: number;
    tasks_count?: number;
    lead?: { id: number; name: string };
}

interface DepartmentDetail {
    id: number;
    name: string;
    code: string;
    slug: string;
    description: string | null;
    director_id: number | null;
    director?: UserItem;
    location: string | null;
    status: string;
    mandate_file_name?: string | null;
    members?: UserItem[];
    projects?: ProjectItem[];
    documents?: DocumentItem[];
    members_count?: number;
    projects_count?: number;
    documents_count?: number;
    updated_at: string;
}

interface DepartmentShowProps {
    department: DepartmentDetail;
    workspaceUsers: UserItem[];
}

export default function DepartmentShow({
    department,
    workspaceUsers = [],
}: DepartmentShowProps) {
    const [activeTab, setActiveTab] = useState<
        'overview' | 'members' | 'projects' | 'documents'
    >('overview');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [isSubmittingMember, setIsSubmittingMember] = useState(false);

    // Document Modals state
    const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
    const [renameDoc, setRenameDoc] = useState<DocumentItem | null>(null);
    const [deleteDoc, setDeleteDoc] = useState<DocumentItem | null>(null);
    const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);

    const membersList = department.members || [];
    const projectsList = department.projects || [];
    const documentsList = department.documents || [];

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedUserId) {
            return;
        }

        setIsSubmittingMember(true);
        router.post(
            `/departments/${department.id}/members`,
            { user_id: selectedUserId },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsAddMemberOpen(false);
                    setSelectedUserId('');
                    setIsSubmittingMember(false);
                },
                onError: () => setIsSubmittingMember(false),
            },
        );
    };

    const handleRemoveMember = (userId: number) => {
        if (
            confirm(
                'Are you sure you want to remove this member from the department?',
            )
        ) {
            router.delete(`/departments/${department.id}/members/${userId}`, {
                preserveState: true,
                preserveScroll: true,
            });
        }
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
            <Head
                title={`${department.name} (${department.code}) - Aero DevPM`}
            />

            <div className="min-h-screen space-y-6 bg-background p-6 text-foreground md:p-8">
                {/* Back navigation & Actions */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/departments"
                        className="group inline-flex items-center text-xs font-semibold text-muted-foreground transition hover:text-foreground"
                    >
                        <ArrowLeft className="mr-1.5 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Departments Directory
                    </Link>

                    <div className="flex items-center space-x-3">
                        <Link
                            href="/departments/documents"
                            className="inline-flex items-center space-x-2 rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
                        >
                            <Folder className="h-4 w-4" />
                            <span>Global Documents Hub</span>
                        </Link>

                        <Button
                            onClick={() => setIsEditOpen(true)}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                        >
                            <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                            Department
                        </Button>
                    </div>
                </div>

                {/* Hero Header Card */}
                <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-2xs md:p-8">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div className="space-y-1">
                            <div className="flex items-center space-x-3">
                                <span className="rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold text-primary">
                                    {department.code}
                                </span>
                                <h1 className="text-xl font-bold tracking-tight text-foreground">
                                    {department.name}
                                </h1>
                                <span
                                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${
                                        department.status === 'active'
                                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                            : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                                    }`}
                                >
                                    {department.status}
                                </span>
                            </div>

                            {department.location && (
                                <div className="flex items-center space-x-1 pt-0.5 text-xs text-muted-foreground">
                                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>{department.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Interactive Stats overview strip */}
                    <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-4 md:grid-cols-4">
                        <div className="rounded-xl border border-border/60 bg-muted/40 p-3.5">
                            <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                                Director
                            </p>
                            <div className="mt-1 flex items-center space-x-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                                    {department.director
                                        ? department.director.name.charAt(0)
                                        : '?'}
                                </div>
                                <p className="truncate text-xs font-bold text-foreground">
                                    {department.director
                                        ? department.director.name
                                        : 'Unassigned'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setActiveTab('members')}
                            className="group cursor-pointer rounded-xl border border-border/60 bg-muted/40 p-3.5 text-left transition hover:bg-muted/70"
                        >
                            <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase transition-colors group-hover:text-primary">
                                Assigned Members
                            </p>
                            <p className="mt-0.5 text-lg font-extrabold text-foreground transition-colors group-hover:text-primary">
                                {membersList.length}
                            </p>
                        </button>

                        <button
                            onClick={() => setActiveTab('projects')}
                            className="group cursor-pointer rounded-xl border border-border/60 bg-muted/40 p-3.5 text-left transition hover:bg-muted/70"
                        >
                            <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase transition-colors group-hover:text-primary">
                                Active Projects
                            </p>
                            <p className="mt-0.5 text-lg font-extrabold text-foreground transition-colors group-hover:text-primary">
                                {projectsList.length}
                            </p>
                        </button>

                        <button
                            onClick={() => setActiveTab('documents')}
                            className="group cursor-pointer rounded-xl border border-border/60 bg-muted/40 p-3.5 text-left transition hover:bg-muted/70"
                        >
                            <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase transition-colors group-hover:text-primary">
                                Uploaded Documents
                            </p>
                            <p className="mt-0.5 text-lg font-extrabold text-foreground transition-colors group-hover:text-primary">
                                {documentsList.length}
                            </p>
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-6 border-b border-border text-sm font-semibold">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`relative pb-3 transition ${activeTab === 'overview' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`relative flex items-center space-x-1.5 pb-3 transition ${activeTab === 'members' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <span>Team Members</span>
                        <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                            {membersList.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`relative flex items-center space-x-1.5 pb-3 transition ${activeTab === 'projects' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <span>Projects</span>
                        <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                            {projectsList.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('documents')}
                        className={`relative flex items-center space-x-1.5 pb-3 transition ${activeTab === 'documents' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <span>Documents</span>
                        <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                            {documentsList.length}
                        </span>
                    </button>
                </div>

                {/* Tab Contents */}
                {activeTab === 'overview' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="space-y-4 md:col-span-2">
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground">
                                        Department Overview & Responsibilities
                                    </h3>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        Summary of organizational mandate and
                                        operational scope.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-border bg-card p-6">
                                    <p className="text-xs leading-relaxed whitespace-pre-line text-muted-foreground">
                                        {department.description ||
                                            'No detailed mandate description has been configured for this department.'}
                                    </p>
                                </div>
                            </div>

                            {/* Sidebar Info Card */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground">
                                        Department Info
                                    </h4>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        Key metadata and leadership assignments.
                                    </p>
                                </div>
                                <div className="space-y-3 rounded-xl border border-border bg-card p-5 text-xs">
                                    <div>
                                        <span className="block text-[11px] text-muted-foreground">
                                            Director
                                        </span>
                                        <span className="font-semibold text-foreground">
                                            {department.director
                                                ? `${department.director.name} (${department.director.email})`
                                                : 'Unassigned'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[11px] text-muted-foreground">
                                            Location
                                        </span>
                                        <span className="font-semibold text-foreground">
                                            {department.location ||
                                                'Remote / Unspecified'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[11px] text-muted-foreground">
                                            Department Code
                                        </span>
                                        <span className="font-mono font-bold text-primary">
                                            {department.code}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'members' && (
                    <div className="space-y-4">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">
                                    Assigned Department Members
                                </h3>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    Workspace team members linked to this
                                    department.
                                </p>
                            </div>
                            <Button
                                onClick={() => setIsAddMemberOpen(true)}
                                size="sm"
                                className="bg-primary text-xs font-semibold text-primary-foreground"
                            >
                                <Plus className="mr-1.5 h-4 w-4" /> Add Member
                            </Button>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6">
                            {membersList.length === 0 ? (
                                <div className="space-y-2 py-6 text-center">
                                    <p className="text-xs text-muted-foreground">
                                        No team members assigned to this
                                        department yet.
                                    </p>
                                    <Button
                                        onClick={() => setIsAddMemberOpen(true)}
                                        size="sm"
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        <Plus className="mr-1 h-3.5 w-3.5" />{' '}
                                        Add First Member
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                    {membersList.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center justify-between space-x-3 rounded-xl border border-border bg-muted/40 p-3.5"
                                        >
                                            <div className="flex items-center space-x-3 truncate">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/20 text-sm font-bold text-primary">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div className="truncate">
                                                    <p className="truncate text-xs font-bold text-foreground">
                                                        {member.name}
                                                    </p>
                                                    <p className="truncate text-[10px] text-muted-foreground">
                                                        {member.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleRemoveMember(
                                                        member.id,
                                                    )
                                                }
                                                title="Remove member from department"
                                                className="shrink-0 cursor-pointer rounded p-1 text-muted-foreground transition hover:text-destructive"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'projects' && (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">
                                Department Projects
                            </h3>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Active projects assigned to {department.name}.
                            </p>
                        </div>
                        {projectsList.length === 0 ? (
                            <div className="rounded-xl border border-border bg-card p-8 text-center text-xs text-muted-foreground">
                                No projects currently assigned to this
                                department.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {projectsList.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/projects/${project.id}`}
                                        className="group block space-y-3 rounded-xl border border-border bg-card p-5 shadow-2xs transition hover:border-primary/40"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Folder className="h-4 w-4 text-primary" />
                                                <span className="text-sm font-bold text-foreground transition group-hover:text-primary">
                                                    {project.name}
                                                </span>
                                            </div>
                                            <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                {project.status}
                                            </span>
                                        </div>
                                        {project.description && (
                                            <p className="line-clamp-2 text-xs text-muted-foreground">
                                                {project.description}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
                                            <span>
                                                Lead:{' '}
                                                {project.lead
                                                    ? project.lead.name
                                                    : 'Unassigned'}
                                            </span>
                                            <div className="flex items-center font-semibold text-primary transition-transform group-hover:translate-x-1">
                                                View Project{' '}
                                                <ChevronRight className="ml-1 h-3.5 w-3.5" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="space-y-4">
                        {/* Title and Controls Header outside container */}
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">
                                    Department Documents
                                </h3>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    Files, mandates, and documentation attached
                                    to {department.name}.
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                {/* Grid vs Table View Mode Switcher */}
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

                                <Button
                                    onClick={() => setIsUploadDocOpen(true)}
                                    size="sm"
                                    className="gap-1.5 bg-primary text-xs font-semibold text-primary-foreground"
                                >
                                    <Upload className="h-4 w-4" /> Upload
                                    Document
                                </Button>
                            </div>
                        </div>

                        {/* Documents Container */}
                        <div className="rounded-xl border border-border bg-card p-6">
                            {documentsList.length === 0 ? (
                                <div className="space-y-3 py-10 text-center">
                                    <FileText className="mx-auto h-10 w-10 text-muted-foreground/40" />
                                    <p className="text-xs text-muted-foreground">
                                        No documents uploaded for this
                                        department yet.
                                    </p>
                                    <Button
                                        onClick={() => setIsUploadDocOpen(true)}
                                        size="sm"
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        <Upload className="mr-1.5 h-3.5 w-3.5" />{' '}
                                        Upload First Document
                                    </Button>
                                </div>
                            ) : viewMode === 'table' ? (
                                /* Table View */
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-border text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                                                <th className="pr-4 pb-3">
                                                    Name
                                                </th>
                                                <th className="px-4 pb-3">
                                                    Type
                                                </th>
                                                <th className="px-4 pb-3">
                                                    Date Uploaded
                                                </th>
                                                <th className="pb-3 pl-4 text-right">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/60">
                                            {documentsList.map((doc) => (
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
                                                                <span className="block max-w-xs truncate font-semibold text-foreground">
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
                                                        <span className="rounded-md border border-border/80 bg-muted px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground uppercase">
                                                            {doc.file_type ||
                                                                'FILE'}
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
                                                                    setRenameDoc(
                                                                        doc,
                                                                    )
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
                                                                    setDeleteDoc(
                                                                        doc,
                                                                    )
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
                                    {documentsList.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="group flex flex-col justify-between space-y-3 rounded-xl border border-border bg-muted/30 p-4 shadow-2xs transition hover:border-primary/40"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <div className="rounded-xl border border-border bg-background p-3 shadow-2xs">
                                                        {getFileIcon(
                                                            doc.file_type,
                                                        )}
                                                    </div>
                                                    <span className="rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground uppercase">
                                                        {doc.file_type ||
                                                            'FILE'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="line-clamp-2 text-xs font-bold text-foreground transition-colors group-hover:text-primary">
                                                        {doc.name}
                                                    </h4>
                                                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                                                        {formatFileSize(
                                                            doc.file_size,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-border/60 pt-2 text-xs">
                                                <span className="text-[10px] text-muted-foreground">
                                                    {formatUploadedDate(
                                                        doc.created_at,
                                                    )}
                                                </span>
                                                <div className="flex items-center space-x-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleViewDocument(
                                                                doc,
                                                            )
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
                )}
            </div>

            {/* Document Modals */}
            <MediaPreviewModal
                document={previewDoc}
                isOpen={!!previewDoc}
                onClose={() => setPreviewDoc(null)}
            />

            <UploadDepartmentDocModal
                departmentId={department.id}
                isOpen={isUploadDocOpen}
                onClose={() => setIsUploadDocOpen(false)}
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

            {/* Edit Department Modal */}
            <EditDepartmentModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                department={department}
                workspaceUsers={workspaceUsers}
            />

            {/* Add Member Modal */}
            <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                <DialogContent className="border-border bg-card text-foreground sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2 text-base font-bold">
                            <UserPlus className="h-5 w-5 text-primary" />
                            <span>Add Member to {department.name}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleAddMember} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">
                                Select Team Member
                            </label>
                            <select
                                value={selectedUserId}
                                onChange={(e) =>
                                    setSelectedUserId(e.target.value)
                                }
                                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                required
                            >
                                <option value="">
                                    -- Choose workspace user --
                                </option>
                                {workspaceUsers
                                    .filter(
                                        (u) =>
                                            !membersList.some(
                                                (m) => m.id === u.id,
                                            ),
                                    )
                                    .map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAddMemberOpen(false)}
                                className="text-xs"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isSubmittingMember || !selectedUserId}
                                className="bg-primary text-xs font-semibold text-primary-foreground"
                            >
                                {isSubmittingMember
                                    ? 'Adding...'
                                    : 'Assign Member'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

DepartmentShow.layout = {
    breadcrumbs: [
        {
            title: 'Departments',
            href: '/departments',
        },
        {
            title: 'Details',
            href: '#',
        },
    ],
};
