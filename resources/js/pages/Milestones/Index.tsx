import { Head, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    Calendar,
    Folder,
    Layers,
    Target,
    Pencil,
    Trash2,
    Eye,
    List,
    Grid,
    CheckCircle2,
    Clock,
    AlertCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface MilestoneItem {
    id: number;
    name: string;
    description?: string;
    start_date?: string;
    due_date?: string;
    status: 'active' | 'completed' | 'upcoming' | 'on_hold';
    progress?: number;
    project_id?: number;
    work_plan_id?: number;
    project?: { id: number; name: string };
    work_plan?: { id: number; name: string };
    tasks_count?: number;
}

interface MilestonesIndexProps {
    milestones: MilestoneItem[];
    projects: { id: number; name: string }[];
    workPlans: { id: number; name: string }[];
    filters: { search?: string; status?: string };
}

export default function MilestonesIndex({
    milestones = [],
    projects = [],
    workPlans = [],
    filters = {},
}: MilestonesIndexProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    // Create / Edit Modal State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState<MilestoneItem | null>(null);

    const [formName, setFormName] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formOwnerType, setFormOwnerType] = useState<'project' | 'work_plan'>('project');
    const [formProjectId, setFormProjectId] = useState<string>('');
    const [formWorkPlanId, setFormWorkPlanId] = useState<string>('');
    const [formStartDate, setFormStartDate] = useState('');
    const [formDueDate, setFormDueDate] = useState('');
    const [formStatus, setFormStatus] = useState<string>('active');

    // View Detail Modal State
    const [detailMilestone, setDetailMilestone] = useState<MilestoneItem | null>(null);

    // Delete Modal State
    const [deletingMilestone, setDeletingMilestone] = useState<MilestoneItem | null>(null);

    const openCreateModal = () => {
        setEditingMilestone(null);
        setFormName('');
        setFormDescription('');
        setFormOwnerType('project');
        setFormProjectId(projects[0]?.id ? String(projects[0].id) : '');
        setFormWorkPlanId(workPlans[0]?.id ? String(workPlans[0].id) : '');
        setFormStartDate('');
        setFormDueDate('');
        setFormStatus('active');
        setIsFormOpen(true);
    };

    const openEditModal = (m: MilestoneItem) => {
        setEditingMilestone(m);
        setFormName(m.name);
        setFormDescription(m.description || '');

        if (m.work_plan_id) {
            setFormOwnerType('work_plan');
            setFormWorkPlanId(String(m.work_plan_id));
            setFormProjectId('');
        } else {
            setFormOwnerType('project');
            setFormProjectId(m.project_id ? String(m.project_id) : '');
            setFormWorkPlanId('');
        }

        setFormStartDate(m.start_date || '');
        setFormDueDate(m.due_date || '');
        setFormStatus(m.status || 'active');
        setIsFormOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formName.trim()) {
            toast.error('Please enter a milestone name.');

            return;
        }

        const payload = {
            name: formName.trim(),
            description: formDescription.trim() || null,
            owner_type: formOwnerType,
            project_id: formOwnerType === 'project' && formProjectId ? parseInt(formProjectId, 10) : null,
            work_plan_id: formOwnerType === 'work_plan' && formWorkPlanId ? parseInt(formWorkPlanId, 10) : null,
            start_date: formStartDate || null,
            due_date: formDueDate || null,
            status: formStatus,
        };

        if (editingMilestone) {
            router.put(`/milestones/${editingMilestone.id}`, payload, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Milestone updated successfully.');
                    setIsFormOpen(false);
                },
                onError: (err) => {
                    toast.error(Object.values(err)[0] as string || 'Failed to update milestone.');
                },
            });
        } else {
            router.post('/milestones', payload, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Milestone created successfully.');
                    setIsFormOpen(false);
                },
                onError: (err) => {
                    toast.error(Object.values(err)[0] as string || 'Failed to create milestone.');
                },
            });
        }
    };

    const handleDeleteSubmit = () => {
        if (!deletingMilestone) {
            return;
        }

        router.delete(`/milestones/${deletingMilestone.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Milestone deleted successfully.');
                setDeletingMilestone(null);
            },
        });
    };

    const filteredMilestones = milestones.filter((m) => {
        // Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const matchesName = m.name.toLowerCase().includes(query);
            const matchesDesc = (m.description || '').toLowerCase().includes(query);
            const matchesProject = (m.project?.name || '').toLowerCase().includes(query);
            const matchesWorkPlan = (m.work_plan?.name || '').toLowerCase().includes(query);

            if (!matchesName && !matchesDesc && !matchesProject && !matchesWorkPlan) {
                return false;
            }
        }

        // Status Filter
        if (statusFilter !== 'all' && m.status !== statusFilter) {
            return false;
        }

        return true;
    });

    const formatStatusBadge = (statusName: string) => {
        switch (statusName) {
            case 'completed':
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                );
            case 'upcoming':
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3" /> Upcoming
                    </span>
                );
            case 'on_hold':
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                        <AlertCircle className="w-3 h-3" /> On Hold
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/30 flex items-center gap-1 w-fit">
                        <Target className="w-3 h-3" /> Active
                    </span>
                );
        }
    };

    return (
        <>
            <Head title="Milestones - Aero DevPM" />

            <div className="p-6 md:p-8 space-y-6 bg-background text-foreground min-h-screen">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" />
                            <span>Milestones</span>
                        </h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            Track project phase targets, delivery deadlines, and task completion progress.
                        </p>
                    </div>

                    <Button
                        onClick={openCreateModal}
                        className="bg-primary text-primary-foreground font-semibold text-xs shadow-lg h-9 px-4"
                    >
                        <Plus className="w-4 h-4 mr-1.5" /> Create Milestone
                    </Button>
                </div>

                {/* Controls & Filter Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-3 rounded-2xl border border-border">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative w-full sm:w-72">
                            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search milestones..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-9 bg-background border border-input rounded-xl pl-9 pr-3 text-xs text-foreground focus:outline-none focus:border-primary"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-9 px-3 bg-background border border-input rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="on_hold">On Hold</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    {/* View Switcher Toggle */}
                    <div className="flex bg-muted/40 border border-border p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Grid className="w-3.5 h-3.5" /> Grid
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <List className="w-3.5 h-3.5" /> List
                        </button>
                    </div>
                </div>

                {/* Content Display */}
                {filteredMilestones.length === 0 ? (
                    <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-3">
                        <Target className="w-10 h-10 text-muted-foreground/40 mx-auto" />
                        <h3 className="text-sm font-bold text-foreground">No Milestones Found</h3>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                            {searchQuery ? `No milestones match "${searchQuery}".` : 'Create milestones to track delivery targets and release goals.'}
                        </p>
                        <Button onClick={openCreateModal} size="sm" className="mt-2 text-xs font-bold bg-primary text-primary-foreground">
                            <Plus className="w-3.5 h-3.5 mr-1" /> Create Milestone
                        </Button>
                    </div>
                ) : viewMode === 'grid' ? (
                    /* GRID VIEW */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredMilestones.map((m) => (
                            <div
                                key={m.id}
                                className="p-5 bg-card border border-border/80 hover:border-primary/40 rounded-2xl shadow-2xs transition flex flex-col justify-between space-y-4"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="space-y-1">
                                            {formatStatusBadge(m.status)}
                                            <h3 className="text-sm font-bold text-foreground leading-snug">{m.name}</h3>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center space-x-1 shrink-0">
                                            <button
                                                onClick={() => setDetailMilestone(m)}
                                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                                                title="View Details"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(m)}
                                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                                                title="Edit Milestone"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setDeletingMilestone(m)}
                                                className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition"
                                                title="Delete Milestone"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {m.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                            {m.description}
                                        </p>
                                    )}

                                    {/* Belonging Badge */}
                                    <div className="flex items-center space-x-2 text-xs font-semibold text-foreground pt-1">
                                        {m.work_plan ? (
                                            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1.5">
                                                <Layers className="w-3.5 h-3.5" /> Work Plan: {m.work_plan.name}
                                            </span>
                                        ) : m.project ? (
                                            <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
                                                <Folder className="w-3.5 h-3.5" /> Project: {m.project.name}
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-1 rounded-lg bg-muted text-muted-foreground italic">Standalone</span>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Info & Progress */}
                                <div className="space-y-2 pt-3 border-t border-border/60">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                                        <div className="flex items-center space-x-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span>
                                                {m.start_date ? `${m.start_date} – ` : ''}{m.due_date || 'No Deadline'}
                                            </span>
                                        </div>
                                        <span className="font-bold text-foreground">{m.progress || 0}%</span>
                                    </div>

                                    <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-primary h-full rounded-full transition-all duration-500"
                                            style={{ width: `${m.progress || 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* LIST VIEW */
                    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-muted-foreground">
                                <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
                                    <tr>
                                        <th className="p-3.5">Milestone Name</th>
                                        <th className="p-3.5">Belongs To</th>
                                        <th className="p-3.5">Date Range</th>
                                        <th className="p-3.5">Status</th>
                                        <th className="p-3.5">Tasks & Progress</th>
                                        <th className="p-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60">
                                    {filteredMilestones.map((m) => (
                                        <tr key={m.id} className="hover:bg-muted/30 transition">
                                            <td className="p-3.5 font-bold text-foreground">
                                                <div>
                                                    <p className="text-xs">{m.name}</p>
                                                    {m.description && (
                                                        <p className="text-[11px] text-muted-foreground font-normal truncate max-w-xs">{m.description}</p>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="p-3.5">
                                                {m.work_plan ? (
                                                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold text-[11px] border border-purple-500/20">
                                                        Work Plan: {m.work_plan.name}
                                                    </span>
                                                ) : m.project ? (
                                                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[11px] border border-primary/20">
                                                        Project: {m.project.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground italic text-[11px]">Standalone</span>
                                                )}
                                            </td>

                                            <td className="p-3.5 font-mono text-xs">
                                                <div className="flex items-center space-x-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                                    <span>{m.start_date ? `${m.start_date} – ` : ''}{m.due_date || 'No Date'}</span>
                                                </div>
                                            </td>

                                            <td className="p-3.5">
                                                {formatStatusBadge(m.status)}
                                            </td>

                                            <td className="p-3.5">
                                                <div className="space-y-1 w-32">
                                                    <div className="flex justify-between text-[10px] font-mono">
                                                        <span>{m.tasks_count || 0} tasks</span>
                                                        <span className="font-bold text-foreground">{m.progress || 0}%</span>
                                                    </div>
                                                    <div className="w-full bg-muted/60 h-1 rounded-full overflow-hidden">
                                                        <div className="bg-primary h-full rounded-full" style={{ width: `${m.progress || 0}%` }} />
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-3.5 text-right">
                                                <div className="flex items-center justify-end space-x-1">
                                                    <button
                                                        onClick={() => setDetailMilestone(m)}
                                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(m)}
                                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                                                        title="Edit Milestone"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingMilestone(m)}
                                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition"
                                                        title="Delete Milestone"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* CREATE / EDIT MILESTONE MODAL */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-md">
                    <form onSubmit={handleFormSubmit}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-primary" />
                                <span>{editingMilestone ? 'Edit Milestone' : 'Create New Milestone'}</span>
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {/* Milestone Name */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-foreground block">
                                    Milestone Title <span className="text-rose-500">*</span>
                                </label>
                                <Input
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="e.g. Beta 1.0 Release, Design Freeze"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-foreground block">Description</label>
                                <textarea
                                    className="w-full p-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:border-primary min-h-[80px]"
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                    placeholder="Target scope and deliverables..."
                                />
                            </div>

                            {/* Owner Option Switcher */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-foreground block">Belongs To</label>
                                <div className="grid grid-cols-2 gap-2 bg-muted/40 p-1 rounded-xl border border-border">
                                    <button
                                        type="button"
                                        onClick={() => setFormOwnerType('project')}
                                        className={`py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                                            formOwnerType === 'project' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                                        }`}
                                    >
                                        <Folder className="w-3.5 h-3.5" /> Project
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormOwnerType('work_plan')}
                                        className={`py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                                            formOwnerType === 'work_plan' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                                        }`}
                                    >
                                        <Layers className="w-3.5 h-3.5" /> Work Plan
                                    </button>
                                </div>

                                {/* Dynamic Dropdown */}
                                {formOwnerType === 'project' ? (
                                    <select
                                        value={formProjectId}
                                        onChange={(e) => setFormProjectId(e.target.value)}
                                        className="w-full h-9.5 px-3 bg-background border border-input rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                                    >
                                        <option value="">Select Project</option>
                                        {projects.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <select
                                        value={formWorkPlanId}
                                        onChange={(e) => setFormWorkPlanId(e.target.value)}
                                        className="w-full h-9.5 px-3 bg-background border border-input rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                                    >
                                        <option value="">Select Work Plan</option>
                                        {workPlans.map((wp) => (
                                            <option key={wp.id} value={wp.id}>{wp.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Dates Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-foreground block">Start Date</label>
                                    <Input
                                        type="date"
                                        value={formStartDate}
                                        onChange={(e) => setFormStartDate(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-foreground block">Due Date</label>
                                    <Input
                                        type="date"
                                        value={formDueDate}
                                        onChange={(e) => setFormDueDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-foreground block">Status</label>
                                <select
                                    value={formStatus}
                                    onChange={(e) => setFormStatus(e.target.value)}
                                    className="w-full h-9.5 px-3 bg-background border border-input rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                                >
                                    <option value="active">Active</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="on_hold">On Hold</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div className="pt-3 border-t border-border flex items-center justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="h-9 text-xs">
                                    Cancel
                                </Button>
                                <Button type="submit" className="h-9 px-4 bg-primary text-primary-foreground font-bold text-xs">
                                    {editingMilestone ? 'Save Changes' : 'Create Milestone'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* DETAIL VIEW MODAL */}
            {detailMilestone && (
                <Dialog open={!!detailMilestone} onOpenChange={() => setDetailMilestone(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-primary" />
                                <span>Milestone Details</span>
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-2">
                            <div className="space-y-1">
                                {formatStatusBadge(detailMilestone.status)}
                                <h3 className="text-base font-bold text-foreground">{detailMilestone.name}</h3>
                                {detailMilestone.description && (
                                    <p className="text-xs text-muted-foreground mt-1">{detailMilestone.description}</p>
                                )}
                            </div>

                            <div className="p-3 border border-border rounded-xl bg-muted/20 space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground font-semibold">Belongs to:</span>
                                    <span className="font-bold text-foreground">
                                        {detailMilestone.work_plan
                                            ? `Work Plan: ${detailMilestone.work_plan.name}`
                                            : detailMilestone.project
                                                ? `Project: ${detailMilestone.project.name}`
                                                : 'Standalone'}
                                    </span>
                                </div>

                                <div className="flex justify-between font-mono">
                                    <span className="text-muted-foreground font-semibold">Start Date:</span>
                                    <span className="text-foreground">{detailMilestone.start_date || 'N/A'}</span>
                                </div>

                                <div className="flex justify-between font-mono">
                                    <span className="text-muted-foreground font-semibold">Due Date:</span>
                                    <span className="text-foreground">{detailMilestone.due_date || 'No Deadline'}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground font-semibold">Tasks Count:</span>
                                    <span className="font-bold text-foreground">{detailMilestone.tasks_count || 0} Tasks</span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-mono">
                                    <span>Milestone Completion Progress</span>
                                    <span className="font-bold text-primary">{detailMilestone.progress || 0}%</span>
                                </div>
                                <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full rounded-full" style={{ width: `${detailMilestone.progress || 0}%` }} />
                                </div>
                            </div>

                            <div className="pt-3 border-t border-border flex justify-end">
                                <Button size="sm" variant="outline" onClick={() => setDetailMilestone(null)} className="h-8 text-xs font-semibold">
                                    Close
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {deletingMilestone && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full space-y-4 text-foreground shadow-2xl">
                        <div className="flex items-center space-x-3 text-rose-500">
                            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                                <Trash2 className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-sm">Delete Milestone</h3>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Are you sure you want to delete <strong className="text-foreground">"{deletingMilestone.name}"</strong>? This action cannot be undone.
                        </p>

                        <div className="flex items-center justify-end space-x-2 pt-2">
                            <Button variant="outline" size="sm" onClick={() => setDeletingMilestone(null)} className="h-8 text-xs">
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleDeleteSubmit} className="h-8 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs">
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

MilestonesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Milestones',
            href: '/milestones',
        },
    ],
};
