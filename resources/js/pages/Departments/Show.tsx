import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Building2,
    ArrowLeft,
    Download,
    FileText,
    Users,
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
    MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditDepartmentModal } from '@/components/departments/EditDepartmentModal';
import {
    MediaPreviewModal,
    DocumentItem,
    isMediaFileType,
    formatUploadedDate,
    formatFileSize,
} from '@/components/departments/MediaPreviewModal';
import { UploadDepartmentDocModal } from '@/components/departments/UploadDepartmentDocModal';
import { RenameDocumentModal } from '@/components/departments/RenameDocumentModal';
import { DeleteDocumentModal } from '@/components/departments/DeleteDocumentModal';
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

export default function DepartmentShow({ department, workspaceUsers = [] }: DepartmentShowProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'projects' | 'documents'>('overview');
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
        if (!selectedUserId) return;
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
            }
        );
    };

    const handleRemoveMember = (userId: number) => {
        if (confirm('Are you sure you want to remove this member from the department?')) {
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
            <Head title={`${department.name} (${department.code}) - Aero DevPM`} />

            <div className="p-6 md:p-8 space-y-6 bg-background text-foreground min-h-screen">
                {/* Back navigation & Actions */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/departments"
                        className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
                        Back to Departments Directory
                    </Link>

                    <div className="flex items-center space-x-3">
                        <Link
                            href="/departments/documents"
                            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold border border-border transition"
                        >
                            <Folder className="w-4 h-4" />
                            <span>Global Documents Hub</span>
                        </Link>

                        <Button onClick={() => setIsEditOpen(true)} variant="outline" size="sm" className="text-xs">
                            <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit Department
                        </Button>
                    </div>
                </div>

                {/* Hero Header Card */}
                <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6 shadow-2xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center space-x-3">
                                <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary font-mono font-bold text-xs border border-primary/20">
                                    {department.code}
                                </span>
                                <h1 className="text-xl font-bold tracking-tight text-foreground">
                                    {department.name}
                                </h1>
                                <span
                                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                                        department.status === 'active'
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    }`}
                                >
                                    {department.status}
                                </span>
                            </div>

                            {department.location && (
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground pt-0.5">
                                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span>{department.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Interactive Stats overview strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
                        <div className="p-3.5 bg-muted/40 rounded-xl border border-border/60">
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Director</p>
                            <div className="flex items-center space-x-2 mt-1">
                                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                                    {department.director ? department.director.name.charAt(0) : '?'}
                                </div>
                                <p className="text-xs font-bold text-foreground truncate">
                                    {department.director ? department.director.name : 'Unassigned'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setActiveTab('members')}
                            className="p-3.5 bg-muted/40 hover:bg-muted/70 rounded-xl border border-border/60 text-left transition group cursor-pointer"
                        >
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider group-hover:text-primary transition-colors">
                                Assigned Members
                            </p>
                            <p className="text-lg font-extrabold text-foreground mt-0.5 group-hover:text-primary transition-colors">
                                {membersList.length}
                            </p>
                        </button>

                        <button
                            onClick={() => setActiveTab('projects')}
                            className="p-3.5 bg-muted/40 hover:bg-muted/70 rounded-xl border border-border/60 text-left transition group cursor-pointer"
                        >
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider group-hover:text-primary transition-colors">
                                Active Projects
                            </p>
                            <p className="text-lg font-extrabold text-foreground mt-0.5 group-hover:text-primary transition-colors">
                                {projectsList.length}
                            </p>
                        </button>

                        <button
                            onClick={() => setActiveTab('documents')}
                            className="p-3.5 bg-muted/40 hover:bg-muted/70 rounded-xl border border-border/60 text-left transition group cursor-pointer"
                        >
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider group-hover:text-primary transition-colors">
                                Uploaded Documents
                            </p>
                            <p className="text-lg font-extrabold text-foreground mt-0.5 group-hover:text-primary transition-colors">
                                {documentsList.length}
                            </p>
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-border space-x-6 text-sm font-semibold">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-3 transition relative ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`pb-3 transition relative flex items-center space-x-1.5 ${activeTab === 'members' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <span>Team Members</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">{membersList.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`pb-3 transition relative flex items-center space-x-1.5 ${activeTab === 'projects' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <span>Projects</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">{projectsList.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('documents')}
                        className={`pb-3 transition relative flex items-center space-x-1.5 ${activeTab === 'documents' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <span>Documents</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">{documentsList.length}</span>
                    </button>
                </div>

                {/* Tab Contents */}
                {activeTab === 'overview' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground">Department Overview & Responsibilities</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">Summary of organizational mandate and operational scope.</p>
                                </div>
                                <div className="bg-card border border-border rounded-xl p-6">
                                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {department.description || 'No detailed mandate description has been configured for this department.'}
                                    </p>
                                </div>
                            </div>

                            {/* Sidebar Info Card */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground">Department Info</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">Key metadata and leadership assignments.</p>
                                </div>
                                <div className="bg-card border border-border rounded-xl p-5 space-y-3 text-xs">
                                    <div>
                                        <span className="text-muted-foreground block text-[11px]">Director</span>
                                        <span className="font-semibold text-foreground">
                                            {department.director ? `${department.director.name} (${department.director.email})` : 'Unassigned'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-[11px]">Location</span>
                                        <span className="font-semibold text-foreground">{department.location || 'Remote / Unspecified'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-[11px]">Department Code</span>
                                        <span className="font-mono font-bold text-primary">{department.code}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'members' && (
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">Assigned Department Members</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Workspace team members linked to this department.</p>
                            </div>
                            <Button onClick={() => setIsAddMemberOpen(true)} size="sm" className="bg-primary text-primary-foreground text-xs font-semibold">
                                <Plus className="w-4 h-4 mr-1.5" /> Add Member
                            </Button>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6">
                            {membersList.length === 0 ? (
                                <div className="text-center py-6 space-y-2">
                                    <p className="text-xs text-muted-foreground">No team members assigned to this department yet.</p>
                                    <Button onClick={() => setIsAddMemberOpen(true)} size="sm" variant="outline" className="text-xs">
                                        <Plus className="w-3.5 h-3.5 mr-1" /> Add First Member
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {membersList.map((member) => (
                                        <div key={member.id} className="p-3.5 bg-muted/40 rounded-xl border border-border flex items-center justify-between space-x-3">
                                            <div className="flex items-center space-x-3 truncate">
                                                <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold border border-primary/30 shrink-0">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-xs font-bold text-foreground truncate">{member.name}</p>
                                                    <p className="text-[10px] text-muted-foreground truncate">{member.email}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveMember(member.id)}
                                                title="Remove member from department"
                                                className="text-muted-foreground hover:text-destructive p-1 rounded transition shrink-0 cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
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
                            <h3 className="text-sm font-semibold text-foreground">Department Projects</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Active projects assigned to {department.name}.</p>
                        </div>
                        {projectsList.length === 0 ? (
                            <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground text-xs">
                                No projects currently assigned to this department.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {projectsList.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/projects/${project.id}`}
                                        className="bg-card border border-border hover:border-primary/40 rounded-xl p-5 transition group space-y-3 block shadow-2xs"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Folder className="w-4 h-4 text-primary" />
                                                <span className="font-bold text-foreground text-sm group-hover:text-primary transition">
                                                    {project.name}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                                                {project.status}
                                            </span>
                                        </div>
                                        {project.description && (
                                            <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
                                        )}
                                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                                            <span>Lead: {project.lead ? project.lead.name : 'Unassigned'}</span>
                                            <div className="flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                                                View Project <ChevronRight className="w-3.5 h-3.5 ml-1" />
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">Department Documents</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Files, mandates, and documentation attached to {department.name}.</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                {/* Grid vs Table View Mode Switcher */}
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

                                <Button onClick={() => setIsUploadDocOpen(true)} size="sm" className="bg-primary text-primary-foreground text-xs font-semibold gap-1.5">
                                    <Upload className="w-4 h-4" /> + Upload Document
                                </Button>
                            </div>
                        </div>

                        {/* Documents Container */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            {documentsList.length === 0 ? (
                                <div className="text-center py-10 space-y-3">
                                    <FileText className="w-10 h-10 mx-auto text-muted-foreground/40" />
                                    <p className="text-xs text-muted-foreground">No documents uploaded for this department yet.</p>
                                    <Button onClick={() => setIsUploadDocOpen(true)} size="sm" variant="outline" className="text-xs">
                                        <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload First Document
                                    </Button>
                                </div>
                            ) : viewMode === 'table' ? (
                                /* Table View */
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-border text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
                                                <th className="pb-3 pr-4">Name</th>
                                                <th className="pb-3 px-4">Type</th>
                                                <th className="pb-3 px-4">Date Uploaded</th>
                                                <th className="pb-3 pl-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/60">
                                            {documentsList.map((doc) => (
                                                <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                                                    <td className="py-3 pr-4 font-medium text-foreground">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="p-2 rounded-lg bg-muted border border-border">
                                                                {getFileIcon(doc.file_type)}
                                                            </div>
                                                            <div>
                                                                <span className="font-semibold text-foreground block truncate max-w-xs">{doc.name}</span>
                                                                <span className="text-[10px] text-muted-foreground block">{formatFileSize(doc.file_size)}</span>
                                                            </div>
                                                        </div>
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
                                    {documentsList.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="bg-muted/30 border border-border hover:border-primary/40 rounded-xl p-4 transition flex flex-col justify-between space-y-3 group shadow-2xs"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <div className="p-3 rounded-xl bg-background border border-border shadow-2xs">
                                                        {getFileIcon(doc.file_type)}
                                                    </div>
                                                    <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[10px] font-bold uppercase border border-border">
                                                        {doc.file_type || 'FILE'}
                                                    </span>
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
                <DialogContent className="sm:max-w-md bg-card border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold flex items-center space-x-2">
                            <UserPlus className="w-5 h-5 text-primary" />
                            <span>Add Member to {department.name}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleAddMember} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">Select Team Member</label>
                            <select
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                required
                            >
                                <option value="">-- Choose workspace user --</option>
                                {workspaceUsers
                                    .filter((u) => !membersList.some((m) => m.id === u.id))
                                    .map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddMemberOpen(false)} className="text-xs">
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" disabled={isSubmittingMember || !selectedUserId} className="bg-primary text-primary-foreground text-xs font-semibold">
                                {isSubmittingMember ? 'Adding...' : 'Assign Member'}
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
