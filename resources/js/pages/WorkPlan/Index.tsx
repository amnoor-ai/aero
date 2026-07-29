import { Head, router } from '@inertiajs/react';
import {
    Plus,
    Calendar,
    Folder,
    Layers,
    ChevronDown,
    ChevronUp,
    Trash2,
    Target,
    BarChart2,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';
import { Button } from '@/components/ui/button';
import { AttachProjectsModal } from '@/components/workplan/AttachProjectsModal';
import { CreateWorkPlanModal } from '@/components/workplan/CreateWorkPlanModal';

interface SprintItem {
    id: number;
    name: string;
    status: string;
    start_date: string;
    end_date: string;
}

interface MilestoneItem {
    id: number;
    name: string;
    status: string;
    due_date: string;
    progress: number;
}

interface ProjectData {
    id: number;
    name: string;
    status: string;
    start_date: string;
    due_date: string;
    progress: number;
    sprints: SprintItem[];
    milestones: MilestoneItem[];
}

interface WorkPlanItem {
    id: number;
    name: string;
    description?: string;
    status: string;
    start_date?: string;
    due_date?: string;
    progress: number;
    projects_count: number;
    projects: ProjectData[];
}

interface ProjectOption {
    id: number;
    name: string;
    status: string;
    progress: number;
}

interface WorkPlanIndexProps {
    workPlans: WorkPlanItem[];
    allProjects: ProjectOption[];
}

export default function WorkPlanIndex({ workPlans = [], allProjects = [] }: WorkPlanIndexProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedWorkPlanForProjects, setSelectedWorkPlanForProjects] = useState<WorkPlanItem | null>(null);
    const [expandedPlanIds, setExpandedPlanIds] = useState<number[]>(workPlans.map((wp) => wp.id));
    const [deletingWorkPlan, setDeletingWorkPlan] = useState<WorkPlanItem | null>(null);

    const toggleExpandPlan = (id: number) => {
        setExpandedPlanIds((prev) =>
            prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
        );
    };

    const handleDeleteWorkPlan = (wp: WorkPlanItem) => {
        setDeletingWorkPlan(wp);
    };

    const formatStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Completed</span>;
            case 'active':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary/20 text-primary border border-primary/30">Active</span>;
            case 'planning':
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">Planning</span>;
            default:
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-muted text-muted-foreground border border-border">On Hold</span>;
        }
    };

    const totalProjectsAttached = workPlans.reduce((sum, wp) => sum + wp.projects_count, 0);

    return (
        <>
            <Head title="Work Plans & Strategic Initiatives - Aero DevPM" />

            <div className="p-6 md:p-8 space-y-6 bg-background text-foreground min-h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center space-x-2">
                            <span>Work Plans & Strategic Portfolio</span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                                {workPlans.length} Initiatives
                            </span>
                        </h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            High-level strategic portfolio manager to tie multiple projects, track aggregated progress, and execute roadmaps.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold h-9 px-4 shadow-md shadow-primary/20"
                        >
                            <Plus className="w-4 h-4 mr-1.5" /> Create Work Plan
                        </Button>
                    </div>
                </div>

                {/* Metric Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-border bg-card/60 space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                            <span>Strategic Initiatives</span>
                            <Layers className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-2xl font-black text-foreground">{workPlans.length}</p>
                        <p className="text-[11px] text-muted-foreground">Portfolio containers active</p>
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-card/60 space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                            <span>Attached Projects</span>
                            <Folder className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-2xl font-black text-foreground">{totalProjectsAttached}</p>
                        <p className="text-[11px] text-muted-foreground">Projects tied across initiatives</p>
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-card/60 space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                            <span>Overall Execution Rate</span>
                            <BarChart2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-2xl font-black text-foreground">
                            {workPlans.length > 0
                                ? Math.round(workPlans.reduce((sum, wp) => sum + wp.progress, 0) / workPlans.length)
                                : 0}%
                        </p>
                        <p className="text-[11px] text-muted-foreground">Average portfolio progress</p>
                    </div>
                </div>

                {/* Work Plans List */}
                <div className="space-y-4">
                    {workPlans.length === 0 ? (
                        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/40 space-y-3">
                            <Layers className="w-10 h-10 text-muted-foreground mx-auto" />
                            <h3 className="text-base font-bold text-foreground">No Work Plans Created</h3>
                            <p className="text-xs text-muted-foreground max-w-md mx-auto">
                                Create your first strategic Work Plan initiative to tie multiple projects together and track overall roadmap completion.
                            </p>
                            <Button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="bg-primary text-primary-foreground text-xs font-bold h-9 px-4"
                            >
                                <Plus className="w-4 h-4 mr-1.5" /> Create Work Plan
                            </Button>
                        </div>
                    ) : (
                        workPlans.map((wp) => {
                            const isExpanded = expandedPlanIds.includes(wp.id);

                            return (
                                <div key={wp.id} className="border border-border/80 rounded-2xl bg-card overflow-hidden shadow-2xs transition">
                                    {/* Work Plan Card Header */}
                                    <div className="p-5 border-b border-border/60 bg-muted/10 space-y-3">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                            <div className="space-y-1 min-w-0">
                                                <div className="flex items-center space-x-2.5">
                                                    <h2 className="text-base font-bold text-foreground truncate">{wp.name}</h2>
                                                    {formatStatusBadge(wp.status)}
                                                </div>
                                                {wp.description && (
                                                    <p className="text-xs text-muted-foreground leading-relaxed">{wp.description}</p>
                                                )}
                                            </div>

                                            {/* Top Card Controls */}
                                            <div className="flex items-center space-x-2 shrink-0">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedWorkPlanForProjects(wp)}
                                                    className="h-8 text-xs font-bold border-border"
                                                >
                                                    <Folder className="w-3.5 h-3.5 mr-1.5 text-primary" />
                                                    <span>Manage Projects ({wp.projects_count})</span>
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteWorkPlan(wp)}
                                                    className="h-8 px-2 text-rose-500 hover:bg-rose-500/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>

                                                <button
                                                    onClick={() => toggleExpandPlan(wp.id)}
                                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                                                >
                                                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Progress Bar & Date Range Bar */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/40 text-xs">
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-muted-foreground">Aggregated Portfolio Progress</span>
                                                    <span className="font-extrabold text-primary">{wp.progress}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all duration-500 rounded-full"
                                                        style={{ width: `${wp.progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <div className="flex items-center space-x-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                                    <span>
                                                        Timeline: {wp.start_date || 'N/A'} — {wp.due_date || 'N/A'}
                                                    </span>
                                                </div>
                                                <span className="font-bold text-foreground">{wp.projects_count} Tied Projects</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Projects Breakdown */}
                                    {isExpanded && (
                                        <div className="p-5 space-y-4 bg-card">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center space-x-1.5">
                                                    <Folder className="w-3.5 h-3.5 text-primary" />
                                                    <span>Attached Projects & Execution Detail</span>
                                                </h3>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedWorkPlanForProjects(wp)}
                                                    className="h-7 text-xs font-bold text-primary hover:underline"
                                                >
                                                    <Plus className="w-3 h-3 mr-1" /> Add/Remove Projects
                                                </Button>
                                            </div>

                                            {wp.projects.length === 0 ? (
                                                <div className="p-6 border border-dashed border-border/60 rounded-xl text-center text-xs text-muted-foreground italic">
                                                    No projects attached to this work plan yet. Click "Manage Projects" to attach existing projects.
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {wp.projects.map((proj) => (
                                                        <div key={proj.id} className="p-4 border border-border/80 rounded-xl bg-muted/10 space-y-3 hover:border-primary/40 transition">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-2 min-w-0">
                                                                    <Folder className="w-4 h-4 text-primary shrink-0" />
                                                                    <a
                                                                        href={`/projects/${proj.id}`}
                                                                        className="font-bold text-xs text-foreground hover:text-primary transition truncate"
                                                                    >
                                                                        {proj.name}
                                                                    </a>
                                                                </div>
                                                                <span className="text-[10px] font-extrabold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                                                                    {proj.progress}% Done
                                                                </span>
                                                            </div>

                                                            {/* Project Progress Bar */}
                                                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-primary transition-all duration-300 rounded-full"
                                                                    style={{ width: `${proj.progress}%` }}
                                                                />
                                                            </div>

                                                            {/* Milestones Quick Info */}
                                                            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                                                                <div className="flex items-center space-x-1">
                                                                    <Target className="w-3 h-3 text-muted-foreground" />
                                                                    <span>{proj.milestones?.length || 0} Milestones</span>
                                                                </div>
                                                                <span className="text-[10px] text-muted-foreground">Active Scope</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Create Work Plan Modal */}
            <CreateWorkPlanModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                allProjects={allProjects}
            />

            {/* Attach Projects Modal */}
            <AttachProjectsModal
                isOpen={!!selectedWorkPlanForProjects}
                onClose={() => setSelectedWorkPlanForProjects(null)}
                workPlan={selectedWorkPlanForProjects}
                allProjects={allProjects}
            />

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                isOpen={!!deletingWorkPlan}
                onClose={() => setDeletingWorkPlan(null)}
                onConfirm={() => {
                    if (deletingWorkPlan) {
                        router.delete(`/work-plans/${deletingWorkPlan.id}`, {
                            preserveScroll: true,
                            onSuccess: () => {
                                toast.success(`Work plan "${deletingWorkPlan.name}" deleted.`);
                                setDeletingWorkPlan(null);
                            },
                        });
                    }
                }}
                title="Delete Work Plan"
                itemName={deletingWorkPlan?.name}
            />
        </>
    );
}
