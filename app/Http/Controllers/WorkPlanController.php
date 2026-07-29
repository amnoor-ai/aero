<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\WorkPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkPlanController extends Controller
{
    public function index(Request $request): Response
    {
        $workspaceId = 1;

        $workPlans = WorkPlan::where('workspace_id', $workspaceId)
            ->with(['projects.sprints', 'projects.milestones'])
            ->latest()
            ->get()
            ->map(function ($wp) {
                return [
                    'id' => $wp->id,
                    'name' => $wp->name,
                    'description' => $wp->description,
                    'status' => $wp->status,
                    'start_date' => $wp->start_date?->toDateString(),
                    'due_date' => $wp->due_date?->toDateString(),
                    'progress' => $wp->progress,
                    'projects_count' => $wp->projects->count(),
                    'projects' => $wp->projects->map(fn ($p) => [
                        'id' => $p->id,
                        'name' => $p->name,
                        'status' => $p->status,
                        'start_date' => $p->start_date?->toDateString() ?? $p->created_at->toDateString(),
                        'due_date' => $p->due_date?->toDateString() ?? $p->created_at->addDays(30)->toDateString(),
                        'progress' => $p->progress,
                        'sprints' => $p->sprints->map(fn ($s) => [
                            'id' => $s->id,
                            'name' => $s->name,
                            'status' => $s->status,
                            'start_date' => $s->start_date?->toDateString() ?? $p->created_at->toDateString(),
                            'end_date' => $s->end_date?->toDateString() ?? $p->created_at->addDays(14)->toDateString(),
                        ]),
                        'milestones' => $p->milestones->map(fn ($m) => [
                            'id' => $m->id,
                            'name' => $m->name,
                            'status' => $m->status,
                            'due_date' => $m->due_date?->toDateString() ?? $p->created_at->addDays(20)->toDateString(),
                            'progress' => $m->progress,
                        ]),
                    ]),
                ];
            });

        $allProjects = Project::where('workspace_id', $workspaceId)
            ->select('id', 'name', 'status', 'start_date', 'due_date')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'status' => $p->status,
                'progress' => $p->progress,
            ]);

        return Inertia::render('WorkPlan/Index', [
            'workPlans' => $workPlans,
            'allProjects' => $allProjects,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'project_ids' => 'nullable|array',
            'project_ids.*' => 'exists:projects,id',
        ]);

        $workspaceId = 1;

        $workPlan = WorkPlan::create([
            'workspace_id' => $workspaceId,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'] ?? 'active',
            'start_date' => $validated['start_date'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
        ]);

        if (! empty($validated['project_ids'])) {
            $workPlan->projects()->sync($validated['project_ids']);
        }

        return back()->with('success', 'Work plan created successfully.');
    }

    public function update(Request $request, WorkPlan $workPlan): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
        ]);

        $workPlan->update($validated);

        return back()->with('success', 'Work plan updated successfully.');
    }

    public function destroy(WorkPlan $workPlan): RedirectResponse
    {
        $workPlan->delete();

        return back()->with('success', 'Work plan deleted.');
    }

    public function attachProjects(Request $request, WorkPlan $workPlan): RedirectResponse
    {
        $validated = $request->validate([
            'project_ids' => 'present|array',
            'project_ids.*' => 'exists:projects,id',
        ]);

        $workPlan->projects()->sync($validated['project_ids']);

        return back()->with('success', 'Attached projects updated successfully.');
    }
}
