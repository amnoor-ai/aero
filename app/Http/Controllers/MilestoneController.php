<?php

namespace App\Http\Controllers;

use App\Models\Milestone;
use App\Models\Project;
use App\Models\WorkPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MilestoneController extends Controller
{
    public function globalIndex(Request $request): Response
    {
        $workspaceId = 1;
        $query = Milestone::where('workspace_id', $workspaceId)
            ->with(['project', 'workPlan'])
            ->withCount('tasks');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('project', function ($p) use ($search) {
                        $p->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('workPlan', function ($wp) use ($search) {
                        $wp->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $milestones = $query->latest('due_date')->get();
        $projects = Project::where('workspace_id', $workspaceId)->select('id', 'name')->orderBy('name')->get();
        $workPlans = WorkPlan::where('workspace_id', $workspaceId)->select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Milestones/Index', [
            'milestones' => $milestones,
            'projects' => $projects,
            'workPlans' => $workPlans,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function storeGlobal(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'owner_type' => 'nullable|string|in:project,work_plan',
            'project_id' => 'nullable|exists:projects,id',
            'work_plan_id' => 'nullable|exists:work_plans,id',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'status' => 'required|string|in:active,completed,upcoming,on_hold',
        ]);

        $workspaceId = 1;

        // If owner_type is project, ensure work_plan_id is null; if work_plan, project_id is null
        $projectId = ($validated['owner_type'] ?? '') === 'project' ? ($validated['project_id'] ?? null) : null;
        $workPlanId = ($validated['owner_type'] ?? '') === 'work_plan' ? ($validated['work_plan_id'] ?? null) : null;

        // Fallback if owner_type wasn't specified but one ID was provided
        if (! $projectId && ! $workPlanId) {
            $projectId = $validated['project_id'] ?? null;
            $workPlanId = $validated['work_plan_id'] ?? null;
        }

        Milestone::create([
            'workspace_id' => $workspaceId,
            'project_id' => $projectId,
            'work_plan_id' => $workPlanId,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'start_date' => $validated['start_date'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'status' => $validated['status'],
        ]);

        return back()->with('success', 'Milestone created successfully.');
    }

    public function store(Request $request, Project $project): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'status' => 'required|string|in:active,completed,upcoming,on_hold',
        ]);

        Milestone::create([
            'workspace_id' => $project->workspace_id,
            'project_id' => $project->id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'start_date' => $validated['start_date'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'status' => $validated['status'],
        ]);

        return back()->with('success', 'Milestone created successfully.');
    }

    public function update(Request $request, Milestone $milestone): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'owner_type' => 'nullable|string|in:project,work_plan',
            'project_id' => 'nullable|exists:projects,id',
            'work_plan_id' => 'nullable|exists:work_plans,id',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'status' => 'required|string|in:active,completed,upcoming,on_hold',
        ]);

        if (array_key_exists('owner_type', $validated)) {
            if ($validated['owner_type'] === 'project') {
                $validated['work_plan_id'] = null;
            } elseif ($validated['owner_type'] === 'work_plan') {
                $validated['project_id'] = null;
            }
            unset($validated['owner_type']);
        }

        $milestone->update($validated);

        return back()->with('success', 'Milestone updated.');
    }

    public function destroy(Milestone $milestone): RedirectResponse
    {
        $milestone->delete();

        return back()->with('success', 'Milestone deleted.');
    }
}
