import { router } from '@inertiajs/react';
import { X, Plus, Calendar, FileText, Check, Folder } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface ProjectOption {
    id: number;
    name: string;
    status: string;
    progress: number;
}

interface CreateWorkPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    allProjects: ProjectOption[];
}

export function CreateWorkPlanModal({ isOpen, onClose, allProjects }: CreateWorkPlanModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('active');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) {
        return null;
    }

    const toggleProjectSelect = (id: number) => {
        setSelectedProjectIds((prev) =>
            prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Please enter a work plan name.');

            return;
        }

        setIsSubmitting(true);

        router.post(
            '/work-plans',
            {
                name: name.trim(),
                description: description.trim() || null,
                status,
                start_date: startDate || null,
                due_date: dueDate || null,
                project_ids: selectedProjectIds,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    toast.success(`Work plan "${name}" created successfully!`);
                    setName('');
                    setDescription('');
                    setStatus('active');
                    setStartDate('');
                    setDueDate('');
                    setSelectedProjectIds([]);
                    onClose();
                },
                onError: () => {
                    setIsSubmitting(false);
                    toast.error('Failed to create work plan. Please check fields.');
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
                className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto text-foreground"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
                    <div>
                        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                            <Plus className="w-4 h-4 text-primary" />
                            <span>Create Work Plan Initiative</span>
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Set up a high-level strategic portfolio to group and track multiple projects.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="text-xs font-bold text-foreground block">
                                Work Plan Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Q3 Strategic Digital Expansion"
                                className="w-full mt-1.5 h-9 px-3 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none focus:border-primary transition"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-xs font-bold text-foreground block flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>Description / Objective</span>
                            </label>
                            <textarea
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Summary of portfolio goals, targets, and strategic alignment..."
                                className="w-full mt-1.5 p-3 bg-background border border-input rounded-xl text-xs text-foreground focus:outline-none focus:border-primary resize-y transition"
                            />
                        </div>

                        {/* Status & Date Range Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="text-[11px] font-semibold text-muted-foreground block">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full mt-1 h-8 px-2 bg-background border border-input rounded-lg text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                                >
                                    <option value="active">Active</option>
                                    <option value="planning">Planning</option>
                                    <option value="completed">Completed</option>
                                    <option value="on_hold">On Hold</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[11px] font-semibold text-muted-foreground block flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                    <span>Start Date</span>
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full mt-1 h-8 px-2 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-semibold text-muted-foreground block flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                    <span>Target Due Date</span>
                                </label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full mt-1 h-8 px-2 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>

                        {/* Attach Projects Checklist */}
                        <div className="space-y-2 pt-2 border-t border-border/60">
                            <label className="text-xs font-bold text-foreground block flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                    <Folder className="w-3.5 h-3.5 text-primary" />
                                    <span>Attach Projects ({selectedProjectIds.length} selected)</span>
                                </span>
                                <span className="text-[10px] text-muted-foreground">Optional initial selection</span>
                            </label>

                            <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 bg-muted/20 border border-border/60 rounded-xl">
                                {allProjects.length === 0 ? (
                                    <p className="text-xs text-muted-foreground italic p-2 text-center">No projects available to attach.</p>
                                ) : (
                                    allProjects.map((proj) => {
                                        const isSelected = selectedProjectIds.includes(proj.id);

                                        return (
                                            <div
                                                key={proj.id}
                                                onClick={() => toggleProjectSelect(proj.id)}
                                                className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition ${
                                                    isSelected
                                                        ? 'bg-primary/10 border-primary/40 text-foreground font-semibold'
                                                        : 'bg-background border-border/60 text-muted-foreground hover:border-primary/30'
                                                }`}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <div
                                                        className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                                                            isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-input'
                                                        }`}
                                                    >
                                                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                                    </div>
                                                    <span>{proj.name}</span>
                                                </div>
                                                <span className="text-[10px] text-muted-foreground">{proj.progress}% progress</span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-border flex items-center justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose} className="h-9 text-xs">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-9 px-5 bg-primary text-primary-foreground font-bold text-xs shadow-sm"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Work Plan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
