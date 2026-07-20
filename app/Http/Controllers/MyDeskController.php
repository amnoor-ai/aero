<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MyDeskController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $workspaceId = 1;

        $query = Task::where('workspace_id', $workspaceId)
            ->with(['project', 'boardColumn', 'assignee', 'checklists'])
            ->where(function ($q) use ($user, $request) {
                // Default to assigned to me unless 'all' is explicitly requested
                if ($request->input('scope') !== 'all') {
                    $q->where('assignee_id', $user?->id ?? 1);
                }
            });

        if ($request->filled('status')) {
            $query->whereHas('boardColumn', function ($q) use ($request) {
                $q->where('name', $request->input('status'));
            });
        }

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->input('project_id'));
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->input('priority'));
        }

        $allTasks = $query->get();

        $today = now()->startOfDay();
        $tomorrow = now()->addDay()->startOfDay();

        $overdue = $allTasks->filter(function ($t) use ($today) {
            return $t->due_date && $t->due_date->lt($today) && $t->boardColumn?->name !== 'Done';
        })->values();

        $dueToday = $allTasks->filter(function ($t) use ($today) {
            return $t->due_date && $t->due_date->equalTo($today) && $t->boardColumn?->name !== 'Done';
        })->values();

        $dueTomorrow = $allTasks->filter(function ($t) use ($tomorrow) {
            return $t->due_date && $t->due_date->equalTo($tomorrow) && $t->boardColumn?->name !== 'Done';
        })->values();

        $upcoming = $allTasks->filter(function ($t) use ($tomorrow) {
            return (! $t->due_date || $t->due_date->gt($tomorrow)) && $t->boardColumn?->name !== 'Done';
        })->values();

        $projects = Project::where('workspace_id', $workspaceId)->select('id', 'name')->get();

        return Inertia::render('MyDesk/Index', [
            'tasks' => [
                'overdue' => $overdue,
                'dueToday' => $dueToday,
                'dueTomorrow' => $dueTomorrow,
                'upcoming' => $upcoming,
            ],
            'counts' => [
                'overdue' => $overdue->count(),
                'dueToday' => $dueToday->count(),
                'dueTomorrow' => $dueTomorrow->count(),
                'upcoming' => $upcoming->count(),
            ],
            'projects' => $projects,
            'filters' => $request->only(['status', 'project_id', 'priority', 'scope']),
        ]);
    }
}
