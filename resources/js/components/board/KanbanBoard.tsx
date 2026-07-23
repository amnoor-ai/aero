import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Plus, CheckSquare, MessageSquare, AlertCircle, User, GitBranch } from 'lucide-react';
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal';

interface TaskItem {
    id: number;
    project_id: number;
    board_column_id: number;
    title: string;
    description?: string;
    type: 'bug' | 'feature' | 'improvement' | 'task';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    story_points?: number;
    assignee?: { id: number; name: string; email: string };
    due_date?: string;
    git_branch?: string;
    checklists?: any[];
    comments?: any[];
}

interface ColumnItem {
    id: number;
    name: string;
    color?: string;
    tasks: TaskItem[];
}

interface KanbanBoardProps {
    projectId: number;
    columns: ColumnItem[];
    users: any[];
}

export function KanbanBoard({ projectId, columns = [], users = [] }: KanbanBoardProps) {
    const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // New task modal state
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [createColumnId, setCreateColumnId] = useState<number | null>(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskType, setNewTaskType] = useState('feature');
    const [newTaskPriority, setNewTaskPriority] = useState('medium');

    const openTaskModal = (task: TaskItem) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || !createColumnId) return;

        router.post(
            '/tasks',
            {
                project_id: projectId,
                board_column_id: createColumnId,
                title: newTaskTitle,
                type: newTaskType,
                priority: newTaskPriority,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsCreateTaskOpen(false);
                    setNewTaskTitle('');
                },
            }
        );
    };

    return (
        <div className="space-y-6">
            {/* Kanban Columns Grid */}
            <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth touch-pan-x min-h-[500px] max-w-full">
                {columns.map((column) => (
                    <div
                        key={column.id}
                        className="w-72 sm:w-80 shrink-0 snap-start bg-secondary/80 border border-border/80 rounded-2xl p-4 flex flex-col max-h-[75vh]"
                    >
                        {/* Column Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                            <div className="flex items-center space-x-2">
                                <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: column.color || '#3B82F6' }}
                                />
                                <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">
                                    {column.name}
                                </h3>
                                <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-mono text-muted-foreground">
                                    {column.tasks?.length || 0}
                                </span>
                            </div>

                            <button
                                onClick={() => {
                                    setCreateColumnId(column.id);
                                    setIsCreateTaskOpen(true);
                                }}
                                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                                title="Add task to column"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Cards Container */}
                        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                            {column.tasks?.length === 0 ? (
                                <div className="p-6 border border-dashed border-border/80 rounded-xl text-center space-y-2 bg-muted/20 my-auto">
                                    <p className="text-xs text-muted-foreground font-medium">No tasks in {column.name}</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCreateColumnId(column.id);
                                            setIsCreateTaskOpen(true);
                                        }}
                                        className="text-[11px] font-bold text-primary hover:underline inline-flex items-center"
                                    >
                                        <Plus className="w-3 h-3 mr-1" /> Add Task
                                    </button>
                                </div>
                            ) : (
                                column.tasks?.map((task) => {
                                    const completedChecklists = task.checklists?.filter((c) => c.is_completed).length || 0;
                                    const totalChecklists = task.checklists?.length || 0;

                                    return (
                                        <div
                                            key={task.id}
                                            onClick={() => openTaskModal(task)}
                                            className="p-3 bg-card hover:bg-accent/10 border border-border/80 hover:border-primary/50 rounded-xl cursor-pointer shadow-sm hover:shadow-md transition space-y-2.5 group"
                                        >
                                            {/* Task Type & Priority Badges */}
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                                        task.type === 'bug'
                                                            ? 'bg-destructive/10 text-destructive border-destructive/30'
                                                            : task.type === 'feature'
                                                            ? 'bg-primary/10 text-primary border-primary/30'
                                                            : 'bg-accent/10 text-accent-foreground border-accent/30'
                                                    }`}
                                                >
                                                    {task.type}
                                                </span>

                                                <span
                                                    className={`text-[9px] font-bold uppercase ${
                                                        task.priority === 'urgent'
                                                            ? 'text-destructive'
                                                            : task.priority === 'high'
                                                            ? 'text-accent-foreground'
                                                            : 'text-muted-foreground'
                                                    }`}
                                                >
                                                    {task.priority}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h4 className="text-xs font-semibold text-card-foreground group-hover:text-primary transition leading-snug">
                                                {task.title}
                                            </h4>

                                            {/* Git Branch Badge */}
                                            {task.git_branch && (
                                                <div className="flex items-center text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 w-fit truncate max-w-full">
                                                    <GitBranch className="w-3 h-3 mr-1 shrink-0" />
                                                    <span className="truncate">{task.git_branch}</span>
                                                </div>
                                            )}

                                            {/* Card Footer: Checklists, Comments, Assignee */}
                                            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                                                <div className="flex items-center space-x-2">
                                                    {totalChecklists > 0 && (
                                                        <span className="flex items-center text-muted-foreground">
                                                            <CheckSquare className="w-3 h-3 mr-1 text-muted-foreground" />
                                                            {completedChecklists}/{totalChecklists}
                                                        </span>
                                                    )}

                                                    {task.comments && task.comments.length > 0 && (
                                                        <span className="flex items-center text-muted-foreground">
                                                            <MessageSquare className="w-3 h-3 mr-1" />
                                                            {task.comments.length}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Assignee Avatar */}
                                                {task.assignee ? (
                                                    <div
                                                        className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground uppercase"
                                                        title={task.assignee.name}
                                                    >
                                                        {task.assignee.name.charAt(0)}
                                                    </div>
                                                ) : (
                                                    <User className="w-4 h-4 text-muted-foreground" />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Task Detail Modal */}
            <TaskDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                task={selectedTask}
                columns={columns}
                users={users}
            />

            {/* Quick Create Task Modal */}
            {isCreateTaskOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 space-y-4">
                        <h3 className="text-sm font-bold text-card-foreground">Add Task to Column</h3>

                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Task Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Implement OAuth login provider"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    className="w-full bg-background border border-input rounded-lg p-2 text-xs text-foreground focus:outline-none focus:border-ring"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">Issue Type</label>
                                    <select
                                        value={newTaskType}
                                        onChange={(e) => setNewTaskType(e.target.value)}
                                        className="w-full bg-background border border-input rounded-lg p-2 text-xs text-foreground focus:outline-none focus:border-ring"
                                    >
                                        <option value="feature">Feature</option>
                                        <option value="bug">Bug</option>
                                        <option value="improvement">Improvement</option>
                                        <option value="task">Task</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">Priority</label>
                                    <select
                                        value={newTaskPriority}
                                        onChange={(e) => setNewTaskPriority(e.target.value)}
                                        className="w-full bg-background border border-input rounded-lg p-2 text-xs text-foreground focus:outline-none focus:border-ring"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateTaskOpen(false)}
                                    className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-xs font-semibold text-primary-foreground rounded-lg"
                                >
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
