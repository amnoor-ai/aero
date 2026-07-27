import { Head, Link, router } from '@inertiajs/react';
import {
    Search,
    Folder,
    Clock,
    Sparkles,
    Activity as ActivityIcon,
    ShieldCheck,
    CheckCircle2,
    MessageSquare,
    FileEdit,
    PlusCircle,
} from 'lucide-react';
import React from 'react';

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

export default function SystemLogsIndex({ activities, filters = {} }: ActivitiesIndexProps) {
    const handleSearch = (query: string) => {
        router.get('/system/logs', { search: query }, { preserveState: true, replace: true });
    };

    const formatActionBadge = (action: string) => {
        switch (action) {
            case 'task_created':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                        <PlusCircle className="h-3 w-3" />
                        <span>Created</span>
                    </span>
                );
            case 'status_changed':
            case 'column_updated':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Moved</span>
                    </span>
                );
            case 'comment_added':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                        <MessageSquare className="h-3 w-3" />
                        <span>Comment</span>
                    </span>
                );
            case 'task_updated':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        <FileEdit className="h-3 w-3" />
                        <span>Updated</span>
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <ActivityIcon className="h-3 w-3" />
                        <span>{action}</span>
                    </span>
                );
        }
    };

    return (
        <>
            <Head title="System Audit Logs - Aero DevPM" />

            <div className="min-h-screen space-y-6 bg-background text-foreground">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-foreground">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                            <span>System Audit & Activity Logs</span>
                        </h1>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Complete system-wide audit trail cataloging task modifications, document events, and user activities.
                        </p>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-2xs">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Filter logs by action, user, task..."
                            value={filters.search || ''}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full rounded-lg border border-border bg-background py-1.5 pl-9 pr-3 text-xs text-foreground focus:border-primary focus:outline-none"
                        />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                        {activities.total || 0} System Logs Recorded
                    </span>
                </div>

                {/* Feed Items */}
                {activities.data.length === 0 ? (
                    <div className="space-y-3 rounded-xl border border-border bg-card p-12 text-center">
                        <Sparkles className="mx-auto h-8 w-8 text-muted-foreground/50" />
                        <h3 className="text-base font-semibold text-foreground">No Logs Found</h3>
                        <p className="mx-auto max-w-sm text-xs text-muted-foreground">
                            No logged task changes or team actions match your current search parameter.
                        </p>
                    </div>
                ) : (
                    <div className="relative space-y-4 rounded-xl border border-border bg-card p-6 shadow-2xs">
                        <div className="absolute bottom-8 left-9 top-8 hidden w-px bg-border/60 sm:block" />

                        {activities.data.map((item) => (
                            <div key={item.id} className="group relative flex items-start space-x-4">
                                {/* Avatar */}
                                <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/20 text-xs font-bold text-primary">
                                    {item.user ? item.user.name.charAt(0) : '?'}
                                </div>

                                <div className="flex-1 space-y-2 rounded-xl border border-border/70 bg-muted/40 p-4 transition group-hover:border-primary/40">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs font-bold text-foreground">
                                                {item.user ? item.user.name : 'System User'}
                                            </span>
                                            {formatActionBadge(item.action)}
                                        </div>

                                        <span className="flex items-center font-mono text-[11px] text-muted-foreground">
                                            <Clock className="mr-1 h-3 w-3" />
                                            {new Date(item.created_at).toLocaleString()}
                                        </span>
                                    </div>

                                    {item.task && (
                                        <div className="flex items-center space-x-2 text-xs">
                                            <span className="font-mono text-muted-foreground">#{item.task.id}</span>
                                            <Link
                                                href={`/projects/${item.task.project?.id || 1}`}
                                                className="max-w-md truncate font-semibold text-foreground transition hover:text-primary"
                                            >
                                                {item.task.title}
                                            </Link>
                                            {item.task.project && (
                                                <span className="flex shrink-0 items-center rounded bg-muted px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                                                    <Folder className="mr-1 h-2.5 w-2.5 text-amber-400" />
                                                    {item.task.project.name}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {item.details && typeof item.details === 'object' && (
                                        <div className="rounded-lg border border-border/40 bg-background/60 p-2 font-mono text-xs text-muted-foreground">
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

SystemLogsIndex.layout = {
    breadcrumbs: [
        { title: 'System', href: '/system/logs' },
        { title: 'System Audit Logs', href: '/system/logs' },
    ],
};
