<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Sprint;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SprintController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'name' => 'required|string|max:255',
            'goal' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'required|string|in:future,active',
        ]);

        $project = Project::findOrFail($validated['project_id']);

        // If trying to create as active, check if another sprint is currently active
        if ($validated['status'] === 'active') {
            Sprint::where('project_id', $project->id)
                ->where('status', 'active')
                ->update(['status' => 'future']);
        }

        $sprint = Sprint::create([
            'workspace_id' => $project->workspace_id,
            'project_id' => $project->id,
            'name' => $validated['name'],
            'goal' => $validated['goal'] ?? null,
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'status' => $validated['status'],
        ]);

        return back()->with('success', 'Sprint created successfully.');
    }

    public function update(Request $request, Sprint $sprint): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'goal' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $sprint->update($validated);

        return back()->with('success', 'Sprint updated successfully.');
    }

    public function start(Sprint $sprint): RedirectResponse
    {
        // Deactivate any currently active sprint for this project
        Sprint::where('project_id', $sprint->project_id)
            ->where('status', 'active')
            ->update(['status' => 'future']);

        $sprint->update([
            'status' => 'active',
            'start_date' => $sprint->start_date ?? now()->toDateString(),
            'end_date' => $sprint->end_date ?? now()->addDays(14)->toDateString(),
        ]);

        return back()->with('success', "{$sprint->name} is now active.");
    }

    public function complete(Request $request, Sprint $sprint): RedirectResponse
    {
        $validated = $request->validate([
            'rollover_action' => 'required|string|in:backlog,next_sprint',
            'target_sprint_id' => 'nullable|exists:sprints,id',
        ]);

        // Complete current sprint
        $sprint->update(['status' => 'completed']);

        // Find uncompleted tasks in this sprint (tasks not in 'Done' board column)
        $incompleteTasks = Task::where('sprint_id', $sprint->id)
            ->whereHas('boardColumn', function ($query) {
                $query->where('name', '!=', 'Done');
            })
            ->get();

        if ($validated['rollover_action'] === 'next_sprint' && ! empty($validated['target_sprint_id'])) {
            Task::whereIn('id', $incompleteTasks->pluck('id'))
                ->update(['sprint_id' => $validated['target_sprint_id']]);
        } else {
            // Move incomplete tasks to Product Backlog (null sprint_id)
            Task::whereIn('id', $incompleteTasks->pluck('id'))
                ->update(['sprint_id' => null]);
        }

        return back()->with('success', "{$sprint->name} completed. {$incompleteTasks->count()} incomplete tasks rolled over.");
    }

    public function assignTasks(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'task_ids' => 'required|array',
            'task_ids.*' => 'exists:tasks,id',
            'sprint_id' => 'nullable|exists:sprints,id',
        ]);

        Task::whereIn('id', $validated['task_ids'])
            ->update(['sprint_id' => $validated['sprint_id']]);

        return back()->with('success', 'Tasks assigned successfully.');
    }
}
