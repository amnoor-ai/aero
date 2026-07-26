import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface SprintItem {
    id: number;
    name: string;
    status: string;
    tasks?: any[];
}

interface CompleteSprintModalProps {
    isOpen: boolean;
    onClose: () => void;
    sprint: SprintItem | null;
    futureSprints: SprintItem[];
}

export function CompleteSprintModal({ isOpen, onClose, sprint, futureSprints }: CompleteSprintModalProps) {
    if (!sprint) return null;

    const tasks = sprint.tasks || [];
    const completedTasks = tasks.filter((t) => t.board_column?.name === 'Done');
    const incompleteTasks = tasks.filter((t) => t.board_column?.name !== 'Done');

    const [rolloverAction, setRolloverAction] = useState<'backlog' | 'next_sprint'>('backlog');
    const [targetSprintId, setTargetSprintId] = useState<string>(futureSprints[0]?.id ? String(futureSprints[0].id) : '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleComplete = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(
            `/sprints/${sprint.id}/complete`,
            {
                rollover_action: rolloverAction,
                target_sprint_id: targetSprintId || null,
            },
            {
                onFinish: () => {
                    setIsSubmitting(false);
                    onClose();
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleComplete}>
                    <DialogHeader>
                        <div className="flex items-center space-x-2 text-emerald-400">
                            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            </div>
                            <DialogTitle className="text-xl">Complete {sprint.name}</DialogTitle>
                        </div>
                        <DialogDescription>
                            Review finished work and choose where to move uncompleted tasks.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Summary Badges */}
                        <div className="grid grid-cols-2 gap-3 p-3 bg-muted/40 rounded-xl border border-border">
                            <div className="flex items-center space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span className="text-xs font-semibold text-foreground">{completedTasks.length} Completed Tasks</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                                <span className="text-xs font-semibold text-foreground">{incompleteTasks.length} Incomplete Tasks</span>
                            </div>
                        </div>

                        {incompleteTasks.length > 0 && (
                            <div className="space-y-3">
                                <Label className="text-xs font-semibold">Move {incompleteTasks.length} Incomplete Tasks to:</Label>
                                
                                <div className="space-y-2">
                                    <label className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition ${rolloverAction === 'backlog' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/40'}`}>
                                        <input
                                            type="radio"
                                            name="rollover"
                                            value="backlog"
                                            checked={rolloverAction === 'backlog'}
                                            onChange={() => setRolloverAction('backlog')}
                                            className="mt-0.5"
                                        />
                                        <div>
                                            <p className="text-xs font-bold text-foreground">Product Backlog</p>
                                            <p className="text-[11px] text-muted-foreground">Tasks will be unassigned from any sprint and put in the backlog queue.</p>
                                        </div>
                                    </label>

                                    {futureSprints.length > 0 && (
                                        <label className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition ${rolloverAction === 'next_sprint' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/40'}`}>
                                            <input
                                                type="radio"
                                                name="rollover"
                                                value="next_sprint"
                                                checked={rolloverAction === 'next_sprint'}
                                                onChange={() => setRolloverAction('next_sprint')}
                                                className="mt-0.5"
                                            />
                                            <div className="w-full">
                                                <p className="text-xs font-bold text-foreground">Move to Next Future Sprint</p>
                                                {rolloverAction === 'next_sprint' && (
                                                    <select
                                                        className="mt-2 w-full h-8 rounded-md border border-input bg-background px-2 text-xs shadow-sm focus:outline-none"
                                                        value={targetSprintId}
                                                        onChange={(e) => setTargetSprintId(e.target.value)}
                                                    >
                                                        {futureSprints.map((fs) => (
                                                            <option key={fs.id} value={fs.id}>
                                                                {fs.name} ({fs.status})
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                            {isSubmitting ? 'Completing...' : 'Complete Sprint'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
