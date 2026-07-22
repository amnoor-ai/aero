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
    ShieldCheck,
    Briefcase,
    Calendar,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditDepartmentModal } from '@/components/departments/EditDepartmentModal';

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
    mandate_file_path: string | null;
    mandate_file_name: string | null;
    status: string;
    members?: UserItem[];
    projects?: ProjectItem[];
    members_count?: number;
    projects_count?: number;
    updated_at: string;
}

interface DepartmentShowProps {
    department: DepartmentDetail;
    workspaceUsers: UserItem[];
}

export default function DepartmentShow({ department, workspaceUsers = [] }: DepartmentShowProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'projects' | 'mandate'>('overview');
    const [isEditOpen, setIsEditOpen] = useState(false);

    const membersList = department.members || [];
    const projectsList = department.projects || [];

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
                        {department.mandate_file_name && (
                            <a
                                href={`/departments/${department.id}/mandate`}
                                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 text-xs font-semibold border border-purple-500/30 transition"
                            >
                                <Download className="w-4 h-4 text-purple-400" />
                                <span>Download Mandate Document</span>
                            </a>
                        )}

                        <Button onClick={() => setIsEditOpen(true)} variant="outline" size="sm" className="text-xs">
                            <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit Department
                        </Button>
                    </div>
                </div>

                {/* Hero Header Card */}
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start space-x-4">
                            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center space-x-3">
                                    <span className="px-2.5 py-1 rounded-md bg-purple-500/15 text-purple-400 font-mono font-extrabold text-xs border border-purple-500/30">
                                        {department.code}
                                    </span>
                                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                                        {department.name}
                                    </h1>
                                    <span
                                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                                            department.status === 'active'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                        }`}
                                    >
                                        {department.status}
                                    </span>
                                </div>

                                {department.location && (
                                    <div className="flex items-center space-x-1 text-xs text-muted-foreground pt-0.5">
                                        <MapPin className="w-3.5 h-3.5 text-purple-400" />
                                        <span>{department.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats overview strip */}
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

                        <div className="p-3.5 bg-muted/40 rounded-xl border border-border/60">
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Assigned Members</p>
                            <p className="text-lg font-extrabold text-foreground mt-0.5">{membersList.length}</p>
                        </div>

                        <div className="p-3.5 bg-muted/40 rounded-xl border border-border/60">
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Active Projects</p>
                            <p className="text-lg font-extrabold text-foreground mt-0.5">{projectsList.length}</p>
                        </div>

                        <div className="p-3.5 bg-muted/40 rounded-xl border border-border/60">
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Mandate Attachment</p>
                            <p className="text-xs font-bold text-purple-300 truncate mt-1">
                                {department.mandate_file_name || 'No Document'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-border space-x-6 text-sm font-semibold">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-3 transition relative ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Overview & Mandate
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
                        onClick={() => setActiveTab('mandate')}
                        className={`pb-3 transition relative ${activeTab === 'mandate' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Mandate & Compliance
                    </button>
                </div>

                {/* Tab Contents */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
                                <h3 className="text-base font-bold text-foreground flex items-center space-x-2">
                                    <Briefcase className="w-4 h-4 text-purple-400" />
                                    <span>Department Description & Responsibilities</span>
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {department.description || 'No detailed mandate description has been configured for this department.'}
                                </p>
                            </div>

                            {/* Mandate file quick download banner */}
                            {department.mandate_file_name && (
                                <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-foreground">Official Department Mandate</h4>
                                            <p className="text-xs text-purple-300/80">{department.mandate_file_name}</p>
                                        </div>
                                    </div>
                                    <a
                                        href={`/departments/${department.id}/mandate`}
                                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-lg shadow-purple-500/20"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>Download File</span>
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Info Card */}
                        <div className="space-y-6">
                            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Department Info</h4>
                                <div className="space-y-3 text-xs">
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
                                        <span className="font-mono font-bold text-purple-400">{department.code}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'members' && (
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                        <h3 className="text-base font-bold text-foreground">Assigned Department Members</h3>
                        {membersList.length === 0 ? (
                            <p className="text-xs text-muted-foreground py-6 text-center">No team members assigned to this department yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {membersList.map((member) => (
                                    <div key={member.id} className="p-3.5 bg-muted/40 rounded-xl border border-border flex items-center space-x-3">
                                        <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold border border-primary/30">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div className="truncate">
                                            <p className="text-xs font-bold text-foreground truncate">{member.name}</p>
                                            <p className="text-[10px] text-muted-foreground truncate">{member.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'projects' && (
                    <div className="space-y-4">
                        {projectsList.length === 0 ? (
                            <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground text-xs">
                                No projects currently assigned to this department.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {projectsList.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/projects/${project.id}`}
                                        className="bg-card border border-border hover:border-purple-500/40 rounded-2xl p-5 transition group space-y-3 block"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Folder className="w-4 h-4 text-purple-400" />
                                                <span className="font-bold text-foreground text-sm group-hover:text-purple-400 transition">
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
                                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                                            <span>Lead: {project.lead ? project.lead.name : 'Unassigned'}</span>
                                            <div className="flex items-center text-purple-400 font-semibold group-hover:translate-x-1 transition-transform">
                                                View Project <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'mandate' && (
                    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Mandate & Organizational Compliance</h3>
                                <p className="text-xs text-muted-foreground">Official charter and documentation for {department.name}</p>
                            </div>
                        </div>

                        {department.mandate_file_name ? (
                            <div className="p-6 rounded-2xl bg-muted/40 border border-border flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center space-x-4">
                                    <div className="p-4 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground">{department.mandate_file_name}</h4>
                                        <p className="text-xs text-muted-foreground">Stored securely in workspace private vault</p>
                                    </div>
                                </div>

                                <a
                                    href={`/departments/${department.id}/mandate`}
                                    className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow-lg"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Download Mandate Document</span>
                                </a>
                            </div>
                        ) : (
                            <div className="p-8 text-center rounded-2xl border border-dashed border-border text-muted-foreground space-y-2">
                                <FileText className="w-8 h-8 mx-auto text-muted-foreground/50" />
                                <p className="text-xs font-semibold">No Mandate Document Attached</p>
                                <p className="text-[11px] max-w-sm mx-auto">
                                    You can upload a mandate file (PDF or DOCX) by editing this department details.
                                </p>
                                <Button onClick={() => setIsEditOpen(true)} size="sm" variant="outline" className="mt-2 text-xs">
                                    Upload Mandate Document
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Department Modal */}
            <EditDepartmentModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                department={department}
                workspaceUsers={workspaceUsers}
            />
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
