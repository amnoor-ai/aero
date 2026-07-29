<?php

namespace App\Http\Controllers;

use App\Models\Department;
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
            ->with(['lead', 'members', 'department'])
            ->withCount('tasks');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->input('search').'%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $sortBy = $request->input('sort_by', 'updated_at');
        $order = strtolower($request->input('order', 'desc')) === 'asc' ? 'asc' : 'desc';

        if (in_array($sortBy, ['name', 'status', 'created_at', 'updated_at'])) {
            $query->orderBy($sortBy, $order);
        } else {
            $query->latest('updated_at');
        }

        $projects = $query->paginate(12)->withQueryString();
        $departments = Department::select('id', 'name', 'code')->orderBy('name')->get();
        $workspaceUsers = User::select('id', 'name', 'email')->orderBy('name')->get();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'departments' => $departments,
            'workspaceUsers' => $workspaceUsers,
            'filters' => $request->only(['search', 'status', 'sort_by', 'order']),
        ]);
    }

    public function show(Project $project): Response
    {
        $project->load([
            'lead',
            'members',
            'department',
            'milestones',
            'documents.uploadedBy',
            'tasks' => function ($t) {
                $t->latest('created_at')
                    ->with(['boardColumn', 'assignee', 'checklists', 'comments.user', 'activities.user']);
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

        if ($project->boardColumns->isEmpty()) {
            $defaultColumns = [
                ['name' => 'Backlog', 'position' => 1, 'color' => '#64748b'],
                ['name' => 'To Do', 'position' => 2, 'color' => '#3b82f6'],
                ['name' => 'In Progress', 'position' => 3, 'color' => '#f59e0b'],
                ['name' => 'In Review', 'position' => 4, 'color' => '#8b5cf6'],
                ['name' => 'Done', 'position' => 5, 'color' => '#10b981'],
            ];

            foreach ($defaultColumns as $colData) {
                $project->boardColumns()->create($colData);
            }

            $project->load(['boardColumns' => function ($query) {
                $query->orderBy('position')->with([
                    'tasks' => function ($t) {
                        $t->orderBy('position')
                            ->with(['assignee', 'checklists', 'comments.user', 'activities.user']);
                    },
                ]);
            }]);
        }

        $users = User::select('id', 'name', 'email')->get();

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
            'department_id' => 'nullable|exists:departments,id',
            'lead_id' => 'nullable|exists:users,id',
            'description' => 'nullable|string',
            'status' => 'required|string|in:draft,planned,ongoing,completed,archived',
            'start_date' => 'nullable|date|after_or_equal:2000-01-01',
            'due_date' => 'nullable|date|after_or_equal:2000-01-01',
            'budget' => 'nullable|numeric|min:0',
            'tags' => 'nullable|array',
            'members' => 'nullable|array',
        ]);

        $workspaceId = 1;
        $validated['slug'] = Str::slug($validated['name']).'-'.time();
        $validated['workspace_id'] = $workspaceId;
        $validated['lead_id'] = $validated['lead_id'] ?? $request->user()->id;

        $project = Project::create($validated);

        // Auto-create default board columns
        $defaultColumns = [
            ['name' => 'Backlog', 'position' => 1, 'color' => '#64748b'],
            ['name' => 'To Do', 'position' => 2, 'color' => '#3b82f6'],
            ['name' => 'In Progress', 'position' => 3, 'color' => '#f59e0b'],
            ['name' => 'In Review', 'position' => 4, 'color' => '#8b5cf6'],
            ['name' => 'Done', 'position' => 5, 'color' => '#10b981'],
        ];

        foreach ($defaultColumns as $colData) {
            $project->boardColumns()->create($colData);
        }

        // Attach lead as lead member
        $project->members()->attach($project->lead_id, ['role' => 'lead']);

        if (! empty($validated['members'])) {
            foreach ($validated['members'] as $m) {
                if ($m['user_id'] != $project->lead_id) {
                    $project->members()->syncWithoutDetaching([
                        $m['user_id'] => ['role' => $m['role'] ?? 'developer'],
                    ]);
                }
            }
        }

        return redirect()->route('projects.show', $project->id)
            ->with('success', 'Project created successfully.');
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'lead_id' => 'nullable|exists:users,id',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|string|in:draft,planned,ongoing,completed,archived',
            'start_date' => 'nullable|date|after_or_equal:2000-01-01',
            'due_date' => 'nullable|date|after_or_equal:2000-01-01',
            'budget' => 'nullable|numeric|min:0',
        ]);

        $project->update($validated);

        return back()->with('success', 'Project updated successfully.');
    }
}
