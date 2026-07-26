import { Head, router } from '@inertiajs/react';
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PendingInvitationsModal from '@/components/pending-invitations-modal';

const chartData = [
    { name: 'Aug', completed: 0, pending: 0 },
    { name: 'Sep', completed: 0, pending: 0 },
    { name: 'Oct', completed: 0, pending: 0 },
    { name: 'Nov', completed: 2, pending: 4 },
    { name: 'Dec', completed: 28, pending: 35 },
    { name: 'Jan', completed: 4, pending: 15 },
    { name: 'Feb', completed: 1, pending: 4 },
    { name: 'Mar', completed: 0, pending: 2 },
    { name: 'Apr', completed: 0, pending: 1 },
    { name: 'May', completed: 0, pending: 0 },
    { name: 'Jun', completed: 1, pending: 2 },
    { name: 'Jul', completed: 4, pending: 3 },
];

interface Metrics {
    totalProjects: number;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    completionRate: number;
    onTimeRate: number;
    overdueRatio: number;
    todoCount: number;
    inProgressCount: number;
    inReviewCount: number;
    doneCount: number;
}

interface DashboardProps {
    metrics: Metrics;
    timeframe?: string;
    activeSprint?: any;
    recentProjects: any[];
    pendingInvitations?: any[];
}

