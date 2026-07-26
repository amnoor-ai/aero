import React from 'react';
import { Zap, Clock, CheckCircle2, SlidersHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SprintItem {
    id: number;
    name: string;
    goal: string | null;
    status: string;
    start_date: string | null;
    end_date: string | null;
    tasks?: any[];
}

interface SprintHeaderStripProps {
    sprint: SprintItem | null;
    onOpenBacklogDrawer: () => void;
    onOpenCreateSprint: () => void;
    onOpenCompleteSprint: () => void;
}

export function SprintHeaderStrip({
    sprint,
    onOpenBacklogDrawer,
    onOpenCreateSprint,
    onOpenCompleteSprint,
}: SprintHeaderStripProps) {
    if (!sprint) {
        return (
            <div className="p-4 rounded-2xl bg-card border border-border/80 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-foreground">No Active Sprint Running</h3>
                        <p className="text-xs text-muted-foreground">Start an iteration sprint or open the Backlog drawer to assign tasks.</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Button onClick={onOpenBacklogDrawer} variant="outline" size="sm" className="text-xs">
                        <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-primary" /> Backlog Planning
                    </Button>
                    <Button onClick={onOpenCreateSprint} size="sm" className="bg-primary text-primary-foreground text-xs font-semibold">
                        <Plus className="w-4 h-4 mr-1" /> Create Sprint
                    </Button>
                </div>
            </div>
        );
    }

    const tasks = sprint.tasks || [];
    const completedTasks = tasks.filter((t) => t.board_column?.name === 'Done');
    const totalPoints = tasks.reduce((sum, t) => sum + (t.story_points || 0), 0);
    const completedPoints = completedTasks.reduce((sum, t) => sum + (t.story_points || 0), 0);

    // Calculate days remaining
    let daysLeft = null;
    if (sprint.end_date) {
        const diffTime = new Date(sprint.end_date).getTime() - new Date().getTime();
        daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    return (
        <div className="p-4 rounded-xl bg-card border border-border flex flex-wrap items-center justify-between gap-4 shadow-2xs">
            <div className="space-y-1 max-w-xl">
                <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-bold text-[11px] border border-primary/20 flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-primary fill-primary" />
                        <span>ACTIVE SPRINT</span>
                    </span>
                    <h3 className="text-base font-bold text-foreground">{sprint.name}</h3>
                    {daysLeft !== null && (
                        <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border">
                            ⏳ {daysLeft} days left
                        </span>
                    )}
                </div>

                {sprint.goal && (
                    <p className="text-xs text-muted-foreground font-medium line-clamp-1 italic">
                        "{sprint.goal}"
                    </p>
                )}
            </div>

            {/* Metrics & Actions */}
            <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-4 px-3 py-1.5 bg-muted/40 rounded-lg border border-border text-xs">
                    <div>
                        <span className="text-[10px] text-muted-foreground block font-semibold uppercase">Story Points</span>
                        <span className="font-mono font-bold text-foreground">{completedPoints} / {totalPoints} pts</span>
                    </div>
                    <div className="w-px h-6 bg-border" />
                    <div>
                        <span className="text-[10px] text-muted-foreground block font-semibold uppercase">Tasks</span>
                        <span className="font-mono font-bold text-foreground">{completedTasks.length} / {tasks.length}</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button onClick={onOpenBacklogDrawer} variant="outline" size="sm" className="text-xs font-semibold">
                        <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" /> Backlog
                    </Button>

                    <Button onClick={onOpenCompleteSprint} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Complete Sprint
                    </Button>
                </div>
            </div>
        </div>
    );
}
