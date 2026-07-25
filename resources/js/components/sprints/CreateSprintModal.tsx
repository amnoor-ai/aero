import { useForm } from '@inertiajs/react';
import { Zap } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CreateSprintModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: number;
}

const getDefaultDates = () => {
    const now = new Date();
    const startDate = now.toISOString().split('T')[0];
    const endDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return { startDate, endDate };
};

export function CreateSprintModal({ isOpen, onClose, projectId }: CreateSprintModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        project_id: projectId,
        name: '',
        goal: '',
        start_date: getDefaultDates().startDate,
        end_date: getDefaultDates().endDate,
        status: 'future',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/sprints', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex items-center space-x-2 text-primary">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <DialogTitle className="text-xl">Create Sprint</DialogTitle>
                        </div>
                        <DialogDescription>
                            Create a new iteration timebox to plan tasks and track story point velocity.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="sprint-name" className="text-xs font-semibold">Sprint Name *</Label>
                            <Input
                                id="sprint-name"
                                placeholder="e.g. Sprint 15 - Navigation Shell"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                        </div>

                        {/* Goal */}
                        <div className="space-y-1.5">
                            <Label htmlFor="sprint-goal" className="text-xs font-semibold">Sprint Goal</Label>
                            <Textarea
                                id="sprint-goal"
                                placeholder="What is the primary objective of this sprint?"
                                rows={3}
                                value={data.goal}
                                onChange={(e) => setData('goal', e.target.value)}
                            />
                            {errors.goal && <p className="text-xs text-destructive">{errors.goal}</p>}
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="start_date" className="text-xs font-semibold">Start Date</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    min="2000-01-01"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="end_date" className="text-xs font-semibold">End Date</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    min="2000-01-01"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Initial Status Selection */}
                        <div className="space-y-1.5">
                            <Label htmlFor="sprint-status" className="text-xs font-semibold">Initial Status</Label>
                            <select
                                id="sprint-status"
                                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                            >
                                <option value="future">Future (Backlog Draft)</option>
                                <option value="active">Active (Start Immediately)</option>
                            </select>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-primary text-primary-foreground">
                            {processing ? 'Creating...' : 'Create Sprint'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
