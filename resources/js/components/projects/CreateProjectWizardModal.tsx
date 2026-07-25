import { useForm } from '@inertiajs/react';
import {
    Calendar,
    DollarSign,
    Tag as TagIcon,
    Users,
    UploadCloud,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    X,
    Building2,
    User as UserIcon,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Department {
    id: number;
    name: string;
    code: string;
}

interface WorkspaceUser {
    id: number;
    name: string;
    email: string;
}

interface CreateProjectWizardModalProps {
    isOpen: boolean;
    onClose: () => void;
    departments?: Department[];
    workspaceUsers?: WorkspaceUser[];
}

export function CreateProjectWizardModal({
    isOpen,
    onClose,
    departments = [],
    workspaceUsers = [],
}: CreateProjectWizardModalProps) {
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [tagInput, setTagInput] = useState('');
    const [policyAccepted, setPolicyAccepted] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        department_id: '',
        lead_id: workspaceUsers[0]?.id ? String(workspaceUsers[0].id) : '',
        description: '',
        status: 'planned' as 'draft' | 'planned' | 'ongoing' | 'completed' | 'archived',
        start_date: '',
        due_date: '',
        budget: '',
        tags: [] as string[],
        members: [] as { user_id: number; role: string }[],
    });

    if (!isOpen) {
return null;
}

    const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
        if (('key' in e && e.key === 'Enter') || e.type === 'click') {
            e.preventDefault();
            const trimmed = tagInput.trim();

            if (trimmed && !data.tags.includes(trimmed)) {
                setData('tags', [...data.tags, trimmed]);
                setTagInput('');
            }
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setData('tags', data.tags.filter((t) => t !== tagToRemove));
    };

    const handleToggleMember = (userId: number) => {
        const exists = data.members.find((m) => m.user_id === userId);

        if (exists) {
            setData('members', data.members.filter((m) => m.user_id !== userId));
        } else {
            setData('members', [...data.members, { user_id: userId, role: 'developer' }]);
        }
    };

    const handleMemberRoleChange = (userId: number, role: string) => {
        setData('members', data.members.map((m) => m.user_id === userId ? { ...m, role } : m));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/projects', {
            onSuccess: () => {
                reset();
                setCurrentStep(1);
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header Stepper Strip */}
                <div className="p-6 border-b border-border/60 bg-muted/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-foreground">Create New Project</h2>
                                <p className="text-xs text-muted-foreground">Configure project scope, team resources, and governance</p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Progress Bar / Stepper Tabs */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold transition ${currentStep === 1 ? 'bg-primary/10 border-primary/40 text-primary' : currentStep > 1 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-muted/40 border-border text-muted-foreground'}`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${currentStep === 1 ? 'bg-primary text-primary-foreground' : currentStep > 1 ? 'bg-emerald-500 text-black' : 'bg-muted text-muted-foreground'}`}>
                                1
                            </span>
                            <span className="truncate">Info & Timeline</span>
                        </div>

                        <div className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold transition ${currentStep === 2 ? 'bg-primary/10 border-primary/40 text-primary' : currentStep > 2 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-muted/40 border-border text-muted-foreground'}`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${currentStep === 2 ? 'bg-primary text-primary-foreground' : currentStep > 2 ? 'bg-emerald-500 text-black' : 'bg-muted text-muted-foreground'}`}>
                                2
                            </span>
                            <span className="truncate">Branding & Team</span>
                        </div>

                        <div className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold transition ${currentStep === 3 ? 'bg-primary/10 border-primary/40 text-primary' : 'bg-muted/40 border-border text-muted-foreground'}`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${currentStep === 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                3
                            </span>
                            <span className="truncate">Review & Governance</span>
                        </div>
                    </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* STEP 1: INFO & TIMELINE */}
                    {currentStep === 1 && (
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-semibold text-foreground flex items-center">
                                        Project Name <span className="text-destructive ml-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. NextGen Payment Gateway"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                                    />
                                    {errors.name && <p className="text-[11px] text-destructive mt-1">{errors.name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground flex items-center">
                                        <Building2 className="w-3.5 h-3.5 mr-1.5 text-purple-400" /> Department
                                    </label>
                                    <select
                                        value={data.department_id}
                                        onChange={(e) => setData('department_id', e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                                    >
                                        <option value="">No Department Assigned</option>
                                        {departments.map((d) => (
                                            <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground flex items-center">
                                        <UserIcon className="w-3.5 h-3.5 mr-1.5 text-cyan-400" /> Project Lead
                                    </label>
                                    <select
                                        value={data.lead_id}
                                        onChange={(e) => setData('lead_id', e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                                    >
                                        {workspaceUsers.map((u) => (
                                            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-semibold text-foreground">Project Description</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Outline high-level objectives, deliverable milestones, and key stakeholders..."
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-primary leading-relaxed"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground flex items-center">
                                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Start Date
                                    </label>
                                    <input
                                        type="date"
                                        min="2000-01-01"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground flex items-center">
                                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-rose-400" /> Target Target Date
                                    </label>
                                    <input
                                        type="date"
                                        min="2000-01-01"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground flex items-center">
                                        <DollarSign className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Estimated Budget ($)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="500"
                                        placeholder="e.g. 25000"
                                        value={data.budget}
                                        onChange={(e) => setData('budget', e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground flex items-center">
                                        <TagIcon className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> Focus Tags
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Add tag & press Enter..."
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleAddTag}
                                            className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                                        />
                                        <Button type="button" onClick={handleAddTag} size="sm" variant="outline" className="h-9 text-xs">
                                            Add
                                        </Button>
                                    </div>

                                    {/* Tag Pills */}
                                    {data.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {data.tags.map((t) => (
                                                <span key={t} className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-[11px] font-medium">
                                                    <span>{t}</span>
                                                    <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-destructive transition">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: BRANDING & TEAM MEMBERSHIP */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            {/* Branding Dropzone */}
                            <div className="p-5 border border-dashed border-border rounded-2xl bg-muted/20 text-center space-y-2">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                                    <UploadCloud className="w-5 h-5" />
                                </div>
                                <h4 className="text-xs font-bold text-foreground">Project Branding & Attachments</h4>
                                <p className="text-[11px] text-muted-foreground max-w-md mx-auto">
                                    Drag & drop project logo badge or architectural specification documents.
                                </p>
                                <Button type="button" variant="outline" size="sm" className="text-xs mt-1">
                                    Browse Files
                                </Button>
                            </div>

                            {/* Team Member Checklist */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-foreground flex items-center">
                                        <Users className="w-4 h-4 mr-1.5 text-blue-400" /> Assign Project Team Members
                                    </h4>
                                    <span className="text-[11px] font-mono text-muted-foreground">
                                        {data.members.length} Members Assigned
                                    </span>
                                </div>

                                <div className="border border-border rounded-2xl divide-y divide-border max-h-56 overflow-y-auto bg-background">
                                    {workspaceUsers.map((user) => {
                                        const assigned = data.members.find((m) => m.user_id === user.id);
                                        const isLead = Number(data.lead_id) === user.id;

                                        return (
                                            <div key={user.id} className="p-3 flex items-center justify-between hover:bg-muted/40 transition">
                                                <div className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        disabled={isLead}
                                                        checked={isLead || !!assigned}
                                                        onChange={() => handleToggleMember(user.id)}
                                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                                                    />
                                                    <div>
                                                        <p className="text-xs font-semibold text-foreground flex items-center">
                                                            {user.name}
                                                            {isLead && (
                                                                <span className="ml-2 text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                                                                    Project Lead
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-[11px] text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>

                                                {(assigned || isLead) && (
                                                    <select
                                                        disabled={isLead}
                                                        value={isLead ? 'lead' : assigned?.role || 'developer'}
                                                        onChange={(e) => handleMemberRoleChange(user.id, e.target.value)}
                                                        className="bg-background border border-border text-[11px] rounded-lg px-2 py-1 text-foreground focus:outline-none"
                                                    >
                                                        <option value="lead">Lead</option>
                                                        <option value="developer">Developer</option>
                                                        <option value="designer">Designer</option>
                                                        <option value="viewer">Viewer</option>
                                                    </select>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: REVIEW & GOVERNANCE */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            {/* Summary Card */}
                            <div className="bg-muted/30 border border-border rounded-2xl p-5 space-y-4">
                                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Project Summary</span>
                                        <h3 className="text-base font-bold text-foreground">{data.name || 'Untitled Project'}</h3>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs border border-primary/20 uppercase">
                                        {data.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                    <div>
                                        <p className="text-muted-foreground text-[11px]">Department</p>
                                        <p className="font-semibold text-foreground">
                                            {departments.find((d) => String(d.id) === data.department_id)?.name || 'Unassigned'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground text-[11px]">Lead</p>
                                        <p className="font-semibold text-foreground">
                                            {workspaceUsers.find((u) => String(u.id) === data.lead_id)?.name || 'Unassigned'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground text-[11px]">Target Timeline</p>
                                        <p className="font-semibold text-foreground">
                                            {data.due_date || 'No Date Specified'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground text-[11px]">Budget</p>
                                        <p className="font-mono font-semibold text-emerald-400">
                                            {data.budget ? `$${Number(data.budget).toLocaleString()}` : 'Unfunded'}
                                        </p>
                                    </div>
                                </div>

                                {data.description && (
                                    <div className="pt-2 border-t border-border/50">
                                        <p className="text-muted-foreground text-[11px]">Scope & Objectives</p>
                                        <p className="text-xs text-foreground leading-relaxed mt-1">{data.description}</p>
                                    </div>
                                )}
                            </div>

                            {/* Status Selector Toggle */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-foreground">Initial Status Mode</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setData('status', 'draft')}
                                        className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${data.status === 'draft' ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold' : 'bg-background border-border text-muted-foreground'}`}
                                    >
                                        <div>
                                            <p className="text-xs">Save as Draft</p>
                                            <p className="text-[10px] text-muted-foreground font-normal">Hidden from active board views</p>
                                        </div>
                                        {data.status === 'draft' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setData('status', 'planned')}
                                        className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${data.status === 'planned' ? 'bg-primary/10 border-primary/40 text-primary font-bold' : 'bg-background border-border text-muted-foreground'}`}
                                    >
                                        <div>
                                            <p className="text-xs">Publish Planned</p>
                                            <p className="text-[10px] text-muted-foreground font-normal">Ready for sprint backlog planning</p>
                                        </div>
                                        {data.status === 'planned' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                    </button>
                                </div>
                            </div>

                            {/* Compliance Checkbox */}
                            <div className="flex items-start space-x-3 p-3.5 rounded-xl border border-border bg-muted/20">
                                <input
                                    type="checkbox"
                                    id="policy-check"
                                    checked={policyAccepted}
                                    onChange={(e) => setPolicyAccepted(e.target.checked)}
                                    className="w-4 h-4 mt-0.5 rounded border-border text-primary focus:ring-primary"
                                />
                                <label htmlFor="policy-check" className="text-xs text-muted-foreground leading-normal cursor-pointer select-none">
                                    <span className="font-semibold text-foreground flex items-center mb-0.5">
                                        <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Compliance & Governance Confirmation
                                    </span>
                                    I verify this project conforms with workspace data security, budget allocations, and departmental resource availability.
                                </label>
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer Navigation Buttons */}
                <div className="p-4 border-t border-border/60 bg-muted/30 flex items-center justify-between">
                    {currentStep > 1 ? (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentStep((s) => (s - 1) as 1 | 2)}
                            className="text-xs"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back
                        </Button>
                    ) : (
                        <div />
                    )}

                    <div className="flex items-center space-x-2">
                        <Button type="button" variant="ghost" size="sm" onClick={onClose} className="text-xs text-muted-foreground">
                            Cancel
                        </Button>

                        {currentStep < 3 ? (
                            <Button
                                type="button"
                                size="sm"
                                disabled={!data.name.trim()}
                                onClick={() => setCurrentStep((s) => (s + 1) as 2 | 3)}
                                className="bg-primary text-primary-foreground text-xs"
                            >
                                Next Step <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                size="sm"
                                disabled={processing || !data.name.trim() || !policyAccepted}
                                onClick={handleSubmit}
                                className="bg-primary text-primary-foreground text-xs font-bold px-5"
                            >
                                {processing ? 'Creating Project...' : 'Launch Project'}
                            </Button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
