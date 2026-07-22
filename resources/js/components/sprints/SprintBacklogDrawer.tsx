import React from 'react';
import { router } from '@inertiajs/react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Zap, Plus, ArrowRight, Layers, CheckCircle2, User, ChevronRight } from 'lucide-react';

interface TaskItem {
    id: number;
    title: string;
    priority: string;
    story_points?: number;
    sprint_id?: number | null;
    assignee?: { name: string };
    board_column?: { name: string };
}

interface SprintItem {
    id: number;
    name: string;
    goal?: string | null;
    status: string;
    tasks?: TaskItem[];
}

interface SprintBacklogDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    backlogTasks: TaskItem[];
    sprints: SprintItem[];
    onOpenCreateSprint: () => void;
}

export function SprintBacklogDrawer({
    isOpen,
    onClose,
    backlogTasks = [],
    sprints = [],
    onOpenCreateSprint,
}: SprintBacklogDrawerProps) {
    const handleMoveTask = (taskId: number, targetSprintId: number | null) => {
        router.post(
            '/sprints/assign-tasks',
            {
                task_ids: [taskId],
                sprint_id: targetSprintId,
            },
            { preserveScroll: true }
        );
    };

    const handleStartSprint = (sprintId: number) => {
        router.post(`/sprints/${sprintId}/start`, {}, { preserveScroll: true });
    };

    const activeSprint = sprints.find((s) => s.status === 'active');
    const futureSprints = sprints.filter((s) => s.status === 'future');

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-xl max-h-screen overflow-y-auto p-6 space-y-6">
                <SheetHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-primary">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Layers className="w-5 h-5 text-primary" />
                            </div>
                            <SheetTitle className="text-xl">Backlog & Sprint Planning</SheetTitle>
                        </div>
                    </div>
                    <SheetDescription>
                        Move tasks between Product Backlog queues and active or future sprint buckets.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    {/* Header Controls */}
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Planning Buckets
                        </span>
                        <Button onClick={onOpenCreateSprint} size="sm" className="bg-primary text-primary-foreground text-xs">
                            <Plus className="w-4 h-4 mr-1" /> New Sprint
                        </Button>
                    </div>

                    {/* Active / Future Sprints Section */}
                    {sprints.length > 0 && (
                        <div className="space-y-4">
                            {sprints.map((sprint) => (
                                <div
                                    key={sprint.id}
                                    className={`rounded-2xl border p-4 space-y-3 ${
                                        sprint.status === 'active'
                                            ? 'border-emerald-500/40 bg-emerald-500/5'
                                            : 'border-border bg-card'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                                    sprint.status === 'active'
                                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                                        : 'bg-muted text-muted-foreground border-border'
                                                }`}
                                            >
                                                {sprint.status}
                                            </span>
                                            <h4 className="text-sm font-bold text-foreground">{sprint.name}</h4>
                                        </div>

                                        {sprint.status === 'future' && (
                                            <Button
                                                onClick={() => handleStartSprint(sprint.id)}
                                                size="sm"
                                                variant="outline"
                                                className="text-xs h-7 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                                            >
                                                <Zap className="w-3 h-3 mr-1 fill-emerald-400" /> Start Sprint
                                            </Button>
                                        )}
                                    </div>

                                    {sprint.goal && (
                                        <p className="text-xs text-muted-foreground italic line-clamp-1">"{sprint.goal}"</p>
                                    )}

                                    {/* Task bucket items */}
                                    <div className="space-y-1.5 pt-1">
                                        {(!sprint.tasks || sprint.tasks.length === 0) ? (
                                            <p className="text-[11px] text-muted-foreground text-center py-2 border border-dashed border-border/60 rounded-lg">
                                                No tasks in this sprint bucket yet. Move tasks from backlog below.
                                            </p>
                                        ) : (
                                            sprint.tasks.map((task) => (
                                                <div
                                                    key={task.id}
                                                    className="flex items-center justify-between p-2 rounded-lg bg-background border border-border/60 text-xs"
                                                >
                                                    <div className="flex items-center space-x-2 truncate">
                                                        <span className="font-mono text-[10px] font-bold text-muted-foreground">#{task.id}</span>
                                                        <span className="font-semibold text-foreground truncate">{task.title}</span>
                                                    </div>
                                                    <Button
                                                        onClick={() => handleMoveTask(task.id, null)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 text-[10px] text-muted-foreground hover:text-amber-400"
                                                        title="Remove to Backlog"
                                                    >
                                                        To Backlog
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Product Backlog (Unassigned Tasks) */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center">
                                <span>Product Backlog</span>
                                <span className="ml-2 px-2 py-0.5 rounded-full bg-muted text-foreground text-[10px] font-mono">
                                    {backlogTasks.length}
                                </span>
                            </h4>
                        </div>

                        {backlogTasks.length === 0 ? (
                            <div className="p-6 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
                                Product Backlog is clear! All tasks are assigned to sprints.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {backlogTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="p-3 bg-card border border-border/80 rounded-xl flex items-center justify-between gap-3 hover:border-primary/40 transition"
                                    >
                                        <div className="space-y-1 truncate">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-mono text-[10px] font-bold text-muted-foreground">#{task.id}</span>
                                                <span className="font-semibold text-foreground text-xs truncate">{task.title}</span>
                                            </div>
                                            <div className="flex items-center space-x-3 text-[10px] text-muted-foreground">
                                                <span className="capitalize font-medium text-amber-400">{task.priority} Priority</span>
                                                {task.story_points && (
                                                    <span className="font-mono font-semibold">{task.story_points} pts</span>
                                                )}
                                                {task.assignee && (
                                                    <span className="flex items-center"><User className="w-2.5 h-2.5 mr-0.5" />{task.assignee.name}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Assign to active or first future sprint button */}
                                        {sprints.length > 0 && (
                                            <Button
                                                onClick={() => handleMoveTask(task.id, (activeSprint || futureSprints[0])?.id || null)}
                                                size="sm"
                                                variant="outline"
                                                className="text-[11px] h-7 shrink-0 text-primary border-primary/30 hover:bg-primary/10"
                                            >
                                                Move to Sprint <ArrowRight className="w-3 h-3 ml-1" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
