<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkPlanController extends Controller
{
    public function index(Request $request): Response
    {
        $workspaceId = 1;

        $projects = Project::where('workspace_id', $workspaceId)
            ->with(['sprints', 'milestones'])
            ->withCount('tasks')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'status' => $p->status,
                    'start_date' => $p->start_date?->toDateString() ?? $p->created_at->toDateString(),
                    'due_date' => $p->due_date?->toDateString() ?? $p->created_at->addDays(30)->toDateString(),
                    'progress' => $p->progress,
                    'tasks_count' => $p->tasks_count,
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
                ];
            });

        return Inertia::render('WorkPlan/Index', [
            'projects' => $projects,
        ]);
    }
}
