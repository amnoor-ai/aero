<?php

namespace App\Http\Controllers;

use App\Models\BoardColumn;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $workspaceId = 1;
        $query = Project::where('workspace_id', $workspaceId)
            ->with(['lead', 'members'])
            ->withCount('tasks');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->input('search').'%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->boolean('starred')) {
            $query->where('is_starred', true);
        }

        $projects = $query->latest('updated_at')->get();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'filters' => $request->only(['search', 'status', 'starred']),
        ]);
    }

    public function show(Project $project): Response
    {
        $project->load([
            'lead',
            'members',
            'sprints' => function ($q) {
                $q->orderBy('created_at', 'desc');
            },
            'boardColumns' => function ($query) {
                $query->orderBy('position')->with([
                    'tasks' => function ($t) {
                        $t->orderBy('position')
                            ->with(['assignee', 'checklists', 'comments.user', 'activities.user']);
                    },
                ]);
            },
        ]);

        $users = User::select('id', 'name', 'email')->get();

        // Product Backlog tasks (tasks not assigned to any sprint or assigned to future sprints)
        $backlogTasks = $project->tasks()
            ->whereNull('sprint_id')
            ->with(['assignee', 'boardColumn'])
            ->get();

        // Active sprint details
        $activeSprint = $project->sprints->firstWhere('status', 'active');
        if ($activeSprint) {
            $activeSprint->load(['tasks.assignee', 'tasks.boardColumn']);
        }

        // Count task stats for Header Strip
        $allTasks = $project->boardColumns->flatMap->tasks;
        $totalCount = $allTasks->count();
        $todoCount = $allTasks->filter(fn ($t) => in_array($t->boardColumn?->name, ['Backlog', 'To Do']))->count();
        $inProgressCount = $allTasks->filter(fn ($t) => $t->boardColumn?->name === 'In Progress')->count();
        $inReviewCount = $allTasks->filter(fn ($t) => $t->boardColumn?->name === 'In Review')->count();
        $completedCount = $allTasks->filter(fn ($t) => $t->boardColumn?->name === 'Done')->count();

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'workspaceUsers' => $users,
            'activeSprint' => $activeSprint,
            'allSprints' => $project->sprints,
            'backlogTasks' => $backlogTasks,
            'stats' => [
                'total' => $totalCount,
                'todo' => $todoCount,
                'inProgress' => $inProgressCount,
                'inReview' => $inReviewCount,
                'completed' => $completedCount,
                'progress' => $project->progress,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|in:planned,ongoing,completed,archived',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
        ]);

        $workspaceId = 1;
        $slug = Str::slug($validated['name']).'-'.Str::random(4);

        $project = Project::create([
            'workspace_id' => $workspaceId,
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'],
            'lead_id' => $request->user()?->id ?? 1,
            'start_date' => $validated['start_date'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'is_starred' => false,
        ]);

        // Seed default board columns
        $defaultColumns = [
            ['name' => 'Backlog', 'color' => '#64748B', 'position' => 1],
            ['name' => 'To Do', 'color' => '#3B82F6', 'position' => 2],
            ['name' => 'In Progress', 'color' => '#F59E0B', 'position' => 3],
            ['name' => 'In Review', 'color' => '#8B5CF6', 'position' => 4],
            ['name' => 'Done', 'color' => '#10B981', 'position' => 5],
        ];

        foreach ($defaultColumns as $col) {
            BoardColumn::create([
                'project_id' => $project->id,
                'name' => $col['name'],
                'color' => $col['color'],
                'position' => $col['position'],
            ]);
        }

        // Attach owner as lead member
        $project->members()->attach($project->lead_id, ['role' => 'lead']);

        return redirect()->route('projects.show', $project->id)
            ->with('success', 'Project created successfully.');
    }

    public function toggleStar(Project $project): RedirectResponse
    {
        $project->update(['is_starred' => ! $project->is_starred]);

        return back();
    }
}
