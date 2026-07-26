import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Activity,
    Search,
    MessageSquare,
    CheckSquare,
    ArrowRight,
    User,
    Folder,
    Clock,
    Sparkles,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ActivityItem {
    id: number;
    action: string;
    details: any;
    created_at: string;
    user?: { id: number; name: string; email: string };
    task?: {
        id: number;
        title: string;
        project?: { id: number; name: string };
    };
}

interface ActivitiesIndexProps {
    activities: {
        data: ActivityItem[];
        links: any[];
        total: number;
    };
    filters: any;
}

export default function ActivitiesIndex({ activities, filters = {} }: ActivitiesIndexProps) {
    const handleSearch = (query: string) => {
        router.get('/activities', { search: query }, { preserveState: true, replace: true });
    };

    const formatActionBadge = (action: string) => {
        switch (action) {
            case 'task_created':
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30">Created</span>;
            case 'status_changed':
            case 'column_updated':
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">Moved</span>;
            case 'comment_added':
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/30">Comment</span>;
            case 'task_updated':
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Updated</span>;
            default:
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-muted text-muted-foreground border border-border">{action}</span>;
        }
    };

    return (
        <>
            <Head title="Activities Feed - Aero DevPM" />

            <div className="p-6 md:p-8 space-y-6 bg-background text-foreground min-h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Activities Feed
                        </h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            Real-time chronological audit trail of all task modifications, comments, and project events.
                        </p>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="p-3 bg-card border border-border rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                        <input
                            type="text"
                            placeholder="Filter activities by action, user, task..."
                            value={filters.search || ''}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                        {activities.total || 0} Events Logged
                    </span>
                </div>

                {/* Feed Items */}
                {activities.data.length === 0 ? (
                    <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-3">
                        <Sparkles className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                        <h3 className="text-base font-semibold text-foreground">No Activities Found</h3>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                            No logged task changes or team actions match your current search parameter.
                        </p>
                    </div>
                ) : (
                    <div className="bg-card border border-border rounded-2xl p-6 relative space-y-6 shadow-sm">
                        <div className="absolute left-9 top-8 bottom-8 w-px bg-border/60 hidden sm:block" />

                        {activities.data.map((item) => (
                            <div key={item.id} className="flex items-start space-x-4 relative group">
                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold border border-primary/30 shrink-0 z-10">
                                    {item.user ? item.user.name.charAt(0) : '?'}
                                </div>

                                <div className="flex-1 bg-muted/40 border border-border/70 rounded-xl p-4 space-y-2 group-hover:border-cyan-500/40 transition">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-bold text-xs text-foreground">
                                                {item.user ? item.user.name : 'System User'}
                                            </span>
                                            {formatActionBadge(item.action)}
                                        </div>

                                        <span className="text-[11px] font-mono text-muted-foreground flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {new Date(item.created_at).toLocaleString()}
                                        </span>
                                    </div>

                                    {item.task && (
                                        <div className="flex items-center space-x-2 text-xs">
                                            <span className="font-mono text-muted-foreground">#{item.task.id}</span>
                                            <Link
                                                href={`/projects/${item.task.project?.id || 1}`}
                                                className="font-semibold text-foreground hover:text-cyan-400 transition truncate max-w-md"
                                            >
                                                {item.task.title}
                                            </Link>
                                            {item.task.project && (
                                                <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium flex items-center shrink-0">
                                                    <Folder className="w-2.5 h-2.5 mr-1 text-amber-400" />
                                                    {item.task.project.name}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {item.details && typeof item.details === 'object' && (
                                        <div className="text-xs text-muted-foreground font-mono bg-background/60 p-2 rounded-lg border border-border/40">
                                            {JSON.stringify(item.details)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

ActivitiesIndex.layout = {
    breadcrumbs: [
        { title: 'Projects & Planning', href: '/projects' },
        { title: 'Activities', href: '/activities' },
    ],
};
