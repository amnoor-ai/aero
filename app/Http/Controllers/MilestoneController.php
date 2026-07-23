<?php

namespace App\Http\Controllers;

use App\Models\Milestone;
use App\Models\Project;
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
            ->with(['project'])
            ->withCount('tasks');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('project', function ($p) use ($search) {
                        $p->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $milestones = $query->latest('due_date')->get();
        $projects = Project::where('workspace_id', $workspaceId)->select('id', 'name')->get();

        return Inertia::render('Milestones/Index', [
            'milestones' => $milestones,
            'projects' => $projects,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function store(Request $request, Project $project): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'required|string|in:active,completed',
        ]);

        Milestone::create([
            'workspace_id' => $project->workspace_id,
            'project_id' => $project->id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
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
            'due_date' => 'nullable|date',
            'status' => 'required|string|in:active,completed',
        ]);

        $milestone->update($validated);

        return back()->with('success', 'Milestone updated.');
    }

    public function destroy(Milestone $milestone): RedirectResponse
    {
        $milestone->delete();

        return back()->with('success', 'Milestone deleted.');
    }
}
