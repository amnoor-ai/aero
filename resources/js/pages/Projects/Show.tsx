import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { KanbanBoard } from '@/components/board/KanbanBoard';
import {
    Folder,
    Star,
    LayoutGrid,
    ListFilter,
    Users,
    FileText,
    MessageSquare,
    MapPin,
    Calendar,
    Pencil,
    Plus,
    Paperclip,
    Upload,
    File,
    X,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProjectProps {
    project: any;
    workspaceUsers: any[];
    stats: {
        total: number;
        todo: number;
        inProgress: number;
        inReview: number;
        completed: number;
        progress: number;
    };
}

type TabType = 'board' | 'list' | 'discussions' | 'milestones' | 'timeline' | 'team' | 'files';

export default function ProjectShow({ project, workspaceUsers = [], stats }: ProjectProps) {
    const [activeTab, setActiveTab] = useState<TabType>('board');

    const handleToggleStar = () => {
        router.post(`/projects/${project.id}/toggle-star`, {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title={`${project.name} - Aero DevPM`} />

            <div className="p-6 md:p-8 space-y-6 bg-background text-foreground">
                {/* Hero Header */}
                <div className="space-y-6 border-b border-border/50 pb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">{project.name}</h1>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Project Details</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Project Name</label>
                                                <Input defaultValue={project.name} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Description</label>
                                                <textarea 
                                                    className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background"
                                                    defaultValue={project.description || ''}
                                                    placeholder="Enter a brief overview of this project..."
                                                />
                                            </div>
                                            <Button className="w-full">Save Changes</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <span
                                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                                        project.status === 'ongoing'
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                    }`}
                                >
                                    {project.status}
                                </span>
                            </div>
                            
                            <p className="text-sm text-muted-foreground max-w-3xl">
                                {project.description || 'No project description provided. Click edit to add a brief overview of this project.'}
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <button
                                onClick={handleToggleStar}
                                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center ${
                                    project.is_starred
                                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                                        : 'bg-card border-border hover:bg-muted text-foreground'
                                }`}
                            >
                                <Star className={`w-4 h-4 mr-2 ${project.is_starred ? 'fill-amber-500' : ''}`} />
                                {project.is_starred ? 'Starred' : 'Star Project'}
                            </button>
                            
                            <Sheet>
                                <SheetTrigger asChild>
                                    <button className="px-4 py-2 bg-card border border-border hover:bg-muted text-foreground text-xs font-semibold rounded-lg transition-all flex items-center">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Project Brief
                                    </button>
                                </SheetTrigger>
                                <SheetContent className="w-[400px] sm:w-[540px]">
                                    <SheetHeader>
                                        <SheetTitle>Project Brief</SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-6">
                                        <div>
                                            <h3 className="font-semibold text-lg">{project.name}</h3>
                                            <p className="text-sm text-muted-foreground mt-2">{project.description || 'No detailed description.'}</p>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-lg border border-border">
                                            <h4 className="font-medium text-sm mb-2">Key Result Areas</h4>
                                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                                <li>Deliver MVP by Q3</li>
                                                <li>Achieve 90% test coverage</li>
                                                <li>Optimize database queries</li>
                                            </ul>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Update Status
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Update Project Status</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Status</label>
                                            <select className="w-full p-2 rounded-md border border-input bg-background" defaultValue={project.status}>
                                                <option value="planned">Planned</option>
                                                <option value="ongoing">Ongoing</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Progress Update (%)</label>
                                            <Input type="number" min="0" max="100" defaultValue={stats.progress} />
                                        </div>
                                        <Button className="w-full">Update Status</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Progress Bar Area */}
                    <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-semibold">Overall Progress</span>
                            <span className="font-bold text-primary">{stats.progress}% Completed</span>
                        </div>
                        <div className="w-full bg-muted h-3 rounded-full overflow-hidden border border-border/50">
                            <div
                                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${stats.progress}%` }}
                            />
                        </div>
                        <div className="flex items-center space-x-6 text-[11px] font-medium text-muted-foreground pt-1">
                            <span><strong className="text-foreground">{stats.todo}</strong> To Do</span>
                            <span><strong className="text-foreground">{stats.inProgress}</strong> In Progress</span>
                            <span><strong className="text-foreground">{stats.inReview}</strong> In Review</span>
                            <span><strong className="text-foreground">{stats.completed}</strong> Completed</span>
                            <span className="ml-auto"><strong className="text-foreground">{stats.total}</strong> Total Activities</span>
                        </div>
                    </div>
                </div>

                {/* Tabbed Navigation */}
                <div className="flex flex-wrap border-b border-border text-sm font-medium gap-x-8 gap-y-2">
                    <button
                        onClick={() => setActiveTab('board')}
                        className={`pb-4 transition border-b-2 flex items-center space-x-2 ${
                            activeTab === 'board'
                                ? 'border-primary text-primary font-bold'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                        }`}
                    >
                        <span>Activities (Board)</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('list')}
                        className={`pb-4 transition border-b-2 flex items-center space-x-2 ${
                            activeTab === 'list'
                                ? 'border-primary text-primary font-bold'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                        }`}
                    >
                        <span>List View</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('discussions')}
                        className={`pb-4 transition border-b-2 flex items-center space-x-2 ${
                            activeTab === 'discussions'
                                ? 'border-primary text-primary font-bold'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                        }`}
                    >
                        <span>Discussions</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('milestones')}
                        className={`pb-4 transition border-b-2 flex items-center space-x-2 ${
                            activeTab === 'milestones'
                                ? 'border-primary text-primary font-bold'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                        }`}
                    >
                        <span>Milestones</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('timeline')}
                        className={`pb-4 transition border-b-2 flex items-center space-x-2 ${
                            activeTab === 'timeline'
                                ? 'border-primary text-primary font-bold'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                        }`}
                    >
                        <span>Timeline</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('team')}
                        className={`pb-4 transition border-b-2 flex items-center space-x-2 ${
                            activeTab === 'team'
                                ? 'border-primary text-primary font-bold'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                        }`}
                    >
                        <span>Team ({project.members?.length || 0})</span>
                    </button>
                    
                    <button
                        onClick={() => setActiveTab('files')}
                        className={`pb-4 transition border-b-2 flex items-center space-x-2 ${
                            activeTab === 'files'
                                ? 'border-primary text-primary font-bold'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                        }`}
                    >
                        <span>Files</span>
                    </button>
                </div>

                {activeTab === 'files' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-foreground">Project Documents</h3>
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Upload className="w-4 h-4 mr-2" />
                                Add Attachment
                            </Button>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground flex flex-col items-center">
                            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                                <Paperclip className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <h4 className="text-foreground font-semibold mb-1">No Attachments Available yet</h4>
                            <p className="text-sm">Upload files, documents, and images to share with your team.</p>
                            <Button variant="outline" className="mt-6">
                                <Plus className="w-4 h-4 mr-2" />
                                Browse Files
                            </Button>
                        </div>
                    </div>
                )}

                {activeTab === 'board' && (
                    <KanbanBoard
                        projectId={project.id}
                        columns={project.board_columns || []}
                        users={workspaceUsers}
                    />
                )}

                {activeTab === 'list' && (
                    <div className="bg-card border border-border rounded-2xl p-6 text-center text-muted-foreground text-sm">
                        Dense list view rendering tasks...
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="p-6 bg-card border border-border rounded-2xl space-y-4 max-w-xl">
                        <h3 className="text-sm font-bold text-foreground">Project Members & Permissions</h3>
                        <div className="divide-y divide-border">
                            {project.members?.map((member: any) => (
                                <div key={member.id} className="py-3 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-foreground text-xs">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-sm text-foreground block">{member.name}</span>
                                            <span className="text-xs text-muted-foreground">{member.email}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono uppercase text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/30">
                                        {member.pivot?.role || 'contributor'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'discussions' && (
                    <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground text-sm">
                        No active discussions for this project. Start a new topic to keep everyone aligned.
                    </div>
                )}

                {activeTab === 'milestones' && (
                    <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground text-sm">
                        No milestones defined yet. Break your project into major phases to track progress.
                    </div>
                )}

                {activeTab === 'timeline' && (
                    <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground text-sm">
                        Timeline view coming soon. A visual Gantt chart of your activities.
                    </div>
                )}

                {activeTab === 'files' && (
                    <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground text-sm">
                        No files uploaded to this project yet. Share documents, designs, and specs here.
                    </div>
                )}
            </div>
        </>
    );
}

ProjectShow.layout = {
    breadcrumbs: [
        {
            title: 'Projects',
            href: '/projects',
        },
        {
            title: 'Project Details',
            href: '#',
        },
    ],
};
