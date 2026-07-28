import { useForm } from '@inertiajs/react';
import {
    X,
    CheckCircle2,
    Briefcase,
    Building2,
    User as UserIcon,
    Layers,
    CheckSquare,
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    Link as LinkIcon,
    Code,
    Calendar,
    ChevronRight,
    ChevronLeft,
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CreateTaskWizardModalProps {
    isOpen: boolean;
    onClose: () => void;
    projects?: { id: number; name: string }[];
    departments?: { id: number; name: string }[];
    users?: { id: number; name: string }[];
    milestones?: { id: number; name: string; project_id: number }[];
    boardColumns?: { id: number; name: string; project_id: number }[];
}

export function CreateTaskWizardModal({
    isOpen,
    onClose,
    projects = [],
    departments = [],
    users = [],
    milestones = [],
    boardColumns = [],
}: CreateTaskWizardModalProps) {
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [descTab, setDescTab] = useState<'write' | 'preview'>('write');

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        context: 'project', // 'project' | 'department' | 'other'
        type: 'task', // 'task' | 'activity'
        priority: 'medium', // 'low' | 'medium' | 'high' | 'urgent'
        description: '',
        project_id: projects[0]?.id || '',
        department_id: '',
        milestone_id: '',
        board_column_id: '',
        assignee_id: '',
        follower_id: '',
        due_date: new Date().toISOString().split('T')[0],
        start_date: new Date().toISOString().split('T')[0],
        story_points: 1,
        kra: '',
        kpi: '',
    });

    if (!isOpen) {
return null;
}

    const filteredMilestones = data.project_id
        ? milestones.filter((m) => String(m.project_id) === String(data.project_id))
        : milestones;

    const filteredColumns = data.project_id
        ? boardColumns.filter((c) => String(c.project_id) === String(data.project_id))
        : boardColumns;

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Enforce that submission ONLY happens on Step 3 Review
        if (currentStep < 3) {
            nextStep();

            return;
        }

        post('/tasks', {
            onSuccess: () => {
                reset();
                setCurrentStep(1);
                onClose();
            },
        });
    };

    const nextStep = () => {
        if (currentStep < 3) {
            setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
        }
    };

    const insertMarkdown = (prefix: string, suffix: string = '') => {
        setData('description', `${data.description}${prefix}selected_text${suffix}`);
    };

    const selectedProjectName = projects.find((p) => String(p.id) === String(data.project_id))?.name || 'Not set';
    const selectedDepartmentName = departments.find((d) => String(d.id) === String(data.department_id))?.name || 'Not set';
    const selectedAssigneeName = users.find((u) => String(u.id) === String(data.assignee_id))?.name || 'Unassigned';
    const selectedMilestoneName = milestones.find((m) => String(m.id) === String(data.milestone_id))?.name || 'None';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-card text-card-foreground rounded-xl border border-border shadow-2xl overflow-hidden my-8">
                {/* Header (Clean title without icons, strictly global theme colors) */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
                    <div>
                        <h2 className="text-lg font-bold text-foreground tracking-tight">
                            Create {data.type === 'activity' ? 'Activity' : 'Task'}
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Follow the wizard steps to configure task details, links, and review before submission.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Step Indicator Bar */}
                <div className="px-8 py-5 border-b border-border bg-card">
                    <div className="flex items-center justify-between max-w-2xl mx-auto">
                        {/* Step 1 */}
                        <div
                            onClick={() => setCurrentStep(1)}
                            className="flex items-center space-x-3 cursor-pointer group"
                        >
                            <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                                    currentStep === 1
                                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                        : currentStep > 1
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                {currentStep > 1 ? <CheckCircle2 className="w-4 h-4 text-primary" /> : '1'}
                            </div>
                            <span
                                className={`text-xs font-semibold ${
                                    currentStep === 1 ? 'text-foreground' : 'text-muted-foreground'
                                }`}
                            >
                                1. Details
                            </span>
                        </div>

                        <div className="flex-1 h-[2px] mx-4 bg-border">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: currentStep >= 2 ? '100%' : '0%' }}
                            />
                        </div>

                        {/* Step 2 */}
                        <div
                            onClick={() => setCurrentStep(2)}
                            className="flex items-center space-x-3 cursor-pointer group"
                        >
                            <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                                    currentStep === 2
                                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                        : currentStep > 2
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                {currentStep > 2 ? <CheckCircle2 className="w-4 h-4 text-primary" /> : '2'}
                            </div>
                            <span
                                className={`text-xs font-semibold ${
                                    currentStep === 2 ? 'text-foreground' : 'text-muted-foreground'
                                }`}
                            >
                                2. Context & Links
                            </span>
                        </div>

                        <div className="flex-1 h-[2px] mx-4 bg-border">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: currentStep >= 3 ? '100%' : '0%' }}
                            />
                        </div>

                        {/* Step 3 */}
                        <div
                            onClick={() => setCurrentStep(3)}
                            className="flex items-center space-x-3 cursor-pointer group"
                        >
                            <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                                    currentStep === 3
                                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                3
                            </div>
                            <span
                                className={`text-xs font-semibold ${
                                    currentStep === 3 ? 'text-foreground' : 'text-muted-foreground'
                                }`}
                            >
                                3. Review
                            </span>
                        </div>
                    </div>
                </div>

                {/* Form Content Body */}
                <form onSubmit={handleFormSubmit} className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* ================= STEP 1: DETAILS ================= */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <h3 className="text-base font-bold text-foreground">Task Details</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Provide the task title, context, priority, and rich description.
                                </p>
                            </div>

                            {/* Name / Title */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-foreground">
                                    Title / Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter title..."
                                    className="w-full px-3.5 py-2.5 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/60"
                                />
                                {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
                            </div>

                            {/* Context Cards Selector */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-foreground">
                                    Context Ownership <span className="text-rose-500">*</span>
                                </label>
                                <p className="text-[11px] text-muted-foreground">
                                    Select where this task belongs in your workspace structure.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                                    {/* Project Card */}
                                    <div
                                        onClick={() => setData('context', 'project')}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                                            data.context === 'project'
                                                ? 'bg-primary/10 border-primary ring-1 ring-primary'
                                                : 'bg-card border-border hover:border-muted-foreground/40'
                                        }`}
                                    >
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                                            <Briefcase className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-foreground">Project</h4>
                                            <p className="text-[11px] text-muted-foreground mt-0.5">Belongs to a project</p>
                                        </div>
                                    </div>

                                    {/* Department Card */}
                                    <div
                                        onClick={() => setData('context', 'department')}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                                            data.context === 'department'
                                                ? 'bg-primary/10 border-primary ring-1 ring-primary'
                                                : 'bg-card border-border hover:border-muted-foreground/40'
                                        }`}
                                    >
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-foreground">Department</h4>
                                            <p className="text-[11px] text-muted-foreground mt-0.5">Internal dept activity</p>
                                        </div>
                                    </div>

                                    {/* Other Card */}
                                    <div
                                        onClick={() => setData('context', 'other')}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                                            data.context === 'other'
                                                ? 'bg-primary/10 border-primary ring-1 ring-primary'
                                                : 'bg-card border-border hover:border-muted-foreground/40'
                                        }`}
                                    >
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                                            <UserIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-foreground">Other</h4>
                                            <p className="text-[11px] text-muted-foreground mt-0.5">Assigned to you</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Priority Level */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-foreground">Priority Level</label>
                                <div className="flex flex-wrap gap-2">
                                    {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setData('priority', p)}
                                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
                                                data.priority === p
                                                    ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                                                    : 'bg-background text-muted-foreground border-border hover:text-foreground'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description Editor with Write / Preview Tabs */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold text-foreground">Description</label>
                                    <div className="flex items-center bg-muted/40 border border-border rounded-lg p-0.5">
                                        <button
                                            type="button"
                                            onClick={() => setDescTab('write')}
                                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                                                descTab === 'write'
                                                    ? 'bg-card text-foreground shadow-xs font-bold'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            Write
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDescTab('preview')}
                                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                                                descTab === 'preview'
                                                    ? 'bg-card text-foreground shadow-xs font-bold'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            Preview
                                        </button>
                                    </div>
                                </div>

                                <div className="border border-input rounded-xl overflow-hidden bg-background">
                                    {/* Formatting Toolbar */}
                                    {descTab === 'write' && (
                                        <div className="flex items-center flex-wrap gap-1 px-3 py-2 border-b border-border bg-muted/20 text-muted-foreground">
                                            <button
                                                type="button"
                                                onClick={() => insertMarkdown('**', '**')}
                                                className="p-1.5 hover:text-foreground hover:bg-muted rounded"
                                                title="Bold"
                                            >
                                                <Bold className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => insertMarkdown('*', '*')}
                                                className="p-1.5 hover:text-foreground hover:bg-muted rounded"
                                                title="Italic"
                                            >
                                                <Italic className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => insertMarkdown('~', '~')}
                                                className="p-1.5 hover:text-foreground hover:bg-muted rounded"
                                                title="Strikethrough"
                                            >
                                                <Strikethrough className="w-3.5 h-3.5" />
                                            </button>
                                            <div className="w-[1px] h-4 bg-border mx-1" />
                                            <button
                                                type="button"
                                                onClick={() => insertMarkdown('- ')}
                                                className="p-1.5 hover:text-foreground hover:bg-muted rounded"
                                                title="Bullet List"
                                            >
                                                <List className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => insertMarkdown('1. ')}
                                                className="p-1.5 hover:text-foreground hover:bg-muted rounded"
                                                title="Numbered List"
                                            >
                                                <ListOrdered className="w-3.5 h-3.5" />
                                            </button>
                                            <div className="w-[1px] h-4 bg-border mx-1" />
                                            <button
                                                type="button"
                                                onClick={() => insertMarkdown('[', '](url)')}
                                                className="p-1.5 hover:text-foreground hover:bg-muted rounded"
                                                title="Link"
                                            >
                                                <LinkIcon className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => insertMarkdown('```\n', '\n```')}
                                                className="p-1.5 hover:text-foreground hover:bg-muted rounded"
                                                title="Code Block"
                                            >
                                                <Code className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}

                                    {/* Textarea or Preview Body */}
                                    {descTab === 'write' ? (
                                        <textarea
                                            rows={4}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Write task details, specifications, or notes..."
                                            className="w-full p-3.5 bg-transparent border-none text-xs text-foreground focus:outline-none placeholder:text-muted-foreground/60 resize-y"
                                        />
                                    ) : (
                                        <div className="p-4 text-xs text-foreground min-h-[110px] whitespace-pre-wrap">
                                            {data.description || <span className="text-muted-foreground italic">No description provided yet.</span>}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Assignments Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">Assigned To</label>
                                    <select
                                        value={data.assignee_id}
                                        onChange={(e) => setData('assignee_id', e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                                    >
                                        <option value="">Select Assignee...</option>
                                        {users.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground">Followed By / Watchers</label>
                                    <select
                                        value={data.follower_id}
                                        onChange={(e) => setData('follower_id', e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                                    >
                                        <option value="">Select Watcher...</option>
                                        {users.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ================= STEP 2: CONTEXT & LINKS ================= */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <h3 className="text-base font-bold text-foreground">Context & Planning Links</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Link this task to your project, milestone, and workplan schedule.
                                </p>
                            </div>

                            {/* Type Cards Selector */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-foreground">Type</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div
                                        onClick={() => setData('type', 'activity')}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
                                            data.type === 'activity'
                                                ? 'bg-primary/10 border-primary ring-1 ring-primary'
                                                : 'bg-card border-border hover:border-muted-foreground/40'
                                        }`}
                                    >
                                        <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                                            <Layers className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-foreground">Activity</h4>
                                            <p className="text-[11px] text-muted-foreground mt-0.5">A standalone activity</p>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setData('type', 'task')}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
                                            data.type === 'task'
                                                ? 'bg-primary/10 border-primary ring-1 ring-primary'
                                                : 'bg-card border-border hover:border-muted-foreground/40'
                                        }`}
                                    >
                                        <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                                            <CheckSquare className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-foreground">Task</h4>
                                            <p className="text-[11px] text-muted-foreground mt-0.5">Part of a project plan</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Planning Links Group */}
                            <div className="space-y-4 pt-2 border-t border-border">
                                <div>
                                    <h4 className="text-xs font-bold text-foreground">Planning Structures</h4>
                                    <p className="text-[11px] text-muted-foreground">Cascading linkages for reporting and progress tracking.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Project / Department Dropdown */}
                                    {data.context === 'department' ? (
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-foreground">Department</label>
                                            <select
                                                value={data.department_id}
                                                onChange={(e) => setData('department_id', e.target.value)}
                                                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                                            >
                                                <option value="">Select Department...</option>
                                                {departments.map((d) => (
                                                    <option key={d.id} value={d.id}>
                                                        {d.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-foreground">Project</label>
                                            <select
                                                value={data.project_id}
                                                onChange={(e) => setData('project_id', e.target.value)}
                                                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                                            >
                                                <option value="">Select Project...</option>
                                                {projects.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Milestone / Workplan Dropdown */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground">Milestone / Workplan</label>
                                        <select
                                            value={data.milestone_id}
                                            onChange={(e) => setData('milestone_id', e.target.value)}
                                            className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                                        >
                                            <option value="">Select milestone...</option>
                                            {filteredMilestones.map((m) => (
                                                <option key={m.id} value={m.id}>
                                                    {m.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Key Result Area */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground">Key Result Area</label>
                                        <input
                                            type="text"
                                            value={data.kra}
                                            onChange={(e) => setData('kra', e.target.value)}
                                            placeholder="Select key result area..."
                                            className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                                        />
                                    </div>

                                    {/* Key Performance Indicator */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground">Key Performance Indicator (KPI)</label>
                                        <input
                                            type="text"
                                            value={data.kpi}
                                            onChange={(e) => setData('kpi', e.target.value)}
                                            placeholder="Select KPI..."
                                            className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Performance & Timeline */}
                            <div className="space-y-4 pt-2 border-t border-border">
                                <div>
                                    <h4 className="text-xs font-bold text-foreground">Schedule & Status</h4>
                                    <p className="text-[11px] text-muted-foreground">Capture task execution timeline and status column.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground">Start Date</label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground">Due Date</label>
                                        <input
                                            type="date"
                                            value={data.due_date}
                                            onChange={(e) => setData('due_date', e.target.value)}
                                            className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground">Board Status</label>
                                        <select
                                            value={data.board_column_id}
                                            onChange={(e) => setData('board_column_id', e.target.value)}
                                            className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                                        >
                                            <option value="">Default Column (To Do)</option>
                                            {filteredColumns.map((col) => (
                                                <option key={col.id} value={col.id}>
                                                    {col.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ================= STEP 3: REVIEW (MANDATORY BEFORE CREATING) ================= */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <h3 className="text-base font-bold text-foreground">Step 3: Review Details</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Please confirm all task details below before submitting.
                                </p>
                            </div>

                            {/* Summary Review Card */}
                            <div className="p-6 bg-muted/20 border border-border rounded-xl space-y-6">
                                {/* Title & Status Badge Header */}
                                <div className="p-4 bg-card border border-border rounded-xl flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <CheckSquare className="w-5 h-5 text-primary" />
                                        <span className="text-sm font-bold text-foreground">
                                            {data.title || <span className="text-muted-foreground italic">Untitled Task</span>}
                                        </span>
                                    </div>
                                    <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                                        {data.priority}
                                    </span>
                                </div>

                                {/* Grid breakdown */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Context Box */}
                                    <div className="p-4 bg-card border border-border rounded-xl space-y-3">
                                        <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center space-x-1.5">
                                            <Briefcase className="w-3.5 h-3.5 text-primary" />
                                            <span>Context</span>
                                        </h5>
                                        <div className="space-y-1.5 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Type</span>
                                                <span className="text-foreground font-semibold capitalize">{data.type}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    {data.context === 'department' ? 'Department' : 'Project'}
                                                </span>
                                                <span className="text-foreground font-semibold">
                                                    {data.context === 'department' ? selectedDepartmentName : selectedProjectName}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Milestone</span>
                                                <span className="text-foreground font-semibold">{selectedMilestoneName}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Schedule Box */}
                                    <div className="p-4 bg-card border border-border rounded-xl space-y-3">
                                        <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center space-x-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-primary" />
                                            <span>Schedule</span>
                                        </h5>
                                        <div className="space-y-1.5 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Start Date</span>
                                                <span className="text-foreground font-semibold">{data.start_date || 'Today'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Due Date</span>
                                                <span className="text-foreground font-semibold">{data.due_date || 'Not set'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Assignments Box */}
                                <div className="p-4 bg-card border border-border rounded-xl space-y-2">
                                    <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center space-x-1.5">
                                        <UserIcon className="w-3.5 h-3.5 text-primary" />
                                        <span>Assignments</span>
                                    </h5>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Assigned To</span>
                                        <span className="text-foreground font-semibold">{selectedAssigneeName}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Step Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-border">
                        {currentStep > 1 ? (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                className="border-border text-foreground hover:bg-muted text-xs font-semibold"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> Back
                            </Button>
                        ) : (
                            <div />
                        )}

                        {currentStep < 3 ? (
                            <Button
                                type="button"
                                onClick={nextStep}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold px-6 shadow-md shadow-primary/20"
                            >
                                Next: {currentStep === 1 ? 'Context & Links' : 'Review'} <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold px-6 shadow-md shadow-primary/20"
                            >
                                {processing ? 'Creating...' : `Confirm & Create ${data.type === 'activity' ? 'Activity' : 'Task'}`}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
