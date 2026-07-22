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
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-card to-card border border-purple-500/30 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1 max-w-xl">
                <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono font-bold text-[11px] border border-emerald-500/30 flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                        <span>ACTIVE SPRINT</span>
                    </span>
                    <h3 className="text-base font-extrabold text-foreground">{sprint.name}</h3>
                    {daysLeft !== null && (
                        <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border">
                            ⏳ {daysLeft} days left
                        </span>
                    )}
                </div>

                {sprint.goal && (
                    <p className="text-xs text-purple-200/80 font-medium line-clamp-1 italic">
                        "{sprint.goal}"
                    </p>
                )}
            </div>

            {/* Metrics & Actions */}
            <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-4 px-3 py-1.5 bg-muted/40 rounded-xl border border-border/60 text-xs">
                    <div>
                        <span className="text-[10px] text-muted-foreground block font-semibold uppercase">Story Points</span>
                        <span className="font-mono font-extrabold text-foreground">{completedPoints} / {totalPoints} pts</span>
                    </div>
                    <div className="w-px h-6 bg-border" />
                    <div>
                        <span className="text-[10px] text-muted-foreground block font-semibold uppercase">Tasks</span>
                        <span className="font-mono font-extrabold text-foreground">{completedTasks.length} / {tasks.length}</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button onClick={onOpenBacklogDrawer} variant="outline" size="sm" className="text-xs">
                        <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-purple-400" /> Backlog
                    </Button>

                    <Button onClick={onOpenCompleteSprint} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Complete Sprint
                    </Button>
                </div>
            </div>
        </div>
    );
}
