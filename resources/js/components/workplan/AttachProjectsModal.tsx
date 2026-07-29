import { router } from '@inertiajs/react';
import { X, Folder, Check } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface ProjectOption {
    id: number;
    name: string;
    status: string;
    progress: number;
}

interface WorkPlanData {
    id: number;
    name: string;
    projects: { id: number; name: string }[];
}

interface AttachProjectsModalProps {
    isOpen: boolean;
    onClose: () => void;
    workPlan: WorkPlanData | null;
    allProjects: ProjectOption[];
}

export function AttachProjectsModal({ isOpen, onClose, workPlan, allProjects }: AttachProjectsModalProps) {
    const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [prevWorkPlanId, setPrevWorkPlanId] = useState<number | null>(null);

    if (workPlan && workPlan.id !== prevWorkPlanId) {
        setPrevWorkPlanId(workPlan.id);
        setSelectedProjectIds(workPlan.projects.map((p) => p.id));
    }

    if (!isOpen || !workPlan) {
        return null;
    }

    const toggleProjectSelect = (id: number) => {
        setSelectedProjectIds((prev) =>
            prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(
            `/work-plans/${workPlan.id}/attach-projects`,
            {
                project_ids: selectedProjectIds,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    toast.success(`Updated projects for work plan "${workPlan.name}"`);
                    onClose();
                },
                onError: () => {
                    setIsSubmitting(false);
                    toast.error('Failed to update project attachments.');
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
                className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto text-foreground"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
                    <div>
                        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                            <Folder className="w-4 h-4 text-primary" />
                            <span>Manage Attached Projects</span>
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Work Plan: <span className="font-semibold text-foreground">{workPlan.name}</span>
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
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-xs text-muted-foreground">
                        Select which projects contribute to this strategic work plan. Selected project progress percentages contribute equally to the work plan's total progress.
                    </p>

                    <div className="max-h-60 overflow-y-auto space-y-2 p-2 bg-muted/20 border border-border/60 rounded-xl">
                        {allProjects.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic p-3 text-center">No projects available.</p>
                        ) : (
                            allProjects.map((proj) => {
                                const isSelected = selectedProjectIds.includes(proj.id);

                                return (
                                    <div
                                        key={proj.id}
                                        onClick={() => toggleProjectSelect(proj.id)}
                                        className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition ${
                                            isSelected
                                                ? 'bg-primary/10 border-primary/40 text-foreground font-semibold'
                                                : 'bg-background border-border/60 text-muted-foreground hover:border-primary/30'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                                                    isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-input'
                                                }`}
                                            >
                                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                            </div>
                                            <span>{proj.name}</span>
                                        </div>
                                        <span className="text-[11px] font-bold text-primary">{proj.progress}% Done</span>
                                    </div>
                                );
                            })
                        )}
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
                            {isSubmitting ? 'Saving...' : 'Save Attachments'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