export default function Dashboard({ metrics, timeframe = 'month', pendingInvitations = [] }: DashboardProps) {
    const handleTimeframeChange = (tf: string) => {
        router.get('/dashboard', { timeframe: tf }, { preserveState: true, replace: true });
    };

    const [isInvitationsModalOpen, setIsInvitationsModalOpen] = React.useState(pendingInvitations.length > 0);

    return (
        <>
            <Head title="Dashboard - Aero DevPM" />
            <PendingInvitationsModal 
                invitations={pendingInvitations} 
                open={isInvitationsModalOpen}
                onOpenChange={setIsInvitationsModalOpen}
            />

            <div className="p-6 md:p-8 space-y-6 bg-background text-foreground min-h-screen">
                {/* Standardized Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Workspace Overview</h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            Execution health, operational load, and recent organization updates.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex bg-secondary p-1 rounded-lg border border-border text-xs">
                            <button
                                onClick={() => handleTimeframeChange('today')}
                                className={`px-3 py-1 font-medium rounded-md transition ${
                                    timeframe === 'today'
                                        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                                        : 'text-secondary-foreground hover:text-foreground'
                                }`}
                            >
                                Today
                            </button>
                            <button
                                onClick={() => handleTimeframeChange('week')}
                                className={`px-3 py-1 font-medium rounded-md transition ${
                                    timeframe === 'week'
                                        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                                        : 'text-secondary-foreground hover:text-foreground'
                                }`}
                            >
                                This Week
                            </button>
                            <button
                                onClick={() => handleTimeframeChange('month')}
                                className={`px-3 py-1 font-medium rounded-md transition ${
                                    timeframe === 'month'
                                        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                                        : 'text-secondary-foreground hover:text-foreground'
                                }`}
                            >
                                This Month
                            </button>
                        </div>
                    </div>
                </div>

                {/* Metric Summary Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Completion Rate */}
                    <div className="p-5 bg-card border border-border rounded-xl flex flex-col justify-between space-y-3">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground block mb-1">Completion Rate</span>
                            <span className="text-2xl font-bold text-foreground">{metrics.completionRate}%</span>
                        </div>
                        <div>
                            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                                <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${metrics.completionRate}%` }} />
                            </div>
                            <span className="text-[11px] text-muted-foreground mt-2 block">{metrics.completedTasks} of {metrics.totalTasks} activities completed</span>
                        </div>
                    </div>

                    {/* On-time Rate */}
                    <div className="p-5 bg-card border border-border rounded-xl flex flex-col justify-between space-y-3">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground block mb-1">On-time Execution Rate</span>
                            <span className="text-2xl font-bold text-foreground">{metrics.onTimeRate}%</span>
                        </div>
                        <div>
                            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                                <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${metrics.onTimeRate}%` }} />
                            </div>
                            <span className="text-[11px] text-muted-foreground mt-2 block">Completed on or before due date</span>
                        </div>
                    </div>

                    {/* Overdue Ratio */}
                    <div className="p-5 bg-card border border-border rounded-xl flex flex-col justify-between space-y-3">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground block mb-1">Overdue Ratio</span>
                            <span className="text-2xl font-bold text-foreground">{metrics.overdueRatio}%</span>
                        </div>
                        <div>
                            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                                <div className="bg-destructive h-full rounded-full transition-all duration-300" style={{ width: `${metrics.overdueRatio}%` }} />
                            </div>
                            <span className="text-[11px] text-muted-foreground mt-2 block">{metrics.overdueTasks} of {metrics.totalTasks - metrics.completedTasks} open activities overdue</span>
                        </div>
                    </div>

                    {/* Throughput */}
                    <div className="p-5 bg-card border border-border rounded-xl flex flex-col justify-between space-y-3">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground block mb-1">Total Throughput</span>
                            <span className="text-2xl font-bold text-foreground">{metrics.doneCount}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                            <span className="text-primary font-semibold">Completed activities</span> in this window
                        </div>
                    </div>
                </div>

                {/* Additional Stat Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 bg-card border border-border rounded-xl space-y-1">
                        <span className="text-xs text-muted-foreground block">Total Projects</span>
                        <span className="text-2xl font-bold text-foreground block">{metrics.totalProjects}</span>
                        <span className="text-[11px] text-muted-foreground block">Active workspace projects</span>
                    </div>

                    <div className="p-5 bg-card border border-border rounded-xl space-y-1">
                        <span className="text-xs text-muted-foreground block">Total Activities</span>
                        <span className="text-2xl font-bold text-foreground block">{metrics.totalTasks}</span>
                        <span className="text-[11px] text-muted-foreground block">Logged tasks and issues</span>
                    </div>

                    <div className="p-5 bg-card border border-border rounded-xl space-y-1">
                        <span className="text-xs text-muted-foreground block">Completed Activities</span>
                        <span className="text-2xl font-bold text-foreground block">{metrics.completedTasks}</span>
                        <span className="text-[11px] text-muted-foreground block">Finished work items</span>
                    </div>

                    <div className="p-5 bg-card border border-border rounded-xl space-y-1">
                        <span className="text-xs text-muted-foreground block">Overdue Activities</span>
                        <span className="text-2xl font-bold text-foreground block">{metrics.overdueTasks}</span>
                        <span className="text-[11px] text-muted-foreground block">Items past target date</span>
                    </div>
                </div>

                {/* Main Content Grid with Headers OUTSIDE the Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                    {/* Activities Chart Section */}
                    <div className="lg:col-span-2 space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-foreground">Activities Progress</h2>
                            <span className="text-xs text-muted-foreground">Monthly breakdown</span>
                        </div>

                        <div className="p-5 bg-card border border-border rounded-xl h-[360px] flex flex-col justify-between">
                            <div className="flex-1 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} dx={-10} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px' }}
                                            itemStyle={{ color: 'var(--foreground)' }}
                                        />
                                        <Area type="monotone" dataKey="completed" stroke="var(--primary)" strokeWidth={2} fillOpacity={0.1} fill="var(--primary)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Announcements Section */}
                    <div className="lg:col-span-1 space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-foreground">Announcements</h2>
                            <button className="text-xs text-primary hover:underline font-medium">View All</button>
                        </div>

                        <div className="p-5 bg-card border border-border rounded-xl h-[360px]">
                            <div className="p-4 bg-secondary/50 border border-border rounded-lg space-y-1">
                                <h3 className="text-xs font-semibold text-foreground">System Maintenance Scheduled</h3>
                                <p className="text-[11px] text-muted-foreground">Downtime expected for v1.2 release.</p>
                                <span className="text-[10px] text-muted-foreground block pt-1">2 days ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
