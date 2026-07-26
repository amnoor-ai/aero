import { Head, router } from '@inertiajs/react';
import {
    Target,
    Search,
    Plus,
    Calendar,
    Folder,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
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

interface ProjectItem {
    id: number;
    name: string;
}

interface MilestoneItem {
    id: number;
    name: string;
    description: string | null;
    due_date: string | null;
    status: string;
    progress: number;
    is_overdue: boolean;
    tasks_count?: number;
    project?: ProjectItem;
}

interface MilestonesIndexProps {
    milestones: MilestoneItem[];
    projects: ProjectItem[];
    filters: any;
}

export default function MilestonesIndex({ milestones = [], projects = [], filters = {} }: MilestonesIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<string>(projects[0]?.id ? String(projects[0].id) : '');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSearch = (query: string) => {
        router.get('/milestones', { ...filters, search: query }, { preserveState: true, replace: true });
    };

    const handleStatusFilter = (val: string) => {
        router.get('/milestones', { ...filters, status: val }, { preserveState: true, replace: true });
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedProject || !name.trim()) {
return;
}

        router.post(
            `/projects/${selectedProject}/milestones`,
            { name, description, due_date: dueDate || null, status: 'active' },
            {
                onSuccess: () => {
                    setIsCreateOpen(false);
                    setName('');
                    setDescription('');
                    setDueDate('');
                },
            }
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this milestone?')) {
            router.delete(`/milestones/${id}`);
        }
    };

    return (
        <>
            <Head title="Milestones & Release Gates - Aero DevPM" />

            <div className="p-6 md:p-8 space-y-6 bg-background text-foreground min-h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            Milestones & Release Gates
                        </h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            Track project phase targets, delivery deadlines, and task completion progress.
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-primary text-primary-foreground font-semibold text-xs shadow-lg"
                    >
                        <Plus className="w-4 h-4 mr-1.5" /> Create Milestone
                    </Button>
                </div>

                {/* Filter Bar */}
                <div className="p-3 bg-card border border-border rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                    <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                        <input
                            type="text"
                            placeholder="Search milestones by name or project..."
                            value={filters.search || ''}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div className="flex bg-muted/50 p-1 rounded-lg border border-border">
                        <button
                            onClick={() => handleStatusFilter('')}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${!filters.status ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => handleStatusFilter('active')}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${filters.status === 'active' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => handleStatusFilter('completed')}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${filters.status === 'completed' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Completed
                        </button>
                    </div>
                </div>

                {/* Milestones Cards Grid */}
                {milestones.length === 0 ? (
                    <div className="bg-card border border-border rounded-xl p-12 text-center space-y-3">
                        <Target className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                        <h3 className="text-base font-semibold text-foreground">No Milestones Found</h3>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                            No milestone release targets match your current filters. Create a milestone to align team delivery phases.
                        </p>
                        <Button onClick={() => setIsCreateOpen(true)} size="sm" className="bg-primary text-primary-foreground mt-2">
                            <Plus className="w-4 h-4 mr-1.5" /> Create Milestone
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {milestones.map((m) => (
                            <div
                                key={m.id}
                                onClick={() => m.project && router.visit(`/projects/${m.project.id}`)}
                                className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 cursor-pointer transition-all duration-200 space-y-4 flex flex-col justify-between shadow-2xs group"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            {m.project && (
                                                <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium inline-flex items-center">
                                                    <Folder className="w-2.5 h-2.5 mr-1 text-muted-foreground" />
                                                    {m.project.name}
                                                </span>
                                            )}
                                            <h3 className="font-bold text-foreground text-base leading-snug group-hover:text-primary transition">{m.name}</h3>
                                        </div>

                                        <span
                                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                                m.is_overdue
                                                    ? 'bg-destructive/10 text-destructive border-destructive/20'
                                                    : m.status === 'completed'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-primary/10 text-primary border-primary/20'
                                            }`}
                                        >
                                            {m.is_overdue ? 'Overdue' : m.status}
                                        </span>
                                    </div>

                                    {m.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                            {m.description}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3 pt-3 border-t border-border">
                                    {/* Progress Bar */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground font-semibold">Progress</span>
                                            <span className="font-mono font-bold text-foreground">{m.progress}%</span>
                                        </div>
                                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden border border-border">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-500"
                                                style={{ width: `${m.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                                            <span>{m.due_date ? new Date(m.due_date).toLocaleDateString() : 'No Target Date'}</span>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(m.id);
                                            }}
                                            className="text-muted-foreground hover:text-destructive transition p-1"
                                            title="Delete Milestone"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Milestone Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <div className="flex items-center space-x-2 text-rose-400">
                                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                                    <Target className="w-5 h-5 text-rose-400" />
                                </div>
                                <DialogTitle className="text-xl">Create Milestone</DialogTitle>
                            </div>
                            <DialogDescription>
                                Establish a new delivery phase gate or release target for a project.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="project" className="text-xs font-semibold">Target Project *</Label>
                                <select
                                    id="project"
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none"
                                    value={selectedProject}
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                    required
                                >
                                    {projects.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs font-semibold">Milestone Title *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Beta V1.0 Release Gate"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="description" className="text-xs font-semibold">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Key deliverables and release objectives..."
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="due_date" className="text-xs font-semibold">Target Completion Date</Label>
                                <Input
                                    id="due_date"
                                    type="date"
                                    min="2000-01-01"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-primary text-primary-foreground">
                                Create Milestone
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

MilestonesIndex.layout = {
    breadcrumbs: [
        { title: 'Projects & Planning', href: '/projects' },
        { title: 'Milestones', href: '/milestones' },
    ],
};
