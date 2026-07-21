import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Folder,
    CheckCircle2,
    AlertTriangle,
    Clock,
    TrendingUp,
    ListTodo,
    Activity,
    Info,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PendingInvitationsModal from '@/components/pending-invitations-modal';

// Mock data for the chart
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

export default function Dashboard({ metrics, timeframe = 'month', activeSprint, recentProjects = [], pendingInvitations = [] }: DashboardProps) {
    const handleTimeframeChange = (tf: string) => {
        router.get('/dashboard', { timeframe: tf }, { preserveState: true, replace: true });
    };

    const total = metrics.totalTasks || 1;
    const todoPct = Math.round((metrics.todoCount / total) * 100);
    const inProgressPct = Math.round((metrics.inProgressCount / total) * 100);
    const inReviewPct = Math.round((metrics.inReviewCount / total) * 100);
    const donePct = Math.round((metrics.doneCount / total) * 100);

    const [isInvitationsModalOpen, setIsInvitationsModalOpen] = React.useState(pendingInvitations.length > 0);

    return (
        <>
            <Head title="Dashboard - Aero DevPM" />
            <PendingInvitationsModal 
                invitations={pendingInvitations} 
                open={isInvitationsModalOpen}
                onOpenChange={setIsInvitationsModalOpen}
            />

            <div className="p-6 md:p-8 space-y-6 bg-background text-foreground">
                {/* Header with Timeframe Pills */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">Workspace Overview</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Execution health, operational load, and recent organization updates.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-card p-1 rounded-full border border-border text-xs">
                            <button
                                onClick={() => handleTimeframeChange('today')}
                                className={`px-3 py-1 font-semibold rounded-full transition ${
                                    timeframe === 'today'
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Today
                            </button>
                            <button
                                onClick={() => handleTimeframeChange('week')}
                                className={`px-3 py-1 font-semibold rounded-full transition ${
                                    timeframe === 'week'
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                This Week
                            </button>
                            <button
                                onClick={() => handleTimeframeChange('month')}
                                className={`px-3 py-1 font-semibold rounded-full transition ${
                                    timeframe === 'month'
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                This Month
                            </button>
                        </div>
                    </div>
                </div>

                {/* Top Row: Metric Summary Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Completion Rate */}
                    <div className="p-5 bg-card/40 border border-border/50 rounded-lg flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-muted-foreground">Completion Rate</span>
                                <div className="p-1.5 rounded-md border border-border text-emerald-500">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-foreground">{metrics.completionRate}%</span>
                        </div>
                        <div className="mt-4">
                            <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${metrics.completionRate}%` }} />
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-2 block">{metrics.completedTasks} of {metrics.totalTasks} activities completed</span>
                        </div>
                    </div>

                    {/* On-time Rate */}
                    <div className="p-5 bg-card/40 border border-border/50 rounded-lg flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-muted-foreground">On-time Rate</span>
                                <div className="p-1.5 rounded-md border border-border text-blue-500">
                                    <Clock className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-foreground">{metrics.onTimeRate}%</span>
                        </div>
                        <div className="mt-4">
                            <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${metrics.onTimeRate}%` }} />
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-2 block">Completed on or before due date</span>
                        </div>
                    </div>

                    {/* Overdue Ratio */}
                    <div className="p-5 bg-card/40 border border-border/50 rounded-lg flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-muted-foreground">Overdue Ratio</span>
                                <div className="p-1.5 rounded-md border border-border text-destructive">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-foreground">{metrics.overdueRatio}%</span>
                        </div>
                        <div className="mt-4">
                            <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                                <div className="bg-destructive h-full rounded-full" style={{ width: `${metrics.overdueRatio}%` }} />
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-2 block">{metrics.overdueTasks} of {metrics.totalTasks - metrics.completedTasks} open activities overdue</span>
                        </div>
                    </div>

                    {/* Throughput */}
                    <div className="p-5 bg-card/40 border border-border/50 rounded-lg flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-muted-foreground">Throughput</span>
                                <div className="p-1.5 rounded-md border border-border text-emerald-500">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-foreground">{metrics.doneCount}</span>
                        </div>
                        <div className="mt-4 flex items-center text-[10px] text-muted-foreground">
                            <span className="bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded mr-1">↗ 100%</span> vs 0 last month
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Additional Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 bg-card/40 border border-border/50 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-primary/10 text-primary rounded-lg"><Folder className="w-4 h-4" /></div>
                            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-1.5 py-0.5 rounded">↑ 0%</span>
                        </div>
                        <span className="text-xs text-muted-foreground block mb-1">Total Projects</span>
                        <span className="text-2xl font-bold text-foreground block mb-3">{metrics.totalProjects}</span>
                        <span className="text-[10px] text-muted-foreground">vs last month</span>
                    </div>

                    <div className="p-5 bg-card/40 border border-border/50 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><ListTodo className="w-4 h-4" /></div>
                            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-1.5 py-0.5 rounded">↑ 50%</span>
                        </div>
                        <span className="text-xs text-muted-foreground block mb-1">Total Activities</span>
                        <span className="text-2xl font-bold text-foreground block mb-3">{metrics.totalTasks}</span>
                        <span className="text-[10px] text-muted-foreground">vs last month</span>
                    </div>

                    <div className="p-5 bg-card/40 border border-border/50 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><CheckCircle2 className="w-4 h-4" /></div>
                            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-1.5 py-0.5 rounded">↑ 14.3%</span>
                        </div>
                        <span className="text-xs text-muted-foreground block mb-1">Completed Activities</span>
                        <span className="text-2xl font-bold text-foreground block mb-3">{metrics.completedTasks}</span>
                        <span className="text-[10px] text-muted-foreground">vs last month</span>
                    </div>

                    <div className="p-5 bg-card/40 border border-border/50 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg"><AlertTriangle className="w-4 h-4" /></div>
                            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-1.5 py-0.5 rounded">↑ 15%</span>
                        </div>
                        <span className="text-xs text-muted-foreground block mb-1">Overdue Activities</span>
                        <span className="text-2xl font-bold text-foreground block mb-3">{metrics.overdueTasks}</span>
                        <span className="text-[10px] text-muted-foreground">vs last month</span>
                    </div>
                </div>

                {/* Main Content Grid: Chart & Announcements */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="p-6 bg-card/40 border border-border/50 rounded-lg h-[400px] flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm font-bold text-foreground">Activities</h2>
                                <div className="flex items-center space-x-2 text-xs">
                                    <span className="text-muted-foreground">Time Frame:</span>
                                    <select className="bg-background border border-border rounded-md px-2 py-1 text-foreground focus:outline-none focus:border-primary">
                                        <option>Last Year</option>
                                        <option>This Year</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="flex-1 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dx={-10} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                                            itemStyle={{ color: '#e2e8f0' }}
                                        />
                                        <Area type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorPending)" />
                                        <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex items-center justify-center space-x-6 mt-4 text-[11px] text-muted-foreground">
                                <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>Completed</div>
                                <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>Pending</div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="p-6 bg-card/40 border border-border/50 rounded-lg h-[400px]">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm font-bold text-foreground">Announcements</h2>
                                <button className="text-[10px] px-3 py-1 border border-border rounded-md hover:bg-muted transition">View All</button>
                            </div>
                            
                            <div className="space-y-4">
                                {/* Sample Announcement */}
                                <div className="p-4 bg-background/50 border border-border/50 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-md">
                                                <Info className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-bold text-foreground">System Maintenance Scheduled</h3>
                                                <p className="text-[10px] text-muted-foreground mt-0.5">Downtime expected for v1.2 release</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">2 days ago</span>
                                    </div>
                                    <div className="mt-3">
                                        <span className="text-[9px] px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded border border-blue-500/20">maintenance</span>
                                    </div>
                                </div>
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
